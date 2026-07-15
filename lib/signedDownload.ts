import crypto from 'crypto';

// Paid guide files live in private/guides/ (NOT public/) and are only served
// through /api/download with a valid, unexpired signature.
export const GUIDE_FILES: Record<string, { filename: string; displayName: string }> = {
  'is-surrogacy-right': { filename: 'is-surrogacy-right-for-me.pdf', displayName: 'Is Surrogacy Right For Me?' },
  'roadmap': { filename: 'roadmap.pdf', displayName: 'The Canadian Surrogacy Roadmap' },
  'indie-checklist': { filename: 'indie-checklist.pdf', displayName: 'Independent Journey Checklist' },
  'ip-profile-template': { filename: 'ip-profile-template.pdf', displayName: 'IP Profile Template Pack' },
  'surrogate-readiness': { filename: 'surrogate-readiness.pdf', displayName: 'Surrogate Readiness Guide' },
};

const DEFAULT_TTL_HOURS = 72;

function secret(): string {
  const s = process.env.DOWNLOAD_LINK_SECRET || process.env.AUTH_SECRET;
  if (!s) throw new Error('DOWNLOAD_LINK_SECRET or AUTH_SECRET must be set for signed downloads');
  return s;
}

function sign(guide: string, exp: number): string {
  return crypto.createHmac('sha256', secret()).update(`${guide}:${exp}`).digest('hex');
}

export function makeSignedDownloadUrl(guide: string, ttlHours = DEFAULT_TTL_HOURS): string {
  if (!GUIDE_FILES[guide]) throw new Error(`Unknown guide key: ${guide}`);
  const exp = Math.floor(Date.now() / 1000) + ttlHours * 3600;
  const sig = sign(guide, exp);
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://canadiansurrogacyoptions.com';
  return `${base}/api/download?guide=${encodeURIComponent(guide)}&exp=${exp}&sig=${sig}`;
}

export function verifySignedDownload(guide: string, exp: string, sig: string):
  | { ok: true; filename: string }
  | { ok: false; reason: 'unknown' | 'expired' | 'invalid' } {
  const entry = GUIDE_FILES[guide];
  if (!entry) return { ok: false, reason: 'unknown' };
  const expNum = Number(exp);
  if (!Number.isFinite(expNum)) return { ok: false, reason: 'invalid' };
  let expected: string;
  try {
    expected = sign(guide, expNum);
  } catch {
    console.error('[signedDownload] No signing secret configured — refusing download');
    return { ok: false, reason: 'invalid' };
  }
  const a = Buffer.from(expected, 'hex');
  const b = Buffer.from(sig || '', 'hex');
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return { ok: false, reason: 'invalid' };
  if (expNum * 1000 < Date.now()) return { ok: false, reason: 'expired' };
  return { ok: true, filename: entry.filename };
}
