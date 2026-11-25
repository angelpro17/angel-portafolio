import type { LayerId } from '@/data/tools';

interface LayerText {
  label: string;
  blurb: string;
}

const layers: Record<LayerId, LayerText> = {
  surface: { label: 'Frontend', blurb: 'Web interfaces and user experience.' },
  logic: { label: 'Backend', blurb: 'APIs, business rules and services.' },
  data: { label: 'Databases', blurb: 'Persistence, caching and vector search.' },
  ops: { label: 'Infrastructure', blurb: 'Containers, cloud, CI/CD and observability.' },
};

export default {
  title: 'Tools',
  banner: 'TOOLS',
  intro: 'Stack by layer: frontend, backend, databases and infrastructure.',
  layers,
} as const;
