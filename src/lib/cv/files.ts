// Bundled privately (src/private, not public/): the PDFs are only reachable through the server.
import es from '@/private/cv/Luis-Angel-Anampa-CV-ES.pdf?inline';
import en from '@/private/cv/Luis-Angel-Anampa-CV-EN.pdf?inline';

const decode = (dataUri: string) => Buffer.from(dataUri.slice(dataUri.indexOf(',') + 1), 'base64');
const cache: Partial<Record<'es' | 'en', Buffer>> = {};

export function cvFile(lang: 'es' | 'en'): Buffer {
  return (cache[lang] ??= decode(lang === 'es' ? es : en));
}
