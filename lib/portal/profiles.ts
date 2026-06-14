import { prisma } from '@/lib/prisma';
import type { ProfileRow } from '@/components/portal/ProfileTable';

interface ListParams {
  q?:        string;
  status?:   string;
  province?: string;
  page?:     number;
  pageSize?: number;
}

// ─── Surrogates ──────────────────────────────────────────────────────────────

export async function getSurrogates(params: ListParams) {
  const { q, status, province, page = 1, pageSize = 25 } = params;
  const where = {
    ...(status   ? { status: status as never }   : {}),
    ...(province ? { province }                  : {}),
    ...(q        ? {
      OR: [
        { firstName: { contains: q, mode: 'insensitive' as never } },
        { lastName:  { contains: q, mode: 'insensitive' as never } },
      ],
    } : {}),
  };
  const [total, rows] = await Promise.all([
    prisma.surrogateProfile.count({ where }),
    prisma.surrogateProfile.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: { id: true, firstName: true, lastName: true, age: true, city: true, province: true, status: true },
    }),
  ]);
  const profiles: ProfileRow[] = rows.map((r: { id: string; firstName: string; lastName: string; age: number | null; city: string | null; province: string | null; status: string }) => ({
    id: r.id, name: `${r.firstName} ${r.lastName}`, age: r.age, city: r.city, province: r.province, status: r.status,
  }));
  return { profiles, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}

export async function getSurrogateById(id: string) {
  return prisma.surrogateProfile.findUnique({ where: { id } });
}

// ─── Donors ──────────────────────────────────────────────────────────────────

export async function getDonors(params: ListParams) {
  const { q, status, province, page = 1, pageSize = 25 } = params;
  const where = {
    ...(status   ? { status: status as never }   : {}),
    ...(province ? { province }                  : {}),
    ...(q        ? {
      OR: [
        { firstName: { contains: q, mode: 'insensitive' as never } },
        { lastName:  { contains: q, mode: 'insensitive' as never } },
      ],
    } : {}),
  };
  const [total, rows] = await Promise.all([
    prisma.donorProfile.count({ where }),
    prisma.donorProfile.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: { id: true, firstName: true, lastName: true, age: true, city: true, province: true, status: true },
    }),
  ]);
  const profiles: ProfileRow[] = rows.map((r: { id: string; firstName: string; lastName: string; age: number | null; city: string | null; province: string | null; status: string }) => ({
    id: r.id, name: `${r.firstName} ${r.lastName}`, age: r.age, city: r.city, province: r.province, status: r.status,
  }));
  return { profiles, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}

export async function getDonorById(id: string) {
  return prisma.donorProfile.findUnique({ where: { id } });
}

// ─── Intended Parents ────────────────────────────────────────────────────────

export async function getIntendedParents(params: ListParams) {
  const { q, status, province, page = 1, pageSize = 25 } = params;
  const where = {
    ...(status   ? { status: status as never }   : {}),
    ...(province ? { province }                  : {}),
    ...(q        ? {
      OR: [
        { primaryFirstName: { contains: q, mode: 'insensitive' as never } },
        { primaryLastName:  { contains: q, mode: 'insensitive' as never } },
        { partnerFirstName: { contains: q, mode: 'insensitive' as never } },
        { partnerLastName:  { contains: q, mode: 'insensitive' as never } },
      ],
    } : {}),
  };
  const [total, rows] = await Promise.all([
    prisma.intendedParentProfile.count({ where }),
    prisma.intendedParentProfile.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: { id: true, primaryFirstName: true, primaryLastName: true, partnerFirstName: true, city: true, province: true, status: true },
    }),
  ]);
  const profiles: ProfileRow[] = rows.map((r: { id: string; primaryFirstName: string; primaryLastName: string; partnerFirstName: string | null; city: string | null; province: string | null; status: string }) => {
    const partner = r.partnerFirstName ? ` & ${r.partnerFirstName}` : '';
    return { id: r.id, name: `${r.primaryFirstName} ${r.primaryLastName}${partner}`, age: null, city: r.city, province: r.province, status: r.status };
  });
  return { profiles, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}

export async function getIntendedParentById(id: string) {
  return prisma.intendedParentProfile.findUnique({ where: { id } });
}

// ─── Dashboard counts ─────────────────────────────────────────────────────────

export async function getDashboardCounts() {
  const [surrogates, donors, ips, recentImports] = await Promise.all([
    prisma.surrogateProfile.groupBy({ by: ['status'], _count: true }),
    prisma.donorProfile.groupBy({ by: ['status'], _count: true }),
    prisma.intendedParentProfile.groupBy({ by: ['status'], _count: true }),
    prisma.importedDocument.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, originalFilename: true, profileType: true, importStatus: true, createdAt: true },
    }),
  ]);
  return { surrogates, donors, ips, recentImports };
}
