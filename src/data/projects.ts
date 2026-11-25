import type { ImageMetadata } from 'astro';
import sonqo from '@/assets/images/sonqo.webp';
import brainstorming from '@/assets/images/brainstorming.webp';
import brainstormingUs from '@/assets/images/brainstorming-us.webp';
import brainstormingBlog from '@/assets/images/brainstorming-blog.webp';
import efectiback from '@/assets/images/efectiback.webp';
import efectibackDashboard from '@/assets/images/efectiback-dashboard.webp';
import efectibackPos from '@/assets/images/efectiback-pos.webp';
import cmsLogin from '@/assets/images/cms-login.webp';
import signperu from '@/assets/images/signperu.webp';
import firstcommit from '@/assets/images/firstcommit.webp';
import firstcommitJobs from '@/assets/images/firstcommit-jobs.webp';
import carnet from '@/assets/images/carnet.webp';
import carnetHow from '@/assets/images/carnet-how.webp';
import media from '@/assets/images/media.webp';
import mediaTranscripcion from '@/assets/images/media/transcripcion.webp';
import mediaResumen from '@/assets/images/media/resumen.webp';
import gouni from '@/assets/images/gouni.webp';
import oxaira from '@/assets/images/oxaira.webp';
import mediscan from '@/assets/images/mediscan.webp';
import movies from '@/assets/images/movies.webp';
import ferreteria from '@/assets/images/ferreteria.webp';
import diHeatmap from '@/assets/images/di-heatmap.webp';
import diMobile from '@/assets/images/di-mobile.webp';

/** Every project has its own case page. Order = display order and "next case" order. */
export const caseSlugs = [
  'sonqo-peru',
  'brainstorming',
  'brainstorming-cms',
  'ferreteria',
  'facturacion',
  'firstcommit',
  'signperu',
  'carnet-upc',
  'media-ai',
  'gouni',
  'oxaira',
  'di-project',
  'mediscan-ai',
  'movies-explorer',
] as const;
export type CaseSlug = (typeof caseSlugs)[number];

export type ProjectKind = 'client' | 'own' | 'study';

export interface ProjectMeta {
  kind: ProjectKind;
  /** Product screenshot. Absent = private system: the card shows only the architecture layer. */
  image?: ImageMetadata;
  /** The image is an illustration with sample data, not a screenshot of the real system. */
  illustrative?: boolean;
  /** All frames for the case page (first one is the cover). Defaults to [image]. */
  gallery?: readonly ImageMetadata[];
  stack: readonly string[];
  url?: string;
}

export const projectMeta: Record<CaseSlug, ProjectMeta> = {
  'sonqo-peru': {
    kind: 'client', image: sonqo, url: 'https://www.sonqoperu.com/',
    stack: ['Astro', 'TypeScript', 'Mercado Pago', 'Sanity', 'Supabase', 'Resend', 'Upstash Redis', 'Cloud Run'],
  },
  brainstorming: {
    kind: 'client', image: brainstorming, gallery: [brainstorming, brainstormingUs, brainstormingBlog], url: 'https://www.brainstorming.la/',
    stack: ['Astro', 'TypeScript', 'PostgreSQL', 'Upstash Redis', 'Resend', 'Turnstile', 'Sentry'],
  },
  'brainstorming-cms': {
    kind: 'client', image: cmsLogin, url: 'https://cms.brainstorming.la/',
    stack: ['Angular', 'Hono', 'Cloudflare Workers', 'PostgreSQL', 'Drizzle', 'OpenAPI', 'Supabase'],
  },
  ferreteria: {
    kind: 'client', image: ferreteria,
    stack: ['Java 17', 'Spring Boot', 'SQL Server', 'Angular', 'JWT'],
  },
  facturacion: {
    kind: 'own', image: efectiback,
    gallery: [efectiback, efectibackDashboard, efectibackPos],
    stack: ['Java 21', 'Spring Boot', 'PostgreSQL', 'Angular', 'Cloud Run', 'Cloudflare R2', 'Astro'],
  },
  firstcommit: {
    kind: 'own', image: firstcommit, gallery: [firstcommit, firstcommitJobs],
    stack: ['Go', 'Python', 'Angular', 'Supabase', 'pgvector', 'Cloud Run', 'Cloud Tasks'],
  },
  signperu: {
    kind: 'own', image: signperu,
    stack: ['Java 21', 'Spring Boot 4', 'PostgreSQL', 'Angular 22', 'PDFBox', 'BouncyCastle', 'Resend', 'Cloud Run', 'Cloud Storage'],
  },
  'carnet-upc': {
    kind: 'own', image: carnet, gallery: [carnet, carnetHow],
    stack: ['Next.js', 'FastAPI', 'MediaPipe', 'rembg', 'OpenCV', 'Cloudinary'],
  },
  'media-ai': {
    kind: 'own', image: media, url: 'https://media-ai-processor.vercel.app/',
    gallery: [media, mediaTranscripcion, mediaResumen],
    stack: ['React', 'FastAPI', 'Whisper', 'EasyOCR', 'Supabase', 'Cloudinary'],
  },
  gouni: {
    kind: 'study', image: gouni, url: 'https://carpool-smoky.vercel.app/home',
    stack: ['Spring Boot', 'Angular', 'MySQL', 'WebSocket', 'Mapbox', 'JWT'],
  },
  oxaira: {
    kind: 'study', image: oxaira, url: 'https://air-q-landing-page.vercel.app/',
    stack: ['Spring Boot', 'RabbitMQ', 'Kafka', 'MySQL', 'Angular', 'Flutter', 'ESP32'],
  },
  'di-project': {
    kind: 'study', image: diHeatmap, gallery: [diHeatmap, diMobile],
    stack: ['Spring Boot', 'Django', 'React', 'React Native', 'PostgreSQL', 'Redis', 'Gemini'],
  },
  'mediscan-ai': {
    kind: 'study', image: mediscan,
    stack: ['Spring Cloud Gateway', 'Spring Boot', 'FastAPI', 'TensorFlow', 'MONAI', 'RabbitMQ', 'React', 'Flutter'],
  },
  'movies-explorer': {
    kind: 'study', image: movies, url: 'https://explorer-movies-app.vercel.app/movies',
    stack: ['Angular', 'Angular Material', 'TMDb', 'LocalStorage'],
  },
};

export const clientSlugs = caseSlugs.filter((s) => projectMeta[s].kind === 'client');
export const ownSlugs = caseSlugs.filter((s) => projectMeta[s].kind === 'own');
export const studySlugs = caseSlugs.filter((s) => projectMeta[s].kind === 'study');

/** Two rows of screenshots that scroll across the opening. Every tile links to its case. */
export interface Tile {
  slug: CaseSlug;
  image: ImageMetadata;
}
export const marqueeRows: readonly [readonly Tile[], readonly Tile[]] = [
  [
    { slug: 'sonqo-peru', image: sonqo },
    { slug: 'facturacion', image: efectiback },
    { slug: 'firstcommit', image: firstcommit },
    { slug: 'carnet-upc', image: carnet },
    { slug: 'gouni', image: gouni },
    { slug: 'di-project', image: diHeatmap },
    { slug: 'signperu', image: signperu },
    { slug: 'movies-explorer', image: movies },
  ],
  [
    { slug: 'brainstorming', image: brainstorming },
    { slug: 'facturacion', image: efectibackDashboard },
    { slug: 'firstcommit', image: firstcommitJobs },
    { slug: 'media-ai', image: media },
    { slug: 'oxaira', image: oxaira },
    { slug: 'di-project', image: diMobile },
    { slug: 'carnet-upc', image: carnetHow },
    { slug: 'mediscan-ai', image: mediscan },
  ],
];
