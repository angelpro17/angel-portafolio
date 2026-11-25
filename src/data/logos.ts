import type { ImageMetadata } from 'astro';
import type { CaseSlug } from './projects';
import sonqo from '@/assets/logos/sonqo.svg';
import brainstorming from '@/assets/logos/brainstorming-wordmark.webp';
import efectiback from '@/assets/logos/efectiback-logo.svg';
import firstcommit from '@/assets/logos/firstcommit-logo.svg';
import signperu from '@/assets/logos/signperu.svg';
import mediaAi from '@/assets/logos/media-ai.svg';
import upc from '@/assets/logos/upc.png';

export interface Logo {
  src: ImageMetadata;
  alt: string;
}

/** Brand marks, kept next to each other so every logo is used consistently (cards, case pages, ledger). */
export const logos = {
  sonqo: { src: sonqo, alt: 'Sonqo Perú' },
  brainstorming: { src: brainstorming, alt: 'Brainstorming' },
  efectiback: { src: efectiback, alt: 'Efectiback, facturación electrónica' },
  firstcommit: { src: firstcommit, alt: 'FirstCommit' },
  signperu: { src: signperu, alt: 'Signperu' },
  mediaAi: { src: mediaAi, alt: 'Media-AI Processor' },
  upc: { src: upc, alt: 'UPC' },
} satisfies Record<string, Logo>;

/** Projects that have a brand mark. Others (private systems, coursework) show none. */
export const projectLogos: Partial<Record<CaseSlug, Logo>> = {
  'sonqo-peru': logos.sonqo,
  brainstorming: logos.brainstorming,
  'brainstorming-cms': logos.brainstorming,
  facturacion: logos.efectiback,
  firstcommit: logos.firstcommit,
  signperu: logos.signperu,
  'carnet-upc': logos.upc,
  'media-ai': logos.mediaAi,
};

/**
 * Projects whose logo already spells the project name. On cards the logo replaces the written
 * title (it would read twice); the link keeps the logo's alt text as its accessible name.
 */
export const wordmarkSlugs: ReadonlySet<CaseSlug> = new Set<CaseSlug>([
  'sonqo-peru',
  'brainstorming',
  'facturacion',
  'firstcommit',
  'signperu',
  'media-ai',
]);

/** Symbol-only marks sit on the same row as the written title instead of above it. */
export const inlineMarkSlugs: ReadonlySet<CaseSlug> = new Set<CaseSlug>(['carnet-upc']);
