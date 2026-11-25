import type { PathId } from '@/data/path';

interface PathText {
  place: string;
  role: string;
  period: string;
  bullets: readonly string[];
}

const items: Record<PathId, PathText> = {
  scotiabank: {
    place: 'Scotiabank',
    role: 'Junior IT Analyst',
    period: 'Oct 2026 · now',
    bullets: [
      'Vulnerability (CVE) remediation in Java and .NET systems',
      'Migrations from Java 17 to 25 and Spring Boot 3 to 4',
      'Unit and integration tests before production',
    ],
  },
  efact: {
    place: 'Efact',
    role: 'Junior Software Engineer',
    period: 'Jan to Sep 2026',
    bullets: [
      'Internal Java library used by 5 microservices',
      'Installer migrated from Java 8 to Java 21',
      'Tracing with Jaeger and messaging with RabbitMQ',
    ],
  },
  licitapp: {
    place: 'LicitApp',
    role: 'Software Engineering Intern (AI)',
    period: 'Jul to Dec 2025',
    bullets: [
      'Coordinated a team of 5 developers',
      'Hybrid OCR and AI engine: PDFs from 50 to 5 seconds',
      'CI/CD on Google Cloud and Angular dashboards',
    ],
  },
  freelance: {
    place: 'Freelance',
    role: 'Full Stack Developer',
    period: 'Jun 2024 · now',
    bullets: [
      'Mercado Pago payments for Sonqo Perú',
      'Custom CMS and serverless backend for Brainstorming',
      'WordPress to Astro migrations with zero infrastructure cost',
    ],
  },
};

export default {
  title: 'Path',
  banner: 'PATH',
  intro: 'Four places, and what I did at each.',
  items,
} as const;
