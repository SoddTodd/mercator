'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Work_Sans } from 'next/font/google';
import type { MercatorMap } from '../../../lib/maps';

const workSans = Work_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-work-sans'
});

export default function MapClient({
  mapData,
  collectionTitle,
  collectionHref,
}: {
  mapData: MercatorMap;
  collectionTitle: string;
  collectionHref: string;
}) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // images array (supports old `image` field for backward compatibility)
  // Always use images array if available, otherwise fall back to single image
  const images = React.useMemo(() => {
    if (mapData.images && mapData.images.length > 0) {
      return mapData.images;
    }
    if (mapData.image) {
      return [mapData.image];
    }
    return [];
  }, [mapData.images, mapData.image]);
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const selected = mapData.sizes?.find(s => s.id === selectedSize) ?? null;

  const handleCheckout = async () => {
    if (!selected) return; // guard: require selection
    setLoading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mapSlug: mapData.slug,
          sizeId: selected.id,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }
      const data = await response.json();
      if (data.url) window.location.href = data.url;
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={`${workSans.variable} min-h-screen bg-[#fdfcfb] text-[#1a1a1a] font-sans`}>
      <nav className="max-w-6xl mx-auto px-8 py-10 flex justify-between items-center">
        <Link href={collectionHref} className="text-[10px] uppercase tracking-[0.4em] font-semibold opacity-40 hover:opacity-100 transition-opacity">← Back to Collection</Link>
        <h1 className="text-4xl italic tracking-tight text-center">{collectionTitle}</h1>
        <div className="text-[10px] uppercase tracking-[0.4em] font-semibold opacity-40">Plate {mapData.id}</div>
      </nav>

      <section className="max-w-6xl mx-auto px-8 py-12 grid grid-cols-2 gap-24 items-start">
        <div className="sticky top-12 flex flex-col justify-start">
          <div className="bg-white p-6 shadow-xl flex flex-col items-center">
            {/* Main image */}
            <div className="w-full flex items-center justify-center bg-white rounded-sm">
              {images.length > 0 ? (
                <div className="w-full flex items-center justify-center">
                  <img
                    src={images[currentImageIndex]}
                    alt={`${mapData.title} image ${currentImageIndex + 1}`}
                    className="max-w-full max-h-[65vh] object-contain grayscale-[15%] hover:grayscale-0 transition-all duration-700"
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="w-full h-64 bg-stone-100 flex items-center justify-center text-stone-400">No image</div>
              )}
            </div>

            {/* Thumbnail grid - show all images with wrapping */}
            {images.length > 0 && (
              <div className="w-full flex flex-wrap justify-center pb-2 px-2" style={{ marginTop: '2.5rem', gap: '1rem' }}>
                {images.map((img, idx) => {
                  const isActive = idx === currentImageIndex;
                  return (
                    <button
                      key={`thumb-${idx}-${img}`}
                      onClick={() => setCurrentImageIndex(idx)}
                      aria-pressed={isActive}
                      className={`overflow-hidden rounded-sm transition-all bg-white flex items-center justify-center ${isActive ? 'shadow-lg scale-105 opacity-100' : 'shadow-sm hover:shadow-md opacity-70 hover:opacity-100'}`}
                      style={{ 
                        width: '64px', 
                        height: '64px',
                        flexShrink: 0
                      }}
                    >
                      <img 
                        src={img} 
                        alt={`thumbnail ${idx + 1} of ${images.length}`} 
                        className="w-full h-full object-contain"
                        loading="lazy"
                        style={{ display: 'block', width: '100%', height: '100%' }}
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col justify-start space-y-12">
          <span className="text-stone-400 uppercase text-[10px] tracking-[0.3em] font-bold block">Collection Item</span>
          <h2 className="text-5xl leading-tight font-semibold">{mapData.title}</h2>

          <div className="text-[17px] leading-relaxed text-stone-700 mb-10 mt-4">
            {mapData.description.split('\n').map((line, i) => (
              <p key={i} className="mb-4">{line}</p>
            ))}
          </div>

          <div className="bg-stone-50/50 p-8 rounded-sm shadow-sm">
            <div className="flex flex-col">
              <div className="flex justify-between items-end mb-10">
                <div className="flex flex-col" style={{ gap: '1rem' }}>
                  <label className="text-[10px] uppercase tracking-[0.2em] font-black text-stone-400">Select Dimensions</label>
                  <div className="flex" style={{ gap: '1rem' }}>
                    {(mapData.sizes ?? []).map((s) => {
                      const isSelected = selectedSize === s.id;
                      return (
                        <button
                          key={s.id}
                          onClick={() => setSelectedSize(isSelected ? null : s.id)}
                          className={`flex-1 px-4 py-2 rounded-sm text-sm font-semibold transition-all flex items-center justify-center gap-2
                          ${isSelected ? 'bg-stone-900 text-white shadow-md' : 'bg-stone-100 text-stone-900 hover:bg-stone-200'}
                          `}
                          aria-pressed={isSelected}
                        >
                          {s.label}
                          {isSelected && <span className="text-xs font-extrabold uppercase tracking-wide"> Selected</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-3xl font-extrabold leading-tight">{selected?.price ?? '—'}</div>
                  <div className="text-[10px] uppercase tracking-[0.2em] font-black text-stone-400">Price</div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading || !selected}
                aria-busy={loading}
                className={`h-16 bg-stone-100 hover:bg-stone-200 transition-colors shadow-xl active:scale-[0.99] flex items-center justify-center text-[12px] font-bold uppercase tracking-[0.16em] text-stone-900 border border-stone-200 disabled:bg-stone-50 disabled:text-stone-400 disabled:cursor-not-allowed`}
                style={{ marginTop: '2.5rem', width: '80%', marginLeft: 'auto', marginRight: 'auto' }}
              >
                {loading ? 'Processing...' : 'Acquire for Archive'}
              </button>

              <div className="mt-8 md:mt-12 text-center text-[10px] uppercase tracking-[0.16em] font-semibold text-stone-500">
                <ul className="list-none m-0 p-0 flex flex-wrap justify-center items-center gap-y-2 md:gap-y-4">
                  <li className="flex items-center py-1">
                    <Link href="/terms" className="hover:text-stone-900 transition-colors duration-300">
                      Terms
                    </Link>
                    <span className="inline-block mx-2 md:mx-4 opacity-60">•</span>
                  </li>
                  <li className="flex items-center py-1">
                    <Link href="/privacy" className="hover:text-stone-900 transition-colors duration-300">
                      Privacy
                    </Link>
                    <span className="inline-block mx-2 md:mx-4 opacity-60">•</span>
                  </li>
                  <li className="flex items-center py-1">
                    <Link href="/shipping" className="hover:text-stone-900 transition-colors duration-300">
                      Shipping
                    </Link>
                    <span className="inline-block mx-2 md:mx-4 opacity-60">•</span>
                  </li>
                  <li className="flex items-center py-1">
                    <Link href="/returns" className="hover:text-stone-900 transition-colors duration-300">
                      Returns
                    </Link>
                    <span className="inline-block mx-2 md:mx-4 opacity-60">•</span>
                  </li>
                  <li className="flex items-center py-1">
                    <Link href="/withdrawal" className="hover:text-stone-900 transition-colors duration-300">
                      Withdrawal
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
