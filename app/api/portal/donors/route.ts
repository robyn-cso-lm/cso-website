import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const q        = searchParams.get('q') ?? undefined;
  const status   = searchParams.get('status') ?? undefined;
  const province = searchParams.get('province') ?? undefined;
  const page     = Number(searchParams.get('page') ?? 1);
  const pageSize = 25;

  const where = {
    ...(status   ? { status: status as never } : {}),
    ...(province ? { province }               : {}),
    ...(q        ? {
      OR: [
        { firstName: { contains: q, mode: 'insensitive' as never } },
        { lastName:  { contains: q, mode: 'insensitive' as never } },
      ],
    } : {}),
  };

  const [total, data] = await Promise.all([
    prisma.donorProfile.count({ where }),
    prisma.donorProfile.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  return NextResponse.json({ data, total, page, pageSize });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const profile = await prisma.donorProfile.create({ data: body });
  return NextResponse.json(profile, { status: 201 });
}
