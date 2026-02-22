import { NextRequest, NextResponse } from 'next/server';
import { getMapsFromStore, upsertMapInStore } from '../../../lib/maps-store';
import { MercatorMap } from '../../../lib/maps';
import { isAuthorizedRequest } from '../../../lib/admin-auth';

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export async function GET(req: NextRequest) {
  const maps = await getMapsFromStore();
  const full = req.nextUrl.searchParams.get('full') === '1';

  if (full) {
    if (!isAuthorizedRequest(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json(maps);
  }

  const summary = maps.map((map) => ({
    id: map.id,
    slug: map.slug,
    title: map.title,
    year: map.year,
    image: map.image,
  }));

  return NextResponse.json(summary);
}

export async function POST(req: NextRequest) {
  if (!isAuthorizedRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const maps = await getMapsFromStore();

    const nextId = body.id?.toString()?.trim() || String(maps.length + 1);
    const slug = body.slug?.toString()?.trim() || toSlug(body.title?.toString() || '');

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    const map: MercatorMap = {
      id: nextId,
      slug,
      title: body.title?.toString()?.trim() || 'Untitled map',
      year: body.year?.toString()?.trim() || '',
      figure: body.figure?.toString()?.trim() || '',
      description: body.description?.toString() || '',
      image: body.image?.toString()?.trim() || '',
      images: Array.isArray(body.images)
        ? body.images.map((value: unknown) => String(value).trim()).filter(Boolean)
        : [],
      printImage: body.printImage?.toString()?.trim() || body.printFiles?.['2:3']?.toString()?.trim() || '',
      printFiles: {
        '2:3': body.printFiles?.['2:3']?.toString()?.trim() || body.printImage?.toString()?.trim() || '',
        '3:4': body.printFiles?.['3:4']?.toString()?.trim() || body.printImage?.toString()?.trim() || '',
      },
    };

    const saved = await upsertMapInStore(map);
    return NextResponse.json(saved);
  } catch {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
}
