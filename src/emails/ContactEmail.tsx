import { Link, Text } from 'react-email';
import { formatLima } from '@/lib/datetime';
import { dictionaries } from '@/i18n/dictionaries';
import { Field } from './Field';
import { Button, Shell, ty } from './Shell';
import { c } from './tokens';

export interface ContactEmailProps {
  name: string;
  email: string;
  topic: string;
  message: string;
  lang: 'es' | 'en';
  /** ISO date string */
  at: string;
  assetBase?: string;
}

/** To Angel: a message came in through the contact form. Always Spanish. */
export default function ContactEmail({ name, email, topic, message, lang, at, assetBase }: ContactEmailProps) {
  const t = dictionaries.es.email.contact;
  const dim = { color: c.charcoal } as const;
  return (
    <Shell lang="es" eyebrow={t.eyebrow} preview={t.preview.replace('{name}', name)} assetBase={assetBase}>
      <div className="rise rise-2">
        <Text className="h1 t-ink" style={ty.h1}>
          {t.title}
        </Text>
        <Text className="t-ink" style={ty.p}>
          {t.lead}
        </Text>
      </div>

      <div className="rise rise-3" style={{ margin: '4px 0 26px' }}>
        <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} style={{ width: '100%', borderCollapse: 'collapse', borderTop: `1px solid ${c.ink}` }}>
          <tbody>
            <Field label={t.rows.name} icon="user">
              <strong style={{ fontWeight: 700 }}>{name}</strong>
            </Field>
            <Field label={t.rows.email} icon="mail">
              <Link href={`mailto:${email}`} className="t-ink" style={{ color: c.ink, fontWeight: 700, textDecoration: 'none' }}>
                {email}
              </Link>
            </Field>
            <Field label={t.rows.topic} icon="note">
              {topic || <span style={dim}>{t.noTopic}</span>}
            </Field>
            <Field label={t.rows.message} icon="message">
              <span style={{ whiteSpace: 'pre-wrap' }}>{message}</span>
            </Field>
            <Field label={t.rows.lang} icon="languages">
              {t.langs[lang]}
            </Field>
            <Field label={t.rows.date} icon="calendar" last>
              {formatLima(at)}
            </Field>
          </tbody>
        </table>
      </div>

      <Button href={`mailto:${email}?subject=${encodeURIComponent(t.ctaSubject)}`}>{t.cta}</Button>
    </Shell>
  );
}

ContactEmail.PreviewProps = {
  name: 'Camila Rojas',
  email: 'camila@empresa.com',
  topic: 'Un sistema a medida',
  message: 'Hola Angel, necesitamos migrar nuestra facturación a un sistema propio con SUNAT. ¿Podemos conversar esta semana?',
  lang: 'es',
  at: '2026-11-14T10:40:00-05:00',
  assetBase: '/static',
} satisfies ContactEmailProps;
