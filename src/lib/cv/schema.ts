import { z } from 'zod';

export const langSchema = z.enum(['es', 'en']);

export const requestSchema = z.object({
  email: z.string().trim().toLowerCase().max(254).pipe(z.email()),
  reason: z.string().trim().max(500).optional().default(''),
  phone: z.string().trim().max(40).optional().default(''),
  lang: langSchema,
  consent: z.literal(true),
  /** Honeypot: humans never fill it. */
  website: z.string().max(0).optional().default(''),
});

export const verifySchema = z.object({
  token: z.string().min(20).max(4000),
  code: z.string().regex(/^\d{6}$/),
});

export type CvRequest = z.infer<typeof requestSchema>;
