import type { ReactNode } from 'react';
import { Icon } from './Shell';
import { c, font } from './tokens';

/** One field = label on top, value below: one fluid column, so a long value never squeezes anything. */
export function Field({ label, icon, children, last }: { label: string; icon: string; children: ReactNode; last?: boolean }) {
  return (
    <tr>
      <td className="rule" style={{ padding: '15px 0 14px', borderBottom: last ? 0 : `1px solid ${c.line}` }}>
        <div className="t-soft" style={{ fontFamily: font.mono, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: c.charcoal }}>
          <Icon name={icon} size={13} style={{ marginRight: 8, verticalAlign: '-2px' }} />
          {label}
        </div>
        <div className="t-ink" style={{ marginTop: 6, fontFamily: font.text, fontSize: 16, lineHeight: '24px', color: c.ink, overflowWrap: 'anywhere' }}>
          {children}
        </div>
      </td>
    </tr>
  );
}
