'use client';
import React from 'react';
import Link from 'next/link';
import { Work_Sans } from 'next/font/google';
import { MAPS, MercatorMap } from '../lib/maps';

const workSans = Work_Sans({ 
  subsets: ['latin'], 
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-work-sans' 
});

export default function Home() {
  return (
    <main className={`${workSans.variable} min-h-screen bg-[#fdfcfb] text-[#1a1a1a] font-sans`}>
      <header className="max-w-6xl mx-auto px-8 py-20 text-center">
        <div className="text-[10px] uppercase tracking-[0.5em] font-semibold opacity-40 mb-6">
          The Atlas of Gerardus Mercator
        </div>
        <h1 className="text-6xl md:text-7xl italic tracking-tight mb-8 text-stone-800 font-semibold">
          The Mercator Archives
        </h1>
        <div className="h-px w-24 bg-stone-200 mx-auto mb-8"></div>
        <p className="max-w-2xl mx-auto text-lg text-stone-500 leading-relaxed italic">
          A curated collection of 57 masterworks from the 16th century.
        </p>
      </header>

      <section className="max-w-6xl mx-auto px-8 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
          {MAPS.map((map) => (
            <Link key={map.id} href={`/map/${map.slug}`} className="group cursor-pointer">
              {/* Исправлено: Добавлена высота h-[400px] и object-contain для контроля размера */}
              <div className="relative overflow-hidden bg-white p-4 shadow-sm border border-stone-100 transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-2 flex items-center justify-center h-[450px]">
                <img 
                  src={map.image} 
                  alt={map.title}
                  className="max-h-full w-auto object-contain grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
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
    </main>
  );
}