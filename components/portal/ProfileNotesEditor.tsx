'use client';

import { useState } from 'react';

interface Props {
  profileId:    string;
  profileType:  string; // 'surrogate' | 'donor' | 'intended_parent'
  field:        string; // 'notes' | 'internalNotes'
  initialValue: string;
  label:        string;
}

const TYPE_PATHS: Record<string, string> = {
  surrogate:       'surrogates',
  donor:           'donors',
  intended_parent: 'intended-parents',
};

export default function ProfileNotesEditor({ profileId, profileType, field, initialValue, label }: Props) {
  const [value,   setValue]   = useState(initialValue);
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [error,   setError]   = useState('');

  async function handleSave() {
    setSaving(true);
    setError('');
    setSaved(false);

    const path = TYPE_PATHS[profileType] ?? profileType;
    try {
      const res = await fetch(`/api/portal/${path}/${profileId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value }),
      });
      if (!res.ok) throw new Error('Save failed');
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError('Could not save. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <textarea
        value={value}
        onChange={e => setValue(e.target.value)}
        rows={4}
        placeholder={`Add ${label.toLowerCase()}…`}
        className="w-full rounded-lg border border-lavender-light bg-cream px-3 py-2 text-sm text-text-primary placeholder-lavender focus:outline-none focus:ring-2 focus:ring-mid-purple/40 resize-none"
      />
      <div className="mt-2 flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-deep-purple px-4 py-2 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
        {saved  && <span className="text-xs text-green-600">Saved</span>}
        {error  && <span className="text-xs text-red-600">{error}</span>}
      </div>
    </div>
  );
}
