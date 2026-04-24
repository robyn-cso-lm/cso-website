import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const profile = await prisma.intendedParentProfile.findUnique({ where: { id: params.id } });
  if (!profile) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(profile);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { notes, internalNotes, status, city, province } = body;
  const profile = await prisma.intendedParentProfile.update({
    where: { id: params.id },
    data: { notes, internalNotes, status, city, province },
  });
  return NextResponse.json(profile);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await prisma.intendedParentProfile.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
