// src/utils/aqi.js

export const STATION_COLORS = [
  '#00c8ff','#ff6b2b','#39ff8e','#b06dff','#f5d020',
  '#ff4f6e','#00e5c0','#ff9f43','#a8d8ea',
]

export const STATIONS = [
  'BapujiNagar','BTM','Hebbal','Hombegowda','Jayanagar',
  'Kadabasenahalli','Peenya','RVCE','Silkboard',
]

export const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export function aqiColor(aqi) {
  if (aqi <= 50)  return '#2dff9e'
  if (aqi <= 100) return '#ffe156'
  if (aqi <= 150) return '#ff8c00'
  if (aqi <= 200) return '#ff5e3a'
  if (aqi <= 300) return '#cc2a36'
  return '#ff0040'
}

export function aqiLabel(aqi) {
  if (aqi <= 50)  return { text: 'Good',          bg: 'rgba(45,255,158,0.12)',  color: '#2dff9e' }
  if (aqi <= 100) return { text: 'Moderate',      bg: 'rgba(255,225,86,0.12)', color: '#ffe156' }
  if (aqi <= 150) return { text: 'USG',           bg: 'rgba(255,140,0,0.12)',  color: '#ff8c00' }
  if (aqi <= 200) return { text: 'Unhealthy',     bg: 'rgba(255,94,58,0.12)',  color: '#ff5e3a' }
  if (aqi <= 300) return { text: 'V.Unhealthy',   bg: 'rgba(204,42,54,0.12)',  color: '#cc2a36' }
  return               { text: 'Hazardous',       bg: 'rgba(126,0,35,0.12)',   color: '#ff0040' }
}

export function stationColor(station) {
  const idx = STATIONS.indexOf(station)
  return STATION_COLORS[idx >= 0 ? idx : 0]
}

export const MODEL_COLORS = {
  'CNN-LSTM':          '#00c8ff',
  'Random Forest':     '#b06dff',
  'Linear Regression': '#7fa8cc',
}
