import type { Metadata } from 'next';
import ChapterPageClient from '../ChapterPageClient';
import { getChapterMetadata } from '../../../lib/chapter-metadata';

export async function generateMetadata(): Promise<Metadata> {
  return getChapterMetadata('vintage-japan-archives');
}

export default function VintageJapanArchivesPage() {
  return <ChapterPageClient chapterSlug="vintage-japan-archives" />;
}
