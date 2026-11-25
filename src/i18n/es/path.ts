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
    role: 'Analista TI Junior',
    period: 'Oct 2026 · hoy',
    bullets: [
      'Remediación de vulnerabilidades (CVE) en sistemas Java y .NET',
      'Migraciones de Java 17 a 25 y de Spring Boot 3 a 4',
      'Pruebas unitarias e integrales antes de producción',
    ],
  },
  efact: {
    place: 'Efact',
    role: 'Ingeniero de Software Junior',
    period: 'Ene a Sep 2026',
    bullets: [
      'Librería interna en Java usada por 5 microservicios',
      'Instalador migrado de Java 8 a Java 21',
      'Trazabilidad con Jaeger y mensajería con RabbitMQ',
    ],
  },
  licitapp: {
    place: 'LicitApp',
    role: 'Practicante de Ingeniería de Software con IA',
    period: 'Jul a Dic 2025',
    bullets: [
      'Coordiné a un equipo de 5 desarrolladores',
      'Motor híbrido de OCR e IA: PDF de 50 a 5 segundos',
      'CI/CD en Google Cloud y dashboards en Angular',
    ],
  },
  freelance: {
    place: 'Freelance',
    role: 'Desarrollador Full Stack',
    period: 'Jun 2024 · hoy',
    bullets: [
      'Pagos con Mercado Pago para Sonqo Perú',
      'CMS a medida y backend serverless para Brainstorming',
      'Migraciones de WordPress a Astro con infraestructura en cero',
    ],
  },
};

export default {
  title: 'Trayectoria',
  banner: 'TRAYECTORIA',
  intro: 'Cuatro lugares y lo que hice en cada uno.',
  items,
} as const;
