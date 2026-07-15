import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { verifySignedDownload } from '@/lib/signedDownload';

export const dynamic = 'force-dynamic';

function messagePage(title: string, body: string, status: number): NextResponse {
  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>${title} | Canadian Surrogacy Options</title>
<style>body{font-family:Arial,sans-serif;background:#f5f0f9;margin:0;padding:40px 20px}
.card{max-width:520px;margin:40px auto;background:#fff;border-radius:12px;padding:40px;box-shadow:0 4px 24px rgba(61,26,110,.1);text-align:center}
h1{color:#3D1A6E;font-size:22px}p{color:#4A3560;line-height:1.7;font-size:15px}
a{color:#6B3FA0}</style></head>
<body><div class="card"><h1>${title}</h1><p>${body}</p></div></body></html>`;
  return new NextResponse(html, { status, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const guide = searchParams.get('guide') || '';
  const exp = searchParams.get('exp') || '';
  const sig = searchParams.get('sig') || '';

  const result = verifySignedDownload(guide, exp, sig);

  if (!result.ok) {
    if (result.reason === 'expired') {
      return messagePage(
        'This download link has expired',
        'For your security, guide download links expire after 72 hours. Reply to your purchase email or write to <a href="mailto:robyn@canadiansurrogacyoptions.com">robyn@canadiansurrogacyoptions.com</a> and we will send you a fresh link right away.',
        410
      );
    }
    return messagePage(
      'Download link not valid',
      'This link is missing or incorrect. Reply to your purchase email or write to <a href="mailto:robyn@canadiansurrogacyoptions.com">robyn@canadiansurrogacyoptions.com</a> and we will sort it out.',
      403
    );
  }

  const filePath = path.join(process.cwd(), 'private', 'guides', result.filename);
  if (!fs.existsSync(filePath)) {
    console.error('[download] Guide file missing from bundle:', filePath);
    return messagePage(
      'Something went wrong',
      'We could not load your guide. Please email <a href="mailto:robyn@canadiansurrogacyoptions.com">robyn@canadiansurrogacyoptions.com</a> and we will send it to you directly.',
      500
    );
  }

  const file = fs.readFileSync(filePath);
  return new NextResponse(file, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${result.filename}"`,
      'Cache-Control': 'private, no-store',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });
}
