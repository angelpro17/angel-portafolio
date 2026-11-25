import { z } from 'zod';
import { langSchema } from '@/lib/cv/schema';

/** One line, no control characters: the name ends up in a subject line. */
const oneLine = /^[^\r\n\t]+$/;

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(80).regex(oneLine),
  email: z.string().trim().toLowerCase().max(254).pipe(z.email()),
  topic: z.string().trim().max(80).optional().default(''),
  message: z.string().trim().min(10).max(2000),
  lang: langSchema,
  consent: z.literal(true),
  /** Honeypot: humans never fill it. */
  website: z.string().max(0).optional().default(''),
  /** Milliseconds the dialog was open before sending. Real people need a few seconds to write. */
  elapsed: z.number().int().min(0).max(86_400_000).optional().default(0),
});

export type ContactMessage = z.infer<typeof contactSchema>;
/** Below this the form was filled faster than a person can write: treated as a bot. */
export const MIN_FILL_MS = 2500;
