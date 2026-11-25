import type { CaseSlug } from '@/data/projects';
import type { ProjectText } from '../schema';

const projects: Record<CaseSlug, ProjectText> = {
  'sonqo-peru': {
    name: 'Sonqo Perú',
    category: 'Cliente · ONG',
    line: 'Donaciones reales, infraestructura en cero.',
    summary:
      'Migré el sitio de una ONG peruana de WordPress a Astro. Costo de infraestructura y de operación en cero, con donaciones únicas y mensuales en producción.',
    problem:
      'El sitio vivía en WordPress, con costos de infraestructura y de operación. Había que reducirlos a cero sin perder la capacidad de recibir donaciones ni de editar el contenido.',
    solution:
      'Rediseñé el sitio en Astro con un backend serverless y conecté las donaciones únicas y mensuales con Mercado Pago (Checkout API y Bricks). El contenido se edita desde Sanity.',
    outcome: 'En producción, procesando pagos reales, con costo de infraestructura y operación en cero.',
    decisions: [
      {
        title: 'Un pago es real cuando el proveedor lo confirma',
        text: 'Los webhooks se verifican con firma HMAC y el estado del pago se consulta a la API de Mercado Pago, sin confiar en lo que llega desde el navegador.',
      },
      {
        title: 'Una sola validación',
        text: 'Los mismos esquemas Zod validan en el cliente y en el servidor, y Upstash Redis limita las solicitudes por visitante.',
      },
      {
        title: 'Contenido sin programadores',
        text: 'Sanity permite al equipo editar cifras, imágenes y textos sin tocar los flujos de pago.',
      },
      {
        title: 'Desplegado en Google Cloud',
        text: 'Cloud Build construye la imagen, Artifact Registry la guarda y Cloud Run la sirve; los secretos viven en Secret Manager.',
      },
    ],
    flow: ['Donante', 'Astro', 'Mercado Pago', 'Webhook verificado', 'Resend'],
  },
  brainstorming: {
    name: 'Brainstorming',
    category: 'Cliente · Consultora de crecimiento comercial',
    line: 'Tres sitios sobre una misma base.',
    summary:
      'Web, blog y sitio para clientes de EE. UU. de una consultora de crecimiento comercial, migrados de WordPress a Astro con backend serverless.',
    problem:
      'Una consultora con tres sitios necesitaba una base mantenible, bilingüe y protegida contra spam, sin depender de WordPress.',
    solution:
      'Migré los sitios a Astro con diseño a medida. El backend serverless usa PostgreSQL, caché en Upstash Redis y correos transaccionales con Resend y React Email. El contenido se gestiona con un CMS a medida que también construí.',
    outcome: 'Tres sitios sobre una misma base técnica, con contenido editable desde el CMS propio.',
    decisions: [
      {
        title: 'Formularios protegidos',
        text: 'Cloudflare Turnstile protege cada punto de contacto; Resend envía la notificación interna y la confirmación al visitante.',
      },
      {
        title: 'Errores con contexto',
        text: 'Sentry registra errores y logs con su contexto, mientras los mensajes que ve el usuario se mantienen genéricos.',
      },
      {
        title: 'Visible para buscadores y para el negocio',
        text: 'SEO técnico con robots.txt y sitemap.xml, Google Analytics y Tag Manager, e internacionalización español e inglés.',
      },
    ],
    flow: ['Visitante', 'Astro', 'Turnstile', 'API serverless', 'PostgreSQL', 'Resend'],
  },
  'brainstorming-cms': {
    name: 'CMS de Brainstorming',
    category: 'Cliente · Producto a medida',
    line: 'Un editor para no depender de un desarrollador.',
    summary:
      'CMS editorial a medida: una API en Hono sobre Cloudflare Workers y un administrador en Angular, con edición por bloques, autoguardado, historial y vista previa.',
    problem:
      'El equipo editorial necesitaba publicar guías y artículos en varios sitios sin pedir cambios de código, y con control sobre quién puede editar qué.',
    solution:
      'Construí dos repositorios independientes: una API en Hono sobre Cloudflare Workers (Drizzle, PostgreSQL y contrato OpenAPI) y un administrador en Angular con editor de texto enriquecido y por bloques.',
    outcome: 'Un CMS propio con historial, biblioteca de archivos y estado de publicación por sitio.',
    decisions: [
      {
        title: 'El contrato manda',
        text: 'Las rutas se definen con esquemas Zod que validan las entradas y generan OpenAPI 3.1. Angular importa una copia versionada del contrato y genera sus tipos a partir de ella.',
      },
      {
        title: 'Autoguardado sin perder cambios',
        text: 'Guarda tras 1,2 segundos de pausa. Ante un conflicto o un error detiene los reintentos y conserva los cambios locales.',
      },
      {
        title: 'Restaurar sin publicar',
        text: 'El historial permite restaurar una versión como borrador; lo publicado no cambia hasta publicar de nuevo.',
      },
      {
        title: 'Acceso por invitación',
        text: 'Un administrador único y editores con permisos. Al navegador solo llega la clave pública de Supabase.',
      },
    ],
    flow: ['Editor', 'Admin Angular', 'API Hono', 'PostgreSQL', 'Publicación por sitio'],
  },
  facturacion: {
    name: 'Efectiback',
    category: 'Producto propio · SaaS de facturación',
    line: 'Facturación electrónica que no se cae, con clientes reales.',
    summary:
      'SaaS de facturación electrónica para Perú: emite factura, boleta y notas directo a SUNAT, con API REST, portal para clientes y panel de operador.',
    problem:
      'Las MYPEs necesitan emitir comprobantes válidos ante SUNAT sin depender de una contadora ni de un portal lento, y los sistemas que ya usan (POS, ERP, tienda online) deben poder integrarse por API.',
    solution:
      'Construí la plataforma de punta a punta: una librería Java con UBL 2.1, firma XAdES y cliente SOAP; una API en Spring Boot con arquitectura hexagonal; un portal y un backoffice en Angular; y la landing en Astro.',
    outcome:
      'En uso por clientes reales. Más de 350 pruebas automatizadas en el backend y emisión verificada contra el ambiente beta de SUNAT, con CDR aceptado.',
    decisions: [
      {
        title: 'La cola vive en Postgres',
        text: 'El envío a SUNAT usa una tabla de cola con FOR UPDATE SKIP LOCKED y reintentos con espera creciente: sin RabbitMQ ni infraestructura extra.',
      },
      {
        title: 'Un validador por tipo de comprobante',
        text: 'Factura, boleta y notas validan con sus propias reglas, extraídas del Excel oficial de SUNAT. Un error se rechaza con HTTP 422 antes de encolar.',
      },
      {
        title: 'Monolito modular, no microservicios',
        text: 'Un solo despliegue con contextos acotados (emisión, identidad, suscripciones). El motor es una librería sin Spring, que se prueba por separado.',
      },
      {
        title: 'Secretos cifrados',
        text: 'Los certificados digitales y la Clave SOL de cada empresa se guardan cifrados con una clave maestra, y la sesión usa una cookie HttpOnly.',
      },
      {
        title: 'Costo operativo mínimo',
        text: 'Backend en Cloud Run, base en Supabase, archivos en Cloudflare R2 y frontends en Cloudflare Pages.',
      },
    ],
    flow: ['Portal o ERP', 'API REST', 'Cola en Postgres', 'Firma XAdES', 'SUNAT', 'CDR en R2'],
  },
  ferreteria: {
    name: 'Ferretería: inventario y ventas',
    category: 'Cliente · Aplicación de escritorio',
    line: 'Un sistema que no depende de servicios externos.',
    summary:
      'Inventario y ventas para una ferretería, desplegado de forma local, con API REST en Java 17 y Spring Boot, SQL Server e interfaz en Angular.',
    problem: 'El negocio necesitaba controlar su stock y sus ventas sin depender de servicios externos.',
    solution:
      'Una API REST en Spring Boot sobre SQL Server con esquemas normalizados y una interfaz SPA en Angular, desplegadas localmente.',
    outcome: 'Un sistema local de inventario y ventas, sin dependencia de servicios externos.',
    decisions: [
      {
        title: 'Stock en tiempo real',
        text: 'Cada entrada y salida actualiza el stock al instante, y los reportes de movimientos explican de dónde sale cada cifra.',
      },
      {
        title: 'Acceso por rol',
        text: 'Check-in y check-out con autenticación JWT y control de acceso basado en roles (RBAC).',
      },
      {
        title: 'Datos ordenados',
        text: 'Esquemas normalizados en SQL Server mantienen coherentes los productos, los movimientos y los usuarios.',
      },
    ],
    flow: ['Caja', 'Angular', 'API REST Spring Boot', 'SQL Server'],
  },
  signperu: {
    name: 'Signperu',
    category: 'Producto propio · Firma electrónica',
    line: 'Firmas con evidencia y un PDF final que se prueba solo.',
    summary:
      'Firma electrónica de documentos PDF: el emisor arma un sobre, los firmantes firman desde un enlace con código por correo, y el PDF final se sella y se puede verificar públicamente.',
    problem:
      'Un contrato enviado por mensaje deja a cada parte esperando a ciegas, sin versiones ni un cierre claro, y nada impide que el archivo cambie después de firmado.',
    solution:
      'Construí un monolito modular (Spring Boot 4, Java 21, DDD hexagonal) con un frontend Angular 22. Los firmantes entran sin cuenta con un enlace y un código por correo; al completar, el sistema estampa las firmas, añade una página de evidencia y sella el PDF con PAdES y un sello de tiempo.',
    outcome: 'Producto propio de acceso privado, con el ciclo completo: sobre, firma, sellado y verificación pública.',
    decisions: [
      {
        title: 'Evidencia, no solo una imagen',
        text: 'Cada firma guarda correo verificado, IP, navegador, hora, hash del PDF y la versión del consentimiento aceptado. La bitácora se encadena con hashes: alterar un registro rompe la cadena.',
      },
      {
        title: 'El PDF final se prueba solo',
        text: 'Se sella con PAdES B-T: firma con certificado propio más un sello de tiempo RFC 3161 de una autoridad externa, con una de respaldo. Sin sello, el sobre sigue en SELLANDO y se reintenta.',
      },
      {
        title: 'El enlace no basta',
        text: 'El token viaja en el fragmento de la URL, en la base solo queda su hash y hay que ingresar un código de 6 dígitos, con 5 intentos como máximo.',
      },
      {
        title: 'Eventos con outbox',
        text: 'Cada cambio de estado escribe sus eventos en una tabla outbox dentro de la misma transacción. Las tareas de fondo usan FOR UPDATE SKIP LOCKED y también se pueden disparar desde Cloud Scheduler.',
      },
      {
        title: 'Monolito, a propósito',
        text: 'Sin microservicios, Kafka ni Redis: costo sin beneficio a este volumen. Los contextos (sobres, documentos, identidad, notificaciones, auditoría) se hablan por fachadas y eventos.',
      },
      {
        title: 'Pensado para Cloud Run',
        text: 'Imagen Docker sin root, PDFs en un bucket privado, clave del sello en Secret Manager y Cloud Scheduler disparando las tareas de fondo.',
      },
    ],
    flow: ['Emisor sube el PDF', 'Sobre y campos', 'Enlace y código', 'Firma con evidencia', 'Sellado PAdES', 'Verificación pública'],
  },
  firstcommit: {
    name: 'FirstCommit',
    category: 'Producto propio · IA aplicada',
    line: 'El primer empleo empieza con un buen commit.',
    summary:
      'Un SaaS de empleabilidad que conecta CV con IA, perfiles de GitHub y matching de vacantes para desarrolladores junior.',
    problem:
      'Conseguir el primer empleo tech implica traducir proyectos y habilidades a un perfil que conecte con oportunidades relevantes.',
    solution:
      'Diseñé tres macroservicios: una Core API en Go, un AI Engine en Python y un scraper en Python que corre como job. Generan el CV, analizan GitHub y buscan vacantes por significado.',
    outcome: 'Un producto que reúne la preparación del perfil y el descubrimiento de oportunidades. Sin demo pública por ahora.',
    decisions: [
      {
        title: 'Tres macroservicios, dos lenguajes',
        text: 'Go donde importa la latencia (auth, feed, pagos) y Python donde vive el ecosistema de IA y scraping. Arquitectura hexagonal en el backend.',
      },
      {
        title: 'Una sola cola entre Go y Python',
        text: 'La Core API nunca llama al AI Engine de forma directa: encola en Cloud Tasks. Así una generación de 60 s no bloquea a la API.',
      },
      {
        title: 'Vectores dentro de la base',
        text: 'pgvector en Supabase relaciona el perfil con las vacantes por significado, sin un servicio de vectores aparte.',
      },
      {
        title: 'Costo fijo cercano a cero',
        text: 'Cloud Run, Supabase, Cloudflare Pages y R2 mantienen el presupuesto total por debajo de US$65 al mes, con el LLM incluido.',
      },
      {
        title: 'Secretos y permisos mínimos',
        text: 'Secret Manager monta los secretos en Cloud Run, y cada servicio tiene su propia cuenta de servicio con permisos mínimos.',
      },
    ],
    flow: ['Perfil', 'Core API · Go', 'Cola de tareas', 'AI Engine · Python', 'LLM y pgvector', 'CV y vacantes'],
  },
  'carnet-upc': {
    name: 'Carnet UPC',
    category: 'Producto propio · Visión artificial',
    line: 'Una foto, lista para el siguiente paso.',
    summary:
      'Procesamiento de fotografías para carné universitario con detección facial y ajuste automático.',
    problem:
      'Adaptar a mano una fotografía a las dimensiones, el fondo y el peso que exige un carné es repetitivo.',
    solution:
      'Un pipeline de visión artificial en FastAPI: MediaPipe detecta el rostro, rembg quita el fondo y OpenCV y Pillow ajustan la imagen a 240 × 288 píxeles. La interfaz está en Next.js.',
    outcome: 'Automatiza la preparación de fotos para carné. Sin demo pública por ahora.',
    decisions: [
      {
        title: 'Procesamiento especializado',
        text: 'MediaPipe encuadra el rostro, rembg (ONNX) separa la figura y OpenCV y Pillow ajustan tamaño, DPI y peso.',
      },
      {
        title: 'Validar desde el inicio',
        text: 'La interfaz en TypeScript valida la entrada antes de enviarla al backend desacoplado.',
      },
    ],
    flow: ['Foto', 'Detección', 'Segmentación', 'Ajuste', 'Descarga'],
  },
  'media-ai': {
    name: 'Media AI Processor',
    category: 'Producto propio · Documentos y multimedia',
    line: 'Herramientas para trabajar con documentos.',
    summary:
      'Una aplicación para trabajar con documentos y multimedia con IA: transcribir, traducir, resumir, limpiar audio y hacer OCR.',
    problem:
      'Manipular documentos y multimedia exige conectar operaciones especializadas con controles que se entiendan.',
    solution:
      'Una interfaz React que llama a una API FastAPI con un router por módulo: audio, transcripción, traducción, OCR, resumen y documentos. Los modelos corren en el propio servicio y cada trabajo se sigue por estado.',
    outcome: 'Un recorrido claro de entrada, procesamiento y descarga, con modelos abiertos que no dependen de APIs de pago.',
    decisions: [
      {
        title: 'Un módulo por capacidad',
        text: 'Cada operación tiene su router y su servicio dentro de la API, así se agregan sin tocar las demás.',
      },
      {
        title: 'Trabajos con estado',
        text: 'Los procesos largos se consultan por id y se descargan al terminar; Supabase guarda su estado.',
      },
      {
        title: 'Modelos abiertos',
        text: 'Whisper, MarianMT, BART y EasyOCR, ejecutados sin conexión a servicios de pago.',
      },
    ],
    flow: ['Archivo', 'Interfaz', 'API', 'Módulo', 'Trabajo', 'Descarga'],
  },
  gouni: {
    name: 'GoUni',
    category: 'Universidad · Movilidad',
    line: 'Compartir ruta. Conectar personas.',
    summary:
      'Plataforma de carpooling universitario: viajes, reservas, mapas y chat en tiempo real.',
    problem:
      'La movilidad universitaria en Lima necesita coordinar trayectos, confianza y comunicación entre conductores y pasajeros.',
    solution:
      'Un backend Spring Boot con DDD y JWT organizado por contextos (IAM, carpooling y chat), un servicio de chat con WebSocket y un frontend Angular con Mapbox y STOMP.',
    outcome: 'Proyecto universitario con el recorrido completo de reserva, pago simulado y comunicación entre usuarios.',
    decisions: [
      {
        title: 'Un contexto por responsabilidad',
        text: 'IAM, carpooling y chat se modelan con DDD, cada uno con sus servicios, dominio y repositorios.',
      },
      {
        title: 'Coordinación en tiempo real',
        text: 'STOMP sobre WebSocket sostiene la conversación entre participantes; Mapbox da contexto geográfico a los trayectos.',
      },
      {
        title: 'Entrega continua',
        text: 'CI/CD en Azure Pipelines con Docker y Kubernetes, y pruebas con JUnit, Mockito y Selenium bajo TDD.',
      },
    ],
    flow: ['Pasajero', 'Reserva', 'Conductor', 'Chat', 'Viaje'],
  },
  oxaira: {
    name: 'Oxaira',
    category: 'Universidad · IoT',
    line: 'Hacer visible lo que respiramos.',
    summary:
      'AirQ, un sistema de monitoreo de calidad del aire: un dispositivo con ESP32, servicios en Spring Boot, mensajería y apps web y móvil.',
    problem:
      'Los datos de los sensores deben llegar a una interfaz comprensible y disparar alertas sin acoplar la captura, el análisis y el aviso.',
    solution:
      'Un dispositivo ESP32 con sensores DHT11 y MQ135 envía lecturas por HTTP. Servicios Spring Boot separados cubren la analítica y las alertas, las notificaciones y los SMS con Twilio, con apps en Angular y Flutter.',
    outcome: 'Un sistema de servicios independientes, de la placa al teléfono. Documentado a partir de los repositorios del equipo.',
    decisions: [
      {
        title: 'Un servicio, una responsabilidad',
        text: 'Analítica, notificaciones y SMS son servicios aparte, cada uno con su propia base de datos.',
      },
      {
        title: 'Dominio de calidad del aire',
        text: 'El servicio de analítica modela lecturas, alertas e insights como agregados, con comandos y consultas separados.',
      },
      {
        title: 'Mensajería para desacoplar',
        text: 'RabbitMQ lleva las alertas hacia notificaciones, y Kafka se exploró para el flujo de eventos.',
      },
    ],
    flow: ['Sensor ESP32', 'Analítica', 'RabbitMQ', 'Notificaciones', 'SMS', 'App'],
  },
  'di-project': {
    name: 'Di Project & Di Mobile',
    category: 'Universidad · Gestión de residuos',
    line: 'Reciclar con datos y con mapas.',
    summary:
      'Plataforma de gestión inteligente de residuos: panel web, app móvil, autenticación y un asistente de reciclaje con IA.',
    problem:
      'Gestionar la recolección de residuos exige saber dónde se acumulan y cómo llegar hasta ellos.',
    solution:
      'Lideré el desarrollo: una API de autenticación en Spring Boot con PostgreSQL y Redis, un servicio en Django que conecta con Gemini, un panel web en React con mapas de calor y una app móvil en React Native.',
    outcome: 'Proyecto universitario liderado de punta a punta, del backend a la app móvil.',
    decisions: [
      {
        title: 'Datos geográficos primero',
        text: 'Los mapas de calor con Leaflet y el ruteo se apoyan en la geolocalización de los camiones y los puntos de recolección.',
      },
      {
        title: 'Autenticación con verificación',
        text: 'JWT y un código de verificación por correo, guardado en Redis con vencimiento.',
      },
      {
        title: 'Un asistente con IA',
        text: 'Un servicio en Django con DRF conecta con Gemini para resolver dudas de reciclaje.',
      },
    ],
    flow: ['Usuario', 'App móvil', 'Servicio GPS', 'Panel web', 'Mapas de calor'],
  },
  'mediscan-ai': {
    name: 'MediScanAI',
    category: 'Universidad · Machine Learning',
    line: 'Explorar IA aplicada a imágenes.',
    summary:
      'Prototipo de análisis de imágenes médicas con arquitectura de microservicios y modelos de IA. No es una herramienta clínica.',
    problem:
      'Integrar tareas de inferencia de duración variable sin bloquear el resto del sistema.',
    solution:
      'Un API Gateway en Spring Cloud Gateway enruta a servicios de IAM, reportes, notificaciones y administración. Un servicio en FastAPI con TensorFlow clasifica y un ML Service con MONAI explica y entrena. Frontends en React y Flutter.',
    outcome: 'Prototipo de ingeniería con muchos servicios; no se presenta como herramienta clínica validada.',
    decisions: [
      {
        title: 'Un solo punto de entrada',
        text: 'El API Gateway concentra el acceso y delega la autenticación en el servicio IAM.',
      },
      {
        title: 'Un servicio por responsabilidad',
        text: 'IAM, reportes, notificaciones y administración son servicios Spring Boot, cada uno con su base de datos.',
      },
      {
        title: 'Lo lento, aparte',
        text: 'La inferencia y el entrenamiento corren en servicios de Python separados, y los correos salen por RabbitMQ.',
      },
      {
        title: 'Resultados explicables',
        text: 'El ML Service incorpora explicabilidad con Captum y un modelo de rayos X con MONAI.',
      },
    ],
    flow: ['Estudio de imagen', 'API Gateway', 'AI Service', 'ML Service', 'Reporte', 'Aviso'],
  },
  'movies-explorer': {
    name: 'Movies Explorer',
    category: 'Universidad · Frontend',
    line: 'Encontrar tu próxima película.',
    summary:
      'Explorador de cine con búsqueda, filtros y una lista personal persistente.',
    problem:
      'Hacer navegable un catálogo extenso sin saturar la interfaz ni repetir solicitudes innecesarias.',
    solution:
      'Una aplicación Angular 19 con Angular Material que consulta TMDb directamente, con búsqueda con debounce, filtros y un detalle con tráiler.',
    outcome: 'Proyecto académico de consumo de APIs y experiencia de exploración responsive.',
    decisions: [
      {
        title: 'Búsqueda controlada',
        text: 'El debounce agrupa la escritura antes de consultar, mientras los filtros acotan el catálogo.',
      },
      {
        title: 'Sin backend propio',
        text: 'La aplicación corre en el navegador: llama a TMDb y guarda favoritos y lista personal en LocalStorage.',
      },
    ],
    flow: ['Búsqueda', 'TMDb', 'Catálogo', 'Lista personal'],
  },
};

export default projects;
