import { Link, Text } from 'react-email';
import { formatLima } from '@/lib/datetime';
import { dictionaries } from '@/i18n/dictionaries';
import { Field } from './Field';
import { Button, Shell, Tag, ty } from './Shell';
import { c } from './tokens';

export interface LeadEmailProps {
  email: string;
  reason: string;
  phone: string;
  lang: 'es' | 'en';
  /** ISO date string */
  at: string;
  assetBase?: string;
}

export default function LeadEmail({ email, reason, phone, lang, at, assetBase }: LeadEmailProps) {
  const t = dictionaries.es.email.lead;
  const dim = { color: c.charcoal } as const;
  return (
    <Shell lang="es" eyebrow={t.eyebrow} preview={t.preview.replace('{email}', email)} assetBase={assetBase}>
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
            <Field label={t.rows.email} icon="mail">
              {/* explicit link so Gmail does not paint its own blue autolink */}
              <Link href={`mailto:${email}`} className="t-ink" style={{ color: c.ink, fontWeight: 700, textDecoration: 'none' }}>
                {email}
              </Link>
              <span style={{ display: 'inline-block', marginLeft: 10 }}>
                <Tag icon="check">{t.verified}</Tag>
              </span>
            </Field>
            <Field label={t.rows.reason} icon="note">
              {reason ? <span style={{ whiteSpace: 'pre-wrap' }}>{reason}</span> : <span style={dim}>{t.noReason}</span>}
            </Field>
            <Field label={t.rows.phone} icon="phone">
              {phone ? (
                <>
                  {phone} <span style={{ ...dim, fontSize: 12 }}>· {t.phoneNote}</span>
                </>
              ) : (
                <span style={dim}>{t.noPhone}</span>
              )}
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

      <div style={{ margin: '0 0 12px' }}>
        <Button href={`mailto:${email}?subject=${encodeURIComponent(t.ctaSubject)}`}>{t.cta}</Button>
      </div>
      <Text className="t-soft" style={ty.soft}>
        {t.note}
      </Text>
    </Shell>
  );
}

LeadEmail.PreviewProps = {
  email: 'reclutador@empresa.com',
  reason: 'Vacante de Backend Senior en nuestro equipo de pagos.',
  phone: '+51 999 888 777',
  lang: 'es',
  at: '2026-11-13T21:15:00-05:00',
  assetBase: '/static',
} satisfies LeadEmailProps;
