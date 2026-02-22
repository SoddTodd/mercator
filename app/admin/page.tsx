'use client';

import { useEffect, useMemo, useState } from 'react';
import { MapSize, MercatorMap } from '../../lib/maps';

const DEFAULT_SIZES: MapSize[] = [
  { id: '3876', label: '12x18"', price: 35, ratio: '2:3' },
  { id: '1', label: '18x24"', price: 45, ratio: '3:4' },
  { id: '2', label: '24x36"', price: 59, ratio: '2:3' },
];

const EMPTY_MAP: MercatorMap = {
  id: '',
  slug: '',
  title: '',
  year: '',
  figure: '',
  description: '',
  image: '',
  images: [],
  printImage: '',
  printFiles: {
    '2:3': '',
    '3:4': '',
  },
  sizes: DEFAULT_SIZES,
};

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export default function AdminPage() {
  const [maps, setMaps] = useState<MercatorMap[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string>('');
  const [form, setForm] = useState<MercatorMap>(EMPTY_MAP);
  const [status, setStatus] = useState<string>('');

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const response = await fetch('/api/maps?full=1');
      const data = await response.json();
      if (cancelled || !Array.isArray(data)) return;

      setMaps(data);
      if (data.length > 0) {
        const first = data[0] as MercatorMap;
        setSelectedSlug(first.slug);
        setForm(first);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const selectedMap = useMemo(
    () => maps.find((map) => map.slug === selectedSlug) ?? null,
    [maps, selectedSlug]
  );

  useEffect(() => {
    if (!selectedMap) return;
    setForm(selectedMap);
  }, [selectedMap]);

  function updateField<K extends keyof MercatorMap>(key: K, value: MercatorMap[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function save() {
    setStatus('Saving...');

    const payload: MercatorMap = {
      ...form,
      slug: form.slug || toSlug(form.title),
      printImage: form.printFiles?.['2:3'] || form.printImage || '',
      images: form.images?.filter(Boolean) ?? [],
      sizes: form.sizes ?? DEFAULT_SIZES,
    };

    const response = await fetch('/api/maps', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      setStatus('Save failed');
      return;
    }

    const saved = (await response.json()) as MercatorMap;
    setMaps((prev) => {
      const index = prev.findIndex((item) => item.slug === saved.slug);
      if (index >= 0) {
        const next = [...prev];
        next[index] = saved;
        return next;
      }
      return [...prev, saved];
    });

    setSelectedSlug(saved.slug);
    setForm(saved);
    setStatus('Saved');
  }

  function createNew() {
    const next = {
      ...EMPTY_MAP,
      id: String(maps.length + 1),
    };
    setSelectedSlug('');
    setForm(next);
  }

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.href = '/admin/login';
  }

  return (
    <main className="min-h-screen bg-[#fdfcfb] text-[#1a1a1a]">
      <div className="max-w-6xl mx-auto px-8 py-12 grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
        <aside className="bg-white border border-stone-200 rounded p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold">Admin Maps</h1>
            <div className="flex items-center gap-2">
              <button
                onClick={createNew}
                className="text-xs uppercase tracking-wider px-3 py-1 border border-stone-300 rounded hover:bg-stone-50"
              >
                New
              </button>
              <button
                onClick={logout}
                className="text-xs uppercase tracking-wider px-3 py-1 border border-stone-300 rounded hover:bg-stone-50"
              >
                Logout
              </button>
            </div>
          </div>
          <div className="space-y-2 max-h-[70vh] overflow-y-auto">
            {maps.map((map) => (
              <button
                key={map.slug}
                onClick={() => setSelectedSlug(map.slug)}
                className={`w-full text-left px-3 py-2 rounded border ${selectedSlug === map.slug ? 'border-stone-800 bg-stone-50' : 'border-stone-200 hover:bg-stone-50'}`}
              >
                <div className="text-sm font-semibold">{map.title}</div>
                <div className="text-xs text-stone-500">/{map.slug}</div>
              </button>
            ))}
          </div>
        </aside>

        <section className="bg-white border border-stone-200 rounded p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="text-sm">
              <div className="mb-1">ID</div>
              <input className="w-full border border-stone-300 rounded px-3 py-2" value={form.id} onChange={(e) => updateField('id', e.target.value)} />
            </label>
            <label className="text-sm">
              <div className="mb-1">Year</div>
              <input className="w-full border border-stone-300 rounded px-3 py-2" value={form.year} onChange={(e) => updateField('year', e.target.value)} />
            </label>
            <label className="text-sm md:col-span-2">
              <div className="mb-1">Title</div>
              <input className="w-full border border-stone-300 rounded px-3 py-2" value={form.title} onChange={(e) => updateField('title', e.target.value)} />
            </label>
            <label className="text-sm md:col-span-2">
              <div className="mb-1">Slug</div>
              <input className="w-full border border-stone-300 rounded px-3 py-2" value={form.slug} onChange={(e) => updateField('slug', e.target.value)} placeholder="auto from title if empty" />
            </label>
            <label className="text-sm md:col-span-2">
              <div className="mb-1">Figure</div>
              <input className="w-full border border-stone-300 rounded px-3 py-2" value={form.figure} onChange={(e) => updateField('figure', e.target.value)} />
            </label>
            <label className="text-sm md:col-span-2">
              <div className="mb-1">Description</div>
              <textarea className="w-full border border-stone-300 rounded px-3 py-2 min-h-40" value={form.description} onChange={(e) => updateField('description', e.target.value)} />
            </label>
            <label className="text-sm md:col-span-2">
              <div className="mb-1">Preview Cover Image URL</div>
              <input className="w-full border border-stone-300 rounded px-3 py-2" value={form.image || ''} onChange={(e) => updateField('image', e.target.value)} />
            </label>
            <label className="text-sm md:col-span-2">
              <div className="mb-1">Gallery Image URLs (one per line)</div>
              <textarea
                className="w-full border border-stone-300 rounded px-3 py-2 min-h-32"
                value={(form.images ?? []).join('\n')}
                onChange={(e) => updateField('images', e.target.value.split('\n').map((v) => v.trim()).filter(Boolean))}
              />
            </label>
            <label className="text-sm md:col-span-2">
              <div className="mb-1">Print File URL (ratio 2:3)</div>
              <input
                className="w-full border border-stone-300 rounded px-3 py-2"
                value={form.printFiles?.['2:3'] || ''}
                onChange={(e) =>
                  updateField('printFiles', {
                    ...form.printFiles,
                    '2:3': e.target.value,
                    '3:4': form.printFiles?.['3:4'] || '',
                  })
                }
              />
            </label>
            <label className="text-sm md:col-span-2">
              <div className="mb-1">Print File URL (ratio 3:4)</div>
              <input
                className="w-full border border-stone-300 rounded px-3 py-2"
                value={form.printFiles?.['3:4'] || ''}
                onChange={(e) =>
                  updateField('printFiles', {
                    ...form.printFiles,
                    '3:4': e.target.value,
                    '2:3': form.printFiles?.['2:3'] || '',
                  })
                }
              />
            </label>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <button
              onClick={save}
              className="px-4 py-2 bg-stone-900 text-white rounded text-sm uppercase tracking-wider hover:bg-stone-800"
            >
              Save Map
            </button>
            <span className="text-sm text-stone-500">{status}</span>
          </div>
        </section>
      </div>
    </main>
  );
}
