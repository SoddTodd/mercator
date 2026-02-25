import type { Metadata } from 'next';
import ChapterPageClient from '../ChapterPageClient';
import { getChapterMetadata } from '../../../lib/chapter-metadata';

export async function generateMetadata(): Promise<Metadata> {
  return getChapterMetadata('nature-landscapes-noir');
}

export default function NatureLandscapesNoirPage() {
  return <ChapterPageClient chapterSlug="nature-landscapes-noir" />;
}
