import type { CaseSlug } from '@/data/projects';
import type { ProjectText } from '../schema';

const projects: Record<CaseSlug, ProjectText> = {
  'sonqo-peru': {
    name: 'Sonqo Perú',
    category: 'Client · NGO',
    line: 'Real donations, zero infrastructure cost.',
    summary:
      'I migrated a Peruvian NGO’s site from WordPress to Astro. Infrastructure and operating cost at zero, with one-time and monthly donations in production.',
    problem:
      'The site lived on WordPress, with infrastructure and operating costs. They had to drop to zero without losing the ability to receive donations or to edit content.',
    solution:
      'I rebuilt the site in Astro with a serverless backend and connected one-time and monthly donations to Mercado Pago (Checkout API and Bricks). Content is edited in Sanity.',
    outcome: 'In production, processing real payments, with infrastructure and operating cost at zero.',
    decisions: [
      {
        title: 'A payment is real when the provider confirms it',
        text: 'Webhooks are verified with an HMAC signature and the payment status is fetched from the Mercado Pago API, never trusted from the browser.',
      },
      {
        title: 'One validation',
        text: 'The same Zod schemas validate on the client and on the server, and Upstash Redis rate-limits requests per visitor.',
      },
      {
        title: 'Content without developers',
        text: 'Sanity lets the team edit figures, images and copy without touching the payment flows.',
      },
      {
        title: 'Deployed on Google Cloud',
        text: 'Cloud Build builds the image, Artifact Registry stores it and Cloud Run serves it; secrets live in Secret Manager.',
      },
    ],
    flow: ['Donor', 'Astro', 'Mercado Pago', 'Verified webhook', 'Resend'],
  },
  brainstorming: {
    name: 'Brainstorming',
    category: 'Client · Business growth consultancy',
    line: 'Three sites on one foundation.',
    summary:
      'Website, blog and a site for US clients of a business growth consultancy, migrated from WordPress to Astro with a serverless backend.',
    problem:
      'A consultancy with three sites needed a maintainable, bilingual foundation protected against spam, without depending on WordPress.',
    solution:
      'I migrated the sites to Astro with a custom design. The serverless backend uses PostgreSQL, Upstash Redis caching and transactional email with Resend and React Email. Content is managed by a custom CMS I also built.',
    outcome: 'Three sites on one technical foundation, with content editable from the custom CMS.',
    decisions: [
      {
        title: 'Protected forms',
        text: 'Cloudflare Turnstile protects every contact point; Resend sends the internal notification and the confirmation to the visitor.',
      },
      {
        title: 'Errors with context',
        text: 'Sentry records errors and logs with their context, while the messages users see stay generic.',
      },
      {
        title: 'Visible to search engines and to the business',
        text: 'Technical SEO with robots.txt and sitemap.xml, Google Analytics and Tag Manager, and Spanish and English internationalization.',
      },
    ],
    flow: ['Visitor', 'Astro', 'Turnstile', 'Serverless API', 'PostgreSQL', 'Resend'],
  },
  'brainstorming-cms': {
    name: 'Brainstorming CMS',
    category: 'Client · Custom product',
    line: 'An editor so nobody depends on a developer.',
    summary:
      'A custom editorial CMS: an API in Hono on Cloudflare Workers and an Angular admin, with block editing, autosave, history and preview.',
    problem:
      'The editorial team needed to publish guides and articles across several sites without asking for code changes, and with control over who can edit what.',
    solution:
      'I built two independent repositories: an API in Hono on Cloudflare Workers (Drizzle, PostgreSQL and an OpenAPI contract) and an Angular admin with a rich-text and block editor.',
    outcome: 'A custom CMS with history, a file library and per-site publishing status.',
    decisions: [
      {
        title: 'The contract rules',
        text: 'Routes are defined with Zod schemas that validate input and generate OpenAPI 3.1. Angular imports a versioned copy of the contract and generates its types from it.',
      },
      {
        title: 'Autosave without losing changes',
        text: 'It saves after a 1.2-second pause. On a conflict or an error it stops retrying and keeps the local changes.',
      },
      {
        title: 'Restore without publishing',
        text: 'History restores a version as a draft; what is published doesn’t change until you publish again.',
      },
      {
        title: 'Access by invitation',
        text: 'A single administrator and editors with permissions. Only the Supabase publishable key reaches the browser.',
      },
    ],
    flow: ['Editor', 'Angular admin', 'Hono API', 'PostgreSQL', 'Per-site publishing'],
  },
  facturacion: {
    name: 'Efectiback',
    category: 'Own product · Invoicing SaaS',
    line: 'Electronic invoicing that stays up, with real clients.',
    summary:
      'An electronic invoicing SaaS for Peru: issues invoices, receipts and notes straight to SUNAT, with a REST API, a client portal and an operator panel.',
    problem:
      'Small businesses need to issue invoices that SUNAT accepts without relying on an accountant or a slow portal, and the systems they already use (POS, ERP, online store) must be able to integrate by API.',
    solution:
      'I built the platform end to end: a Java library with UBL 2.1, XAdES signing and a SOAP client; a Spring Boot API with hexagonal architecture; a client portal and a back office in Angular; and the landing page in Astro.',
    outcome:
      'In use by real clients. More than 350 automated backend tests, and issuing verified against SUNAT’s beta environment with an accepted CDR.',
    decisions: [
      {
        title: 'The queue lives in Postgres',
        text: 'Sending to SUNAT uses a queue table with FOR UPDATE SKIP LOCKED and exponential-backoff retries: no RabbitMQ, no extra infrastructure.',
      },
      {
        title: 'One validator per document type',
        text: 'Invoices, receipts and notes validate with their own rules, extracted from SUNAT’s official spreadsheet. An error is rejected with HTTP 422 before queuing.',
      },
      {
        title: 'Modular monolith, not microservices',
        text: 'A single deployment with bounded contexts (issuing, identity, subscriptions). The engine is a library without Spring, tested on its own.',
      },
      {
        title: 'Encrypted secrets',
        text: 'Each company’s digital certificates and SOL key are stored encrypted with a master key, and the session uses an HttpOnly cookie.',
      },
      {
        title: 'Minimal running cost',
        text: 'Backend on Cloud Run, database on Supabase, files on Cloudflare R2 and front ends on Cloudflare Pages.',
      },
    ],
    flow: ['Portal or ERP', 'REST API', 'Postgres queue', 'XAdES signing', 'SUNAT', 'CDR in R2'],
  },
  ferreteria: {
    name: 'Hardware store: inventory and sales',
    category: 'Client · Desktop application',
    line: 'A system that doesn’t depend on external services.',
    summary:
      'Inventory and sales for a hardware store, deployed locally, with a REST API in Java 17 and Spring Boot, SQL Server and an Angular interface.',
    problem: 'The business needed to control its stock and sales without depending on external services.',
    solution:
      'A Spring Boot REST API on SQL Server with normalized schemas and an Angular SPA, deployed locally.',
    outcome: 'A local inventory and sales system with no dependency on external services.',
    decisions: [
      {
        title: 'Real-time stock',
        text: 'Every entry and exit updates stock instantly, and movement reports explain where each figure comes from.',
      },
      {
        title: 'Role-based access',
        text: 'Check-in and check-out with JWT authentication and role-based access control (RBAC).',
      },
      {
        title: 'Tidy data',
        text: 'Normalized SQL Server schemas keep products, movements and users consistent.',
      },
    ],
    flow: ['Checkout', 'Angular', 'Spring Boot REST API', 'SQL Server'],
  },
  signperu: {
    name: 'Signperu',
    category: 'Own product · Electronic signing',
    line: 'Signatures with evidence, and a final PDF that proves itself.',
    summary:
      'Electronic signing for PDF documents: the sender builds an envelope, signers sign from a link with an emailed code, and the final PDF is sealed and can be verified publicly.',
    problem:
      'A contract sent by message leaves each party waiting blind, with no versions and no clear close, and nothing stops the file from changing after it is signed.',
    solution:
      'I built a modular monolith (Spring Boot 4, Java 21, hexagonal DDD) with an Angular 22 frontend. Signers get in without an account through a link and an emailed code; on completion the system stamps the signatures, adds an evidence page and seals the PDF with PAdES and a time stamp.',
    outcome: 'An own product with private access, covering the full cycle: envelope, signing, sealing and public verification.',
    decisions: [
      {
        title: 'Evidence, not just an image',
        text: 'Each signature records the verified email, IP, browser, time, PDF hash and the consent version accepted. The audit log is hash-chained: altering one record breaks the chain.',
      },
      {
        title: 'The final PDF proves itself',
        text: 'It is sealed with PAdES B-T: a signature with its own certificate plus an RFC 3161 time stamp from an external authority, with a backup one. Without a stamp the envelope stays in SELLANDO and retries.',
      },
      {
        title: 'The link is not enough',
        text: 'The token travels in the URL fragment, only its hash is stored, and a 6-digit code is required, with at most 5 attempts.',
      },
      {
        title: 'Events with an outbox',
        text: 'Every state change writes its events to an outbox table in the same transaction. Background tasks use FOR UPDATE SKIP LOCKED and can also be triggered from Cloud Scheduler.',
      },
      {
        title: 'A monolith, on purpose',
        text: 'No microservices, Kafka or Redis: cost with no benefit at this volume. Contexts (envelopes, documents, identity, notifications, audit) talk through facades and events.',
      },
      {
        title: 'Built for Cloud Run',
        text: 'A non-root Docker image, PDFs in a private bucket, the sealing key in Secret Manager and Cloud Scheduler triggering background tasks.',
      },
    ],
    flow: ['Sender uploads the PDF', 'Envelope and fields', 'Link and code', 'Signature with evidence', 'PAdES sealing', 'Public verification'],
  },
  firstcommit: {
    name: 'FirstCommit',
    category: 'Own product · Applied AI',
    line: 'The first job starts with a good commit.',
    summary:
      'An employability SaaS that connects AI-built CVs, GitHub profiles and job matching for junior developers.',
    problem:
      'Landing a first tech job means translating projects and skills into a profile that connects with relevant openings.',
    solution:
      'I designed three macro-services: a Core API in Go, an AI Engine in Python and a Python scraper that runs as a job. They generate the CV, analyze GitHub and search openings by meaning.',
    outcome: 'A product that brings together profile preparation and opportunity discovery. No public demo yet.',
    decisions: [
      {
        title: 'Three macro-services, two languages',
        text: 'Go where latency matters (auth, feed, payments) and Python where the AI and scraping ecosystem lives. Hexagonal architecture on the backend.',
      },
      {
        title: 'One queue between Go and Python',
        text: 'The Core API never calls the AI Engine directly: it enqueues on Cloud Tasks. A 60-second generation never blocks the API.',
      },
      {
        title: 'Vectors inside the database',
        text: 'pgvector on Supabase relates a profile to openings by meaning, without a separate vector service.',
      },
      {
        title: 'Near-zero fixed cost',
        text: 'Cloud Run, Supabase, Cloudflare Pages and R2 keep the total budget under US$65 a month, LLM included.',
      },
      {
        title: 'Secrets and least privilege',
        text: 'Secret Manager mounts secrets into Cloud Run, and each service has its own service account with minimal permissions.',
      },
    ],
    flow: ['Profile', 'Core API · Go', 'Task queue', 'AI Engine · Python', 'LLM and pgvector', 'CV and openings'],
  },
  'carnet-upc': {
    name: 'Carnet UPC',
    category: 'Own product · Computer vision',
    line: 'A photo, ready for the next step.',
    summary:
      'Photo processing for university ID cards with face detection and automatic adjustment.',
    problem:
      'Adapting a photo by hand to the size, background and weight an ID card requires is repetitive.',
    solution:
      'A computer vision pipeline in FastAPI: MediaPipe detects the face, rembg removes the background, and OpenCV and Pillow fit the image to 240 × 288 pixels. The interface is in Next.js.',
    outcome: 'It automates preparing photos for ID cards. No public demo yet.',
    decisions: [
      {
        title: 'Specialized processing',
        text: 'MediaPipe frames the face, rembg (ONNX) separates the figure, and OpenCV and Pillow handle size, DPI and weight.',
      },
      {
        title: 'Validate from the start',
        text: 'The TypeScript interface validates the input before sending it to the decoupled backend.',
      },
    ],
    flow: ['Photo', 'Detection', 'Segmentation', 'Fitting', 'Download'],
  },
  'media-ai': {
    name: 'Media AI Processor',
    category: 'Own product · Documents and media',
    line: 'Tools for working with documents.',
    summary:
      'An app for working with documents and media using AI: transcribe, translate, summarize, clean audio and run OCR.',
    problem:
      'Handling documents and media means connecting specialized operations with controls people can understand.',
    solution:
      'A React interface that calls a FastAPI API with one router per module: audio, transcription, translation, OCR, summarization and documents. Models run inside the service and every job is tracked by status.',
    outcome: 'A clear path from input to processing to download, with open models that do not depend on paid APIs.',
    decisions: [
      {
        title: 'One module per capability',
        text: 'Each operation has its own router and service inside the API, so new ones are added without touching the rest.',
      },
      {
        title: 'Jobs with status',
        text: 'Long processes are polled by id and downloaded when done; Supabase stores their status.',
      },
      {
        title: 'Open models',
        text: 'Whisper, MarianMT, BART and EasyOCR, run without calling paid services.',
      },
    ],
    flow: ['File', 'Interface', 'API', 'Module', 'Job', 'Download'],
  },
  gouni: {
    name: 'GoUni',
    category: 'University · Mobility',
    line: 'Share the route. Connect people.',
    summary:
      'A university carpooling platform: rides, bookings, maps and real-time chat.',
    problem:
      'University mobility in Lima needs to coordinate trips, trust and communication between drivers and passengers.',
    solution:
      'A Spring Boot backend with DDD and JWT organized by contexts (IAM, carpooling and chat), a WebSocket chat service and an Angular frontend with Mapbox and STOMP.',
    outcome: 'A university project covering the full journey of booking, simulated payment and communication between users.',
    decisions: [
      {
        title: 'One context per responsibility',
        text: 'IAM, carpooling and chat are modeled with DDD, each with its own services, domain and repositories.',
      },
      {
        title: 'Real-time coordination',
        text: 'STOMP over WebSocket carries the conversation between participants; Mapbox adds geographic context to trips.',
      },
      {
        title: 'Continuous delivery',
        text: 'CI/CD on Azure Pipelines with Docker and Kubernetes, and tests with JUnit, Mockito and Selenium under TDD.',
      },
    ],
    flow: ['Passenger', 'Booking', 'Driver', 'Chat', 'Trip'],
  },
  oxaira: {
    name: 'Oxaira',
    category: 'University · IoT',
    line: 'Make what we breathe visible.',
    summary:
      'AirQ, an air quality monitoring system: an ESP32 device, Spring Boot services, messaging and web and mobile apps.',
    problem:
      'Sensor data must reach an understandable interface and trigger alerts without coupling capture, analysis and notification.',
    solution:
      'An ESP32 with DHT11 and MQ135 sensors sends readings over HTTP. Separate Spring Boot services cover analytics and alerts, notifications and SMS through Twilio, with Angular and Flutter apps.',
    outcome: 'A system of independent services, from the board to the phone. Documented from the team’s repositories.',
    decisions: [
      {
        title: 'One service, one responsibility',
        text: 'Analytics, notifications and SMS are separate services, each with its own database.',
      },
      {
        title: 'An air quality domain',
        text: 'The analytics service models readings, alerts and insights as aggregates, with separate commands and queries.',
      },
      {
        title: 'Messaging to decouple',
        text: 'RabbitMQ carries alerts to notifications, and Kafka was explored for the event stream.',
      },
    ],
    flow: ['ESP32 sensor', 'Analytics', 'RabbitMQ', 'Notifications', 'SMS', 'App'],
  },
  'di-project': {
    name: 'Di Project & Di Mobile',
    category: 'University · Waste management',
    line: 'Recycling with data and maps.',
    summary:
      'A smart waste management platform: a web dashboard, a mobile app, authentication and an AI recycling assistant.',
    problem:
      'Managing waste collection requires knowing where waste piles up and how to get there.',
    solution:
      'I led development: an authentication API in Spring Boot with PostgreSQL and Redis, a Django service that connects to Gemini, a React web dashboard with heat maps and a React Native mobile app.',
    outcome: 'A university project led end to end, from backend to mobile app.',
    decisions: [
      {
        title: 'Geographic data first',
        text: 'Leaflet heat maps and routing rely on the geolocation of trucks and collection points.',
      },
      {
        title: 'Authentication with verification',
        text: 'JWT plus an emailed verification code, stored in Redis with an expiry.',
      },
      {
        title: 'An AI assistant',
        text: 'A Django service with DRF connects to Gemini to answer recycling questions.',
      },
    ],
    flow: ['User', 'Mobile app', 'GPS service', 'Web dashboard', 'Heat maps'],
  },
  'mediscan-ai': {
    name: 'MediScanAI',
    category: 'University · Machine Learning',
    line: 'Exploring AI applied to images.',
    summary:
      'A medical image analysis prototype with a microservice architecture and AI models. Not a clinical tool.',
    problem:
      'Integrating inference tasks of variable duration without blocking the rest of the system.',
    solution:
      'A Spring Cloud Gateway API Gateway routes to IAM, report, notification and administrative services. A FastAPI service with TensorFlow classifies, and an ML Service with MONAI explains and trains. React and Flutter frontends.',
    outcome: 'An engineering prototype with many services; it is not presented as a validated clinical tool.',
    decisions: [
      {
        title: 'A single entry point',
        text: 'The API Gateway concentrates access and delegates authentication to the IAM service.',
      },
      {
        title: 'One service per responsibility',
        text: 'IAM, reports, notifications and administration are Spring Boot services, each with its own database.',
      },
      {
        title: 'Slow work, kept apart',
        text: 'Inference and training run in separate Python services, and emails go out through RabbitMQ.',
      },
      {
        title: 'Explainable results',
        text: 'The ML Service adds explainability with Captum and an X-ray model built with MONAI.',
      },
    ],
    flow: ['Imaging study', 'API Gateway', 'AI Service', 'ML Service', 'Report', 'Notice'],
  },
  'movies-explorer': {
    name: 'Movies Explorer',
    category: 'University · Frontend',
    line: 'Find your next movie.',
    summary:
      'A movie explorer with search, filters and a persistent personal list.',
    problem:
      'Making a large catalog navigable without overloading the interface or repeating needless requests.',
    solution:
      'An Angular 19 app with Angular Material that queries TMDb directly, with debounced search, filters and a detail view with a trailer.',
    outcome: 'An academic project on consuming APIs and building a responsive browsing experience.',
    decisions: [
      {
        title: 'Controlled search',
        text: 'Debounce groups typing before querying, while filters narrow the catalog.',
      },
      {
        title: 'No backend of its own',
        text: 'The app runs in the browser: it calls TMDb and keeps favorites and the personal list in LocalStorage.',
      },
    ],
    flow: ['Search', 'TMDb', 'Catalog', 'Personal list'],
  },
};

export default projects;
