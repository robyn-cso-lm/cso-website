'use client';

import { useState } from 'react';
import ImportReviewForm from '@/components/portal/ImportReviewForm';

type Step = 'upload' | 'review';

export default function ImportPage() {
  const [step,        setStep]       = useState<Step>('upload');
  const [file,        setFile]       = useState<File | null>(null);
  const [profileType, setProfileType] = useState('surrogate');
  const [uploading,   setUploading]  = useState(false);
  const [error,       setError]      = useState('');
  const [result,      setResult]     = useState<{
    docId: string;
    extractedText: string;
    aiExtractedJson: Record<string, unknown>;
  } | null>(null);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setError('');

    const fd = new FormData();
    fd.append('file', file);
    fd.append('profileType', profileType);

    try {
      const res = await fetch('/api/portal/import', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Upload failed');
      setResult(data);
      setStep('review');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl text-text-primary">Import Profile from PDF</h1>

      {step === 'upload' && (
        <form onSubmit={handleUpload} className="max-w-lg rounded-xl border border-lavender-light bg-white p-8">
          <div className="mb-5">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-lavender">
              Profile Type
            </label>
            <select
              value={profileType}
              onChange={e => setProfileType(e.target.value)}
              className="w-full rounded-lg border border-lavender-light bg-cream px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-mid-purple/40"
            >
              <option value="surrogate">Surrogate</option>
              <option value="donor">Donor</option>
              <option value="intended_parent">Intended Parent</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-lavender">
              PDF File
            </label>
            <div
              className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-lavender-light bg-cream p-10 transition-colors hover:border-mid-purple/50 cursor-pointer"
              onClick={() => document.getElementById('pdf-input')?.click()}
            >
              {file ? (
                <div className="text-center">
                  <p className="text-sm font-medium text-text-primary">{file.name}</p>
                  <p className="mt-1 text-xs text-lavender">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              ) : (
                <>
                  <p className="text-sm text-text-secondary">Click to select a PDF</p>
                  <p className="mt-1 text-xs text-lavender">Max 10 MB</p>
                </>
              )}
              <input
                id="pdf-input"
                type="file"
                accept=".pdf,application/pdf"
                className="hidden"
                onChange={e => setFile(e.target.files?.[0] ?? null)}
              />
            </div>
          </div>

          {error && (
            <p className="mb-4 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-700">{error}</p>
          )}

          <button
            type="submit"
            disabled={!file || uploading}
            className="w-full rounded-xl bg-deep-purple py-3 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {uploading ? 'Extracting…' : 'Upload & Extract →'}
          </button>
        </form>
      )}

      {step === 'review' && result && (
        <div>
          <div className="mb-6 flex items-center gap-3">
            <button
              onClick={() => { setStep('upload'); setResult(null); setFile(null); }}
              className="text-xs text-lavender hover:text-mid-purple"
            >
              ← Upload another
            </button>
            <span className="text-xs text-lavender">
              Review extracted fields — correct any errors, then save.
            </span>
          </div>

          <div className="rounded-xl border border-lavender-light bg-white p-8">
            <ImportReviewForm
              docId={result.docId}
              profileType={profileType}
              extracted={{ ...result.aiExtractedJson, rawText: result.extractedText }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
