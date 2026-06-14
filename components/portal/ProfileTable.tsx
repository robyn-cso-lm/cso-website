import Link from 'next/link';
import StatusBadge from './StatusBadge';

export interface ProfileRow {
  id:       string;
  name:     string;
  age:      number | null;
  city:     string | null;
  province: string | null;
  status:   string;
}

interface Props {
  rows:     ProfileRow[];
  basePath: string; // e.g. '/portal/surrogates'
  emptyMessage?: string;
}

export default function ProfileTable({ rows, basePath, emptyMessage }: Props) {
  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-lavender-light bg-white p-12 text-center text-sm text-lavender">
        {emptyMessage ?? 'No profiles found.'}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-lavender-light bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-lavender-light bg-cream text-xs font-semibold uppercase tracking-wider text-lavender">
            <th className="px-4 py-3 text-left">Name</th>
            <th className="px-4 py-3 text-left">Age</th>
            <th className="px-4 py-3 text-left">Location</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-right"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-lavender-light">
          {rows.map(row => (
            <tr key={row.id} className="hover:bg-cream/60 transition-colors">
              <td className="px-4 py-3 font-medium text-text-primary">{row.name}</td>
              <td className="px-4 py-3 text-text-secondary">{row.age ?? '—'}</td>
              <td className="px-4 py-3 text-text-secondary">
                {[row.city, row.province].filter(Boolean).join(', ') || '—'}
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={row.status} />
              </td>
              <td className="px-4 py-3 text-right">
                <Link
                  href={`${basePath}/${row.id}`}
                  className="rounded-lg bg-lavender-light px-3 py-1.5 text-xs font-medium text-deep-purple hover:bg-lavender/30 transition-colors"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
