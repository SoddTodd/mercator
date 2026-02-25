import type { Metadata } from 'next';
import ChapterPageClient from '../ChapterPageClient';
import { getChapterMetadata } from '../../../lib/chapter-metadata';

export async function generateMetadata(): Promise<Metadata> {
  return getChapterMetadata('the-mercator-archives');
}

export default function TheMercatorArchivesPage() {
  return <ChapterPageClient chapterSlug="the-mercator-archives" />;
}
