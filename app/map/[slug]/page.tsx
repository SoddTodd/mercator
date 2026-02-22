import React from 'react';
import { notFound } from 'next/navigation';
import MapClient from './MapClient';
import { getMapBySlug } from '../../../lib/maps-store';

// Server component: получает params как обычный объект
export default async function MapPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const mapData = await getMapBySlug(slug);

  if (!mapData) return notFound();

  return <MapClient mapData={mapData} />;
}
