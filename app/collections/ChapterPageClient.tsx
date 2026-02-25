'use client';

import React from 'react';
import Link from 'next/link';
import { Work_Sans } from 'next/font/google';
import { Chapter, DEFAULT_CHAPTERS, sortChapters } from '../../lib/chapters';

type ChapterMapSummary = {
  id: string;
  chapterSlug?: string;
  slug: string;
  title: string;
  year: string;
  image?: string;
};

const workSans = Work_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-work-sans',
});

export default function ChapterPageClient({ chapterSlug }: { chapterSlug: string }) {
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [chapters, setChapters] = React.useState<Chapter[]>(sortChapters(DEFAULT_CHAPTERS));
  const [maps, setMaps] = React.useState<ChapterMapSummary[]>([]);
  const closeDropdownTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const openDropdown = React.useCallback(() => {
    if (closeDropdownTimeoutRef.current) {
      clearTimeout(closeDropdownTimeoutRef.current);
      closeDropdownTimeoutRef.current = null;
    }
    setShowDropdown(true);
  }, []);

  const closeDropdownWithDelay = React.useCallback(() => {
    if (closeDropdownTimeoutRef.current) {
      clearTimeout(closeDropdownTimeoutRef.current);
    }

    closeDropdownTimeoutRef.current = setTimeout(() => {
      setShowDropdown(false);
      closeDropdownTimeoutRef.current = null;
    }, 180);
  }, []);

  React.useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [chaptersResponse, mapsResponse] = await Promise.all([
          fetch('/api/chapters'),
          fetch('/api/maps'),
        ]);

        if (chaptersResponse.ok) {
          const nextChapters = (await chaptersResponse.json()) as Chapter[];
          if (!cancelled && Array.isArray(nextChapters) && nextChapters.length > 0) {
            setChapters(sortChapters(nextChapters));
          }
        }

        if (mapsResponse.ok) {
          const nextMaps = (await mapsResponse.json()) as ChapterMapSummary[];
          if (!cancelled && Array.isArray(nextMaps)) {
            setMaps(nextMaps);
          }
        }
      } catch {
      }
    }

    load();

    return () => {
      cancelled = true;
      if (closeDropdownTimeoutRef.current) {
        clearTimeout(closeDropdownTimeoutRef.current);
      }
    };
  }, [closeDropdownWithDelay]);

  const chapter = React.useMemo(
    () => chapters.find((item) => item.slug === chapterSlug) || DEFAULT_CHAPTERS.find((item) => item.slug === chapterSlug),
    [chapterSlug, chapters]
  );

  const chapterMaps = React.useMemo(
    () => maps.filter((map) => (map.chapterSlug || 'the-mercator-archives') === chapterSlug),
    [chapterSlug, maps]
  );

  if (!chapter) {
    return (
      <main className={`${workSans.variable} min-h-screen bg-[#fdfcfb] text-[#1a1a1a] font-sans`}>
        <section className="max-w-4xl mx-auto px-8 py-24 text-center">
          <h1 className="text-4xl italic font-semibold text-stone-800 mb-6">Collection not found</h1>
          <Link href="/" className="text-xs uppercase tracking-[0.2em] font-semibold text-stone-700 hover:text-stone-950 transition-colors">
            ← Back to all collections
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className={`${workSans.variable} min-h-screen bg-[#fdfcfb] text-[#1a1a1a] font-sans`}>
      <nav className="fixed left-8 top-1/2 -translate-y-1/2 z-[100]">
        <div className="flex flex-col gap-6">
          <a
            href="#about"
            className="text-xs uppercase tracking-[0.2em] font-semibold text-stone-800 hover:text-stone-950 transition-colors duration-300 writing-mode-vertical-rl"
          >
            About
          </a>

          <div
            className="relative"
            onMouseEnter={openDropdown}
            onMouseLeave={closeDropdownWithDelay}
          >
            <button className="text-xs uppercase tracking-[0.2em] font-semibold text-stone-800 hover:text-stone-950 transition-colors duration-300 writing-mode-vertical-rl cursor-pointer">
              All Plates
            </button>

            {showDropdown && (
              <div
                className="absolute left-12 top-0 bg-white shadow-2xl rounded-lg p-6 w-[420px] max-h-[80vh] overflow-y-auto border border-stone-200"
                onMouseEnter={openDropdown}
                onMouseLeave={closeDropdownWithDelay}
              >
                <h3 className="text-sm uppercase tracking-[0.2em] font-semibold text-stone-800 mb-4 pb-3 border-b border-stone-200">
                  {chapter.title}
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {chapterMaps.length > 0 ? (
                    chapterMaps.map((map) => (
                      <Link
                        key={map.slug}
                        href={`/map/${map.slug}`}
                        className="group flex items-start gap-3 p-3 rounded hover:bg-stone-50 transition-colors duration-200"
                      >
                        <span className="text-[10px] font-bold text-stone-400 mt-1 min-w-[30px]">
                          {(map.id || '').toString().padStart(2, '0')}
                        </span>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-stone-800 group-hover:text-stone-950 leading-tight">
                            {map.title}
                          </p>
                          <p className="text-[10px] text-stone-400 mt-1 uppercase tracking-wider">
                            {map.year}
                          </p>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p className="text-sm text-stone-500 italic px-2 py-1">No items yet in this collection.</p>
                  )}
                </div>
              </div>
            )}
          </div>

          <a
            href="#contact"
            className="text-xs uppercase tracking-[0.2em] font-semibold text-stone-800 hover:text-stone-950 transition-colors duration-300 writing-mode-vertical-rl"
          >
            Contact
          </a>
        </div>
      </nav>

      <header id="about" className="max-w-6xl mx-auto px-8 py-20 text-center">
        <div className="text-[10px] uppercase tracking-[0.5em] font-semibold opacity-40 mb-6">
          Collection {chapter.id}
        </div>
        <h1 className="text-6xl md:text-7xl italic tracking-tight mb-8 text-stone-800 font-semibold">
          {chapter.title}
        </h1>
        <div className="h-px w-24 bg-stone-200 mx-auto mb-8"></div>
        <p className="max-w-2xl mx-auto text-lg text-stone-500 leading-relaxed italic">
          {chapter.description}
        </p>
      </header>

      {chapter.heroImage && (
        <section className="max-w-6xl mx-auto px-8 pb-16">
          <div className="bg-white border border-stone-200 p-4 shadow-sm">
            <img
              src={chapter.heroImage}
              alt={chapter.title}
              className="w-full h-auto object-cover max-h-[520px]"
            />
          </div>
        </section>
      )}

      <section className="max-w-6xl mx-auto px-8 pb-24">
        <div className="text-center mb-14">
          <h2 className="text-4xl italic font-semibold text-stone-800 mb-4">The Collection</h2>
          <div className="h-px w-16 bg-stone-200 mx-auto"></div>
        </div>

        {chapterMaps.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
            {chapterMaps.map((map) => (
              <Link key={map.slug} href={`/map/${map.slug}`} className="group cursor-pointer flex flex-col">
                <div className="relative overflow-hidden bg-white p-4 shadow-sm transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-2 flex items-center justify-center">
                  <img
                    src={map.image || '/maps/saxonia4.avif'}
                    alt={map.title}
                    className="w-auto h-auto max-w-full object-contain grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
                  />
                </div>
                <div className="mt-6 text-center">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400">
                    {map.year} / Plate {(map.id || '').toString().padStart(2, '0')}
                  </span>
                  <h3 className="text-2xl mt-2 group-hover:text-stone-600 transition-colors px-4 leading-tight font-medium">
                    {map.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="border border-stone-200 bg-white p-10 text-center max-w-3xl mx-auto">
            <p className="text-stone-500 italic text-lg">This collection is ready for curation. Add entries from the admin panel to publish items here.</p>
          </div>
        )}
      </section>

      <section id="contact" className="max-w-6xl mx-auto px-8 pb-24 text-center">
        <h2 className="text-4xl italic font-semibold text-stone-800 mb-6">Get in Touch</h2>
        <div className="h-px w-16 bg-stone-200 mx-auto mb-10"></div>
        <p className="text-lg text-stone-500 leading-relaxed italic max-w-2xl mx-auto">
          For collection-specific inquiries, collaborations, or print information, please contact us.
        </p>
        <a
          href="mailto:info@monochrome-matters.eu"
          className="inline-block text-sm uppercase tracking-[0.3em] font-semibold text-stone-600 hover:text-stone-900 transition-colors duration-300"
          style={{ marginTop: '3rem' }}
        >
          Contact Us
        </a>
        <div className="mt-12">
          <Link href="/" className="text-xs uppercase tracking-[0.2em] font-semibold text-stone-700 hover:text-stone-950 transition-colors">
            ← Back to all collections
          </Link>
        </div>
      </section>
    </main>
  );
}
