import type { LayerId } from '@/data/tools';

interface LayerText {
  label: string;
  blurb: string;
}

const layers: Record<LayerId, LayerText> = {
  surface: { label: 'Frontend', blurb: 'Interfaces web y experiencia de usuario.' },
  logic: { label: 'Backend', blurb: 'APIs, reglas de negocio y servicios.' },
  data: { label: 'Bases de datos', blurb: 'Persistencia, caché y búsqueda vectorial.' },
  ops: { label: 'Infraestructura', blurb: 'Contenedores, nube, CI/CD y observabilidad.' },
};

export default {
  title: 'Herramientas',
  banner: 'HERRAMIENTAS',
  intro: 'Stack por capa: frontend, backend, bases de datos e infraestructura.',
  layers,
} as const;
