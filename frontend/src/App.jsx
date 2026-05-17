// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import Sidebar    from './components/Sidebar'
import Header     from './components/Header'
import Overview   from './pages/Overview'
import Spatial    from './pages/Spatial'
import Temporal   from './pages/Temporal'
import Prediction from './pages/Prediction'
import TimeSeries from './pages/TimeSeries'

/* ── Rising particle system ─────────────────────────────────────────────────── */
function ParticleField() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const COLORS = [
      'rgba(52,211,120,0.75)',
      'rgba(16,185,129,0.65)',
      'rgba(245,158,11,0.60)',
      'rgba(251,191,36,0.55)',
      'rgba(110,231,183,0.65)',
    ]
    const particles = Array.from({ length: 32 }).map(() => {
      const p = document.createElement('div')
      p.className = 'particle'
      const size  = Math.random() * 2.8 + 0.6
      const color = COLORS[Math.floor(Math.random() * COLORS.length)]
      const dur   = 12 + Math.random() * 22
      const delay = -(Math.random() * dur)
      p.style.cssText = `
        width:${size}px; height:${size}px;
        left:${Math.random() * 100}vw;
        bottom:${Math.random() * 30}vh;
        background:${color};
        box-shadow: 0 0 ${size * 5}px ${color};
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

/* ── Floating molecule-like orbs ──────────────────────────────────────────── */
function FloatingOrbs() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const orbs = Array.from({ length: 6 }).map((_, i) => {
      const o = document.createElement('div')
      const size = 80 + i * 40
      o.style.cssText = `
        position: fixed;
        width: ${size}px; height: ${size}px;
        border-radius: 50%;
        pointer-events: none;
        z-index: 0;
        left: ${10 + i * 15}%;
        top: ${15 + (i % 3) * 28}%;
        border: 1px solid rgba(52,211,120,${0.06 + i * 0.01});
        animation: breathe ${7 + i * 2}s ease-in-out infinite ${i * 1.5}s;
        box-shadow: inset 0 0 30px rgba(52,211,120,0.03), 0 0 20px rgba(52,211,120,0.04);
      `
      el.appendChild(o)
      return o
    })
    return () => orbs.forEach(o => o.remove())
  }, [])
  return <div ref={ref} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }} />
}

export default function App() {
  return (
    <BrowserRouter>
      {/* === Layered atmospheric background === */}
      <div className="bg-atmosphere" />
      <div className="bg-grid" />
      <div className="bg-vignette" />
      {/* Aurora conic gradient */}
      <div className="aurora-layer" />
      {/* Warm smog blobs */}
      <div className="smog-blob smog-1" />
      <div className="smog-blob smog-2" />
      <div className="smog-blob smog-3" />
      <div className="smog-blob smog-4" />
      {/* Animated rings */}
      <FloatingOrbs />
      {/* Rising particles */}
      <ParticleField />
      {/* Scan line */}
      <div className="scan-overlay" />

      <div style={{ display: 'flex', minHeight: '100vh', position: 'relative', zIndex: 1 }}>
        <Sidebar />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <Header />
          <main style={{ flex: 1, overflowY: 'auto' }}>
            <Routes>
              <Route path="/"           element={<Overview />} />
              <Route path="/spatial"    element={<Spatial />} />
              <Route path="/temporal"   element={<Temporal />} />
              <Route path="/prediction" element={<Prediction />} />
              <Route path="/timeseries" element={<TimeSeries />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  )
}
