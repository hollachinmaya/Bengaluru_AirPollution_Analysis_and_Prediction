// src/api/client.js
import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 300000, // 5 min — CNN-LSTM training safety window
})

// ── Overview ──────────────────────────────────────────────────────────────────
export const fetchOverview = () =>
  api.get('/overview/stats').then(r => r.data)

// ── Spatial ───────────────────────────────────────────────────────────────────
export const fetchHotspots = (pollutant = 'PM2_5_AQI') =>
  api.get('/spatial/hotspots', { params: { pollutant } }).then(r => r.data)

export const fetchPollutantProfile = station =>
  api.get(`/spatial/pollutant-profile/${station}`).then(r => r.data)

export const fetchStations = () =>
  api.get('/spatial/stations').then(r => r.data)

// ── Temporal ──────────────────────────────────────────────────────────────────
export const fetchSeasonal = (pollutant = 'PM2_5_AQI') =>
  api.get('/temporal/seasonal', { params: { pollutant } }).then(r => r.data)

export const fetchSeasonalStation = (station, pollutant = 'PM2_5_AQI') =>
  api.get(`/temporal/seasonal/${station}`, { params: { pollutant } }).then(r => r.data)

export const fetchYearly = (pollutant = 'PM2_5_AQI') =>
  api.get('/temporal/yearly', { params: { pollutant } }).then(r => r.data)

export const fetchWeekly = (pollutant = 'PM2_5_AQI') =>
  api.get('/temporal/weekly', { params: { pollutant } }).then(r => r.data)

// ── Correlation ───────────────────────────────────────────────────────────────
export const fetchCorrelation = () =>
  api.get('/correlation/matrix').then(r => r.data)

// ── Prediction (CNN-LSTM) ─────────────────────────────────────────────────────
export const trainStation        = station => api.get(`/prediction/train/${station}`).then(r => r.data)
export const fetchForecast       = station => api.get(`/prediction/forecast/${station}`).then(r => r.data)
export const fetchLoss           = station => api.get(`/prediction/loss/${station}`).then(r => r.data)
export const fetchFeatureImportance = station => api.get(`/prediction/feature-importance/${station}`).then(r => r.data)
export const fetchArchitecture   = ()      => api.get('/prediction/architecture').then(r => r.data)

// ── Time Series ───────────────────────────────────────────────────────────────
export const fetchMonthlyAll     = (pollutant = 'PM2_5_AQI') =>
  api.get('/timeseries/monthly', { params: { pollutant } }).then(r => r.data)

export const fetchMonthlyStation = (station, pollutant = 'PM2_5_AQI') =>
  api.get(`/timeseries/monthly/${station}`, { params: { pollutant } }).then(r => r.data)

export const fetchYoY = (pollutant = 'PM2_5_AQI') =>
  api.get('/timeseries/yoy', { params: { pollutant } }).then(r => r.data)

export const fetchVolatility = (pollutant = 'PM2_5_AQI') =>
  api.get('/timeseries/volatility', { params: { pollutant } }).then(r => r.data)
