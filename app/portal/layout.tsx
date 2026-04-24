import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import PortalNav from '@/components/portal/PortalNav';

export const metadata = { title: 'CSO Staff Portal' };

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect('/portal/login');

  return (
    <div className="flex h-screen overflow-hidden bg-cream">
      <PortalNav userName={session.user?.name} />
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
