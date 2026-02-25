import { promises as fs } from 'fs';
import path from 'path';
import { Chapter, DEFAULT_CHAPTERS, sortChapters } from './chapters';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'chapters.json');

function normalizeChapter(input: Chapter): Chapter {
  return {
    ...input,
    id: input.id || String(input.order).padStart(2, '0'),
    href: input.href || `/collections/${input.slug}`,
    heroImage: input.heroImage || '',
    seoTitle: input.seoTitle || input.title,
    seoDescription: input.seoDescription || input.description,
    status: input.status || 'New direction',
    isLive: Boolean(input.isLive),
  };
}

async function ensureDataFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });

  try {
    await fs.access(DATA_FILE);
  } catch {
    const initial = sortChapters(DEFAULT_CHAPTERS).map(normalizeChapter);
    await fs.writeFile(DATA_FILE, JSON.stringify(initial, null, 2), 'utf8');
  }
}

export async function getChaptersFromStore(): Promise<Chapter[]> {
  await ensureDataFile();
  const raw = await fs.readFile(DATA_FILE, 'utf8');
  const parsed = JSON.parse(raw) as Chapter[];
  return sortChapters(parsed.map(normalizeChapter));
}

export async function saveChaptersToStore(chapters: Chapter[]) {
  await ensureDataFile();
  const normalized = sortChapters(chapters.map(normalizeChapter));
  await fs.writeFile(DATA_FILE, JSON.stringify(normalized, null, 2), 'utf8');
}

export async function upsertChapterInStore(chapter: Chapter) {
  const chapters = await getChaptersFromStore();
  const next = normalizeChapter(chapter);
  const index = chapters.findIndex((item) => item.slug === next.slug);

  if (index >= 0) {
    chapters[index] = next;
  } else {
    chapters.push(next);
  }

  await saveChaptersToStore(chapters);
  return next;
}

export async function getChapterBySlugFromStore(slug: string) {
  const chapters = await getChaptersFromStore();
  return chapters.find((chapter) => chapter.slug === slug) ?? null;
}
