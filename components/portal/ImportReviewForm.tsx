'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  docId:         string;
  profileType:   string;
  extracted:     Record<string, unknown>;
}

const SURROGATE_FIELDS = [
  { key: 'firstName',        label: 'First Name',        type: 'text' },
  { key: 'lastName',         label: 'Last Name',         type: 'text' },
  { key: 'age',              label: 'Age',               type: 'number' },
  { key: 'city',             label: 'City',              type: 'text' },
  { key: 'province',         label: 'Province',          type: 'text' },
  { key: 'country',          label: 'Country',           type: 'text' },
  { key: 'smokingStatus',    label: 'Smoking Status',    type: 'text' },
  { key: 'hasCarriedBefore', label: 'Carried Before',    type: 'checkbox' },
  { key: 'numberOfChildren', label: '# of Children',     type: 'number' },
  { key: 'bmi',              label: 'BMI',               type: 'number' },
  { key: 'notes',            label: 'Notes',             type: 'textarea' },
];

const DONOR_FIELDS = [
  { key: 'firstName',  label: 'First Name',  type: 'text' },
  { key: 'lastName',   label: 'Last Name',   type: 'text' },
  { key: 'age',        label: 'Age',         type: 'number' },
  { key: 'city',       label: 'City',        type: 'text' },
  { key: 'province',   label: 'Province',    type: 'text' },
  { key: 'country',    label: 'Country',     type: 'text' },
  { key: 'bloodType',  label: 'Blood Type',  type: 'text' },
  { key: 'hairColor',  label: 'Hair Color',  type: 'text' },
  { key: 'eyeColor',   label: 'Eye Color',   type: 'text' },
  { key: 'ethnicity',  label: 'Ethnicity',   type: 'text' },
  { key: 'education',  label: 'Education',   type: 'text' },
  { key: 'hasKids',    label: 'Has Kids',    type: 'checkbox' },
  { key: 'notes',      label: 'Notes',       type: 'textarea' },
];

const IP_FIELDS = [
  { key: 'primaryFirstName',  label: 'Primary First Name',  type: 'text' },
  { key: 'primaryLastName',   label: 'Primary Last Name',   type: 'text' },
  { key: 'partnerFirstName',  label: 'Partner First Name',  type: 'text' },
  { key: 'partnerLastName',   label: 'Partner Last Name',   type: 'text' },
  { key: 'familyStructure',   label: 'Family Structure',    type: 'text' },
  { key: 'city',              label: 'City',                type: 'text' },
  { key: 'province',          label: 'Province',            type: 'text' },
  { key: 'country',           label: 'Country',             type: 'text' },
  { key: 'needsSurrogate',    label: 'Needs Surrogate',     type: 'checkbox' },
  { key: 'needsEggDonor',     label: 'Needs Egg Donor',     type: 'checkbox' },
  { key: 'previousAttempts',  label: 'Previous Attempts',   type: 'number' },
  { key: 'budget',            label: 'Budget Tier',         type: 'text' },
  { key: 'notes',             label: 'Notes',               type: 'textarea' },
];

const API_PATHS: Record<string, string> = {
  surrogate:       '/api/portal/surrogates',
  donor:           '/api/portal/donors',
  intended_parent: '/api/portal/intended-parents',
};

const REDIRECT_PATHS: Record<string, string> = {
  surrogate:       '/portal/surrogates',
  donor:           '/portal/donors',
  intended_parent: '/portal/intended-parents',
};

export default function ImportReviewForm({ docId, profileType, extracted }: Props) {
  const router  = useRouter();
  const fields  = profileType === 'donor' ? DONOR_FIELDS
                : profileType === 'intended_parent' ? IP_FIELDS
                : SURROGATE_FIELDS;

  const [form, setForm] = useState<Record<string, unknown>>(() => {
    const init: Record<string, unknown> = {};
    for (const f of fields) {
      init[f.key] = extracted[f.key] ?? (f.type === 'checkbox' ? false : '');
    }
    return init;
  });

  const [saving, setSaving]   = useState(false);
  const [error,  setError]    = useState('');

  function set(key: string, value: unknown) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setError('');
    try {
      const payload: Record<string, unknown> = {
        ...form,
        importedFromId: docId,
        rawText: (extracted as { rawText?: string }).rawText,
      };
      // Convert numeric strings
      for (const f of fields) {
        if (f.type === 'number' && payload[f.key] !== '' && payload[f.key] !== null) {
          payload[f.key] = Number(payload[f.key]) || null;
        }
      }

      const res = await fetch(API_PATHS[profileType] ?? API_PATHS['surrogate'], {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Save failed');
      const saved = await res.json();
      router.push(`${REDIRECT_PATHS[profileType]}/${saved.id}`);
    } catch {
      setError('Could not save profile. Please check required fields.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="mb-4 rounded-lg bg-lavender-light/50 px-4 py-3 text-sm text-mid-purple">
        Fields below were extracted from the PDF using AI. Please review and correct any errors before saving.
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {fields.map(f => (
          <div key={f.key} className={f.type === 'textarea' ? 'sm:col-span-2' : ''}>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-lavender">
              {f.label}
            </label>
            {f.type === 'checkbox' ? (
              <input
                type="checkbox"
                checked={Boolean(form[f.key])}
                onChange={e => set(f.key, e.target.checked)}
                className="h-4 w-4 rounded border-lavender-light text-deep-purple focus:ring-mid-purple/40"
              />
            ) : f.type === 'textarea' ? (
              <textarea
                rows={3}
                value={String(form[f.key] ?? '')}
                onChange={e => set(f.key, e.target.value)}
                className="w-full rounded-lg border border-lavender-light bg-cream px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-mid-purple/40 resize-none"
              />
            ) : (
              <input
                type={f.type}
                value={String(form[f.key] ?? '')}
                onChange={e => set(f.key, e.target.value)}
                className="w-full rounded-lg border border-lavender-light bg-cream px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-mid-purple/40"
              />
            )}
          </div>
        ))}
      </div>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-700">{error}</p>
      )}

      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-6 rounded-xl bg-deep-purple px-6 py-3 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50 transition-opacity"
      >
        {saving ? 'Saving Profile…' : 'Save Profile →'}
      </button>
    </div>
  );
}
