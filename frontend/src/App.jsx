// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import Sidebar     from './components/Sidebar'
import Header      from './components/Header'
import Overview    from './pages/Overview'
import Spatial     from './pages/Spatial'
import Temporal    from './pages/Temporal'
import Correlation from './pages/Correlation'
import Prediction  from './pages/Prediction'
import TimeSeries  from './pages/TimeSeries'

/* ── Rising particle system ─────────────────────────────────────────────────── */
function ParticleField() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const COLORS = [
      'rgba(56,190,255,0.7)',
      'rgba(196,126,255,0.6)',
      'rgba(34,245,160,0.55)',
      'rgba(255,92,58,0.5)',
      'rgba(255,228,77,0.5)',
    ]
    const particles = Array.from({ length: 28 }).map(() => {
      const p = document.createElement('div')
      p.className = 'particle'
      const size  = Math.random() * 2.5 + 0.8
      const color = COLORS[Math.floor(Math.random() * COLORS.length)]
      const dur   = 10 + Math.random() * 20
      const delay = -(Math.random() * dur)
      p.style.cssText = `
        width:${size}px; height:${size}px;
        left:${Math.random() * 100}vw;
        bottom:${Math.random() * 40}vh;
        background:${color};
        box-shadow: 0 0 ${size * 4}px ${color};
        animation-duration:${dur}s;
        animation-delay:${delay}s;
      `
      el.appendChild(p)
      return p
    })
    return () => particles.forEach(p => p.remove())
  }, [])
  return <div ref={ref} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }} />
}

export default function App() {
  return (
    <BrowserRouter>
      {/* === Layered atmospheric background === */}
      {/* 1. Full-page radial gradient mesh */}
      <div className="bg-atmosphere" />
      {/* 2. Small grid */}
      <div className="bg-grid" />
      {/* 3. Edge vignette */}
      <div className="bg-vignette" />
      {/* 4. Visible smog blobs */}
      <div className="smog-blob smog-1" />
      <div className="smog-blob smog-2" />
      <div className="smog-blob smog-3" />
      <div className="smog-blob smog-4" />
      {/* 5. Horizontal smog streaks */}
      <div className="smog-streak" />
      <div className="smog-streak-2" />
      {/* 6. Rising particles */}
      <ParticleField />
      {/* 7. Scan line */}
      <div className="scan-overlay" />

      <div style={{ display: 'flex', minHeight: '100vh', position: 'relative', zIndex: 1 }}>
        <Sidebar />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <Header />
          <main style={{ flex: 1, overflowY: 'auto' }}>
            <Routes>
              <Route path="/"            element={<Overview />} />
              <Route path="/spatial"     element={<Spatial />} />
              <Route path="/temporal"    element={<Temporal />} />
              <Route path="/correlation" element={<Correlation />} />
              <Route path="/prediction"  element={<Prediction />} />
              <Route path="/timeseries"  element={<TimeSeries />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  )
}
