'use client';

import { useRef, useState } from 'react';

export function ImageUploadButton({
  onUpload,
  folder = 'mercator',
  label = 'Upload',
  accept = 'image/*',
}: {
  onUpload: (url: string) => void;
  folder?: string;
  label?: string;
  accept?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    try {
      const body = new FormData();
      body.append('file', file);
      body.append('folder', folder);

      const res = await fetch('/api/upload', { method: 'POST', body });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert('Upload failed: ' + (data.error ?? 'Unknown error'));
        return;
      }

      const { url } = await res.json();
      onUpload(url);
    } catch {
      alert('Upload failed — check your connection.');
    } finally {
      setUploading(false);
    }
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = '';
        }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="shrink-0 px-3 py-2 text-xs uppercase tracking-wider border border-stone-300 rounded hover:bg-stone-50 disabled:opacity-40 whitespace-nowrap"
      >
        {uploading ? '↑ Uploading…' : `↑ ${label}`}
      </button>
    </>
  );
}
