export const dynamic = 'force-dynamic';

import { getDonorById } from '@/lib/portal/profiles';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import StatusBadge from '@/components/portal/StatusBadge';
import ProfileNotesEditor from '@/components/portal/ProfileNotesEditor';

interface PageProps { params: { id: string } }

function Field({ label, value }: { label: string; value: string | number | boolean | null | undefined }) {
  const display = value === null || value === undefined ? '—'
    : typeof value === 'boolean' ? (value ? 'Yes' : 'No')
    : String(value);
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-lavender">{label}</p>
      <p className="mt-1 text-sm text-text-primary">{display}</p>
    </div>
  );
}

export default async function DonorDetailPage({ params }: PageProps) {
  const profile = await getDonorById(params.id);
  if (!profile) notFound();

  return (
    <div>
      <Link href="/portal/donors" className="text-xs text-lavender hover:text-mid-purple">
        ← Back to Donors
      </Link>

      <div className="mt-4 mb-6 flex items-start justify-between">
        <div>
          <h1 className="font-serif text-2xl text-text-primary">
            {profile.firstName} {profile.lastName}
          </h1>
          {profile.displayId && (
            <p className="mt-1 text-xs text-lavender">{profile.displayId}</p>
          )}
        </div>
        <StatusBadge status={profile.status} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-lavender-light bg-white p-6">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-lavender">Profile Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="First Name"  value={profile.firstName} />
            <Field label="Last Name"   value={profile.lastName} />
            <Field label="Age"         value={profile.age} />
            <Field label="City"        value={profile.city} />
            <Field label="Province"    value={profile.province} />
            <Field label="Country"     value={profile.country} />
            <Field label="Blood Type"  value={profile.bloodType} />
            <Field label="Hair Color"  value={profile.hairColor} />
            <Field label="Eye Color"   value={profile.eyeColor} />
            <Field label="Ethnicity"   value={profile.ethnicity} />
            <Field label="Education"   value={profile.education} />
            <Field label="Has Kids"    value={profile.hasKids} />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-xl border border-lavender-light bg-white p-6">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-lavender">Notes</h2>
            <ProfileNotesEditor
              profileId={profile.id}
              profileType="donor"
              field="notes"
              initialValue={profile.notes ?? ''}
              label="General Notes"
            />
          </div>
          <div className="rounded-xl border border-lavender-light bg-white p-6">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-lavender">Internal Notes (Staff Only)</h2>
            <ProfileNotesEditor
              profileId={profile.id}
              profileType="donor"
              field="internalNotes"
              initialValue={profile.internalNotes ?? ''}
              label="Internal Notes"
            />
          </div>
        </div>
      </div>

      {profile.rawText && (
        <details className="mt-6">
          <summary className="cursor-pointer text-xs text-lavender hover:text-mid-purple">
            View raw imported text
          </summary>
          <pre className="mt-2 max-h-64 overflow-y-auto rounded-xl bg-cream p-4 text-xs text-text-secondary whitespace-pre-wrap">
            {profile.rawText}
          </pre>
        </details>
      )}
    </div>
  );
}
