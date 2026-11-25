import { Link, Text } from 'react-email';
import { profile } from '@/data/profile';
import { dictionaries } from '@/i18n/dictionaries';
import { Button, Shell, Tag, ty } from './Shell';
import { c, font } from './tokens';

export interface CvEmailProps {
  lang: 'es' | 'en';
  fileName: string;
  assetBase?: string;
}

export default function CvEmail({ lang, fileName, assetBase }: CvEmailProps) {
  const t = dictionaries[lang].email.cv;
  // No personal address in the mail: the button goes to the contact form on the site.
  const contactUrl = `${profile.site}${lang === 'en' ? '/en' : ''}/#contact`;
  return (
    <Shell lang={lang} eyebrow={t.eyebrow} preview={t.preview} assetBase={assetBase}>
      <div className="rise rise-2">
        <Text className="h1 t-ink" style={ty.h1}>
          {t.title}
        </Text>
        <Text className="t-ink" style={ty.p}>
          {t.lead}
        </Text>
      </div>

      {/* Attachment chip: shows the file is there even if the client hides attachments */}
      <div className="rise rise-3 rule" style={{ margin: '4px 0 26px', padding: '13px 16px', border: `1px solid ${c.line}`, borderRadius: 3 }}>
        <table role="presentation" cellPadding={0} cellSpacing={0} style={{ borderCollapse: 'collapse' }}>
          <tbody>
            <tr>
              <td style={{ paddingRight: 12, verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                <Tag>PDF</Tag>
              </td>
              <td style={{ verticalAlign: 'middle' }}>
                <Text className="t-ink" style={{ margin: 0, fontFamily: font.mono, fontSize: 13, lineHeight: '18px', color: c.ink }}>
                  {fileName}
                </Text>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <Text className="t-ink" style={ty.p}>
        {t.talk}
      </Text>
      <div style={{ margin: '0 0 32px' }}>
        <Button href={contactUrl}>{t.cta}</Button>
      </div>

      <div className="rule" style={{ borderTop: `1px solid ${c.line}`, paddingTop: 20 }}>
        <Text className="t-ink" style={{ margin: 0, fontFamily: font.display, fontWeight: 700, fontSize: 17, lineHeight: '22px', letterSpacing: '-0.015em', color: c.ink }}>
          {t.sign}
        </Text>
        <Text className="t-soft" style={{ ...ty.soft, margin: '2px 0 10px' }}>
          {t.role}
        </Text>
        <Link href={profile.site} className="lnk t-ink" style={{ fontFamily: font.mono, fontSize: 12, color: c.ink, textDecoration: 'underline', textUnderlineOffset: 3 }}>
          {t.site}
        </Link>
      </div>
    </Shell>
  );
}

CvEmail.PreviewProps = { lang: 'es', fileName: 'Luis-Angel-Anampa-CV-ES.pdf', assetBase: '/static' } satisfies CvEmailProps;
