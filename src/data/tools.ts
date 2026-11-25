export const layerIds = ['surface', 'logic', 'data', 'ops'] as const;
export type LayerId = (typeof layerIds)[number];

export const tools: Record<LayerId, readonly string[]> = {
  surface: ['Astro', 'Angular', 'React', 'TypeScript', 'Tailwind CSS', 'GSAP'],
  logic: ['Java 8 · 17 · 21', 'Spring Boot', 'Go', 'Python', 'Hono'],
  data: ['PostgreSQL', 'SQL Server', 'MongoDB', 'Redis', 'pgvector'],
  ops: ['Docker', 'Kubernetes', 'Azure DevOps', 'GCP', 'AWS', 'Cloudflare', 'Vercel', 'RabbitMQ', 'Jaeger', 'GitHub Actions'],
};
