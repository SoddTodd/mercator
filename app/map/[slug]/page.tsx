import React from 'react';
import { notFound } from 'next/navigation';
import MapClient from './MapClient';
import { getMapBySlug } from '../../../lib/maps-store';
import { DEFAULT_CHAPTERS } from '../../../lib/chapters';
import { getChapterBySlugFromStore } from '../../../lib/chapters-store';

// Server component: получает params как обычный объект
export default async function MapPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const mapData = await getMapBySlug(slug);

  if (!mapData) return notFound();

  const collectionSlug = mapData.chapterSlug || 'the-mercator-archives';
  const storedCollection = await getChapterBySlugFromStore(collectionSlug);
  const fallbackCollection = DEFAULT_CHAPTERS.find((chapter) => chapter.slug === collectionSlug);
  const collection = storedCollection ?? fallbackCollection;

  const collectionTitle = collection?.title || 'Collection';
  const collectionHref = collection?.href || `/collections/${collectionSlug}`;

  return <MapClient mapData={mapData} collectionTitle={collectionTitle} collectionHref={collectionHref} />;
}
