import { createContext, Fragment, useContext, type CSSProperties, type ReactNode } from 'react';
import { Body, Head, Html, Link, Preview, Text } from 'react-email';
import { profile } from '@/data/profile';
import { dictionaries } from '@/i18n/dictionaries';
import { asset, c, font } from './tokens';

type Lang = 'es' | 'en';

const AssetBase = createContext<string>(profile.site);

/**
 * Hosted PNG icon (mail clients drop SVG). `dual` adds a second file that only shows in dark mode,
 * for icons whose color must flip. Files come from tools/email-icons.mjs.
 */
export function Icon({ name, size = 16, dual = false, style }: { name: string; size?: number; dual?: boolean; style?: CSSProperties }) {
  const base = useContext(AssetBase);
  const common = { width: size, height: size, alt: '' } as const;
  const look: CSSProperties = { display: 'inline-block', border: 0, verticalAlign: '-0.18em', ...style };
  return (
    <>
      <img className={dual ? 'ic-l swap' : 'ic-l'} src={asset(`/email/icons/${name}-l.png`, base)} {...common} style={look} />
      {dual && <img className="ic-d" src={asset(`/email/icons/${name}-d.png`, base)} {...common} style={{ ...look, display: 'none' }} />}
    </>
  );
}

/*
 * Layout rules, learned from real devices (Gmail iOS dark mode painted only parts of the card):
 * - every table and cell that has a background states it twice, as the bgcolor attribute and as CSS,
 *   so forced-dark clients repaint the card as one surface instead of cell by cell;
 * - the masthead is a dark band with a light logo in BOTH modes, so the logo can never vanish;
 * - one fluid column, no side-by-side blocks, so nothing is squeezed on a phone.
 *
 * Motion: mail clients run no JS and only some honour CSS animation (Apple Mail, iOS Mail). Gmail and
 * Outlook show the final state, so it is progressive enhancement. One curve, 600 ms, 80 ms stagger.
 */
const css = (base: string) => `
  @font-face { font-family: 'IBM Plex Sans'; font-weight: 400; font-style: normal; src: url('${asset('/email/fonts/IBMPlexSans-Regular.woff2', base)}') format('woff2'); }
  @font-face { font-family: 'IBM Plex Sans'; font-weight: 700; font-style: normal; src: url('${asset('/email/fonts/IBMPlexSans-Bold.woff2', base)}') format('woff2'); }
  @font-face { font-family: 'Bricolage Grotesque'; font-weight: 200 800; font-style: normal; src: url('${asset('/email/fonts/BricolageGrotesque.woff2', base)}') format('woff2'); }
  :root { color-scheme: light dark; supported-color-schemes: light dark; }
  .ic-d { display: none; max-height: 0; overflow: hidden; }
  a { text-decoration-thickness: 1px; }
  @keyframes rise { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  @media (prefers-reduced-motion: no-preference) {
    .rise { animation: rise 600ms cubic-bezier(0.22, 1, 0.36, 1) both; }
    .rise-2 { animation-delay: 80ms; }
    .rise-3 { animation-delay: 160ms; }
    .lnk { transition: color 150ms cubic-bezier(0.22, 1, 0.36, 1); }
    .lnk:hover { color: ${c.ember} !important; }
  }
  @media (max-width: 480px) {
    .px { padding-left: 22px !important; padding-right: 22px !important; }
    .h1 { font-size: 25px !important; line-height: 30px !important; }
    .code { font-size: 28px !important; letter-spacing: 0.2em !important; }
    .full { display: block !important; width: 100% !important; box-sizing: border-box; text-align: center !important; }
  }
  @media (prefers-color-scheme: dark) {
    .bg-page { background-color: #121211 !important; }
    .bg-card { background-color: #1d1d1b !important; border-color: #34322f !important; }
    .t-ink { color: #e2dedb !important; }
    .t-soft { color: #aaa49d !important; }
    .rule { border-color: #34322f !important; }
    .code-box { background-color: #262523 !important; border-color: #e2dedb !important; }
    .ic-l.swap { display: none !important; }
    .ic-d { display: inline-block !important; max-height: none !important; overflow: visible !important; }
  }
`;

interface Props {
  lang?: Lang;
  preview: string;
  eyebrow: string;
  /** Base URL for images and fonts. Production: the site. Preview: '/static'. */
  assetBase?: string;
  children: ReactNode;
}

/** The legacy bgcolor attribute is what forced-dark clients read; React's td types omit it, so it is spread. */
export const bg = (color: string): Record<string, string> => ({ bgcolor: color });

const table = { borderCollapse: 'collapse', width: '100%' } as const;

export function Shell({ lang = 'es', preview, eyebrow, assetBase = profile.site, children }: Props) {
  const t = dictionaries[lang].email;
  return (
    <AssetBase.Provider value={assetBase}>
      <Html lang={lang} dir="ltr">
        <Head>
          <meta name="color-scheme" content="light dark" />
          <meta name="supported-color-schemes" content="light dark" />
          <style>{css(assetBase)}</style>
        </Head>
        <Preview>{preview}</Preview>
        <Body className="bg-page" style={{ margin: 0, padding: 0, backgroundColor: c.parchment, fontFamily: font.text }}>
          <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} bgcolor={c.parchment} className="bg-page" style={{ ...table, backgroundColor: c.parchment }}>
            <tbody>
              <tr>
                <td align="center" {...bg(c.parchment)} className="bg-page" style={{ padding: '28px 12px', backgroundColor: c.parchment }}>
                  <table
                    role="presentation"
                    width="100%"
                    cellPadding={0}
                    cellSpacing={0}
                    bgcolor={c.paper}
                    className="bg-card"
                    style={{ maxWidth: 600, backgroundColor: c.paper, border: `1px solid ${c.line}`, borderRadius: 11, borderCollapse: 'separate', overflow: 'hidden' }}
                  >
                    <tbody>
                      {/* Masthead: the logo on its own dark badge (an image, so forced-dark clients cannot invert it) */}
                      <tr>
                        <td className="bg-card px" {...bg(c.paper)} style={{ padding: '28px 28px 0', backgroundColor: c.paper }}>
                          <img src={asset('/email/badge.png', assetBase)} width={180} height={44} alt="Angel Anampa" style={{ display: 'block', border: 0, width: 180, height: 44 }} />
                        </td>
                      </tr>

                      {/* Content */}
                      <tr>
                        <td className="bg-card px" {...bg(c.paper)} style={{ padding: '30px 28px 30px', backgroundColor: c.paper }}>
                          <Text
                            className="rise t-soft"
                            style={{ margin: '0 0 16px', fontFamily: font.mono, fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: c.charcoal }}
                          >
                            <span style={{ color: c.ember }}>■</span>&nbsp;&nbsp;{eyebrow}
                          </Text>
                          {children}
                        </td>
                      </tr>

                      {/* Footer: socials */}
                      <tr>
                        <td align="center" className="bg-card rule px" {...bg(c.paper)} style={{ padding: '22px 28px 26px', backgroundColor: c.paper, borderTop: `1px solid ${c.line}`, textAlign: 'center' }}>
                          {[
                            ['github', 'GitHub', profile.github],
                            ['linkedin', 'LinkedIn', profile.linkedin],
                            ['globe', profile.site.replace('https://', ''), profile.site],
                          ].map(([icon, label, href]) => (
                            <Fragment key={href}>
                            <Link
                              href={href}
                              className="lnk t-soft"
                              style={{ display: 'inline-block', margin: '0 9px 6px', fontFamily: font.mono, fontSize: 12, color: c.charcoal, textDecoration: 'underline', textUnderlineOffset: 3 }}
                            >
                              <Icon name={icon} size={14} style={{ marginRight: 7, verticalAlign: '-2px' }} />
                              {label}
                            </Link>
                            {'\n'}
                            </Fragment>
                          ))}
                          <Text className="t-soft" style={{ margin: '8px 0 0', fontFamily: font.mono, fontSize: 11, lineHeight: '16px', color: c.charcoal }}>
                            © 2026 {t.rights}
                          </Text>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </Body>
      </Html>
    </AssetBase.Provider>
  );
}

/** Shared text styles so each template stays short. */
export const ty = {
  h1: { margin: '0 0 12px', fontFamily: font.display, fontWeight: 700, fontSize: 28, lineHeight: '33px', letterSpacing: '-0.025em', color: c.ink },
  p: { margin: '0 0 20px', fontFamily: font.text, fontSize: 16, lineHeight: '25px', color: c.ink },
  soft: { margin: '0', fontFamily: font.text, fontSize: 13, lineHeight: '20px', color: c.charcoal },
};

export function Tag({ children, icon }: { children: ReactNode; icon?: string }) {
  return (
    <span
      style={{ display: 'inline-block', padding: '4px 9px 3px', borderRadius: 3, backgroundColor: c.ember, color: '#efece8', fontFamily: font.mono, fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', lineHeight: '16px', whiteSpace: 'nowrap' }}
    >
      {icon && <Icon name={icon} size={12} style={{ marginRight: 5, verticalAlign: '-2px' }} />}
      {children}
    </span>
  );
}

export function Button({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="full"
      style={{ display: 'inline-block', padding: '14px 24px', borderRadius: 3, backgroundColor: c.ember, color: '#efece8', fontFamily: font.display, fontWeight: 700, fontSize: 14, letterSpacing: '-0.01em', textDecoration: 'none', textAlign: 'center' }}
    >
      {children}
      <Icon name="arrow-right" size={16} style={{ marginLeft: 10, verticalAlign: '-3px' }} />
    </Link>
  );
}
