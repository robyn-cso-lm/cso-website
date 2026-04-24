type Status = 'PENDING_REVIEW' | 'ACTIVE' | 'MATCHED' | 'ON_HOLD' | 'INACTIVE' | 'ARCHIVED';

const LABELS: Record<Status, string> = {
  PENDING_REVIEW: 'Pending Review',
  ACTIVE:         'Active',
  MATCHED:        'Matched',
  ON_HOLD:        'On Hold',
  INACTIVE:       'Inactive',
  ARCHIVED:       'Archived',
};

const STYLES: Record<Status, string> = {
  PENDING_REVIEW: 'bg-amber-100 text-amber-800',
  ACTIVE:         'bg-green-100 text-green-800',
  MATCHED:        'bg-blue-100 text-blue-800',
  ON_HOLD:        'bg-orange-100 text-orange-800',
  INACTIVE:       'bg-gray-100 text-gray-600',
  ARCHIVED:       'bg-gray-100 text-gray-400',
};

export default function StatusBadge({ status }: { status: string }) {
  const s = (status as Status) in LABELS ? (status as Status) : 'INACTIVE';
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STYLES[s]}`}>
      {LABELS[s]}
    </span>
  );
}
