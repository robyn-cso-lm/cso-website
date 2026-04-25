export const dynamic = 'force-dynamic';

import { getDonors } from '@/lib/portal/profiles';
import ProfileTable from '@/components/portal/ProfileTable';
import SearchBar from '@/components/portal/SearchBar';
import { Suspense } from 'react';
import Link from 'next/link';

interface PageProps {
  searchParams: { q?: string; status?: string; province?: string; page?: string };
}

export default async function DonorsPage({ searchParams }: PageProps) {
  const page = Number(searchParams.page ?? 1);
  const { profiles, total, totalPages } = await getDonors({
    q:        searchParams.q,
    status:   searchParams.status,
    province: searchParams.province,
    page,
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-serif text-2xl text-text-primary">Donors</h1>
        <span className="text-sm text-lavender">{total} total</span>
      </div>

      <div className="mb-4">
        <Suspense>
          <SearchBar />
        </Suspense>
      </div>

      <ProfileTable
        rows={profiles}
        basePath="/portal/donors"
        emptyMessage="No donor profiles match your filters."
      />

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-lavender">
          <span>Page {page} of {totalPages}</span>
          <div className="flex gap-2">
            {page > 1 && (
              <Link href={`?page=${page - 1}`} className="rounded-lg border border-lavender-light px-3 py-1.5 hover:bg-lavender-light/50">
                Previous
              </Link>
            )}
            {page < totalPages && (
              <Link href={`?page=${page + 1}`} className="rounded-lg border border-lavender-light px-3 py-1.5 hover:bg-lavender-light/50">
                Next
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
