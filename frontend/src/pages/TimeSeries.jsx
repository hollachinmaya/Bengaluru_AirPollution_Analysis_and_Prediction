// src/pages/TimeSeries.jsx
import { useState } from 'react'
import { useApi } from '../hooks/useApi'
import { fetchMonthlyAll, fetchMonthlyStation, fetchYoY, fetchVolatility } from '../api/client'
import { STATIONS, STATION_COLORS, stationColor, POLLUTANT_OPTIONS, pollutantColor, pollutantLabel } from '../utils/aqi'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip,
  CartesianGrid, Legend, ResponsiveContainer, ReferenceLine, Cell
} from 'recharts'
import { Card, CardHeader, SectionHeader, Spinner, ErrorBox, Select, TabBtn } from '../components/UI'

const TIP = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: 'rgba(5,10,20,0.95)', border: '1px solid rgba(0,200,255,0.2)', borderRadius: 8, padding: '10px 14px', fontSize: 12, maxWidth: 200 }}>
      <div style={{ color: 'var(--text2)', marginBottom: 4, fontFamily: 'Space Mono, monospace', fontSize: 10 }}>{label}</div>
      {payload.slice(0, 6).map((p, i) => (
        <div key={i} style={{ color: p.color || 'var(--accent)', fontFamily: 'Space Mono, monospace', fontSize: 11 }}>
          {p.name}: <b>{typeof p.value === 'number' ? p.value.toFixed(1) : p.value}</b>
        </div>
      ))}
    </div>
  )
}

// Shared pollutant pill selector component
function PollutantSelector({ value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
      <span style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'Space Mono, monospace', letterSpacing: 1, textTransform: 'uppercase' }}>Pollutant:</span>
      {POLLUTANT_OPTIONS.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          style={{
            padding: '5px 14px',
            borderRadius: 20,
            border: `1.5px solid ${value === opt.value ? opt.color : 'rgba(255,255,255,0.1)'}`,
            background: value === opt.value ? opt.color + '22' : 'transparent',
            color: value === opt.value ? opt.color : 'var(--text2)',
            fontSize: 12,
            fontFamily: 'Space Mono, monospace',
            cursor: 'pointer',
            transition: 'all 0.2s',
            fontWeight: value === opt.value ? 700 : 400,
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

export default function TimeSeries() {
  const [mode, setMode]         = useState('all')
  const [selStation, setSelStation] = useState('BapujiNagar')
  const [pollutant, setPollutant]   = useState('PM2_5_AQI')

  const { data: allMonthly,     loading: l1 } = useApi(() => fetchMonthlyAll(pollutant),           [pollutant])
  const { data: stationMonthly, loading: l2 } = useApi(() => fetchMonthlyStation(selStation, pollutant), [selStation, pollutant])
  const { data: yoy,            loading: l3 } = useApi(() => fetchYoY(pollutant),                  [pollutant])
  const { data: vol,            loading: l4 } = useApi(() => fetchVolatility(pollutant),           [pollutant])

  const loading = l1 || l3 || l4
  const pColor  = pollutantColor(pollutant)
  const pLabel  = pollutantLabel(pollutant)

  // Build all-stations pivot for multi-line chart
  const allPivot = (() => {
    if (!allMonthly) return []
    const months = [...new Set(allMonthly.map(r => r.month))].sort()
    return months.map(m => {
      const row = { month: m }
      allMonthly.filter(r => r.month === m).forEach(r => { row[r.station] = r.aqi })
      return row
    })
  })()

  // YoY pivot per station
  const yoyStations = yoy ? [...new Set(yoy.map(r => r.station))] : []
  const yoyYears    = yoy ? [...new Set(yoy.map(r => r.year))].sort() : []
  const yoyPivot    = yoyYears.map(yr => {
    const row = { year: yr }
    yoy?.filter(r => r.year === yr).forEach(r => { row[r.station] = r.delta })
    return row
  })

  if (loading) return <Spinner label="Loading time series…" />

  return (
    <div className="fade-in" style={{ padding: 28, maxWidth: 1400 }}>
      <SectionHeader tag="TIME SERIES EXPLORER" title="Monthly Trends"
        desc="Monthly-aggregated trajectories revealing long-term pollution dynamics and inter-zone divergence patterns (2019–2024)." />

      {/* Pollutant Selector */}
      <div style={{ marginBottom: 18, padding: '12px 18px', background: 'rgba(0,200,255,0.04)', borderRadius: 10, border: '1px solid rgba(0,200,255,0.1)' }}>
        <PollutantSelector value={pollutant} onChange={setPollutant} />
      </div>

      {/* Mode toggle */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap', alignItems: 'center' }}>
        <TabBtn active={mode === 'all'}    onClick={() => setMode('all')}>All Stations</TabBtn>
        <TabBtn active={mode === 'single'} onClick={() => setMode('single')}>Single Station</TabBtn>
        {mode === 'single' && (
          <Select value={selStation} onChange={setSelStation} options={STATIONS} />
        )}
      </div>

      {/* Main time series */}
      <Card style={{ marginBottom: 18 }}>
        <CardHeader
          title={mode === 'all'
            ? `All Stations — Monthly ${pLabel} (2019–2024)`
            : `${selStation} — Monthly ${pLabel} (2019–2024)`}
          badge="COVID-19 Dip Visible (2020)"
          badgeColor="blue"
        />
        {mode === 'all' ? (
          <ResponsiveContainer width="100%" height={360}>
            <LineChart data={allPivot} margin={{ right: 20 }}>
              <CartesianGrid stroke="rgba(0,200,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: 'var(--text2)', fontSize: 9 }} tickCount={24} angle={-35} textAnchor="end" height={50} />
              <YAxis tick={{ fill: 'var(--text2)', fontSize: 11 }} label={{ value: pLabel, angle: -90, position: 'insideLeft', fill: 'var(--text2)', fontSize: 11 }} />
              <Tooltip content={<TIP />} />
              <Legend wrapperStyle={{ fontSize: 10, color: 'var(--text2)' }} />
              <ReferenceLine x="2020-04" stroke="rgba(255,107,43,0.35)" strokeDasharray="5,4" label={{ value: 'Lockdown', fill: '#ff6b2b', fontSize: 9 }} />
              {STATIONS.map((s, i) => (
                <Line key={s} type="monotone" dataKey={s} stroke={STATION_COLORS[i]}
                  strokeWidth={1.5} dot={false} connectNulls />
              ))}
            </LineChart>
          </ResponsiveContainer>
        ) : (
          l2 ? <Spinner /> : (
            <ResponsiveContainer width="100%" height={360}>
              <LineChart data={stationMonthly?.map(d => ({ month: d.month, aqi: d.aqi }))}>
                <CartesianGrid stroke="rgba(0,200,255,0.04)" />
                <XAxis dataKey="month" tick={{ fill: 'var(--text2)', fontSize: 9 }} angle={-35} textAnchor="end" height={50} />
                <YAxis tick={{ fill: 'var(--text2)', fontSize: 11 }} />
                <Tooltip content={<TIP />} />
                <ReferenceLine x="2020-04" stroke="rgba(255,107,43,0.35)" strokeDasharray="5,4" label={{ value: 'Lockdown', fill: '#ff6b2b', fontSize: 9 }} />
                <Line dataKey="aqi" name={`${selStation} — ${pLabel}`} stroke={pColor} strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )
        )}
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        {/* YoY change */}
        <Card>
          <CardHeader title={`Year-over-Year Δ ${pLabel}`} badge="Change Analysis" badgeColor="orange" />
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={yoyPivot} margin={{ right: 20 }}>
              <CartesianGrid stroke="rgba(0,200,255,0.05)" />
              <XAxis dataKey="year" tick={{ fill: 'var(--text2)', fontSize: 12 }} />
              <YAxis tick={{ fill: 'var(--text2)', fontSize: 11 }} label={{ value: `Δ ${pLabel}`, angle: -90, position: 'insideLeft', fill: 'var(--text2)', fontSize: 10 }} />
              <Tooltip content={<TIP />} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <ReferenceLine y={0} stroke="rgba(255,255,255,0.2)" strokeDasharray="4,3" />
              {yoyStations.slice(0, 5).map((s, i) => (
                <Line key={s} type="monotone" dataKey={s} stroke={STATION_COLORS[i]}
                  strokeWidth={2} dot={{ r: 3 }} connectNulls />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Volatility */}
        <Card>
          <CardHeader title={`Station ${pLabel} Volatility`} badge="Std Deviation" badgeColor="purple" />
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={vol} layout="vertical" margin={{ left: 10, right: 20 }}>
              <XAxis type="number" tick={{ fill: 'var(--text2)', fontSize: 11 }} />
              <YAxis type="category" dataKey="station" width={110} tick={{ fill: 'var(--text2)', fontSize: 11 }} />
              <Tooltip formatter={v => [v.toFixed(1), 'Std Dev']} contentStyle={{ background: 'rgba(5,10,20,0.95)', border: '1px solid rgba(0,200,255,0.2)', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="std_aqi" name="Std Dev" radius={[0,5,5,0]}>
                {(vol || []).map((d, i) => (
                  <Cell key={i} fill={STATION_COLORS[STATIONS.indexOf(d.station)] || pColor} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  )
}
