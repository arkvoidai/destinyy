/**
 * Arkvoid Asset Map & Image Registry
 * Manages asset paths, aspect ratios, dimensions, alt text, and captions.
 */

export type AssetKey =
  | 'heroWorld'
  | 'heroWorldPortrait'
  | 'chapterArrive'
  | 'chapterMeet'
  | 'chapterChange'
  | 'chapterLeave'
  | 'chapterReturn'
  | 'personScholar'
  | 'personDisciple'
  | 'personBeast'
  | 'personImmortal'
  | 'demoCourtyard'
  | 'realm01'
  | 'realm02'
  | 'realm03'
  | 'realm04'
  | 'realm05'
  | 'realm06'
  | 'deviceToday'
  | 'deviceWorld'
  | 'eyewearConcept'
  | 'founder';

export interface AssetSpec {
  key: AssetKey;
  name?: string;
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  aspectRatio: string;
  optional?: boolean;
}

export function assetUrl(path: string): string {
  const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${cleanPath}`;
}

export const ASSETS: Record<AssetKey, AssetSpec> = {
  heroWorld: {
    key: 'heroWorld',
    src: assetUrl('/images/hero-world.jpg'),
    alt: 'Mountain peaks at dawn with terrace pavilions overlooking misty valley currents',
    caption: 'Concept art.',
    width: 2400,
    height: 1500,
    aspectRatio: '16 / 10',
    optional: false,
  },
  heroWorldPortrait: {
    key: 'heroWorldPortrait',
    src: assetUrl('/images/hero-world.jpg'),
    alt: 'Mountain peaks at dawn with terrace pavilions overlooking misty valley currents',
    caption: 'Concept art.',
    width: 2400,
    height: 1500,
    aspectRatio: '16 / 10',
    optional: false,
  },
  chapterArrive: {
    key: 'chapterArrive',
    src: assetUrl('/images/chapter-1-arrive.jpg'),
    alt: 'Stone bridge leading to mountain sect courtyard in early morning mist',
    caption: 'Concept art.',
    width: 1600,
    height: 2000,
    aspectRatio: '4 / 5',
    optional: false,
  },
  chapterMeet: {
    key: 'chapterMeet',
    src: assetUrl('/images/chapter-2-meet.jpg'),
    alt: 'Disciple tending orchid beds beside an open wooden pavilion',
    caption: 'Concept art.',
    width: 1600,
    height: 2000,
    aspectRatio: '4 / 5',
    optional: false,
  },
  chapterChange: {
    key: 'chapterChange',
    src: assetUrl('/images/chapter-3-change.jpg'),
    alt: 'Stone boundary marker carved with fresh covenant glyphs beside mountain brook',
    caption: 'Concept art.',
    width: 1600,
    height: 2000,
    aspectRatio: '4 / 5',
    optional: false,
  },
  chapterLeave: {
    key: 'chapterLeave',
    src: assetUrl('/images/chapter-4-leave.jpg'),
    alt: 'Quiet dusk settling over mountain monastery courtyard with lanterns being lit',
    caption: 'Concept art.',
    width: 1600,
    height: 2000,
    aspectRatio: '4 / 5',
    optional: false,
  },
  chapterReturn: {
    key: 'chapterReturn',
    src: assetUrl('/images/chapter-5-return.jpg'),
    alt: 'Elder scholar waiting on bridge steps holding steaming earthenware tea cup',
    caption: 'Concept art.',
    width: 1600,
    height: 2000,
    aspectRatio: '4 / 5',
    optional: false,
  },
  personScholar: {
    key: 'personScholar',
    src: assetUrl('/images/person-scholar.jpg'),
    alt: 'Elder scholar holding wooden stylus above inscribed record tablets',
    caption: 'Concept art.',
    width: 1200,
    height: 1500,
    aspectRatio: '4 / 5',
    optional: false,
  },
  personDisciple: {
    key: 'personDisciple',
    src: assetUrl('/images/person-disciple.jpg'),
    alt: 'Young disciple carrying bundle of freshly gathered medicinal mountain roots',
    caption: 'Concept art.',
    width: 1200,
    height: 1500,
    aspectRatio: '4 / 5',
    optional: false,
  },
  personBeast: {
    key: 'personBeast',
    src: assetUrl('/images/person-beast.jpg'),
    alt: 'Spiritual mountain stag watching silently from cliffside bamboo grove',
    caption: 'Concept art.',
    width: 1200,
    height: 1500,
    aspectRatio: '4 / 5',
    optional: false,
  },
  personImmortal: {
    key: 'personImmortal',
    src: assetUrl('/images/person-immortal.jpg'),
    alt: 'Solitary cloaked figure standing on high cliff ridge above cloud canopy',
    caption: 'Concept art.',
    width: 1200,
    height: 1500,
    aspectRatio: '4 / 5',
    optional: false,
  },
  demoCourtyard: {
    key: 'demoCourtyard',
    src: assetUrl('/images/demo-courtyard.jpg'),
    alt: 'Monastery stone terrace with central brazier and record pavilion',
    caption: 'Concept art.',
    width: 1600,
    height: 1000,
    aspectRatio: '16 / 10',
    optional: false,
  },
  realm01: {
    key: 'realm01',
    src: assetUrl('/images/realm-01.jpg'),
    alt: 'Whispering mountain mist veiling initial breath cultivation sanctuary',
    caption: 'Concept art.',
    width: 1200,
    height: 1600,
    aspectRatio: '3 / 4',
    optional: false,
  },
  realm02: {
    key: 'realm02',
    src: assetUrl('/images/realm-02.jpg'),
    alt: 'Deep cavern stream illuminated by pale phosphor lichen crystals',
    caption: 'Concept art.',
    width: 1200,
    height: 1600,
    aspectRatio: '3 / 4',
    optional: false,
  },
  realm03: {
    key: 'realm03',
    src: assetUrl('/images/realm-03.jpg'),
    alt: 'Ancient forge anvil under starry celestial alignment',
    caption: 'Concept art.',
    width: 1200,
    height: 1600,
    aspectRatio: '3 / 4',
    optional: false,
  },
  realm04: {
    key: 'realm04',
    src: assetUrl('/images/realm-04.jpg'),
    alt: 'Still mountain pond reflecting eternal silver twilight horizon',
    caption: 'Concept art.',
    width: 1200,
    height: 1600,
    aspectRatio: '3 / 4',
    optional: false,
  },
  realm05: {
    key: 'realm05',
    src: assetUrl('/images/realm-05.jpg'),
    alt: 'Carved pillar hall aligned with geometric valley energy meridians',
    caption: 'Concept art.',
    width: 1200,
    height: 1600,
    aspectRatio: '3 / 4',
    optional: false,
  },
  realm06: {
    key: 'realm06',
    src: assetUrl('/images/realm-06.jpg'),
    alt: 'Summit overlook where mountain peak dissolves into boundless celestial sky',
    caption: 'Concept art.',
    width: 1200,
    height: 1600,
    aspectRatio: '3 / 4',
    optional: false,
  },
  deviceToday: {
    key: 'deviceToday',
    src: assetUrl('/images/device-today.jpg'),
    alt: 'Modern desk with glowing monitor showing static browser page',
    caption: 'Today.',
    width: 1800,
    height: 1200,
    aspectRatio: '3 / 2',
    optional: false,
  },
  deviceWorld: {
    key: 'deviceWorld',
    src: assetUrl('/images/device-world.jpg'),
    alt: 'Same desk with open field of view revealing mountain terrace and courtyard',
    caption: 'Concept art.',
    width: 1800,
    height: 1200,
    aspectRatio: '3 / 2',
    optional: false,
  },
  eyewearConcept: {
    key: 'eyewearConcept',
    src: assetUrl('/images/eyewear-concept.jpg'),
    alt: 'Industrial sketch of lightweight eyewear frame resting on architectural blueprint',
    caption: 'Concept art.',
    width: 1800,
    height: 1200,
    aspectRatio: '3 / 2',
    optional: true,
  },
  founder: {
    key: 'founder',
    src: assetUrl('/images/founder.jpg'),
    alt: 'Manish Talukdar in studio work environment',
    caption: 'Concept art.',
    width: 1200,
    height: 1500,
    aspectRatio: '4 / 5',
    optional: true,
  },
};
