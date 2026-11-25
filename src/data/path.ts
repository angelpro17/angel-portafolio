import { logos, type Logo } from './logos';
import scotiabank from '@/assets/logos/scotiabank.svg';
import efact from '@/assets/logos/efact.webp';
import licitapp from '@/assets/logos/licitapp.webp';

export const pathIds = ['scotiabank', 'efact', 'licitapp', 'freelance'] as const;
export type PathId = (typeof pathIds)[number];

/** Company marks. Freelance has none of its own: the page shows the AA monogram and lists its clients. */
export const pathLogos: Record<PathId, Logo | null> = {
  scotiabank: { src: scotiabank, alt: 'Scotiabank' },
  efact: { src: efact, alt: 'Efact' },
  licitapp: { src: licitapp, alt: 'LicitApp' },
  freelance: null,
};

export const freelanceClients: readonly Logo[] = [logos.sonqo, logos.brainstorming];

export type { Logo };
