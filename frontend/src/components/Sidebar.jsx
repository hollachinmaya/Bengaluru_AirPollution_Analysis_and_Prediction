// src/components/Sidebar.jsx
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Map, Calendar, Link2,
  BrainCircuit, TrendingUp, ChevronRight, Wind
} from 'lucide-react'

const NAV = [
  { path: '/',            icon: LayoutDashboard, label: 'Overview',    tag: '01', desc: 'City summary' },
  { path: '/spatial',     icon: Map,             label: 'Spatial',     tag: '02', desc: 'Zone hotspots' },
  { path: '/temporal',    icon: Calendar,        label: 'Temporal',    tag: '03', desc: 'Season trends' },
  { path: '/correlation', icon: Link2,           label: 'Correlation', tag: '04', desc: 'Station matrix' },
  { path: '/prediction',  icon: BrainCircuit,    label: 'CNN-LSTM',    tag: '05', desc: 'DL forecast' },
  { path: '/timeseries',  icon: TrendingUp,      label: 'Time Series', tag: '06', desc: 'Monthly AQI' },
]

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
      <div style={{ padding: '22px 20px 18px', borderBottom: '1px solid rgba(0,180,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Animated logo icon */}
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(196,126,255,0.2))',
            border: '1px solid rgba(0,212,255,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 20px rgba(0,212,255,0.2), inset 0 0 20px rgba(0,212,255,0.05)',
          }} className="animate-breathe">
            <Wind size={20} color="#00d4ff" />
          </div>
          <div>
            <div style={{
              fontFamily: 'Rajdhani, Space Mono, monospace',
              fontSize: 16, fontWeight: 700, letterSpacing: 1.5,
              background: 'linear-gradient(90deg, #00d4ff, #c47eff)',
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
          background: 'rgba(45,255,158,0.06)', border: '1px solid rgba(45,255,158,0.15)',
          display: 'flex', alignItems: 'center', gap: 7,
        }}>
          <div style={{
            width: 6, height: 6, borderRadius: '50%',
            background: '#2dff9e',
            boxShadow: '0 0 8px #2dff9e',
          }} className="animate-pulse-dot" />
          <span style={{ fontSize: 9, color: '#2dff9e', fontFamily: 'Space Mono, monospace', letterSpacing: 1 }}>
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
              borderColor: isActive ? 'rgba(0,212,255,0.28)' : 'transparent',
              background: isActive
                ? 'linear-gradient(90deg, rgba(0,212,255,0.1), rgba(0,212,255,0.03))'
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
                    background: 'linear-gradient(180deg, var(--accent), rgba(0,212,255,0.3))',
                    boxShadow: '0 0 8px var(--accent)',
                  }} />
                )}
                {/* Icon with glow */}
                <div style={{
                  width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                  background: isActive ? 'rgba(0,212,255,0.12)' : 'rgba(255,255,255,0.04)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s',
                }}>
                  <Icon size={14} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: isActive ? 600 : 400, lineHeight: 1.2 }}>{label}</div>
                  <div style={{ fontSize: 9, color: isActive ? 'rgba(0,212,255,0.6)' : 'var(--text3)', marginTop: 1, letterSpacing: 0.5 }}>{desc}</div>
                </div>
                <div style={{
                  fontSize: 9, fontFamily: 'Space Mono, monospace',
                  color: isActive ? 'rgba(0,212,255,0.5)' : 'var(--text3)',
                  flexShrink: 0,
                }}>{tag}</div>
                {isActive && <ChevronRight size={11} style={{ flexShrink: 0 }} />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div style={{
        padding: '14px 20px', borderTop: '1px solid rgba(0,180,255,0.08)',
        fontSize: 10, color: 'var(--text3)', lineHeight: 1.8,
      }}>
        <div style={{ fontFamily: 'Space Mono, monospace', color: 'var(--text2)', fontSize: 10 }}>JSS STU · 2025–26</div>
        <div style={{ fontSize: 9 }}>ISE Dept · CPCB / KSPCB Data</div>
        <div style={{
          marginTop: 8, padding: '5px 8px', borderRadius: 6,
          background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.1)',
          fontSize: 9, color: 'var(--text3)', fontFamily: 'Space Mono, monospace',
        }}>
          v1.0.0 · CNN-LSTM Engine
        </div>
      </div>
    </aside>
  )
}
