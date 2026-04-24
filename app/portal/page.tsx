import { getDashboardCounts } from '@/lib/portal/profiles';
import Link from 'next/link';

function countByStatus(groups: { status: string; _count: number }[], status: string) {
  return groups.find(g => g.status === status)?._count ?? 0;
}

export default async function PortalDashboard() {
  const { surrogates, donors, ips, recentImports } = await getDashboardCounts();

  const cards = [
    {
      title:  'Surrogates',
      href:   '/portal/surrogates',
      active: countByStatus(surrogates, 'ACTIVE'),
      pending: countByStatus(surrogates, 'PENDING_REVIEW'),
      total:  surrogates.reduce((n, g) => n + g._count, 0),
      color:  'bg-pink-50 border-pink-200',
      dot:    'bg-pink-400',
    },
    {
      title:  'Donors',
      href:   '/portal/donors',
      active: countByStatus(donors, 'ACTIVE'),
      pending: countByStatus(donors, 'PENDING_REVIEW'),
      total:  donors.reduce((n, g) => n + g._count, 0),
      color:  'bg-purple-50 border-purple-200',
      dot:    'bg-purple-400',
    },
    {
      title:  'Intended Parents',
      href:   '/portal/intended-parents',
      active: countByStatus(ips, 'ACTIVE'),
      pending: countByStatus(ips, 'PENDING_REVIEW'),
      total:  ips.reduce((n, g) => n + g._count, 0),
      color:  'bg-blue-50 border-blue-200',
      dot:    'bg-blue-400',
    },
  ];

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl text-text-primary">Dashboard</h1>

      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {cards.map(c => (
          <Link key={c.title} href={c.href}>
            <div className={`rounded-xl border p-5 transition-shadow hover:shadow-md ${c.color}`}>
              <div className="mb-3 flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${c.dot}`} />
                <p className="text-sm font-semibold text-text-secondary">{c.title}</p>
              </div>
              <p className="text-3xl font-bold text-text-primary">{c.total}</p>
              <p className="mt-1 text-xs text-text-secondary">
                {c.active} active · {c.pending} pending review
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="rounded-xl border border-lavender-light bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-text-primary">Recent Imports</h2>
          <Link href="/portal/import" className="text-xs font-medium text-mid-purple hover:underline">
            Import PDF →
          </Link>
        </div>
        {recentImports.length === 0 ? (
          <p className="text-sm text-lavender">No imports yet.</p>
        ) : (
          <ul className="space-y-2">
            {recentImports.map(doc => (
              <li key={doc.id} className="flex items-center justify-between text-sm">
                <span className="truncate text-text-secondary">{doc.originalFilename}</span>
                <span className="ml-4 shrink-0 capitalize text-lavender">{doc.importStatus}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
