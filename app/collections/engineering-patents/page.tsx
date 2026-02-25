import type { Metadata } from 'next';
import ChapterPageClient from '../ChapterPageClient';
import { getChapterMetadata } from '../../../lib/chapter-metadata';

export async function generateMetadata(): Promise<Metadata> {
  return getChapterMetadata('engineering-patents');
}

export default function EngineeringPatentsPage() {
  return <ChapterPageClient chapterSlug="engineering-patents" />;
}
