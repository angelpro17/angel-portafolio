/** Business timezone for anything Angel reads (notifications, logs). */
const TZ = 'America/Lima';

export function formatLima(iso: string, locale = 'es-PE'): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat(locale, { dateStyle: 'full', timeStyle: 'short', timeZone: TZ }).format(d);
}
