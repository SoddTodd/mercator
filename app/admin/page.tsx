'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Chapter, DEFAULT_CHAPTERS, sortChapters } from '../../lib/chapters';
import { MapSize, MercatorMap } from '../../lib/maps';

const DEFAULT_SIZES: MapSize[] = [
  { id: '3876', label: '12x18"', price: 35, ratio: '2:3' },
  { id: '1', label: '18x24"', price: 45, ratio: '3:4' },
  { id: '2', label: '24x36"', price: 59, ratio: '2:3' },
];

const EMPTY_MAP: MercatorMap = {
  id: '',
  chapterSlug: 'the-mercator-archives',
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

const EMPTY_CHAPTER: Chapter = {
  id: '00',
  order: 0,
  slug: '',
  title: '',
  description: '',
  heroImage: '',
  seoTitle: '',
  seoDescription: '',
  href: '',
  status: 'New direction',
  isLive: false,
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
  const [chapters, setChapters] = useState<Chapter[]>(sortChapters(DEFAULT_CHAPTERS));
  const [selectedSlug, setSelectedSlug] = useState<string>('');
  const [selectedChapterSlug, setSelectedChapterSlug] = useState<string>('');
  const [activeSection, setActiveSection] = useState<'maps' | 'chapters'>('maps');
  const [chapterFilter, setChapterFilter] = useState<string>('all');
  const [manualIdOverride, setManualIdOverride] = useState(false);
  const [form, setForm] = useState<MercatorMap>(EMPTY_MAP);
  const [chapterForm, setChapterForm] = useState<Chapter>(EMPTY_CHAPTER);
  const [status, setStatus] = useState<string>('');

  function normalizeMap(item: MercatorMap): MercatorMap {
    return {
      ...item,
      chapterSlug: item.chapterSlug || 'the-mercator-archives',
      printFiles: {
        '2:3': item.printFiles?.['2:3'] || item.printImage || '',
        '3:4': item.printFiles?.['3:4'] || item.printImage || '',
      },
      sizes: item.sizes ?? DEFAULT_SIZES,
    };
  }

  function pickMap(slug: string, sourceMaps: MercatorMap[]) {
    const found = sourceMaps.find((item) => item.slug === slug);
    if (!found) return;
    setSelectedSlug(found.slug);
    setManualIdOverride(false);
    setForm(found);
  }

  function normalizeChapter(input: Chapter): Chapter {
    return {
      ...input,
      href: input.href || `/collections/${input.slug}`,
      id: input.id || String(input.order).padStart(2, '0'),
      heroImage: input.heroImage || '',
      seoTitle: input.seoTitle || input.title,
      seoDescription: input.seoDescription || input.description,
    };
  }

  function pickChapter(slug: string, sourceChapters: Chapter[]) {
    const found = sourceChapters.find((chapter) => chapter.slug === slug);
    if (!found) return;
    setSelectedChapterSlug(found.slug);
    setChapterForm(found);
  }

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const [mapsResponse, chaptersResponse] = await Promise.all([
        fetch('/api/maps?full=1'),
        fetch('/api/chapters?full=1'),
      ]);

      const mapsData = await mapsResponse.json();
      const chaptersData = await chaptersResponse.json();

      if (cancelled) return;

      if (Array.isArray(mapsData)) {
        const normalizedMaps = mapsData.map((item) => normalizeMap(item as MercatorMap));
        setMaps(normalizedMaps);

        if (normalizedMaps.length > 0) {
          pickMap(normalizedMaps[0].slug, normalizedMaps);
        } else {
          setSelectedSlug('');
          setForm(EMPTY_MAP);
        }
      }

      if (Array.isArray(chaptersData) && chaptersData.length > 0) {
        const normalizedChapters = sortChapters(chaptersData.map((item) => normalizeChapter(item as Chapter)));
        setChapters(normalizedChapters);
        pickChapter(normalizedChapters[0].slug, normalizedChapters);
      } else {
        const fallback = sortChapters(DEFAULT_CHAPTERS);
        setChapters(fallback);
        pickChapter(fallback[0].slug, fallback);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredMaps = useMemo(() => {
    if (chapterFilter === 'all') return maps;
    return maps.filter((map) => map.chapterSlug === chapterFilter);
  }, [maps, chapterFilter]);

  const chapterStats = useMemo(() => {
    const byChapter = new Map<string, number>();
    for (const map of maps) {
      const key = map.chapterSlug || 'the-mercator-archives';
      byChapter.set(key, (byChapter.get(key) || 0) + 1);
    }
    return byChapter;
  }, [maps]);

  function updateField<K extends keyof MercatorMap>(key: K, value: MercatorMap[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function getNextIdForCollection(collectionSlug: string, sourceMaps: MercatorMap[], excludeSlug?: string) {
    const ids = sourceMaps
      .filter((item) => (item.chapterSlug || 'the-mercator-archives') === collectionSlug)
      .filter((item) => !excludeSlug || item.slug !== excludeSlug)
      .map((item) => Number(item.id))
      .filter((value) => Number.isFinite(value) && value > 0);

    if (ids.length === 0) return '1';
    return String(Math.max(...ids) + 1);
  }

  async function save() {
    setStatus('Saving...');

    const resolvedCollectionSlug = form.chapterSlug || 'the-mercator-archives';
    const resolvedId = (form.id || '').trim() || getNextIdForCollection(resolvedCollectionSlug, maps);

    const payload: MercatorMap = {
      ...form,
      id: resolvedId,
      chapterSlug: resolvedCollectionSlug,
      slug: form.slug || toSlug(form.title),
      printImage: form.printFiles?.['2:3'] || form.printImage || '',
      images: (form.images ?? []).map((value) => value.trim()).filter(Boolean),
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
    const normalizedSaved = normalizeMap(saved);
    setMaps((prev) => {
      const index = prev.findIndex((item) => item.slug === normalizedSaved.slug);
      if (index >= 0) {
        const next = [...prev];
        next[index] = normalizedSaved;
        return next;
      }
      return [...prev, normalizedSaved];
    });

    setSelectedSlug(normalizedSaved.slug);
    setForm(normalizedSaved);
    setStatus('Saved');
  }

  async function saveChapter() {
    setStatus('Saving collection...');

    const payload: Chapter = {
      ...chapterForm,
      id: chapterForm.id || String(chapterForm.order).padStart(2, '0'),
      href: chapterForm.href || `/collections/${chapterForm.slug}`,
      heroImage: chapterForm.heroImage || '',
      seoTitle: chapterForm.seoTitle || chapterForm.title,
      seoDescription: chapterForm.seoDescription || chapterForm.description,
    };

    const response = await fetch('/api/chapters', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      setStatus('Collection save failed');
      return;
    }

    const saved = normalizeChapter((await response.json()) as Chapter);
    setChapters((prev) => {
      const index = prev.findIndex((item) => item.slug === saved.slug);
      if (index >= 0) {
        const next = [...prev];
        next[index] = saved;
        return sortChapters(next);
      }
      return sortChapters([...prev, saved]);
    });

    setSelectedChapterSlug(saved.slug);
    setChapterForm(saved);
    setStatus('Collection saved');
  }

  function createNew() {
    const nextCollectionSlug = chapterFilter === 'all' ? 'the-mercator-archives' : chapterFilter;
    const next = {
      ...EMPTY_MAP,
      chapterSlug: nextCollectionSlug,
      id: getNextIdForCollection(nextCollectionSlug, maps),
    };
    setSelectedSlug('');
    setManualIdOverride(false);
    setForm(next);
    setStatus('');
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
            <h1 className="text-xl font-semibold">Admin Studio</h1>
            <div className="flex items-center gap-2">
              <button
                onClick={logout}
                className="text-xs uppercase tracking-wider px-3 py-1 border border-stone-300 rounded hover:bg-stone-50"
              >
                Logout
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-4">
            <button
              onClick={() => setActiveSection('maps')}
              className={`text-xs uppercase tracking-wider px-3 py-2 border rounded ${activeSection === 'maps' ? 'border-stone-900 bg-stone-900 text-white' : 'border-stone-300 hover:bg-stone-50'}`}
            >
              Items
            </button>
            <button
              onClick={() => setActiveSection('chapters')}
              className={`text-xs uppercase tracking-wider px-3 py-2 border rounded ${activeSection === 'chapters' ? 'border-stone-900 bg-stone-900 text-white' : 'border-stone-300 hover:bg-stone-50'}`}
            >
              Collections
            </button>
          </div>

          {activeSection === 'maps' ? (
            <>
              <div className="mb-4">
                <label className="text-xs uppercase tracking-wider text-stone-500 block mb-1">Collection filter</label>
                <select
                  className="w-full border border-stone-300 rounded px-3 py-2 text-sm"
                  value={chapterFilter}
                  onChange={(e) => setChapterFilter(e.target.value)}
                >
                  <option value="all">All collections</option>
                  {chapters.map((chapter) => (
                    <option key={chapter.slug} value={chapter.slug}>
                      {chapter.id} — {chapter.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm uppercase tracking-wider text-stone-500">Item entries</h2>
                <button
                  onClick={createNew}
                  className="text-xs uppercase tracking-wider px-3 py-1 border border-stone-300 rounded hover:bg-stone-50"
                >
                  New
                </button>
              </div>

              <div className="space-y-2 max-h-[58vh] overflow-y-auto pr-1">
                {filteredMaps.map((map) => (
                  <button
                    key={map.slug}
                    onClick={() => pickMap(map.slug, maps)}
                    className={`w-full text-left px-3 py-2 rounded border ${selectedSlug === map.slug ? 'border-stone-800 bg-stone-50' : 'border-stone-200 hover:bg-stone-50'}`}
                  >
                    <div className="text-sm font-semibold">{map.title}</div>
                    <div className="text-xs text-stone-500">/{map.slug}</div>
                  </button>
                ))}
                {filteredMaps.length === 0 && (
                  <p className="text-xs text-stone-500 italic">No items in this collection yet.</p>
                )}
              </div>
            </>
          ) : (
            <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
              {chapters.map((chapter) => (
                <div
                  key={chapter.slug}
                  className={`border rounded p-3 ${selectedChapterSlug === chapter.slug ? 'border-stone-800 bg-stone-50' : 'border-stone-200'}`}
                >
                  <div className="text-[10px] uppercase tracking-wider text-stone-400 mb-1">
                    Collection {chapter.id} · {chapter.status}
                  </div>
                  <div className="text-sm font-semibold text-stone-800">{chapter.title}</div>
                  <div className="text-xs text-stone-500 mt-1">
                    Entries: {chapterStats.get(chapter.slug) || 0}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <button
                      onClick={() => pickChapter(chapter.slug, chapters)}
                      className="text-xs uppercase tracking-wider px-2 py-1 border border-stone-300 rounded hover:bg-stone-100"
                    >
                      Edit
                    </button>
                    <Link href={chapter.href} className="text-xs uppercase tracking-wider text-stone-600 hover:text-stone-900">
                      Open collection →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </aside>

        <section className="bg-white border border-stone-200 rounded p-6 space-y-5">
          <div className="text-[10px] uppercase tracking-[0.2em] text-stone-400">{activeSection === 'maps' ? 'Item Editor' : 'Collection Editor'}</div>
          {activeSection === 'maps' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="text-sm">
              <div className="mb-1">ID</div>
              <input
                className={`w-full border rounded px-3 py-2 ${manualIdOverride ? 'border-stone-300' : 'border-stone-200 bg-stone-50 text-stone-600'}`}
                value={form.id}
                onChange={(e) => updateField('id', e.target.value)}
                readOnly={!manualIdOverride}
              />
              <label className="mt-2 inline-flex items-center gap-2 text-xs text-stone-500">
                <input
                  type="checkbox"
                  checked={manualIdOverride}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setManualIdOverride(checked);

                    if (!checked) {
                      setForm((prev) => {
                        const collectionSlug = prev.chapterSlug || 'the-mercator-archives';
                        return {
                          ...prev,
                          id: getNextIdForCollection(collectionSlug, maps, selectedSlug || undefined),
                        };
                      });
                    }
                  }}
                />
                Manual ID override
              </label>
            </label>
            <label className="text-sm">
              <div className="mb-1">Collection</div>
              <select
                className="w-full border border-stone-300 rounded px-3 py-2"
                value={form.chapterSlug || 'the-mercator-archives'}
                onChange={(e) => {
                  const nextCollectionSlug = e.target.value;
                  setForm((prev) => {
                    const shouldAutoReindex = !manualIdOverride;
                    return {
                      ...prev,
                      chapterSlug: nextCollectionSlug,
                      id: shouldAutoReindex
                        ? getNextIdForCollection(nextCollectionSlug, maps, selectedSlug || undefined)
                        : prev.id,
                    };
                  });
                }}
              >
                {chapters.map((chapter) => (
                  <option key={chapter.slug} value={chapter.slug}>
                    {chapter.id} — {chapter.title}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm">
              <div className="mb-1">Year</div>
              <input className="w-full border border-stone-300 rounded px-3 py-2" value={form.year} onChange={(e) => updateField('year', e.target.value)} />
            </label>
            <div className="hidden md:block" />
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
                onChange={(e) => updateField('images', e.target.value.split('\n'))}
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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="text-sm">
                <div className="mb-1">ID</div>
                <input
                  className="w-full border border-stone-300 rounded px-3 py-2"
                  value={chapterForm.id}
                  onChange={(e) => setChapterForm((prev) => ({ ...prev, id: e.target.value }))}
                />
              </label>
              <label className="text-sm">
                <div className="mb-1">Order</div>
                <input
                  type="number"
                  className="w-full border border-stone-300 rounded px-3 py-2"
                  value={chapterForm.order}
                  onChange={(e) => setChapterForm((prev) => ({ ...prev, order: Number(e.target.value || 0) }))}
                />
              </label>
              <label className="text-sm md:col-span-2">
                <div className="mb-1">Title</div>
                <input
                  className="w-full border border-stone-300 rounded px-3 py-2"
                  value={chapterForm.title}
                  onChange={(e) => setChapterForm((prev) => ({ ...prev, title: e.target.value }))}
                />
              </label>
              <label className="text-sm md:col-span-2">
                <div className="mb-1">Slug</div>
                <input
                  className="w-full border border-stone-300 rounded px-3 py-2"
                  value={chapterForm.slug}
                  onChange={(e) => setChapterForm((prev) => ({ ...prev, slug: e.target.value }))}
                />
              </label>
              <label className="text-sm md:col-span-2">
                <div className="mb-1">Description</div>
                <textarea
                  className="w-full border border-stone-300 rounded px-3 py-2 min-h-28"
                  value={chapterForm.description}
                  onChange={(e) => setChapterForm((prev) => ({ ...prev, description: e.target.value }))}
                />
              </label>
              <label className="text-sm md:col-span-2">
                <div className="mb-1">Hero Image URL</div>
                <input
                  className="w-full border border-stone-300 rounded px-3 py-2"
                  value={chapterForm.heroImage || ''}
                  onChange={(e) => setChapterForm((prev) => ({ ...prev, heroImage: e.target.value }))}
                />
              </label>
              <label className="text-sm md:col-span-2">
                <div className="mb-1">SEO Title</div>
                <input
                  className="w-full border border-stone-300 rounded px-3 py-2"
                  value={chapterForm.seoTitle || ''}
                  onChange={(e) => setChapterForm((prev) => ({ ...prev, seoTitle: e.target.value }))}
                />
              </label>
              <label className="text-sm md:col-span-2">
                <div className="mb-1">SEO Description</div>
                <textarea
                  className="w-full border border-stone-300 rounded px-3 py-2 min-h-24"
                  value={chapterForm.seoDescription || ''}
                  onChange={(e) => setChapterForm((prev) => ({ ...prev, seoDescription: e.target.value }))}
                />
              </label>
              <label className="text-sm md:col-span-2">
                <div className="mb-1">Href</div>
                <input
                  className="w-full border border-stone-300 rounded px-3 py-2"
                  value={chapterForm.href}
                  onChange={(e) => setChapterForm((prev) => ({ ...prev, href: e.target.value }))}
                />
              </label>
              <label className="text-sm">
                <div className="mb-1">Status</div>
                <select
                  className="w-full border border-stone-300 rounded px-3 py-2"
                  value={chapterForm.status}
                  onChange={(e) => setChapterForm((prev) => ({ ...prev, status: e.target.value === 'Live collection' ? 'Live collection' : 'New direction' }))}
                >
                  <option value="New direction">New direction</option>
                  <option value="Live collection">Live collection</option>
                </select>
              </label>
              <label className="text-sm flex items-center gap-3 mt-6">
                <input
                  type="checkbox"
                  checked={chapterForm.isLive}
                  onChange={(e) => setChapterForm((prev) => ({ ...prev, isLive: e.target.checked }))}
                />
                <span>Live collection</span>
              </label>
            </div>
          )}

          <div className="flex items-center gap-4 pt-2">
            <button
              onClick={activeSection === 'maps' ? save : saveChapter}
              className="px-4 py-2 bg-stone-900 text-white rounded text-sm uppercase tracking-wider hover:bg-stone-800"
            >
              {activeSection === 'maps' ? 'Save Item' : 'Save Collection'}
            </button>
            <span className="text-sm text-stone-500">{status}</span>
          </div>
        </section>
      </div>
    </main>
  );
}
