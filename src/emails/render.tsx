import type { ReactElement } from 'react';
import { render, toPlainText } from 'react-email';
import CodeEmail, { type CodeEmailProps } from './CodeEmail';
import CvEmail, { type CvEmailProps } from './CvEmail';
import LeadEmail, { type LeadEmailProps } from './LeadEmail';
import ContactEmail, { type ContactEmailProps } from './ContactEmail';
import ReceiptEmail, { type ReceiptEmailProps } from './ReceiptEmail';

/** HTML for the client plus a plain-text part (some clients and spam filters want it). */
async function both(node: ReactElement) {
  const html = await render(node);
  return { html, text: toPlainText(html) };
}

export const renderCode = (p: CodeEmailProps) => both(<CodeEmail {...p} />);
export const renderCv = (p: CvEmailProps) => both(<CvEmail {...p} />);
export const renderLead = (p: LeadEmailProps) => both(<LeadEmail {...p} />);
export const renderContact = (p: ContactEmailProps) => both(<ContactEmail {...p} />);
export const renderReceipt = (p: ReceiptEmailProps) => both(<ReceiptEmail {...p} />);
