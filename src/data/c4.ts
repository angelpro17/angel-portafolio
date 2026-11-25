import type { CaseSlug } from './projects';

/**
 * C4 model (Simon Brown) for every project: Context (1), Containers (2) and, where it adds value, Components (3).
 * Layout is declared as a grid: `place[id] = [column, row]` (fractions allowed). Names and descriptions live in
 * the i18n dictionaries (`c4` namespace) keyed by node id, so each diagram exists in both languages.
 */
export type C4Kind = 'person' | 'system' | 'container' | 'component' | 'database' | 'queue' | 'external';

export interface C4NodeDef {
  kind: C4Kind;
  /** Technology, language-neutral. Shown as [tech] under the name. */
  tech?: string;
  /** The system under focus (drawn inverted). */
  focus?: boolean;
}

export interface C4Edge {
  from: string;
  to: string;
  /** Protocol or technology, language-neutral. */
  tech?: string;
  /** Part of the main request path: numbered, and the pulse travels along it in order. */
  primary?: boolean;
  /** Arrowheads on both ends. */
  both?: boolean;
  /** Where the elbow turns along the main axis (0–1). Default 0.5. */
  bend?: number;
}

export interface C4View {
  level: 1 | 2 | 3;
  cols: number;
  rows: number;
  place: Record<string, readonly [number, number]>;
  edges: readonly C4Edge[];
}

export interface C4Model {
  nodes: Record<string, C4NodeDef>;
  views: readonly C4View[];
}

const person: C4NodeDef = { kind: 'person' };
const ext = (tech?: string): C4NodeDef => ({ kind: 'external', tech });
const box = (tech: string): C4NodeDef => ({ kind: 'container', tech });
const db = (tech: string): C4NodeDef => ({ kind: 'database', tech });
const part = (tech: string): C4NodeDef => ({ kind: 'component', tech });

export const c4: Record<CaseSlug, C4Model> = {
  /* ───────── Efectiback ───────── */
  facturacion: {
    nodes: {
      owner: person, operator: person, erp: ext('REST'),
      efectiback: { kind: 'system', focus: true },
      sunat: ext('SOAP · XML'), mail: ext('Resend'), jsonpe: ext('json.pe'),
      portal: box('Angular 22 · Cloudflare Pages'), backoffice: box('Angular 22 · Cloudflare Access'),
      api: box('Spring Boot 3.5 · Java 21 · Cloud Run'), sched: ext('Cloud Scheduler'),
      db: db('PostgreSQL · Supabase'), store: db('Cloudflare R2'),
      emision: part('Bounded context'), identidad: part('Bounded context'), suscripciones: part('Bounded context'),
      pos: part('Bounded context'), validador: part('motor-core'), worker: part('@Scheduled · SKIP LOCKED'),
      motor: part('motor-core · UBL 2.1 · XAdES'), almacen: part('Puerto AlmacenComprobantes'),
    },
    views: [
      {
        level: 1, cols: 3, rows: 3,
        place: { owner: [0, 0], operator: [0, 1], erp: [0, 2], efectiback: [1, 1], sunat: [2, 0], mail: [2, 1], jsonpe: [2, 2] },
        edges: [
          { from: 'owner', to: 'efectiback', tech: 'Web portal', primary: true },
          { from: 'operator', to: 'efectiback', tech: 'Backoffice' },
          { from: 'erp', to: 'efectiback', tech: 'REST · API key' },
          { from: 'efectiback', to: 'sunat', tech: 'SOAP · signed XML', primary: true },
          { from: 'efectiback', to: 'mail', tech: 'HTTPS' },
          { from: 'efectiback', to: 'jsonpe', tech: 'HTTPS' },
        ],
      },
      {
        level: 2, cols: 4, rows: 3,
        place: {
          owner: [0, 0], operator: [0, 1], erp: [0, 2], portal: [1, 0], backoffice: [1, 1], sched: [2, 0],
          api: [2, 1], mail: [2, 2], db: [3, 0], store: [3, 1], sunat: [3, 2],
        },
        edges: [
          { from: 'owner', to: 'portal', tech: 'HTTPS', primary: true },
          { from: 'operator', to: 'backoffice', tech: 'HTTPS' },
          { from: 'erp', to: 'api', tech: 'REST · API key', bend: 0.92 },
          { from: 'portal', to: 'api', tech: 'REST · JWT', primary: true },
          { from: 'backoffice', to: 'api', tech: 'REST · cookie' },
          { from: 'sched', to: 'api', tech: 'HTTP · secret' },
          { from: 'api', to: 'db', tech: 'JDBC · Flyway' },
          { from: 'api', to: 'store', tech: 'S3 API' },
          { from: 'api', to: 'sunat', tech: 'SOAP', primary: true },
          { from: 'api', to: 'mail', tech: 'HTTPS' },
        ],
      },
      {
        level: 3, cols: 4, rows: 3,
        place: {
          identidad: [0, 0], suscripciones: [0, 1], pos: [0, 2], validador: [1, 0], emision: [1, 1],
          worker: [2, 1], almacen: [2, 2], motor: [3, 1], sunat: [3, 2],
        },
        edges: [
          { from: 'identidad', to: 'emision', tech: 'ACL · facade' },
          { from: 'suscripciones', to: 'emision', tech: 'plan quota' },
          { from: 'pos', to: 'emision', tech: 'command' },
          { from: 'emision', to: 'validador', tech: 'per-type rules' },
          { from: 'emision', to: 'worker', tech: 'cola_envios', primary: true },
          { from: 'worker', to: 'motor', tech: 'sign + send', primary: true },
          { from: 'motor', to: 'sunat', tech: 'SOAP', primary: true },
          { from: 'worker', to: 'almacen', tech: 'XML · CDR · PDF' },
        ],
      },
    ],
  },

  /* ───────── sonqo-peru ───────── */
  'sonqo-peru': {
    nodes: {
      donor: { kind: 'person' },
      team: { kind: 'person' },
      site: { kind: 'system', focus: true },
      mp: { kind: 'external', tech: 'Mercado Pago' },
      resend: { kind: 'external', tech: 'Resend' },
      sanity: { kind: 'external', tech: 'Sanity' },
      gcp: { kind: 'external', tech: 'Cloud Build · Artifact Registry · Secret Manager' },
      supa: { kind: 'database', tech: 'Supabase · PostgreSQL' },
      astro: { kind: 'container', tech: 'Astro 7 · Bun' },
      api: { kind: 'container', tech: 'Rutas SSR · Cloud Run' },
      redis: { kind: 'database', tech: 'Upstash Redis' },
      hp: { kind: 'component', tech: 'honeypot' },
      rl: { kind: 'component', tech: 'Upstash ratelimit' },
      val: { kind: 'component', tech: 'Zod' },
      ck: { kind: 'component', tech: 'Mercado Pago SDK' },
      wh: { kind: 'component', tech: 'HMAC · idempotency' },
    },
    views: [
      {
        level: 1, cols: 3, rows: 3,
        place: { donor: [0, 1], team: [1, 2], site: [1, 1], mp: [2, 0], resend: [2, 1], sanity: [2, 2] },
        edges: [
          { from: 'donor', to: 'site', tech: 'HTTPS', primary: true },
          { from: 'site', to: 'mp', tech: 'Checkout API · Bricks', primary: true, both: true },
          { from: 'site', to: 'resend', tech: 'HTTPS' },
          { from: 'site', to: 'sanity', tech: 'GROQ' },
          { from: 'team', to: 'sanity', tech: 'Studio' },
        ],
      },
      {
        level: 2, cols: 4, rows: 3,
        place: { sanity: [1, 0], gcp: [2, 0], donor: [0, 1], astro: [1, 1], api: [2, 1], mp: [3, 0], redis: [3, 1], supa: [2, 2], resend: [3, 2] },
        edges: [
          { from: 'donor', to: 'astro', tech: 'HTTPS', primary: true },
          { from: 'astro', to: 'sanity', tech: 'GROQ · build' },
          { from: 'astro', to: 'api', tech: 'POST · JSON', primary: true },
          { from: 'gcp', to: 'api', tech: 'deploy · secrets' },
          { from: 'api', to: 'mp', tech: 'Payments · HMAC webhook', primary: true, both: true },
          { from: 'api', to: 'redis', tech: 'rate limit' },
          { from: 'api', to: 'supa', tech: 'SQL' },
          { from: 'api', to: 'resend', tech: 'HTTPS' },
        ],
      },
      {
        level: 3, cols: 4, rows: 3,
        place: { hp: [0, 0], rl: [1, 0], val: [2, 0], ck: [3, 0], redis: [1, 1], mp: [3, 1], wh: [2, 2], resend: [1, 2] },
        edges: [
          { from: 'hp', to: 'rl', tech: 'pipeline' },
          { from: 'rl', to: 'val', tech: 'pipeline' },
          { from: 'val', to: 'ck', tech: 'valid input', primary: true },
          { from: 'ck', to: 'mp', tech: 'Checkout API', primary: true, both: true },
          { from: 'rl', to: 'redis', tech: 'rate limit' },
          { from: 'mp', to: 'wh', tech: 'webhook', primary: true },
          { from: 'wh', to: 'redis', tech: 'idempotency' },
          { from: 'wh', to: 'resend', tech: 'confirmation' },
        ],
      },
    ],
  },

  /* ───────── brainstorming ───────── */
  brainstorming: {
    nodes: {
      visitor: { kind: 'person' },
      site: { kind: 'system', focus: true },
      turnstile: { kind: 'external', tech: 'Cloudflare Turnstile' },
      resend: { kind: 'external', tech: 'Resend' },
      cms: { kind: 'external', tech: 'CMS a medida' },
      sentry: { kind: 'external', tech: 'Sentry' },
      astro: { kind: 'container', tech: 'Astro · Vercel' },
      api: { kind: 'container', tech: 'Funciones serverless · Vercel' },
      pg: { kind: 'database', tech: 'PostgreSQL' },
      redis: { kind: 'database', tech: 'Upstash Redis' },
      ts: { kind: 'component', tech: 'siteverify' },
      rl: { kind: 'component', tech: 'Upstash ratelimit' },
      val: { kind: 'component', tech: 'validation' },
      repo: { kind: 'component', tech: 'repository' },
      mailer: { kind: 'component', tech: 'React Email' },
    },
    views: [
      {
        level: 1, cols: 3, rows: 4,
        place: { visitor: [0, 1.5], site: [1, 1.5], turnstile: [2, 0], resend: [2, 1], cms: [2, 2], sentry: [2, 3] },
        edges: [
          { from: 'visitor', to: 'site', tech: 'HTTPS', primary: true },
          { from: 'site', to: 'turnstile', tech: 'siteverify' },
          { from: 'site', to: 'resend', tech: 'HTTPS' },
          { from: 'site', to: 'cms', tech: 'REST' },
          { from: 'site', to: 'sentry', tech: 'HTTPS' },
        ],
      },
      {
        level: 2, cols: 4, rows: 3,
        place: { cms: [1, 0], resend: [2, 0], turnstile: [3, 0], visitor: [0, 1], astro: [1, 1], api: [2, 1], pg: [3, 1], sentry: [2, 2], redis: [3, 2] },
        edges: [
          { from: 'visitor', to: 'astro', tech: 'HTTPS', primary: true },
          { from: 'astro', to: 'cms', tech: 'REST · build' },
          { from: 'astro', to: 'api', tech: 'POST · JSON', primary: true },
          { from: 'api', to: 'turnstile', tech: 'siteverify', primary: true },
          { from: 'api', to: 'pg', tech: 'SQL', primary: true },
          { from: 'api', to: 'redis', tech: 'cache' },
          { from: 'api', to: 'resend', tech: 'React Email' },
          { from: 'api', to: 'sentry', tech: 'HTTPS' },
        ],
      },
      {
        level: 3, cols: 4, rows: 3,
        place: { ts: [0, 0], rl: [1, 0], val: [2, 0], repo: [3, 0], turnstile: [0, 1], redis: [1, 1], mailer: [2, 1], pg: [3, 1], resend: [2, 2] },
        edges: [
          { from: 'ts', to: 'rl', tech: 'pipeline' },
          { from: 'rl', to: 'val', tech: 'pipeline' },
          { from: 'val', to: 'repo', tech: 'persist', primary: true },
          { from: 'val', to: 'mailer', tech: 'notify', primary: true },
          { from: 'repo', to: 'pg', tech: 'SQL', primary: true },
          { from: 'mailer', to: 'resend', tech: 'HTTPS', primary: true },
          { from: 'rl', to: 'redis', tech: 'rate limit' },
          { from: 'ts', to: 'turnstile', tech: 'siteverify' },
        ],
      },
    ],
  },

  /* ───────── brainstorming-cms ───────── */
  'brainstorming-cms': {
    nodes: {
      team: { kind: 'person' },
      cms: { kind: 'system', focus: true },
      sites: { kind: 'external', tech: 'Astro · Vercel' },
      supa: { kind: 'external', tech: 'Supabase Auth' },
      mail: { kind: 'external', tech: 'Resend' },
      admin: { kind: 'container', tech: 'Angular 22 · Cloudflare Pages' },
      api: { kind: 'container', tech: 'Hono · Cloudflare Workers' },
      db: { kind: 'database', tech: 'PostgreSQL · Supabase · Hyperdrive' },
      files: { kind: 'database', tech: 'Cloudflare R2' },
      h: { kind: 'component', tech: 'Hono · @hono/zod-openapi' },
      uc: { kind: 'component', tech: 'Application services' },
      dom: { kind: 'component', tech: 'Result · errors' },
      ad_id: { kind: 'component', tech: 'jose' },
      ad_db: { kind: 'component', tech: 'Drizzle' },
      ad_files: { kind: 'component', tech: 'R2 binding' },
      ad_pub: { kind: 'component', tech: 'Vercel API' },
    },
    views: [
      {
        level: 1, cols: 3, rows: 3,
        place: { team: [0, 1], cms: [1, 1], sites: [2, 0], supa: [2, 1], mail: [2, 2] },
        edges: [
          { from: 'team', to: 'cms', tech: 'HTTPS', primary: true },
          { from: 'cms', to: 'sites', tech: 'Deploy · content API', primary: true, both: true },
          { from: 'cms', to: 'supa', tech: 'JWT' },
          { from: 'cms', to: 'mail', tech: 'HTTPS' },
        ],
      },
      {
        level: 2, cols: 4, rows: 3,
        place: { team: [0, 1], admin: [1, 1], mail: [2, 0], api: [2, 1], sites: [2, 2], supa: [3, 0], files: [3, 1], db: [3, 2] },
        edges: [
          { from: 'team', to: 'admin', tech: 'HTTPS', primary: true },
          { from: 'admin', to: 'api', tech: 'REST · OpenAPI · JWT', primary: true },
          { from: 'api', to: 'supa', tech: 'JWT · jose' },
          { from: 'api', to: 'files', tech: 'R2 API' },
          { from: 'api', to: 'db', tech: 'SQL · Hyperdrive' },
          { from: 'api', to: 'sites', tech: 'Deploy · content API', primary: true, both: true },
          { from: 'api', to: 'mail', tech: 'React Email' },
        ],
      },
      {
        level: 3, cols: 4, rows: 4,
        place: { h: [0, 1.5], uc: [1, 1.5], dom: [1, 0], ad_id: [2, 0], supa: [3, 0], ad_db: [2, 1], db: [3, 1], ad_files: [2, 2], files: [3, 2], ad_pub: [2, 3], sites: [3, 3] },
        edges: [
          { from: 'h', to: 'uc', tech: 'calls', primary: true },
          { from: 'uc', to: 'dom', tech: 'rules' },
          { from: 'uc', to: 'ad_id', tech: 'port', primary: true },
          { from: 'ad_id', to: 'supa', tech: 'JWT · jose', primary: true },
          { from: 'uc', to: 'ad_db', tech: 'port' },
          { from: 'ad_db', to: 'db', tech: 'SQL · Hyperdrive' },
          { from: 'uc', to: 'ad_files', tech: 'port' },
          { from: 'ad_files', to: 'files', tech: 'R2 API' },
          { from: 'uc', to: 'ad_pub', tech: 'port' },
          { from: 'ad_pub', to: 'sites', tech: 'Vercel API' },
        ],
      },
    ],
  },

  /* ───────── ferreteria ───────── */
  ferreteria: {
    nodes: {
      cashier: { kind: 'person' },
      admin: { kind: 'person' },
      system: { kind: 'system', focus: true },
      spa: { kind: 'container', tech: 'Angular SPA' },
      api: { kind: 'container', tech: 'Spring Boot · Java 17' },
      db: { kind: 'database', tech: 'SQL Server' },
      h: { kind: 'component', tech: 'REST controllers' },
      uc: { kind: 'component', tech: 'Application services' },
      dom: { kind: 'component', tech: 'Entities' },
      ad: { kind: 'component', tech: 'JPA · Hibernate' },
    },
    views: [
      {
        level: 1, cols: 2, rows: 2,
        place: { cashier: [0, 0], admin: [0, 1], system: [1, 0.5] },
        edges: [
          { from: 'cashier', to: 'system', tech: 'Browser · LAN', primary: true },
          { from: 'admin', to: 'system', tech: 'Browser · LAN' },
        ],
      },
      {
        level: 2, cols: 4, rows: 1,
        place: { cashier: [0, 0], spa: [1, 0], api: [2, 0], db: [3, 0] },
        edges: [
          { from: 'cashier', to: 'spa', tech: 'Browser', primary: true },
          { from: 'spa', to: 'api', tech: 'REST · JWT', primary: true },
          { from: 'api', to: 'db', tech: 'JDBC', primary: true },
        ],
      },
      {
        level: 3, cols: 4, rows: 3,
        place: { h: [0, 1], uc: [1, 1], dom: [1, 0], ad: [2, 1], db: [3, 1] },
        edges: [
          { from: 'h', to: 'uc', tech: 'calls', primary: true },
          { from: 'uc', to: 'dom', tech: 'rules' },
          { from: 'uc', to: 'ad', tech: 'port', primary: true },
          { from: 'ad', to: 'db', tech: 'SQL', primary: true },
        ],
      },
    ],
  },

  /* ───────── firstcommit ───────── */
  firstcommit: {
    nodes: {
      dev: { kind: 'person' },
      firstcommit: { kind: 'system', focus: true },
      github: { kind: 'external', tech: 'REST' },
      jobs: { kind: 'external', tech: 'APIs · HTML' },
      llm: { kind: 'external', tech: 'LiteLLM · Helicone' },
      mp: { kind: 'external', tech: 'Mercado Pago' },
      web: { kind: 'container', tech: 'Angular 22 · Cloudflare Pages' },
      core: { kind: 'container', tech: 'Go · Fiber · Cloud Run' },
      ai: { kind: 'container', tech: 'Python 3.12 · FastAPI · Cloud Run' },
      scraper: { kind: 'container', tech: 'Python · Cloud Run Job' },
      tasks: { kind: 'queue', tech: 'GCP Cloud Tasks' },
      db: { kind: 'database', tech: 'Supabase · PostgreSQL · pgvector' },
      store: { kind: 'database', tech: 'Cloudflare R2' },
      mail: { kind: 'external', tech: 'Resend' },
      h: { kind: 'component', tech: 'Fiber handlers' },
      uc: { kind: 'component', tech: 'Use cases' },
      dom: { kind: 'component', tech: 'Domain' },
      ad_db: { kind: 'component', tech: 'Supabase adapter' },
      ad_tasks: { kind: 'component', tech: 'Cloud Tasks adapter' },
      ad_mp: { kind: 'component', tech: 'mercadopago/sdk-go' },
    },
    views: [
      {
        level: 1, cols: 3, rows: 4,
        place: { dev: [0, 1.5], firstcommit: [1, 1.5], github: [2, 0], jobs: [2, 1], llm: [2, 2], mp: [2, 3] },
        edges: [
          { from: 'dev', to: 'firstcommit', tech: 'HTTPS', primary: true },
          { from: 'firstcommit', to: 'github', tech: 'REST' },
          { from: 'firstcommit', to: 'jobs', tech: 'APIs · scraping' },
          { from: 'firstcommit', to: 'llm', tech: 'LiteLLM' },
          { from: 'firstcommit', to: 'mp', tech: 'Webhooks' },
        ],
      },
      {
        level: 2, cols: 4, rows: 4,
        place: { jobs: [0, 0], scraper: [1, 0], mp: [2, 0], mail: [3, 0], dev: [0, 1], web: [1, 1], core: [2, 1], store: [3, 1], tasks: [2, 2], db: [3, 2], github: [1, 3], ai: [2, 3], llm: [3, 3] },
        edges: [
          { from: 'scraper', to: 'jobs', tech: 'HTTP · HTML' },
          { from: 'dev', to: 'web', tech: 'HTTPS', primary: true },
          { from: 'web', to: 'core', tech: 'REST · JWT', primary: true },
          { from: 'core', to: 'mp', tech: 'Webhooks', both: true },
          { from: 'core', to: 'mail', tech: 'HTTPS' },
          { from: 'core', to: 'store', tech: 'S3 API' },
          { from: 'core', to: 'db', tech: 'SQL' },
          { from: 'core', to: 'tasks', tech: 'enqueue', primary: true },
          { from: 'tasks', to: 'ai', tech: 'HTTP push', primary: true },
          { from: 'ai', to: 'github', tech: 'REST' },
          { from: 'ai', to: 'db', tech: 'pgvector' },
          { from: 'ai', to: 'llm', tech: 'LLM API', primary: true },
        ],
      },
      {
        level: 3, cols: 4, rows: 3,
        place: { h: [0, 1], uc: [1, 1], dom: [1, 0], ad_db: [2, 0], db: [3, 0], ad_tasks: [2, 1], tasks: [3, 1], ad_mp: [2, 2], mp: [3, 2] },
        edges: [
          { from: 'h', to: 'uc', tech: 'calls', primary: true },
          { from: 'uc', to: 'dom', tech: 'rules' },
          { from: 'uc', to: 'ad_db', tech: 'port', primary: true },
          { from: 'ad_db', to: 'db', tech: 'SQL · Supabase', primary: true },
          { from: 'uc', to: 'ad_tasks', tech: 'port' },
          { from: 'ad_tasks', to: 'tasks', tech: 'enqueue' },
          { from: 'uc', to: 'ad_mp', tech: 'port' },
          { from: 'ad_mp', to: 'mp', tech: 'Webhooks' },
        ],
      },
    ],
  },

  /* ───────── carnet-upc ───────── */
  'carnet-upc': {
    nodes: {
      student: { kind: 'person' },
      carnet: { kind: 'system', focus: true },
      cdn: { kind: 'external', tech: 'Cloudinary' },
      web: { kind: 'container', tech: 'Next.js · Vercel' },
      api: { kind: 'container', tech: 'FastAPI · Python · PaaS' },
      ep: { kind: 'component', tech: 'FastAPI · /process' },
      face: { kind: 'component', tech: 'MediaPipe' },
      seg: { kind: 'component', tech: 'rembg · ONNX' },
      fit: { kind: 'component', tech: 'OpenCV · Pillow' },
    },
    views: [
      {
        level: 1, cols: 3, rows: 1,
        place: { student: [0, 0], carnet: [1, 0], cdn: [2, 0] },
        edges: [
          { from: 'student', to: 'carnet', tech: 'HTTPS', primary: true },
          { from: 'carnet', to: 'cdn', tech: 'HTTPS', primary: true },
        ],
      },
      {
        level: 2, cols: 4, rows: 1,
        place: { student: [0, 0], web: [1, 0], api: [2, 0], cdn: [3, 0] },
        edges: [
          { from: 'student', to: 'web', tech: 'Browser', primary: true },
          { from: 'web', to: 'api', tech: 'REST · multipart', primary: true },
          { from: 'api', to: 'cdn', tech: 'HTTPS', primary: true },
        ],
      },
      {
        level: 3, cols: 4, rows: 2,
        place: { ep: [0, 0], face: [1, 0], seg: [2, 0], fit: [3, 0], cdn: [3, 1] },
        edges: [
          { from: 'ep', to: 'face', tech: 'image', primary: true },
          { from: 'face', to: 'seg', tech: 'crop', primary: true },
          { from: 'seg', to: 'fit', tech: 'figure', primary: true },
          { from: 'fit', to: 'cdn', tech: '240×288 · 300 DPI', primary: true },
        ],
      },
    ],
  },

  /* ───────── media-ai ───────── */
  'media-ai': {
    nodes: {
      user: { kind: 'person' },
      media: { kind: 'system', focus: true },
      supa: { kind: 'database', tech: 'Supabase · PostgreSQL' },
      cloud: { kind: 'external', tech: 'Cloudinary' },
      web: { kind: 'container', tech: 'React · Vite · Vercel' },
      api: { kind: 'container', tech: 'FastAPI · Docker' },
      router: { kind: 'component', tech: 'FastAPI routers' },
      m_av: { kind: 'component', tech: 'noisereduce · Whisper · FFmpeg' },
      m_text: { kind: 'component', tech: 'MarianMT · BART' },
      m_docs: { kind: 'component', tech: 'PyMuPDF · EasyOCR' },
      jobs: { kind: 'component', tech: 'jobs · polling' },
      storage: { kind: 'component', tech: 'storage' },
    },
    views: [
      {
        level: 1, cols: 3, rows: 2,
        place: { user: [0, 0.5], media: [1, 0.5], supa: [2, 0], cloud: [2, 1] },
        edges: [
          { from: 'user', to: 'media', tech: 'HTTPS', primary: true },
          { from: 'media', to: 'supa', tech: 'SQL' },
          { from: 'media', to: 'cloud', tech: 'HTTPS' },
        ],
      },
      {
        level: 2, cols: 4, rows: 3,
        place: { user: [0, 1], web: [1, 1], api: [2, 1], supa: [3, 0], cloud: [3, 2] },
        edges: [
          { from: 'user', to: 'web', tech: 'Browser', primary: true },
          { from: 'web', to: 'api', tech: 'REST · jobs', primary: true },
          { from: 'api', to: 'supa', tech: 'SQL' },
          { from: 'api', to: 'cloud', tech: 'HTTPS' },
        ],
      },
      {
        level: 3, cols: 4, rows: 3,
        place: { router: [0, 1], m_av: [1, 0], m_text: [1, 1], m_docs: [1, 2], jobs: [2, 1], storage: [2, 2], supa: [3, 1], cloud: [3, 2] },
        edges: [
          { from: 'router', to: 'm_av', tech: '/audio · /video · /transcribe', primary: true },
          { from: 'router', to: 'm_text', tech: '/translate · /summarize' },
          { from: 'router', to: 'm_docs', tech: '/docs · /ocr · /pdf-editor' },
          { from: 'm_av', to: 'jobs', tech: 'job', primary: true },
          { from: 'm_text', to: 'jobs', tech: 'job' },
          { from: 'm_docs', to: 'jobs', tech: 'job' },
          { from: 'jobs', to: 'supa', tech: 'SQL', primary: true },
          { from: 'm_docs', to: 'storage', tech: 'files' },
          { from: 'storage', to: 'cloud', tech: 'HTTPS' },
        ],
      },
    ],
  },

  /* ───────── gouni ───────── */
  gouni: {
    nodes: {
      rider: { kind: 'person' },
      gouni: { kind: 'system', focus: true },
      maps: { kind: 'external', tech: 'Mapbox GL' },
      smtp: { kind: 'external', tech: 'Gmail SMTP' },
      web: { kind: 'container', tech: 'Angular 18 · Material · PrimeNG' },
      api: { kind: 'container', tech: 'Spring Boot · Java 17' },
      chat: { kind: 'container', tech: 'Spring WebSocket · STOMP' },
      db: { kind: 'database', tech: 'MySQL' },
      clients: { kind: 'external', tech: 'Browser · STOMP' },
      h: { kind: 'component', tech: 'REST controllers' },
      uc: { kind: 'component', tech: 'Application services' },
      dom: { kind: 'component', tech: 'Aggregates' },
      ad_db: { kind: 'component', tech: 'JPA repositories' },
      ad_mail: { kind: 'component', tech: 'Mail sender' },
      ad_ws: { kind: 'component', tech: 'WebSocket config' },
    },
    views: [
      {
        level: 1, cols: 3, rows: 2,
        place: { rider: [0, 0.5], gouni: [1, 0.5], maps: [2, 0], smtp: [2, 1] },
        edges: [
          { from: 'rider', to: 'gouni', tech: 'HTTPS', primary: true },
          { from: 'gouni', to: 'maps', tech: 'Mapbox GL' },
          { from: 'gouni', to: 'smtp', tech: 'SMTP' },
        ],
      },
      {
        level: 2, cols: 4, rows: 3,
        place: { maps: [1, 0], rider: [0, 1], web: [1, 1], chat: [2, 0], api: [2, 1], db: [3, 1], smtp: [3, 2] },
        edges: [
          { from: 'rider', to: 'web', tech: 'HTTPS', primary: true },
          { from: 'web', to: 'maps', tech: 'Mapbox GL' },
          { from: 'web', to: 'api', tech: 'REST · JWT', primary: true },
          { from: 'web', to: 'chat', tech: 'WebSocket · STOMP', primary: true },
          { from: 'api', to: 'db', tech: 'JDBC' },
          { from: 'api', to: 'smtp', tech: 'SMTP' },
        ],
      },
      {
        level: 3, cols: 4, rows: 3,
        place: { h: [0, 1], uc: [1, 1], dom: [1, 0], ad_db: [2, 0], db: [3, 0], ad_mail: [2, 1], smtp: [3, 1], ad_ws: [2, 2], clients: [3, 2] },
        edges: [
          { from: 'h', to: 'uc', tech: 'calls', primary: true },
          { from: 'uc', to: 'dom', tech: 'rules' },
          { from: 'uc', to: 'ad_db', tech: 'port', primary: true },
          { from: 'ad_db', to: 'db', tech: 'JDBC', primary: true },
          { from: 'uc', to: 'ad_mail', tech: 'port' },
          { from: 'ad_mail', to: 'smtp', tech: 'SMTP' },
          { from: 'uc', to: 'ad_ws', tech: 'port' },
          { from: 'ad_ws', to: 'clients', tech: 'WebSocket · STOMP' },
        ],
      },
    ],
  },

  /* ───────── oxaira ───────── */
  oxaira: {
    nodes: {
      user: { kind: 'person' },
      esp32: { kind: 'container', tech: 'ESP32 · C++ · DHT11 + MQ135' },
      airq: { kind: 'system', focus: true },
      twilio: { kind: 'external', tech: 'Twilio' },
      web: { kind: 'container', tech: 'Angular 19' },
      mobile: { kind: 'container', tech: 'Flutter' },
      backend: { kind: 'container', tech: 'Spring Boot · Java 17' },
      pg: { kind: 'database', tech: 'PostgreSQL' },
      analytics: { kind: 'container', tech: 'Spring Boot · Data Analytics' },
      my: { kind: 'database', tech: 'MySQL' },
      rabbit: { kind: 'queue', tech: 'RabbitMQ' },
      notif: { kind: 'container', tech: 'Spring Boot · AMQP' },
      sms: { kind: 'container', tech: 'Spring Boot · Twilio' },
      kafka: { kind: 'queue', tech: 'Apache Kafka' },
      h: { kind: 'component', tech: 'REST controllers' },
      uc: { kind: 'component', tech: 'Command and query services' },
      dom: { kind: 'component', tech: 'Aggregates' },
      ad_db: { kind: 'component', tech: 'JPA · Hibernate' },
      ad_alert: { kind: 'component', tech: 'Alert publisher' },
    },
    views: [
      {
        level: 1, cols: 3, rows: 3,
        place: { user: [0, 0], esp32: [0, 1], airq: [1, 1], twilio: [2, 1] },
        edges: [
          { from: 'user', to: 'airq', tech: 'HTTPS', primary: true },
          { from: 'esp32', to: 'airq', tech: 'HTTP · JSON', primary: true },
          { from: 'airq', to: 'twilio', tech: 'HTTPS', primary: true },
        ],
      },
      {
        level: 2, cols: 4, rows: 4,
        place: { user: [0, 0], web: [1, 0], backend: [2, 0], pg: [3, 0], mobile: [1, 1], esp32: [0, 2], analytics: [2, 2], my: [3, 2], sms: [0, 3], notif: [1, 3], rabbit: [2, 3], kafka: [3, 3] },
        edges: [
          { from: 'user', to: 'web', tech: 'HTTPS' },
          { from: 'user', to: 'mobile', tech: 'App' },
          { from: 'web', to: 'backend', tech: 'REST' },
          { from: 'mobile', to: 'backend', tech: 'REST' },
          { from: 'backend', to: 'pg', tech: 'JDBC' },
          { from: 'esp32', to: 'analytics', tech: 'HTTP · JSON', primary: true },
          { from: 'analytics', to: 'my', tech: 'JDBC' },
          { from: 'analytics', to: 'rabbit', tech: 'AMQP · alerts', primary: true },
          { from: 'rabbit', to: 'notif', tech: 'AMQP', primary: true },
          { from: 'notif', to: 'sms', tech: 'HTTP', primary: true },
          { from: 'analytics', to: 'kafka', tech: 'events' },
        ],
      },
      {
        level: 3, cols: 4, rows: 3,
        place: { h: [0, 1], uc: [1, 1], dom: [1, 0], ad_db: [2, 0.5], my: [3, 0.5], ad_alert: [2, 1.5], rabbit: [3, 1.5] },
        edges: [
          { from: 'h', to: 'uc', tech: 'calls', primary: true },
          { from: 'uc', to: 'dom', tech: 'rules' },
          { from: 'uc', to: 'ad_db', tech: 'port', primary: true },
          { from: 'ad_db', to: 'my', tech: 'JDBC', primary: true },
          { from: 'uc', to: 'ad_alert', tech: 'port' },
          { from: 'ad_alert', to: 'rabbit', tech: 'AMQP' },
        ],
      },
    ],
  },

  /* ───────── di-project ───────── */
  'di-project': {
    nodes: {
      staff: { kind: 'person' },
      rider: { kind: 'person' },
      di: { kind: 'system', focus: true },
      gemini: { kind: 'external', tech: 'Google Gemini' },
      smtp: { kind: 'external', tech: 'Gmail SMTP' },
      web: { kind: 'container', tech: 'React 19 · Leaflet · STOMP' },
      mobile: { kind: 'container', tech: 'React Native 0.82' },
      gps: { kind: 'container', tech: 'Java 21 · simulador GPS' },
      auth: { kind: 'container', tech: 'Spring Boot 3 · Java 21' },
      chat: { kind: 'container', tech: 'Django 5 · DRF · SimpleJWT' },
      pg: { kind: 'database', tech: 'PostgreSQL' },
      redis: { kind: 'database', tech: 'Redis' },
      h: { kind: 'component', tech: 'Controllers' },
      uc: { kind: 'component', tech: 'Services' },
      dom: { kind: 'component', tech: 'Model' },
      ad_db: { kind: 'component', tech: 'JPA' },
      ad_redis: { kind: 'component', tech: 'Redis repository' },
      ad_mail: { kind: 'component', tech: 'Mail sender' },
    },
    views: [
      {
        level: 1, cols: 3, rows: 3,
        place: { staff: [0, 0], rider: [0, 1], di: [1, 1], gemini: [2, 0], smtp: [2, 2] },
        edges: [
          { from: 'staff', to: 'di', tech: 'HTTPS', primary: true },
          { from: 'rider', to: 'di', tech: 'Mobile', primary: true },
          { from: 'di', to: 'gemini', tech: 'HTTPS' },
          { from: 'di', to: 'smtp', tech: 'SMTP' },
        ],
      },
      {
        level: 2, cols: 4, rows: 3,
        place: { staff: [0, 0], web: [1, 0], auth: [2, 0], pg: [3, 0], gps: [1, 1], chat: [2, 1], redis: [3, 1], rider: [0, 2], mobile: [1, 2], gemini: [3, 2] },
        edges: [
          { from: 'staff', to: 'web', tech: 'HTTPS', primary: true },
          { from: 'rider', to: 'mobile', tech: 'App', primary: true },
          { from: 'web', to: 'auth', tech: 'REST · JWT', primary: true },
          { from: 'web', to: 'chat', tech: 'REST · JWT' },
          { from: 'mobile', to: 'auth', tech: 'REST · JWT', bend: 0.5 },
          { from: 'mobile', to: 'gps', tech: 'GPS · STOMP', primary: true },
          { from: 'gps', to: 'web', tech: 'WebSocket · STOMP', primary: true },
          { from: 'auth', to: 'pg', tech: 'JDBC' },
          { from: 'auth', to: 'redis', tech: 'codes' },
          { from: 'chat', to: 'gemini', tech: 'Gemini API' },
        ],
      },
      {
        level: 3, cols: 4, rows: 3,
        place: { h: [0, 1], uc: [1, 1], dom: [1, 0], ad_db: [2, 0], pg: [3, 0], ad_redis: [2, 1], redis: [3, 1], ad_mail: [2, 2], smtp: [3, 2] },
        edges: [
          { from: 'h', to: 'uc', tech: 'calls', primary: true },
          { from: 'uc', to: 'dom', tech: 'rules' },
          { from: 'uc', to: 'ad_db', tech: 'port', primary: true },
          { from: 'ad_db', to: 'pg', tech: 'JDBC', primary: true },
          { from: 'uc', to: 'ad_redis', tech: 'port' },
          { from: 'ad_redis', to: 'redis', tech: 'Redis' },
          { from: 'uc', to: 'ad_mail', tech: 'port' },
          { from: 'ad_mail', to: 'smtp', tech: 'SMTP' },
        ],
      },
    ],
  },

  /* ───────── mediscan-ai ───────── */
  'mediscan-ai': {
    nodes: {
      pro: { kind: 'person' },
      mediscan: { kind: 'system', focus: true },
      smtp: { kind: 'external', tech: 'Gmail SMTP' },
      s3: { kind: 'external', tech: 'Amazon S3' },
      gemini: { kind: 'external', tech: 'Google Gemini' },
      web: { kind: 'container', tech: 'React 18 · Docker' },
      mobile: { kind: 'container', tech: 'Flutter' },
      gw: { kind: 'container', tech: 'Spring Cloud Gateway' },
      iam: { kind: 'container', tech: 'Spring Security · MySQL' },
      report: { kind: 'container', tech: 'Spring Boot · MySQL' },
      admin: { kind: 'container', tech: 'Java 21 · MySQL' },
      ai: { kind: 'container', tech: 'FastAPI · TensorFlow' },
      notif: { kind: 'container', tech: 'Spring Boot · MySQL' },
      ml: { kind: 'container', tech: 'FastAPI · MONAI · PostgreSQL' },
      rabbit: { kind: 'queue', tech: 'RabbitMQ' },
      email: { kind: 'container', tech: 'Spring Boot · AMQP' },
      pg: { kind: 'database', tech: 'PostgreSQL' },
      h: { kind: 'component', tech: 'FastAPI v1 · v2' },
      uc: { kind: 'component', tech: 'Services' },
      dom: { kind: 'component', tech: 'MONAI · X-ray model' },
      ad_db: { kind: 'component', tech: 'asyncpg repository' },
      ad_s3: { kind: 'component', tech: 'boto3' },
      ad_gemini: { kind: 'component', tech: 'google-genai' },
    },
    views: [
      {
        level: 1, cols: 3, rows: 3,
        place: { pro: [0, 1], mediscan: [1, 1], smtp: [2, 0], s3: [2, 1], gemini: [2, 2] },
        edges: [
          { from: 'pro', to: 'mediscan', tech: 'HTTPS', primary: true },
          { from: 'mediscan', to: 'smtp', tech: 'SMTP' },
          { from: 'mediscan', to: 's3', tech: 'S3 API' },
          { from: 'mediscan', to: 'gemini', tech: 'HTTPS' },
        ],
      },
      {
        level: 2, cols: 4, rows: 4,
        place: { pro: [0, 0], web: [1, 0], gw: [2, 0], iam: [3, 0], mobile: [1, 1], notif: [2, 1], report: [3, 1], rabbit: [1, 2], email: [0, 2], gemini: [2, 2], admin: [3, 2], smtp: [0, 3], s3: [1, 3], ml: [2, 3], ai: [3, 3] },
        edges: [
          { from: 'pro', to: 'web', tech: 'HTTPS', primary: true },
          { from: 'pro', to: 'mobile', tech: 'App' },
          { from: 'web', to: 'gw', tech: 'REST', primary: true },
          { from: 'mobile', to: 'gw', tech: 'REST' },
          { from: 'gw', to: 'iam', tech: 'REST · JWT', primary: true },
          { from: 'gw', to: 'report', tech: 'REST' },
          { from: 'gw', to: 'admin', tech: 'REST' },
          { from: 'gw', to: 'ai', tech: 'REST', primary: true },
          { from: 'gw', to: 'notif', tech: 'REST' },
          { from: 'notif', to: 'rabbit', tech: 'AMQP', bend: 0.2 },
          { from: 'rabbit', to: 'email', tech: 'AMQP' },
          { from: 'email', to: 'smtp', tech: 'SMTP' },
          { from: 'ai', to: 'ml', tech: 'HTTP', primary: true },
          { from: 'ml', to: 's3', tech: 'S3 API' },
          { from: 'ml', to: 'gemini', tech: 'HTTPS' },
        ],
      },
      {
        level: 3, cols: 4, rows: 3,
        place: { h: [0, 1], uc: [1, 1], dom: [1, 0], ad_db: [2, 0], pg: [3, 0], ad_s3: [2, 1], s3: [3, 1], ad_gemini: [2, 2], gemini: [3, 2] },
        edges: [
          { from: 'h', to: 'uc', tech: 'calls', primary: true },
          { from: 'uc', to: 'dom', tech: 'rules' },
          { from: 'uc', to: 'ad_db', tech: 'port', primary: true },
          { from: 'ad_db', to: 'pg', tech: 'SQL', primary: true },
          { from: 'uc', to: 'ad_s3', tech: 'port' },
          { from: 'ad_s3', to: 's3', tech: 'S3 API' },
          { from: 'uc', to: 'ad_gemini', tech: 'port' },
          { from: 'ad_gemini', to: 'gemini', tech: 'HTTPS' },
        ],
      },
    ],
  },

  /* ───────── movies-explorer ───────── */
  'movies-explorer': {
    nodes: {
      user: { kind: 'person' },
      movies: { kind: 'system', focus: true },
      tmdb: { kind: 'external', tech: 'TMDb API' },
      spa: { kind: 'container', tech: 'Angular 19 · Material · Vercel' },
      storage: { kind: 'database', tech: 'Browser · LocalStorage' },
      page: { kind: 'component', tech: 'movies page' },
      filters: { kind: 'component', tech: 'filters · debounce' },
      rows: { kind: 'component', tech: 'rows · cards' },
      detail: { kind: 'component', tech: 'detail · trailer' },
      svc: { kind: 'component', tech: 'MoviesService · HttpClient' },
    },
    views: [
      {
        level: 1, cols: 3, rows: 1,
        place: { user: [0, 0], movies: [1, 0], tmdb: [2, 0] },
        edges: [
          { from: 'user', to: 'movies', tech: 'HTTPS', primary: true },
          { from: 'movies', to: 'tmdb', tech: 'HTTPS', primary: true },
        ],
      },
      {
        level: 2, cols: 3, rows: 2,
        place: { user: [0, 0], spa: [1, 0], tmdb: [2, 0], storage: [1, 1] },
        edges: [
          { from: 'user', to: 'spa', tech: 'Browser', primary: true },
          { from: 'spa', to: 'tmdb', tech: 'REST · API key', primary: true },
          { from: 'spa', to: 'storage', tech: 'favorites · watchlist' },
        ],
      },
      {
        level: 3, cols: 4, rows: 3,
        place: { page: [0, 1], filters: [1, 0], rows: [1, 1], detail: [1, 2], svc: [2, 1], tmdb: [3, 0], storage: [3, 2] },
        edges: [
          { from: 'page', to: 'filters', tech: 'search' },
          { from: 'page', to: 'rows', tech: 'catalog', primary: true },
          { from: 'page', to: 'detail', tech: 'route' },
          { from: 'filters', to: 'svc', tech: 'query' },
          { from: 'rows', to: 'svc', tech: 'list', primary: true },
          { from: 'detail', to: 'svc', tech: 'movie' },
          { from: 'svc', to: 'tmdb', tech: 'HTTPS', primary: true },
          { from: 'svc', to: 'storage', tech: 'favorites' },
        ],
      },
    ],
  },

  /* ───────── Signperu ───────── */
  signperu: {
    nodes: {
      issuer: person, signer: person, verifier: person,
      signperu: { kind: 'system', focus: true },
      resend: ext('Resend'), tsa: ext('RFC 3161'), sched: ext('Cloud Scheduler'), secrets: ext('Secret Manager'),
      files: db('Google Cloud Storage · bucket privado'),
      web: box('Angular 22 · Tailwind 4 · GSAP'), api: box('Spring Boot 4 · Java 21 · Cloud Run'), db: db('PostgreSQL 16 · Flyway'),
      identidad: part('Bounded context'), acceso: part('Aggregate'), sobres: part('Bounded context'),
      documentos: part('Bounded context'), sellador: part('PDFBox · BouncyCastle'),
      outbox: part('Outbox · SKIP LOCKED'), auditoria: part('Hash chain'), notificaciones: part('Bounded context'),
    },
    views: [
      {
        level: 1, cols: 3, rows: 3,
        place: { issuer: [0, 0], signer: [0, 1], verifier: [0, 2], signperu: [1, 1], resend: [2, 0], tsa: [2, 1], files: [2, 2] },
        edges: [
          { from: 'issuer', to: 'signperu', tech: 'HTTPS · session + TOTP' },
          { from: 'signer', to: 'signperu', tech: 'HTTPS · link + code', primary: true },
          { from: 'verifier', to: 'signperu', tech: 'Public check' },
          { from: 'signperu', to: 'tsa', tech: 'RFC 3161', primary: true },
          { from: 'signperu', to: 'resend', tech: 'HTTPS · webhook', both: true },
          { from: 'signperu', to: 'files', tech: 'Storage API' },
        ],
      },
      {
        level: 2, cols: 4, rows: 3,
        place: { issuer: [0, 0], signer: [0, 1], verifier: [0, 2], web: [1, 1], secrets: [1, 2], sched: [2, 0], api: [2, 1], resend: [2, 2], db: [3, 0], files: [3, 1], tsa: [3, 2] },
        edges: [
          { from: 'issuer', to: 'web', tech: 'HTTPS' },
          { from: 'signer', to: 'web', tech: 'HTTPS · link', primary: true },
          { from: 'verifier', to: 'web', tech: 'HTTPS' },
          { from: 'web', to: 'api', tech: 'REST · /api', primary: true },
          { from: 'sched', to: 'api', tech: 'HTTP · token' },
          { from: 'secrets', to: 'api', tech: 'env · secrets' },
          { from: 'api', to: 'db', tech: 'JDBC · outbox', primary: true },
          { from: 'api', to: 'files', tech: 'Storage API' },
          { from: 'api', to: 'tsa', tech: 'RFC 3161', primary: true },
          { from: 'api', to: 'resend', tech: 'HTTPS · webhook', both: true },
        ],
      },
      {
        level: 3, cols: 4, rows: 3,
        place: {
          identidad: [0, 0], acceso: [1, 0], auditoria: [2, 0], resend: [3, 0],
          files: [0, 2], sobres: [1, 1], outbox: [2, 1], notificaciones: [3, 1],
          documentos: [1, 2], sellador: [2, 2], tsa: [3, 2],
        },
        edges: [
          { from: 'identidad', to: 'sobres', tech: 'session' },
          { from: 'acceso', to: 'sobres', tech: 'validates access', primary: true },
          { from: 'sobres', to: 'outbox', tech: 'events' },
          { from: 'outbox', to: 'auditoria', tech: 'events' },
          { from: 'outbox', to: 'notificaciones', tech: 'handler' },
          { from: 'notificaciones', to: 'resend', tech: 'HTTPS' },
          { from: 'sobres', to: 'documentos', tech: 'ACL · facade', primary: true },
          { from: 'documentos', to: 'sellador', tech: 'port', primary: true },
          { from: 'sellador', to: 'tsa', tech: 'RFC 3161', primary: true },
          { from: 'documentos', to: 'files', tech: 'port' },
        ],
      },
    ],
  },

};

/** The container view used inside the lens. Falls back to the first view. */
export function lensView(slug: CaseSlug): C4View {
  const model = c4[slug];
  return model.views.find((v) => v.level === 2) ?? model.views[0];
}
