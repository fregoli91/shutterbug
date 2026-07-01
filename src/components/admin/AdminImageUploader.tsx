'use client';

import { useState } from 'react';

export function AdminImageUploader({
  targetId,
  mode = 'append'
}: {
  targetId: string;
  mode?: 'append' | 'replace';
}) {
  const [status, setStatus] = useState('');

  async function upload(formData: FormData) {
    setStatus('Uploading...');
    const response = await fetch('/api/admin/upload', {
      method: 'POST',
      body: formData
    });
    const payload = (await response.json()) as { url?: string; error?: string };
    if (!response.ok || !payload.url) {
      setStatus(payload.error || 'Upload failed');
      return;
    }

    const target = document.getElementById(targetId) as HTMLInputElement | HTMLTextAreaElement | null;
    if (target) {
      target.value = mode === 'replace' || !target.value ? payload.url : `${target.value.trim()}\n${payload.url}`;
      target.dispatchEvent(new Event('input', { bubbles: true }));
    }
    setStatus('Uploaded');
  }

  return (
    <form action={upload} className="grid gap-2 rounded-lg border border-ink/10 bg-mint p-3">
      <input name="file" type="file" accept="image/*" className="text-sm" required />
      <button type="submit" className="min-h-10 rounded-full bg-forest px-4 text-sm font-semibold text-white">
        Upload image
      </button>
      {status ? <p className="text-xs font-semibold text-ink/65">{status}</p> : null}
    </form>
  );
}
