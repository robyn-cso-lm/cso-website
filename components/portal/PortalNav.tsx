'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

const NAV = [
  { href: '/portal',                label: 'Dashboard',         icon: '◉' },
  { href: '/portal/surrogates',     label: 'Surrogates',        icon: '♥' },
  { href: '/portal/donors',         label: 'Donors',            icon: '◈' },
  { href: '/portal/intended-parents', label: 'Intended Parents', icon: '◎' },
  { href: '/portal/import',         label: 'Import PDF',        icon: '↑' },
];

export default function PortalNav({ userName }: { userName?: string | null }) {
  const path = usePathname();

  return (
    <aside className="flex h-screen w-56 flex-col border-r border-lavender-light bg-white">
      <div className="px-5 py-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-lavender">CSO Staff</p>
        <p className="mt-1 text-sm font-medium text-text-primary">{userName ?? 'Coordinator'}</p>
      </div>

      <nav className="flex-1 space-y-0.5 px-3">
        {NAV.map(({ href, label, icon }) => {
          const active = href === '/portal' ? path === '/portal' : path.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                active
                  ? 'bg-lavender-light font-semibold text-deep-purple'
                  : 'text-text-secondary hover:bg-lavender-light/50 hover:text-deep-purple'
              }`}
            >
              <span className="w-4 text-center text-base">{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-lavender-light p-4">
        <button
          onClick={() => signOut({ callbackUrl: '/portal/login' })}
          className="w-full rounded-lg px-3 py-2 text-left text-sm text-text-secondary hover:bg-lavender-light/50 hover:text-deep-purple transition-colors"
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
}
