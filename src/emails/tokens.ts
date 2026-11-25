/**
 * Email design tokens. Same palette and type as the site. IBM Plex Sans and Bricolage Grotesque are loaded with @font-face (Apple Mail, iOS Mail
 * and Outlook for Mac honour it); Gmail and Outlook on Windows ignore web fonts and fall back to Helvetica/Arial.
 */
export const c = {
  parchment: '#e2dedb',
  paper: '#efece8',
  line: '#d4cec7',
  ink: '#1d1d1b',
  charcoal: '#5c5752',
  ember: '#c03f13',
} as const;

const sans = "'Helvetica Neue', Helvetica, Arial, sans-serif";
export const font = {
  display: `'Bricolage Grotesque', ${sans}`,
  text: `'IBM Plex Sans', ${sans}`,
  mono: "'JetBrains Mono', 'SFMono-Regular', Menlo, Consolas, 'Courier New', monospace",
} as const;

/** Images and fonts must be absolute URLs in real email. Preview passes '/static' to use the local copy. */
export const asset = (path: string, base: string) => `${base}${path}`;
