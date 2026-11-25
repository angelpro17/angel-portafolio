import { Link, Text } from 'react-email';
import { profile } from '@/data/profile';
import { dictionaries } from '@/i18n/dictionaries';
import { Shell, ty } from './Shell';
import { c, font } from './tokens';

export interface ReceiptEmailProps {
  name: string;
  message: string;
  lang: 'es' | 'en';
  assetBase?: string;
}

/** To the visitor: proof that the message arrived, with a copy of what they wrote. */
export default function ReceiptEmail({ name, message, lang, assetBase }: ReceiptEmailProps) {
  const t = dictionaries[lang].email.receipt;
  return (
    <Shell lang={lang} eyebrow={t.eyebrow} preview={t.preview} assetBase={assetBase}>
      <div className="rise rise-2">
        <Text className="h1 t-ink" style={ty.h1}>
          {t.title}
        </Text>
        <Text className="t-ink" style={ty.p}>
          {t.lead.replace('{name}', name)}
        </Text>
      </div>

      <div className="rise rise-3 rule" style={{ margin: '4px 0 28px', padding: '16px 18px', border: `1px solid ${c.line}`, borderLeft: `3px solid ${c.ember}`, borderRadius: 3 }}>
        <Text className="t-soft" style={{ margin: '0 0 8px', fontFamily: font.mono, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: c.charcoal }}>
          {t.yours}
        </Text>
        <Text className="t-ink" style={{ margin: 0, fontFamily: font.text, fontSize: 15, lineHeight: '23px', color: c.ink, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>
          {message}
        </Text>
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

ReceiptEmail.PreviewProps = {
  name: 'Camila',
  message: 'Hola Angel, necesitamos migrar nuestra facturación a un sistema propio con SUNAT. ¿Podemos conversar esta semana?',
  lang: 'es',
  assetBase: '/static',
} satisfies ReceiptEmailProps;
