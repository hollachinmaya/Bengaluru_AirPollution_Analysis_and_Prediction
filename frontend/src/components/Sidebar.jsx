// src/components/Sidebar.jsx
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Map, Calendar,
  BrainCircuit, TrendingUp, ChevronRight, Wind
} from 'lucide-react'

const NAV = [
  { path: '/',           icon: LayoutDashboard, label: 'Overview',    tag: '01', desc: 'City summary' },
  { path: '/spatial',    icon: Map,             label: 'Spatial',     tag: '02', desc: 'Zone hotspots' },
  { path: '/temporal',   icon: Calendar,        label: 'Temporal',    tag: '03', desc: 'Season trends' },
  { path: '/prediction', icon: BrainCircuit,    label: 'CNN-LSTM',    tag: '04', desc: 'DL forecast' },
  { path: '/timeseries', icon: TrendingUp,      label: 'Time Series', tag: '05', desc: 'Monthly AQI' },
]

// Animated waveform indicator (shown when active)
function Waveform() {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 14 }}>
      {[10, 14, 8, 14, 10].map((h, i) => (
        <div
          key={i}
          className="wave-bar"
          style={{ height: h, animationDelay: `${i * 0.12}s` }}
        />
      ))}
    </div>
  )
}

export default function Sidebar() {
  return (
    <aside
      className="sidebar-bg"
      style={{
        width: 230, minHeight: '100vh', flexShrink: 0,
        display: 'flex', flexDirection: 'column',
        position: 'sticky', top: 0, zIndex: 50,
      }}
    >
      <div className="sidebar-right-line" />

      {/* Logo */}
      <div style={{ padding: '22px 20px 18px', borderBottom: '1px solid rgba(52,211,120,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Animated logo icon with orbit dot */}
          <div style={{ position: 'relative', width: 40, height: 40 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: 'linear-gradient(135deg, rgba(52,211,120,0.18), rgba(245,158,11,0.15))',
              border: '1px solid rgba(52,211,120,0.28)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 20px rgba(52,211,120,0.18), inset 0 0 20px rgba(52,211,120,0.05)',
            }} className="animate-breathe">
              <Wind size={20} color="#34d378" />
            </div>
            {/* Orbiting dot */}
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              width: 6, height: 6, marginTop: -3, marginLeft: -3,
              zIndex: 1,
            }}>
              <div style={{
                width: 5, height: 5, borderRadius: '50%',
                background: '#f59e0b',
                boxShadow: '0 0 6px #f59e0b',
                animation: 'orbitDot 3s linear infinite',
                display: 'block',
              }} />
            </div>
          </div>
          <div>
            <div style={{
              fontFamily: 'Rajdhani, Space Mono, monospace',
              fontSize: 16, fontWeight: 700, letterSpacing: 1.5,
              background: 'linear-gradient(90deg, #34d378, #f59e0b)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              BLR · AQI
            </div>
            <div style={{ fontSize: 9, color: 'var(--text3)', letterSpacing: 2, textTransform: 'uppercase', marginTop: 1 }}>
              Intelligence Hub
            </div>
          </div>
        </div>

        {/* Live indicator bar */}
        <div style={{
          marginTop: 14, padding: '6px 10px', borderRadius: 8,
          background: 'rgba(52,211,120,0.06)', border: '1px solid rgba(52,211,120,0.15)',
          display: 'flex', alignItems: 'center', gap: 7,
        }}>
          <div style={{
            width: 6, height: 6, borderRadius: '50%',
            background: '#34d378',
            boxShadow: '0 0 8px #34d378',
          }} className="animate-pulse-dot" />
          <span style={{ fontSize: 9, color: '#34d378', fontFamily: 'Space Mono, monospace', letterSpacing: 1 }}>
            LIVE · 9 SENSORS ACTIVE
          </span>
        </div>
      </div>

      {/* Nav label */}
      <div style={{ padding: '14px 20px 6px', fontSize: 9, color: 'var(--text3)', letterSpacing: 2, textTransform: 'uppercase', fontFamily: 'Space Mono, monospace' }}>
        Navigation
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: '4px 10px 16px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV.map(({ path, icon: Icon, label, tag, desc }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px', borderRadius: 10, textDecoration: 'none',
              border: '1px solid',
              borderColor: isActive ? 'rgba(52,211,120,0.28)' : 'transparent',
              background: isActive
                ? 'linear-gradient(90deg, rgba(52,211,120,0.10), rgba(52,211,120,0.03))'
                : 'transparent',
              color: isActive ? 'var(--accent)' : 'var(--text2)',
              transition: 'all 0.2s cubic-bezier(.22,1,.36,1)',
              position: 'relative', overflow: 'hidden',
            })}
          >
            {({ isActive }) => (
              <>
                {/* Active left bar */}
                {isActive && (
                  <div style={{
                    position: 'absolute', left: 0, top: '20%', bottom: '20%',
                    width: 2.5, borderRadius: '0 2px 2px 0',
                    background: 'linear-gradient(180deg, var(--accent), rgba(245,158,11,0.5))',
                    boxShadow: '0 0 8px var(--accent)',
                  }} />
                )}
                {/* Icon */}
                <div style={{
                  width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                  background: isActive ? 'rgba(52,211,120,0.12)' : 'rgba(255,255,255,0.03)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s',
                  boxShadow: isActive ? '0 0 12px rgba(52,211,120,0.15)' : 'none',
                }}>
                  <Icon size={14} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: isActive ? 600 : 400, lineHeight: 1.2 }}>{label}</div>
                  <div style={{ fontSize: 9, color: isActive ? 'rgba(52,211,120,0.6)' : 'var(--text3)', marginTop: 1, letterSpacing: 0.5 }}>{desc}</div>
                </div>
                {isActive ? <Waveform /> : (
                  <div style={{ fontSize: 9, fontFamily: 'Space Mono, monospace', color: 'var(--text3)', flexShrink: 0 }}>{tag}</div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div style={{
        padding: '14px 20px', borderTop: '1px solid rgba(52,211,120,0.08)',
        fontSize: 10, color: 'var(--text3)', lineHeight: 1.8,
      }}>
        <div style={{ fontFamily: 'Space Mono, monospace', color: 'var(--text2)', fontSize: 10 }}>JSS STU · 2025–26</div>
        <div style={{ fontSize: 9 }}>ISE Dept · CPCB / KSPCB Data</div>
        <div style={{
          marginTop: 8, padding: '5px 8px', borderRadius: 6,
          background: 'rgba(52,211,120,0.05)', border: '1px solid rgba(52,211,120,0.10)',
          fontSize: 9, color: 'var(--text3)', fontFamily: 'Space Mono, monospace',
        }}>
          v1.0.0 · CNN-LSTM Engine
        </div>
      </div>
    </aside>
  )
}
