# angelanampa.dev

Portafolio de Angel Anampa. Astro estático, TypeScript estricto, Tailwind v4 (tokens en `@theme`), sin backend.

- Concepto y sistema visual: [`DESIGN.md`](./DESIGN.md)
- Licencias de iconos y fuentes: [`THIRD_PARTY_LICENSES.md`](./THIRD_PARTY_LICENSES.md)

## Comandos

```bash
pnpm install
pnpm dev        # http://127.0.0.1:4321
pnpm build      # astro check + astro build (falla si falta una clave EN)
pnpm preview
```

## Dónde editar

| Qué | Dónde |
|---|---|
| Un proyecto (texto ES/EN) | `src/i18n/{es,en}/projects.ts` |
| Un proyecto (slug, imagen, stack, URL) | `src/data/projects.ts` |
| Trayectoria, archivo, herramientas | `src/data/{path,archive,tools}.ts` + `src/i18n/*` |
| Colores, fuentes, movimiento | `src/styles/global.css` (`@theme`) |
| Contacto, CV | `src/data/profile.ts`, `public/cv/` |

Una captura nueva: `.webp` en `src/assets/images/`, importarla en `src/data/projects.ts` y asignarla como `image`. Sin captura, la tarjeta muestra solo la capa Sistema.

## Decisiones

- Sin formulario ni API: correo copiable + `mailto`. No hay secretos ni variables de entorno.
- Idiomas: español en `/`, inglés en `/en`. `src/i18n/dictionaries.ts` rompe el build si falta una clave.
- Movimiento: CSS + View Transitions + un par de scripts propios. Respeta `prefers-reduced-motion`; sin JS todo el contenido es visible.

## CV lead gate

Every CV button opens a modal: email (required), reason and phone (optional, phone not validated) and a consent box.
The server emails a 6-digit code; after the visitor enters it, the CV PDF is **emailed** to that address and a
notification goes to `NOTIFY_TO`. The PDFs live in `src/private/cv/` (never in `public/`), so there is no direct URL.

- Routes: `src/pages/api/cv/request.ts` and `verify.ts` (the only on-demand routes; Vercel adapter).
- Stateless challenge (`src/lib/cv/challenge.ts`): signed token with the HMAC of the code, 10 min TTL.
- Limits (`limits.ts`): per IP, per email, 5 guesses per code, single use. Upstash Redis if configured, in-memory fallback otherwise.
- Env vars: see `.env.example`. Set them in Vercel. `RESEND_API_KEY` + `CV_FROM` (domain verified in Resend) are required in production; `OTP_SECRET` too.
- Dev without Resend key: no email is sent and the code is shown in the modal.
# angel-portafolio
# angel-portafolio
