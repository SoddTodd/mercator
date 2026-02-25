import type { Metadata } from 'next';
import { DEFAULT_CHAPTERS } from './chapters';
import { getChapterBySlugFromStore } from './chapters-store';

export async function getChapterMetadata(slug: string): Promise<Metadata> {
  const stored = await getChapterBySlugFromStore(slug);
  const fallback = DEFAULT_CHAPTERS.find((chapter) => chapter.slug === slug);
  const chapter = stored ?? fallback;

  if (!chapter) {
    return {
      title: 'Collection',
      description: 'Poster collection',
    };
  }

  return {
    title: chapter.seoTitle || chapter.title,
    description: chapter.seoDescription || chapter.description,
  };
}
