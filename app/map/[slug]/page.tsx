import React from 'react';
import { MAPS, MercatorMap } from '../../../lib/maps';
import { notFound } from 'next/navigation';
import MapClient from './MapClient';

// Размеры с ценами как ЧИСЛАМИ (важно для Stripe)
const SIZES = [
  { id: "3876", label: '12x18"', price: 35 },
  { id: "1", label: '18x24"', price: 45 },
  { id: "2", label: '24x36"', price: 59 },
];

// Server component: получает params как обычный объект
export default async function MapPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const mapData = MAPS.find((m: MercatorMap) => m.slug === slug);

  if (!mapData) return notFound();

  const mapWithSizes = { ...mapData, sizes: mapData.sizes ?? SIZES };

  return <MapClient mapData={mapWithSizes} />;
}
