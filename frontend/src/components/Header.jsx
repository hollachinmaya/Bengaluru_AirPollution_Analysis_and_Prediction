// src/components/Header.jsx
import { useLocation } from 'react-router-dom'
import { Activity, Satellite, Clock3 } from 'lucide-react'
import { useState, useEffect } from 'react'

const PAGE_META = {
  '/':           { title: 'City Overview',       desc: 'Real-time spatiotemporal air quality summary',       icon: '🏙️' },
  '/spatial':    { title: 'Spatial Hotspots',    desc: 'Pollution hotspot detection & zone mapping',          icon: '🗺️' },
  '/temporal':   { title: 'Temporal Patterns',   desc: 'Seasonal, yearly & weekday AQI trends',              icon: '📅' },
  '/prediction': { title: 'CNN-LSTM Forecast',   desc: 'Deep learning based next-day AQI prediction engine', icon: '🧠' },
  '/timeseries': { title: 'Time Series Analysis', desc: 'Monthly AQI trends 2019–2024',                     icon: '📈' },
}

function LiveClock() {
  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text3)', fontSize: 11, fontFamily: 'Space Mono, monospace' }}>
      <Clock3 size={11} />
      {time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
    </div>
  )
}

export default function Header() {
  const { pathname } = useLocation()
  const meta = PAGE_META[pathname] || PAGE_META['/']

  return (
    <header className="hud-header" style={{ padding: '0 28px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 40 }}>
      {/* Left — page identity */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 8,
          background: 'linear-gradient(135deg, rgba(52,211,120,0.15), rgba(245,158,11,0.10))',
          border: '1px solid rgba(52,211,120,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, boxShadow: '0 0 12px rgba(52,211,120,0.15)',
        }}>
          {meta.icon}
        </div>
        <div>
          <h1 style={{
            fontSize: 15, fontWeight: 700,
            fontFamily: 'Rajdhani, Inter, sans-serif',
            letterSpacing: 0.8,
            background: 'linear-gradient(90deg, var(--text), rgba(52,211,120,0.75))',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            {meta.title}
          </h1>
          <p style={{ fontSize: 11, color: 'var(--text3)', marginTop: 1, letterSpacing: 0.2 }}>
            {meta.desc}
          </p>
        </div>
      </div>

      {/* Right — status bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <LiveClock />

        <div style={{ width: 1, height: 28, background: 'rgba(52,211,120,0.12)' }} />

        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'Rajdhani, Space Mono, monospace', fontSize: 20, fontWeight: 700, color: 'var(--accent)', lineHeight: 1 }}>9</div>
            <div style={{ fontSize: 8, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 1.5, marginTop: 1 }}>Stations</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'Rajdhani, Space Mono, monospace', fontSize: 20, fontWeight: 700, color: 'var(--text2)', lineHeight: 1 }}>17,779</div>
            <div style={{ fontSize: 8, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 1.5, marginTop: 1 }}>Records</div>
          </div>
        </div>

        <div style={{ width: 1, height: 28, background: 'rgba(52,211,120,0.12)' }} />

        {/* Live badge */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 7,
          fontSize: 10, color: '#34d378',
          background: 'rgba(52,211,120,0.07)',
          border: '1px solid rgba(52,211,120,0.20)',
          padding: '6px 13px', borderRadius: 20,
          fontFamily: 'Space Mono, monospace',
          letterSpacing: 1,
          boxShadow: '0 0 12px rgba(52,211,120,0.08)',
        }}>
          <Activity size={11} />
          LIVE
        </div>

        {/* Bangalore badge */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          fontSize: 10, color: 'var(--accent2)',
          background: 'rgba(245,158,11,0.07)',
          border: '1px solid rgba(245,158,11,0.20)',
          padding: '6px 12px', borderRadius: 20,
          fontFamily: 'Space Mono, monospace',
          letterSpacing: 0.8,
        }}>
          <Satellite size={11} />
          BENGALURU
        </div>
      </div>
    </header>
  )
}
