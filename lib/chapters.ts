export type Chapter = {
  id: string;
  order: number;
  slug: string;
  title: string;
  description: string;
  heroImage?: string;
  seoTitle?: string;
  seoDescription?: string;
  href: string;
  status: 'Live collection' | 'New direction';
  isLive: boolean;
};

export const DEFAULT_CHAPTERS: Chapter[] = [
  {
    id: '01',
    order: 1,
    slug: 'nature-landscapes-noir',
    title: 'Nature & Landscapes Noir',
    description: 'Atmospheric monochrome nature compositions and moody wide-format landscapes.',
    heroImage: '',
    seoTitle: 'Nature & Landscapes Noir Posters',
    seoDescription: 'Atmospheric monochrome nature and landscape poster collection.',
    href: '/collections/nature-landscapes-noir',
    status: 'New direction',
    isLive: false,
  },
  {
    id: '02',
    order: 2,
    slug: 'vintage-japan-archives',
    title: 'Vintage Japan Archives',
    description: 'Curated references inspired by vintage Japanese print aesthetics and archival works.',
    heroImage: '',
    seoTitle: 'Vintage Japan Archives Posters',
    seoDescription: 'Curated vintage Japan inspired poster chapter.',
    href: '/collections/vintage-japan-archives',
    status: 'New direction',
    isLive: false,
  },
  {
    id: '03',
    order: 3,
    slug: 'the-mercator-archives',
    title: 'The Mercator Archives',
    description: 'Your established historical atlas chapter, already live with a full plate collection.',
    heroImage: '',
    seoTitle: 'The Mercator Archives Posters',
    seoDescription: 'Historical atlas posters from The Mercator Archives.',
    href: '/collections/the-mercator-archives',
    status: 'Live collection',
    isLive: true,
  },
  {
    id: '04',
    order: 4,
    slug: 'engineering-patents',
    title: 'Engineering & Patents',
    description: 'Technical drawing-driven posters rooted in industrial design and patent-era diagrams.',
    heroImage: '',
    seoTitle: 'Engineering & Patents Posters',
    seoDescription: 'Technical engineering and patent-era poster collection.',
    href: '/collections/engineering-patents',
    status: 'New direction',
    isLive: false,
  },
];

export const CHAPTERS = DEFAULT_CHAPTERS;

export function getChapterBySlug(slug: string) {
  return DEFAULT_CHAPTERS.find((chapter) => chapter.slug === slug);
}

export function sortChapters(chapters: Chapter[]) {
  return [...chapters].sort((a, b) => a.order - b.order);
}
