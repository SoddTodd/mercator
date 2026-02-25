import { NextRequest, NextResponse } from 'next/server';
import { Chapter } from '../../../lib/chapters';
import { getChaptersFromStore, upsertChapterInStore } from '../../../lib/chapters-store';
import { isAuthorizedRequest } from '../../../lib/admin-auth';

export async function GET(req: NextRequest) {
  const chapters = await getChaptersFromStore();
  const full = req.nextUrl.searchParams.get('full') === '1';

  if (full && !isAuthorizedRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json(chapters);
}

export async function POST(req: NextRequest) {
  if (!isAuthorizedRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const order = Number(body.order ?? 0);

    const chapter: Chapter = {
      id: body.id?.toString()?.trim() || String(order).padStart(2, '0') || '00',
      order: Number.isFinite(order) ? order : 0,
      slug: body.slug?.toString()?.trim() || '',
      title: body.title?.toString()?.trim() || 'Untitled chapter',
      description: body.description?.toString() || '',
      heroImage: body.heroImage?.toString()?.trim() || '',
      seoTitle: body.seoTitle?.toString()?.trim() || body.title?.toString()?.trim() || 'Untitled chapter',
      seoDescription: body.seoDescription?.toString()?.trim() || body.description?.toString() || '',
      href: body.href?.toString()?.trim() || `/collections/${body.slug?.toString()?.trim() || ''}`,
      status: body.status === 'Live collection' ? 'Live collection' : 'New direction',
      isLive: Boolean(body.isLive),
    };

    if (!chapter.slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    const saved = await upsertChapterInStore(chapter);
    return NextResponse.json(saved);
  } catch {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
}
