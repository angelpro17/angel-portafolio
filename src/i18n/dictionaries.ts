import es from './es';
import en from './en';

/**
 * `es` is the source of truth for the shape. If `en` is missing a namespace or a key,
 * or has the wrong type, TypeScript fails the build right here.
 */
type DeepMirror<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? readonly DeepMirror<U>[]
    : { [K in keyof T]: DeepMirror<T[K]> };

const _enParity: DeepMirror<typeof es> = en;
void _enParity;

export const dictionaries = { es, en } as const;
export type Language = keyof typeof dictionaries;
export type Namespace = keyof typeof es;
