// src/pages/Temporal.jsx
import { useState } from 'react'
import { useApi } from '../hooks/useApi'
import { fetchSeasonal, fetchYearly, fetchWeekly, fetchSeasonalStation } from '../api/client'
import { STATIONS, STATION_COLORS, POLLUTANT_OPTIONS, pollutantColor, pollutantLabel } from '../utils/aqi'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip,
  CartesianGrid, Legend, ResponsiveContainer, ReferenceLine, Cell
} from 'recharts'
import { Card, CardHeader, SectionHeader, Spinner, ErrorBox, Select, InsightBox } from '../components/UI'

const TIP = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: 'rgba(5,10,20,0.95)', border: '1px solid rgba(0,200,255,0.2)', borderRadius: 8, padding: '10px 14px', fontSize: 12 }}>
      <div style={{ color: 'var(--text2)', marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || 'var(--accent)', fontFamily: 'Space Mono,monospace' }}>
          {p.name}: <b>{typeof p.value === 'number' ? p.value.toFixed(1) : p.value}</b>
        </div>
      ))}
    </div>
  )
}

// Shared pollutant pill selector
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

export default function Temporal() {
  const [pollutant, setPollutant] = useState('PM2_5_AQI')
  const [selStation, setSelStation] = useState('BapujiNagar')

  const { data: seasonal } = useApi(() => fetchSeasonal(pollutant), [pollutant])
  const { data: yearly } = useApi(() => fetchYearly(pollutant), [pollutant])
  const { data: weekly } = useApi(() => fetchWeekly(pollutant), [pollutant])
  const { data: stationSeasonal, loading: stLoading } = useApi(
    () => fetchSeasonalStation(selStation, pollutant), [selStation, pollutant]
  )

  const loading = !seasonal || !yearly || !weekly
  const pColor = pollutantColor(pollutant)
  const pLabel = pollutantLabel(pollutant)

  // Build yearly pivot: [{year, Station1, Station2...}]
  const yearlyPivot = (() => {
    if (!yearly) return []
    const years = [...new Set(yearly.map(r => r.year))].sort()
    return years.map(yr => {
      const row = { year: yr }
      yearly.filter(r => r.year === yr).forEach(r => { row[r.station] = r.mean_value })
      return row
    })
  })()

  // Weekly bar colors
  const weeklyData = weekly?.data?.map(d => ({
    ...d,
    color: ['Sat', 'Sun'].includes(d.day) ? '#39ff8e' : pColor
  })) || []

  const maxMonth = seasonal?.reduce((a, b) => b.value > a.value ? b : a, { value: 0 })
  const minMonth = seasonal?.reduce((a, b) => b.value < a.value ? b : a, { value: 9999 })

  if (loading) return <Spinner label="Loading temporal analysis…" />

  return (
    <div className="fade-in" style={{ padding: 28, maxWidth: 1400 }}>
      <SectionHeader tag="TEMPORAL DECOMPOSITION" title="Temporal Analysis"
        desc="Seasonal cycles, COVID-19 dip, and weekday–weekend anthropogenic patterns." />

      {/* Pollutant Selector */}
      <div style={{ marginBottom: 20, padding: '12px 18px', background: 'rgba(0,200,255,0.04)', borderRadius: 10, border: '1px solid rgba(0,200,255,0.1)' }}>
        <PollutantSelector value={pollutant} onChange={setPollutant} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }}>
        {/* Seasonal */}
        <Card>
          <CardHeader title={`Seasonal Pattern (City Avg) — ${pLabel}`} badge="Monthly" badgeColor="blue" />
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={seasonal}>
              <CartesianGrid stroke="rgba(0,200,255,0.06)" />
              <XAxis dataKey="month_name" tick={{ fill: 'var(--text2)', fontSize: 11 }} />
              <YAxis tick={{ fill: 'var(--text2)', fontSize: 11 }} />
              <Tooltip content={<TIP />} />
              <Line dataKey="value" name={pLabel} stroke={pColor} strokeWidth={2.5}
                dot={{ fill: pColor, r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
          {maxMonth && (
            <InsightBox accent={pColor}>
              🔺 <b>Peak:</b> {maxMonth.month_name} ({pLabel} {maxMonth.value?.toFixed(1)}) &nbsp;
              🔻 <b>Lowest:</b> {minMonth.month_name} ({pLabel} {minMonth.value?.toFixed(1)})
            </InsightBox>
          )}
        </Card>

        {/* Weekday vs Weekend */}
        <Card>
          <CardHeader title={`Weekday vs Weekend — ${pLabel}`} badge="Transport Analysis" badgeColor="orange" />
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={weeklyData} margin={{ top: 5 }}>
              <CartesianGrid stroke="rgba(0,200,255,0.06)" />
              <XAxis dataKey="day" tick={{ fill: 'var(--text2)', fontSize: 12 }} />
              <YAxis tick={{ fill: 'var(--text2)', fontSize: 11 }} />
              <Tooltip content={<TIP />} />
              <Bar dataKey="mean_value" name={pLabel} radius={[5, 5, 0, 0]}>
                {weeklyData.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          {weekly && (
            <InsightBox accent="var(--accent2)">
              📈 <b>Weekday avg:</b> {weekly.weekday_avg} vs <b>Weekend avg:</b> {weekly.weekend_avg} —
              Δ {Math.abs(weekly.delta).toFixed(1)} units
              {weekly.delta > 0 ? ' — weekday emissions drive the peak.' : '.'}
            </InsightBox>
          )}
        </Card>
      </div>

      {/* Yearly trend */}
      <Card style={{ marginBottom: 18 }}>
        <CardHeader title={`Yearly Trends (All Stations) — ${pLabel}`} badge="2019–2024 · COVID Analysis" badgeColor="purple" />
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={yearlyPivot} margin={{ right: 20 }}>
            <CartesianGrid stroke="rgba(0,200,255,0.05)" />
            <XAxis dataKey="year" tick={{ fill: 'var(--text2)', fontSize: 12 }} />
            <YAxis tick={{ fill: 'var(--text2)', fontSize: 11 }} />
            <Tooltip content={<TIP />} />
            <Legend wrapperStyle={{ fontSize: 11, color: 'var(--text2)' }} />
            <ReferenceLine x={2020} stroke="rgba(255,107,43,0.4)" strokeDasharray="5,4" label={{ value: 'COVID-19', fill: '#ff6b2b', fontSize: 10 }} />
            {STATIONS.map((s, i) => (
              <Line key={s} type="monotone" dataKey={s} stroke={STATION_COLORS[i]}
                strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} connectNulls />
            ))}
          </LineChart>
        </ResponsiveContainer>
        <InsightBox accent="var(--accent4)">
          📉 <b>2020 COVID Dip:</b> Lockdown restrictions caused notable reduction across most stations.&nbsp;
          📈 <b>2021–2024 Rebound:</b> Post-pandemic economic recovery drove levels back toward pre-COVID values.
        </InsightBox>
      </Card>

      {/* Per-station seasonal */}
      <Card>
        <CardHeader title={`Monthly Seasonal Pattern (Per Station) — ${pLabel}`} badge="Comparison" badgeColor="green" />
        <div style={{ display: 'flex', gap: 16, marginBottom: 14, flexWrap: 'wrap', alignItems: 'center' }}>
          <Select label="Station:" value={selStation} onChange={setSelStation} options={STATIONS} />
        </div>
        {stLoading ? <Spinner label="Loading…" /> : (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={stationSeasonal}>
              <CartesianGrid stroke="rgba(0,200,255,0.06)" />
              <XAxis dataKey="month_name" tick={{ fill: 'var(--text2)', fontSize: 11 }} />
              <YAxis tick={{ fill: 'var(--text2)', fontSize: 11 }} />
              <Tooltip content={<TIP />} />
              <Bar dataKey="value" name={`${selStation} — ${pLabel}`} radius={[4, 4, 0, 0]}>
                {(stationSeasonal || []).map((d, i) => (
                  <Cell key={i} fill={pColor + (Math.round((0.4 + (i / 12) * 0.5) * 255).toString(16).padStart(2, '0'))} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card>
    </div>
  )
}
