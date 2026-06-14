import OpenAI from 'openai';

// ─── PDF text extraction ──────────────────────────────────────────────────────

export async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  // Lazy require to avoid issues in environments where the native module isn't available
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const pdfParse = require('pdf-parse');
  const result = await pdfParse(buffer);
  return result.text ?? '';
}

// ─── AI field extraction ──────────────────────────────────────────────────────

const PROMPTS: Record<string, string> = {
  surrogate: `Extract these fields from the surrogate profile document. Return ONLY valid JSON with exactly these keys (use null for missing fields):
firstName, lastName, age (number), city, province, country, smokingStatus, hasCarriedBefore (boolean), numberOfChildren (number), bmi (number), notes`,

  donor: `Extract these fields from the egg donor profile document. Return ONLY valid JSON with exactly these keys (use null for missing fields):
firstName, lastName, age (number), city, province, country, bloodType, hairColor, eyeColor, ethnicity, education, hasKids (boolean), notes`,

  intended_parent: `Extract these fields from the intended parent profile document. Return ONLY valid JSON with exactly these keys (use null for missing fields):
primaryFirstName, primaryLastName, partnerFirstName, partnerLastName, familyStructure, city, province, country, needsEggDonor (boolean), needsSurrogate (boolean), previousAttempts (number), budget, notes`,
};

export async function extractProfileFields(
  text: string,
  profileType: string
): Promise<Record<string, unknown>> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.warn('[pdf] OPENAI_API_KEY not set — returning empty extraction');
    return {};
  }

  const prompt = PROMPTS[profileType] ?? PROMPTS['surrogate'];

  const client = new OpenAI({ apiKey });
  const completion = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: `You are a data extraction assistant for a Canadian surrogacy agency. ${prompt}` },
      { role: 'user', content: `Document text:\n---\n${text.slice(0, 8000)}\n---` },
    ],
  });

  const raw = completion.choices[0]?.message?.content ?? '{}';
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    console.error('[pdf] Failed to parse AI extraction JSON:', raw);
    return {};
  }
}
