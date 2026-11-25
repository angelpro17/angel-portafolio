import { defaultLang } from './config';
import { dictionaries, type Language, type Namespace } from './dictionaries';
import type { CaseSlug } from '@/data/projects';

export type { Language };

/** Language from the pathname: "/en/…" → en, anything else → default. */
export function getLang(url: URL): Language {
  const [, segment] = url.pathname.split('/');
  return segment === 'en' ? 'en' : defaultLang;
}

export function useTranslations<N extends Namespace>(lang: Language, ns: N): (typeof dictionaries)[Language][N] {
  return dictionaries[lang][ns];
}

export const homePath = (lang: Language) => (lang === defaultLang ? '/' : `/${lang}`);
export const workPath = (slug: CaseSlug, lang: Language) =>
  lang === defaultLang ? `/trabajo/${slug}` : `/${lang}/work/${slug}`;
/** Section anchors are language-neutral so the same id works in both languages. */
export const sectionPath = (lang: Language, id: 'work' | 'path' | 'contact') =>
  `${homePath(lang)}#${id}`;

export function alternatesFor(build: (lang: Language) => string): Record<Language, string> {
  return { es: build('es'), en: build('en') };
}
