import { Resend } from 'resend';
import { RESEND_API_KEY } from 'astro:env/server';

/** The one Resend client. Created on first use so a missing key never breaks module load. */
let instance: Resend | undefined;
export const resend = () => (instance ??= new Resend(RESEND_API_KEY));
