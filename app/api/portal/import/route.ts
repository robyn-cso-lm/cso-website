import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { extractTextFromPdf, extractProfileFields } from '@/lib/portal/pdf';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const formData    = await req.formData();
  const file        = formData.get('file') as File | null;
  const profileType = (formData.get('profileType') as string | null) ?? 'surrogate';

  if (!file || file.type !== 'application/pdf') {
    return NextResponse.json({ error: 'A PDF file is required.' }, { status: 400 });
  }

  const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'File is too large (max 10 MB).' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  // Create an initial import record
  const doc = await prisma.importedDocument.create({
    data: {
      originalFilename: file.name,
      fileSize:         file.size,
      profileType,
      importStatus:     'pending',
      importedById:     session.user.id ?? 'unknown',
    },
  });

  // Extract text
  let extractedText = '';
  try {
    extractedText = await extractTextFromPdf(buffer);
  } catch (err) {
    console.error('[import] PDF parse failed:', err);
    await prisma.importedDocument.update({
      where: { id: doc.id },
      data: { importStatus: 'error', errorMessage: 'Could not parse PDF text.' },
    });
    return NextResponse.json({ error: 'Could not read the PDF. Is it a text-based (not scanned) PDF?' }, { status: 422 });
  }

  // AI field extraction (best-effort)
  let aiExtractedJson: Record<string, unknown> = {};
  try {
    aiExtractedJson = await extractProfileFields(extractedText, profileType);
  } catch (err) {
    console.warn('[import] AI extraction failed:', err);
    // Non-fatal — staff can fill in fields manually
  }

  await prisma.importedDocument.update({
    where: { id: doc.id },
    data: { extractedText, aiExtractedJson: aiExtractedJson as object, importStatus: 'reviewed' },
  });

  return NextResponse.json({
    docId:          doc.id,
    extractedText,
    aiExtractedJson,
  });
}
