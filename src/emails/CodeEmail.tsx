import { Text } from 'react-email';
import { dictionaries } from '@/i18n/dictionaries';
import { bg, Shell, Tag, ty } from './Shell';
import { c, font } from './tokens';

export interface CodeEmailProps {
  lang: 'es' | 'en';
  code: string;
  assetBase?: string;
}

export default function CodeEmail({ lang, code, assetBase }: CodeEmailProps) {
  const t = dictionaries[lang].email.code;
  return (
    <Shell lang={lang} eyebrow={t.eyebrow} preview={t.preview.replace('{code}', code)} assetBase={assetBase}>
      <div className="rise rise-2">
        <Text className="h1 t-ink" style={ty.h1}>
          {t.title}
        </Text>
        <Text className="t-ink" style={ty.p}>
          {t.lead}
        </Text>
      </div>

      <div className="rise rise-3">
        <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} style={{ borderCollapse: 'separate', width: '100%', margin: '4px 0 24px' }}>
          <tbody>
            <tr>
              <td
                className="code code-box t-ink"
                align="center"
                {...bg('#e8e4df')}
                aria-label={`${t.codeLabel}: ${code.split('').join(' ')}`}
                style={{
                  padding: '20px 10px 18px',
                  backgroundColor: '#e8e4df',
                  border: `1px solid ${c.ink}`,
                  borderBottom: `3px solid ${c.ember}`,
                  borderRadius: 3,
                  color: c.ink,
                  fontFamily: font.mono,
                  fontSize: 34,
                  fontWeight: 700,
                  lineHeight: '40px',
                  letterSpacing: '0.26em',
                  textAlign: 'center',
                  WebkitUserSelect: 'all',
                  userSelect: 'all',
                }}
              >
                {code}
              </td>
            </tr>
          </tbody>
        </table>

      </div>

      <div style={{ margin: '0 0 28px' }}>
        <Tag icon="clock">{t.expires}</Tag>
      </div>

      <div className="rule" style={{ borderTop: `1px solid ${c.line}`, paddingTop: 18 }}>
        <Text className="t-soft" style={ty.soft}>
          {t.ignore}
        </Text>
      </div>
    </Shell>
  );
}

CodeEmail.PreviewProps = { lang: 'es', code: '482190', assetBase: '/static' } satisfies CodeEmailProps;
