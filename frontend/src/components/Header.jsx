// src/components/Header.jsx
import { useLocation } from 'react-router-dom'
import { Activity, Satellite, Clock3 } from 'lucide-react'
import { useState, useEffect } from 'react'

const PAGE_META = {
  '/':            { title: 'City Overview',       desc: 'Real-time spatiotemporal air quality summary',       icon: '🏙️' },
  '/spatial':     { title: 'Spatial Hotspots',    desc: 'Pollution hotspot detection & zone mapping',          icon: '🗺️' },
  '/temporal':    { title: 'Temporal Patterns',   desc: 'Seasonal, yearly & weekday AQI trends',              icon: '📅' },
  '/correlation': { title: 'Correlation Matrix',  desc: 'Inter-pollutant Pearson correlation analysis',       icon: '🔗' },
  '/prediction':  { title: 'CNN-LSTM Forecast',   desc: 'Deep learning based next-day AQI prediction engine', icon: '🧠' },
  '/timeseries':  { title: 'Time Series Analysis','desc': 'Monthly AQI trends 2019–2024',                    icon: '📈' },
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
        {/* Accent corner bracket */}
        <div style={{
          width: 28, height: 28, borderRadius: 8,
          background: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(196,126,255,0.1))',
          border: '1px solid rgba(0,212,255,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, boxShadow: '0 0 12px rgba(0,212,255,0.15)',
        }}>
          {meta.icon}
        </div>
        <div>
          <h1 style={{
            fontSize: 15, fontWeight: 700,
            fontFamily: 'Rajdhani, Inter, sans-serif',
            letterSpacing: 0.8,
            background: 'linear-gradient(90deg, var(--text), rgba(0,212,255,0.7))',
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
        {/* Clock */}
        <LiveClock />

        {/* Divider */}
        <div style={{ width: 1, height: 28, background: 'rgba(0,180,255,0.12)' }} />

        {/* Key stats */}
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

        {/* Divider */}
        <div style={{ width: 1, height: 28, background: 'rgba(0,180,255,0.12)' }} />

        {/* Live badge */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 7,
          fontSize: 10, color: '#2dff9e',
          background: 'rgba(45,255,158,0.07)',
          border: '1px solid rgba(45,255,158,0.18)',
          padding: '6px 13px', borderRadius: 20,
          fontFamily: 'Space Mono, monospace',
          letterSpacing: 1,
          boxShadow: '0 0 12px rgba(45,255,158,0.08)',
        }}>
          <Activity size={11} />
          LIVE
        </div>

        {/* Bangalore badge */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          fontSize: 10, color: 'var(--accent4)',
          background: 'rgba(196,126,255,0.07)',
          border: '1px solid rgba(196,126,255,0.18)',
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
