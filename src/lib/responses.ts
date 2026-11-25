const json = (body: unknown, status: number, headers: HeadersInit = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store', ...headers },
  });

export const ok = (body: Record<string, unknown> = {}) => json({ ok: true, ...body }, 200);
/** `detail` is only attached in dev, to debug provider errors without exposing them in production. */
export const fail = (status: number, code: string, err?: unknown) =>
  json({ ok: false, code, ...(import.meta.env.DEV && err ? { detail: String(err) } : {}) }, status);

/** Astro's checkOrigin only covers form content types; JSON POSTs need this check. */
export const sameOrigin = (request: Request) => {
  const origin = request.headers.get('origin');
  return origin !== null && origin === new URL(request.url).origin;
};
