// src/components/UI.jsx
import { Loader2 } from 'lucide-react'

/* ── Card ──────────────────────────────────────────────────────────────────── */
export function Card({ children, className = '', style = {}, accentColor }) {
  return (
    <div
      className={`glass-card ${className}`}
      style={{
        padding: 20,
        ...style,
      }}
    >
      {/* Optional top accent stripe that follows accentColor */}
      {accentColor && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 1,
          background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
          opacity: 0.7,
        }} />
      )}
      {children}
    </div>
  )
}

/* ── CardHeader ─────────────────────────────────────────────────────────────── */
export function CardHeader({ title, badge, badgeColor = 'blue' }) {
  const colors = {
    blue:   { bg: 'rgba(52,211,120,0.08)',  border: 'rgba(52,211,120,0.22)', text: '#34d378' },
    orange: { bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.22)', text: '#f59e0b' },
    green:  { bg: 'rgba(16,185,129,0.08)',  border: 'rgba(16,185,129,0.22)', text: '#10b981' },
    purple: { bg: 'rgba(251,191,36,0.08)',  border: 'rgba(251,191,36,0.22)', text: '#fbbf24' },
    yellow: { bg: 'rgba(110,231,183,0.08)', border: 'rgba(110,231,183,0.22)',text: '#6ee7b7' },
  }
  const c = colors[badgeColor] || colors.blue
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
      <span style={{
        fontFamily: 'Space Mono, monospace', fontSize: 10,
        textTransform: 'uppercase', letterSpacing: 2,
        color: 'var(--text3)',
      }}>
        {title}
      </span>
      {badge && (
        <span style={{
          fontSize: 9, padding: '3px 10px', borderRadius: 20,
          fontFamily: 'Space Mono, monospace',
          background: c.bg, border: `1px solid ${c.border}`, color: c.text,
          letterSpacing: 0.5,
        }}>
          {badge}
        </span>
      )}
    </div>
  )
}

/* ── Spinner ─────────────────────────────────────────────────────────────────  */
export function Spinner({ size = 28, label = 'Loading…' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, padding: '64px 20px' }}>
      {/* Multi-ring loader */}
      <div style={{ position: 'relative', width: size + 16, height: size + 16 }}>
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          border: '2px solid transparent',
          borderTopColor: 'var(--accent)',
          animation: 'spin 1s linear infinite',
        }} />
        <div style={{
          position: 'absolute', inset: 5, borderRadius: '50%',
          border: '1.5px solid transparent',
          borderTopColor: 'var(--accent4)',
          animation: 'spin 1.6s linear infinite reverse',
        }} />
        <Loader2 size={size - 14} color="var(--accent)" style={{ position: 'absolute', inset: 0, margin: 'auto' }} className="animate-spin-slow" />
      </div>
      <span style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'Space Mono, monospace', letterSpacing: 1 }}>{label}</span>
    </div>
  )
}

/* ── ErrorBox ─────────────────────────────────────────────────────────────── */
export function ErrorBox({ message }) {
  return (
    <div style={{
      borderRadius: 12, padding: '14px 18px',
      background: 'rgba(255,94,58,0.06)', border: '1px solid rgba(255,94,58,0.25)',
      color: '#ff5e3a', fontFamily: 'Space Mono, monospace', fontSize: 12,
      display: 'flex', alignItems: 'flex-start', gap: 10,
      boxShadow: '0 4px 20px rgba(255,94,58,0.08)',
    }}>
      <span style={{ fontSize: 16, lineHeight: 1 }}>⚠</span>
      <span style={{ lineHeight: 1.6 }}>{message}</span>
    </div>
  )
}

/* ── StatCard ─────────────────────────────────────────────────────────────── */
export function StatCard({ icon, value, label, sub, accent }) {
  const a = accent || 'var(--accent)'
  return (
    <div
      className="glass-card"
      style={{
        padding: '18px 20px', cursor: 'default',
        transition: 'transform 0.25s cubic-bezier(.22,1,.36,1), box-shadow 0.25s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-3px)'
        e.currentTarget.style.boxShadow = `0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px ${a}22`
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = ''
      }}
    >
      {/* Top accent gradient stripe */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${a}, transparent)`, borderRadius: '16px 16px 0 0' }} />

      <div style={{ fontSize: 20, marginBottom: 10 }}>{icon}</div>
      <div style={{
        fontFamily: 'Rajdhani, Space Mono, monospace',
        fontSize: 28, fontWeight: 700, color: a,
        lineHeight: 1, letterSpacing: -0.5,
        textShadow: `0 0 20px ${a}60`,
      }}>
        {value}
      </div>
      <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: 1.5, color: 'var(--text3)', marginTop: 6, fontFamily: 'Space Mono, monospace' }}>
        {label}
      </div>
      {sub && <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 3 }}>{sub}</div>}
    </div>
  )
}

/* ── Select ──────────────────────────────────────────────────────────────────  */
export function Select({ value, onChange, options, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {label && <span style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'Space Mono, monospace', letterSpacing: 0.5 }}>{label}</span>}
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          background: 'rgba(4,14,8,0.92)',
          border: '1px solid rgba(52,211,120,0.20)',
          color: 'var(--text)',
          padding: '8px 14px', borderRadius: 9,
          fontSize: 13, fontFamily: 'Inter, sans-serif',
          cursor: 'pointer',
          backdropFilter: 'blur(12px)',
          outline: 'none',
          transition: 'border-color 0.2s',
        }}
        onFocus={e => e.target.style.borderColor = 'rgba(52,211,120,0.5)'}
        onBlur={ e => e.target.style.borderColor = 'rgba(52,211,120,0.2)'}
      >
        {options.map(o => (
          <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>
        ))}
      </select>
    </div>
  )
}

/* ── AqiBadge ─────────────────────────────────────────────────────────────── */
export function AqiBadge({ aqi }) {
  const { text, bg, color } = aqiLabelHelper(aqi)
  return (
    <span style={{
      background: bg, color, border: `1px solid ${color}50`,
      borderRadius: 20, padding: '3px 11px', fontSize: 10,
      fontWeight: 600, fontFamily: 'Space Mono, monospace',
      letterSpacing: 0.5,
      boxShadow: `0 0 8px ${color}25`,
    }}>
      {text}
    </span>
  )
}
function aqiLabelHelper(aqi) {
  if (aqi <= 50)  return { text: 'Good',        bg: 'rgba(45,255,158,0.12)',  color: '#2dff9e' }
  if (aqi <= 100) return { text: 'Moderate',    bg: 'rgba(255,225,86,0.12)', color: '#ffe156' }
  if (aqi <= 150) return { text: 'USG',         bg: 'rgba(255,140,0,0.12)',  color: '#ff8c00' }
  if (aqi <= 200) return { text: 'Unhealthy',   bg: 'rgba(255,94,58,0.12)',  color: '#ff5e3a' }
  if (aqi <= 300) return { text: 'V.Unhealthy', bg: 'rgba(204,42,54,0.12)',  color: '#cc2a36' }
  return               { text: 'Hazardous',     bg: 'rgba(126,0,35,0.12)',   color: '#ff0040' }
}

/* ── InsightBox ──────────────────────────────────────────────────────────────  */
export function InsightBox({ children, accent = 'var(--accent)' }) {
  return (
    <div style={{
      background: 'rgba(52,211,120,0.04)', borderRadius: 10,
      borderLeft: `3px solid ${accent}`,
      padding: '11px 16px', fontSize: 12, color: 'var(--text2)',
      marginTop: 14, lineHeight: 1.75,
      backdropFilter: 'blur(12px)',
    }}>
      {children}
    </div>
  )
}

/* ── SectionHeader ───────────────────────────────────────────────────────────  */
export function SectionHeader({ tag, title, desc }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <p style={{
        fontFamily: 'Space Mono, monospace', fontSize: 10,
        textTransform: 'uppercase', letterSpacing: 3,
        color: 'var(--accent)', marginBottom: 6, opacity: 0.8,
      }}>
        {tag}
      </p>
      <h2 style={{
        fontSize: 24, fontWeight: 800, color: 'var(--text)',
        fontFamily: 'Rajdhani, Inter, sans-serif',
        letterSpacing: 0.5,
        background: 'linear-gradient(90deg, var(--text), rgba(52,211,120,0.75))',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
      }}>
        {title}
      </h2>
      {desc && (
        <p style={{ fontSize: 13, color: 'var(--text3)', marginTop: 6, lineHeight: 1.6 }}>
          {desc}
        </p>
      )}
    </div>
  )
}

/* ── TabBtn ───────────────────────────────────────────────────────────────── */
export function TabBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={active ? '' : ''}
      style={{
        padding: '7px 16px', borderRadius: 8, fontSize: 12,
        fontFamily: 'Space Mono, monospace', cursor: 'pointer',
        border: '1px solid',
        borderColor: active ? 'rgba(52,211,120,0.35)' : 'rgba(52,211,120,0.10)',
        background: active ? 'rgba(52,211,120,0.10)' : 'rgba(52,211,120,0.02)',
        color: active ? 'var(--accent)' : 'var(--text3)',
        transition: 'all 0.2s',
        backdropFilter: 'blur(12px)',
        letterSpacing: 0.5,
        boxShadow: active ? '0 0 14px rgba(52,211,120,0.14)' : 'none',
      }}
    >
      {children}
    </button>
  )
}
