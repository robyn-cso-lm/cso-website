'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

const STATUSES = [
  { value: '', label: 'All Statuses' },
  { value: 'PENDING_REVIEW', label: 'Pending Review' },
  { value: 'ACTIVE',         label: 'Active' },
  { value: 'MATCHED',        label: 'Matched' },
  { value: 'ON_HOLD',        label: 'On Hold' },
  { value: 'INACTIVE',       label: 'Inactive' },
  { value: 'ARCHIVED',       label: 'Archived' },
];

const PROVINCES = [
  '', 'AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'NT', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT',
];

export default function SearchBar() {
  const router     = useRouter();
  const pathname   = usePathname();
  const params     = useSearchParams();

  const update = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(params.toString());
      if (value) {
        next.set(key, value);
      } else {
        next.delete(key);
      }
      next.delete('page'); // reset to first page on filter change
      router.push(`${pathname}?${next.toString()}`);
    },
    [params, pathname, router]
  );

  return (
    <div className="flex flex-wrap gap-3">
      <input
        type="search"
        placeholder="Search by name…"
        defaultValue={params.get('q') ?? ''}
        onChange={e => update('q', e.target.value)}
        className="h-9 rounded-lg border border-lavender-light bg-white px-3 text-sm text-text-primary placeholder-lavender focus:outline-none focus:ring-2 focus:ring-mid-purple/40 w-56"
      />
      <select
        defaultValue={params.get('status') ?? ''}
        onChange={e => update('status', e.target.value)}
        className="h-9 rounded-lg border border-lavender-light bg-white px-3 text-sm text-text-secondary focus:outline-none focus:ring-2 focus:ring-mid-purple/40"
      >
        {STATUSES.map(s => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </select>
      <select
        defaultValue={params.get('province') ?? ''}
        onChange={e => update('province', e.target.value)}
        className="h-9 rounded-lg border border-lavender-light bg-white px-3 text-sm text-text-secondary focus:outline-none focus:ring-2 focus:ring-mid-purple/40"
      >
        <option value="">All Provinces</option>
        {PROVINCES.filter(Boolean).map(p => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>
    </div>
  );
}
