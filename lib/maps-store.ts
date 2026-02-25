import { promises as fs } from 'fs';
import path from 'path';
import { MAPS, MapSize, MercatorMap } from './maps';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'maps.json');

export const DEFAULT_SIZES: MapSize[] = [
  { id: '3876', label: '12x18"', price: 35, ratio: '2:3' },
  { id: '1', label: '18x24"', price: 45, ratio: '3:4' },
  { id: '2', label: '24x36"', price: 59, ratio: '2:3' },
];

function normalizeMap(input: MercatorMap): MercatorMap {
  const printFiles = {
    '2:3': input.printFiles?.['2:3'] ?? input.printImage ?? '',
    '3:4': input.printFiles?.['3:4'] ?? input.printImage ?? '',
  };

  return {
    ...input,
    chapterSlug: input.chapterSlug ?? 'the-mercator-archives',
    printFiles,
    printImage: input.printImage ?? printFiles['2:3'],
    sizes: input.sizes ?? DEFAULT_SIZES,
  };
}

async function ensureDataFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });

  try {
    await fs.access(DATA_FILE);
  } catch {
    const initial = MAPS.map(normalizeMap);
    await fs.writeFile(DATA_FILE, JSON.stringify(initial, null, 2), 'utf8');
  }
}

export async function getMapsFromStore(): Promise<MercatorMap[]> {
  await ensureDataFile();
  const raw = await fs.readFile(DATA_FILE, 'utf8');
  const parsed = JSON.parse(raw) as MercatorMap[];
  return parsed.map(normalizeMap);
}

export async function saveMapsToStore(maps: MercatorMap[]) {
  await ensureDataFile();
  const normalized = maps.map(normalizeMap);
  await fs.writeFile(DATA_FILE, JSON.stringify(normalized, null, 2), 'utf8');
}

export async function upsertMapInStore(map: MercatorMap) {
  const maps = await getMapsFromStore();
  const next = normalizeMap(map);
  const index = maps.findIndex((item) => item.slug === next.slug);

  if (index >= 0) {
    maps[index] = next;
  } else {
    maps.push(next);
  }

  await saveMapsToStore(maps);
  return next;
}

export async function getMapBySlug(slug: string) {
  const maps = await getMapsFromStore();
  return maps.find((item) => item.slug === slug) ?? null;
}
