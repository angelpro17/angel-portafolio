// Mail clients do not render SVG (Gmail, Outlook), so icons ship as hosted PNGs.
// Lucide for UI icons, the site's own brand marks for GitHub/LinkedIn. Run: pnpm email:icons
import { readFileSync, mkdirSync } from 'node:fs';
import sharp from 'sharp';

const OUT = 'public/email/icons';
mkdirSync(OUT, { recursive: true });

const lucide = (n) => readFileSync(`node_modules/lucide-static/icons/${n}.svg`, 'utf8');
const site = (n) => readFileSync(`src/icons/${n}.svg`, 'utf8');

// name -> [svg, tone]. Each icon is rendered only in the tone the templates use.
const icons = {
  'arrow-right': [lucide('arrow-right'), 'onEmber'],
  check: [lucide('check'), 'onEmber'],
  clock: [lucide('clock'), 'onEmber'],
  mail: [lucide('mail'), 'soft'],
  note: [lucide('tag'), 'soft'],
  message: [lucide('message-square-text'), 'soft'],
  user: [lucide('user'), 'soft'],
  phone: [lucide('phone'), 'soft'],
  languages: [lucide('languages'), 'soft'],
  calendar: [lucide('calendar'), 'soft'],
  globe: [lucide('globe'), 'soft'],
  github: [site('logo-github'), 'soft'],
  linkedin: [site('logo-linkedin'), 'soft'],
};

// tone -> [light-mode color, dark-mode color]
const tones = {
  onInk: ['#e2dedb', '#1d1d1b'], // sits on an ink button, which flips to parchment in dark mode
  soft: ['#857f78', '#857f78'], // one mid tone, readable on paper and on forced-dark backgrounds
  onEmber: ['#efece8', '#efece8'],
};

for (const [name, [svg, tone]] of Object.entries(icons)) {
  const [light, dark] = tones[tone];
  for (const [mode, color] of [['l', light], ['d', dark]]) {
    const colored = svg
      .replace(/currentColor/g, color)
      .replace(/<!--.*?-->/gs, '')
      .replace(/<svg(?![^>]*\swidth=)/, '<svg width="24" height="24"');
    await sharp(Buffer.from(colored), { density: 600 }).resize(72, 72).png({ compressionLevel: 9 }).toFile(`${OUT}/${name}-${mode}.png`);
  }
}
console.log('icons:', Object.keys(icons).length * 2);

// Logo badge. Gmail (iOS) force-inverts neutral colors in dark mode but never touches images, so the
// logo ships with its own dark backing: it reads the same in light, dark and forced-dark clients.
{
  const W = 360;
  const H = 88;
  const logo = readFileSync('public/brand/logo.svg', 'utf8').replace(/currentColor/g, '#e2dedb').replace('<svg ', '<svg width="530" height="72" ');
  const mark = await sharp(Buffer.from(logo), { density: 600 }).resize({ width: 252 }).png().toBuffer();
  const meta = await sharp(mark).metadata();
  const bg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><rect width="${W}" height="${H}" rx="14" fill="#1d1d1b"/></svg>`);
  await sharp(bg)
    .composite([{ input: mark, left: Math.round((W - meta.width) / 2), top: Math.round((H - meta.height) / 2) }])
    .png({ compressionLevel: 9 })
    .toFile('public/email/badge.png');
  console.log('badge ok');
}
