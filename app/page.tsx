'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Work_Sans } from 'next/font/google';
import { MAPS, MercatorMap } from '../lib/maps';
import { Chapter, DEFAULT_CHAPTERS, sortChapters } from '../lib/chapters';

const workSans = Work_Sans({ 
  subsets: ['latin'], 
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-work-sans' 
});

export default function Home() {
  const [showChapterMenu, setShowChapterMenu] = useState(false);
  const [maps, setMaps] = useState<MercatorMap[]>(MAPS);
  const [chapters, setChapters] = useState<Chapter[]>(sortChapters(DEFAULT_CHAPTERS));
  const closeMenuTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const openChapterMenu = React.useCallback(() => {
    if (closeMenuTimeoutRef.current) {
      clearTimeout(closeMenuTimeoutRef.current);
      closeMenuTimeoutRef.current = null;
    }
    setShowChapterMenu(true);
  }, []);

  const closeChapterMenuWithDelay = React.useCallback(() => {
    if (closeMenuTimeoutRef.current) {
      clearTimeout(closeMenuTimeoutRef.current);
    }

    closeMenuTimeoutRef.current = setTimeout(() => {
      setShowChapterMenu(false);
      closeMenuTimeoutRef.current = null;
    }, 180);
  }, []);

  React.useEffect(() => {
    let cancelled = false;

    async function loadMaps() {
      try {
        const response = await fetch('/api/maps');
        if (!response.ok) return;
        const nextMaps = (await response.json()) as MercatorMap[];
        if (!cancelled && Array.isArray(nextMaps) && nextMaps.length > 0) {
          setMaps(
            nextMaps.map((map) => ({
              ...map,
              chapterSlug: map.chapterSlug || 'the-mercator-archives',
            }))
          );
        }
      } catch {
      }
    }

    async function loadChapters() {
      try {
        const response = await fetch('/api/chapters');
        if (!response.ok) return;
        const nextChapters = (await response.json()) as Chapter[];
        if (!cancelled && Array.isArray(nextChapters) && nextChapters.length > 0) {
          setChapters(sortChapters(nextChapters));
        }
      } catch {
      }
    }

    loadMaps();
    loadChapters();
    return () => {
      cancelled = true;
    };
  }, []);

  const mercatorMaps = React.useMemo(
    () => maps.filter((map) => (map.chapterSlug || 'the-mercator-archives') === 'the-mercator-archives'),
    [maps]
  );

  React.useEffect(() => {
    return () => {
      if (closeMenuTimeoutRef.current) {
        clearTimeout(closeMenuTimeoutRef.current);
      }
    };
  }, []);

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
            onMouseEnter={openChapterMenu}
            onMouseLeave={closeChapterMenuWithDelay}
          >
            <button
              className="text-xs uppercase tracking-[0.2em] font-semibold text-stone-800 hover:text-stone-950 transition-colors duration-300 writing-mode-vertical-rl cursor-pointer"
            >
              Collections
            </button>

            {showChapterMenu && (
              <div
                className="absolute left-12 top-0 bg-white shadow-2xl rounded-lg p-6 w-[420px] border border-stone-200"
                onMouseEnter={openChapterMenu}
                onMouseLeave={closeChapterMenuWithDelay}
              >
                <h3 className="text-sm uppercase tracking-[0.2em] font-semibold text-stone-800 mb-4 pb-3 border-b border-stone-200">
                  Poster Collections
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {chapters.map((chapter) => (
                    <Link
                      key={chapter.slug}
                      href={chapter.href}
                      className="group flex items-start gap-3 p-3 rounded hover:bg-stone-50 transition-colors duration-200"
                    >
                      <span className="text-[10px] font-bold text-stone-400 mt-1 min-w-[30px]">
                        {chapter.id}
                      </span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-stone-800 group-hover:text-stone-950 leading-tight">
                          {chapter.title}
                        </p>
                        <p className="text-[10px] text-stone-400 mt-1 uppercase tracking-wider">
                          {chapter.status}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <a
            href="#maps"
            className="text-xs uppercase tracking-[0.2em] font-semibold text-stone-800 hover:text-stone-950 transition-colors duration-300 writing-mode-vertical-rl"
          >
            Mercator
          </a>

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
          Monochrome Matters — Poster Collections
        </div>
        <h1 className="text-6xl md:text-7xl italic tracking-tight mb-8 text-stone-800 font-semibold">
          Archive Directions
        </h1>
        <div className="h-px w-24 bg-stone-200 mx-auto mb-8"></div>
        <p className="max-w-2xl mx-auto text-lg text-stone-500 leading-relaxed italic">
          Choose a collection direction to enter. Mercator is live today, and three new lines are ready to be built next.
        </p>
      </header>

      <section className="max-w-6xl mx-auto px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {chapters.map((chapter) => (
            <Link
              key={chapter.slug}
              href={chapter.href}
              className="group border border-stone-200 bg-white p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400 mb-4">
                {chapter.status}
              </div>
              <h2 className="text-3xl italic font-semibold text-stone-800 mb-4 group-hover:text-stone-600 transition-colors">
                {chapter.title}
              </h2>
              <p className="text-stone-500 leading-relaxed mb-6">{chapter.description}</p>
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-stone-700 group-hover:text-stone-950 transition-colors">
                Enter collection →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section id="maps" className="max-w-6xl mx-auto px-8 pb-32">
        <div className="text-center mb-16">
          <h2 className="text-4xl italic font-semibold text-stone-800 mb-4">The Mercator Archives</h2>
          <div className="h-px w-16 bg-stone-200 mx-auto"></div>
          <p className="max-w-2xl mx-auto text-stone-500 italic mt-6">
            Active chapter with the current atlas product line.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
          {mercatorMaps.map((map) => (
            <Link key={map.id} href={`/map/${map.slug}`} className="group cursor-pointer flex flex-col">
              <div className="relative overflow-hidden bg-white p-4 shadow-sm transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-2 flex items-center justify-center">
                <img 
                  src={map.image || '/maps/saxonia4.avif'} 
                  alt={map.title}
                  className="w-auto h-auto max-w-full object-contain grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
                />
              </div>
              <div className="mt-6 text-center">
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400">
                  {map.year} / Plate {map.id.padStart(2, '0')}
                </span>
                <h3 className="text-2xl mt-2 group-hover:text-stone-600 transition-colors px-4 leading-tight font-medium">
                  {map.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="max-w-6xl mx-auto px-8 pb-32">
        <div className="text-center">
          <h2 className="text-4xl italic font-semibold text-stone-800 mb-6 md:mb-8">Get in Touch</h2>
          <div className="h-px w-16 bg-stone-200 mx-auto mb-10 md:mb-14"></div>
          <p className="text-lg text-stone-500 leading-relaxed italic max-w-2xl mx-auto">
            For inquiries about prints or additional information about the collection,
            please reach out to us.
          </p>
          <a 
            href="mailto:info@monochrome-matters.eu" 
            className="inline-block text-sm uppercase tracking-[0.3em] font-semibold text-stone-600 hover:text-stone-900 transition-colors duration-300"
            style={{ marginTop: '4rem' }}
          >
            Contact Us
          </a>

          <div
            className="border-t border-stone-200 text-[10px] uppercase tracking-[0.2em] font-semibold text-stone-500"
            style={{ marginTop: '5rem', paddingTop: '2.75rem' }}
          >
            <ul
              className="list-none m-0 p-0 flex flex-row flex-wrap justify-center items-center"
              style={{ rowGap: '1rem', columnGap: '0.5rem' }}
            >
              <li className="flex items-center" style={{ paddingTop: '0.25rem', paddingBottom: '0.25rem' }}>
                <Link href="/legal" className="hover:text-stone-900 transition-colors duration-300">Legal Center</Link>
                <span className="inline-block mx-4 opacity-60">•</span>
              </li>
              <li className="flex items-center" style={{ paddingTop: '0.25rem', paddingBottom: '0.25rem' }}>
                <Link href="/impressum" className="hover:text-stone-900 transition-colors duration-300">Impressum</Link>
                <span className="inline-block mx-4 opacity-60">•</span>
              </li>
              <li className="flex items-center" style={{ paddingTop: '0.25rem', paddingBottom: '0.25rem' }}>
                <Link href="/privacy" className="hover:text-stone-900 transition-colors duration-300">Privacy</Link>
                <span className="inline-block mx-4 opacity-60">•</span>
              </li>
              <li className="flex items-center" style={{ paddingTop: '0.25rem', paddingBottom: '0.25rem' }}>
                <Link href="/terms" className="hover:text-stone-900 transition-colors duration-300">Terms</Link>
                <span className="inline-block mx-4 opacity-60">•</span>
              </li>
              <li className="flex items-center" style={{ paddingTop: '0.25rem', paddingBottom: '0.25rem' }}>
                <Link href="/shipping" className="hover:text-stone-900 transition-colors duration-300">Shipping</Link>
                <span className="inline-block mx-4 opacity-60">•</span>
              </li>
              <li className="flex items-center" style={{ paddingTop: '0.25rem', paddingBottom: '0.25rem' }}>
                <Link href="/returns" className="hover:text-stone-900 transition-colors duration-300">Returns</Link>
                <span className="inline-block mx-4 opacity-60">•</span>
              </li>
              <li className="flex items-center" style={{ paddingTop: '0.25rem', paddingBottom: '0.25rem' }}>
                <Link href="/withdrawal" className="hover:text-stone-900 transition-colors duration-300">Withdrawal</Link>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
