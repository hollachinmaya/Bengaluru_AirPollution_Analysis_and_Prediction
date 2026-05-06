# 🌫️ Spatio-Temporal Analysis and Prediction of Air Quality in Bengaluru

> A full-stack web application for spatiotemporal analysis, visualization, and deep-learning-based prediction of urban air quality across 9 monitoring stations in Bengaluru, India.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Dataset](#dataset)
- [Model Architecture](#model-architecture)
- [API Endpoints](#api-endpoints)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Monitoring Stations](#monitoring-stations)
- [AQI Categories](#aqi-categories)
- [Dependencies](#dependencies)
- [Authors](#authors)

---

## Overview

This project implements a comprehensive air quality intelligence platform for Bengaluru. It combines spatiotemporal data analysis with a **CNN-LSTM deep learning model** to forecast PM2.5-based AQI values. The application provides interactive dashboards for exploring historical trends, spatial distributions, temporal patterns, and station-level predictions through a modern React frontend backed by a FastAPI REST API.

---

## Features

- 📊 **Overview Dashboard** — Summary statistics, AQI distributions, and station-level KPIs
- 🗺️ **Spatial Analysis** — Geographic heatmaps and station comparison across Bengaluru
- 📅 **Temporal Analysis** — Monthly and day-of-week AQI pattern exploration
- 📈 **Time Series Viewer** — Historical AQI trends per station
- 🔗 **Correlation Analysis** — Feature correlation matrices and pollutant relationships
- 🤖 **Prediction Module** — CNN-LSTM model predictions with RMSE, MAE, and R² metrics
- 💻 **Code Viewer** — In-app source code browser for transparency
- ⚡ **Real-time API** — FastAPI backend with `/docs` Swagger UI

---

## Tech Stack

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Python | 3.11 | Runtime |
| FastAPI | 0.111.0 | REST API framework |
| Uvicorn | 0.29.0 | ASGI server |
| TensorFlow | 2.16.1 | CNN-LSTM model |
| Pandas | 2.3.3 | Data manipulation |
| NumPy | 1.26.4 | Numerical computing |
| Scikit-learn | 1.5.0 | Preprocessing & metrics |
| SciPy | 1.14.1 | Statistical analysis |

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | ^18.3.1 | UI framework |
| Vite | ^5.3.1 | Build tool & dev server |
| React Router DOM | ^6.23.1 | Client-side routing |
| Recharts | ^2.12.7 | Data visualization |
| Axios | ^1.7.2 | HTTP client |
| Lucide React | ^0.383.0 | Icon library |
| TailwindCSS | ^3.4.4 | Utility-first CSS |

---

## Project Structure

```
bangalore_aq_app/
│
├── backend/                        # FastAPI Python backend
│   ├── main.py                     # App entry point, CORS, router registration
│   ├── requirements.txt            # Python dependencies
│   ├── runtime.txt                 # Python version pin
│   └── app/
│       ├── __init__.py
│       ├── core.py                 # Data loading, preprocessing, caching, constants
│       ├── data.csv                # Historical AQI dataset (9 stations)
│       └── routers/
│           ├── __init__.py
│           ├── overview.py         # /api/overview — summary stats & KPIs
│           ├── spatial.py          # /api/spatial  — geographic analysis
│           ├── temporal.py         # /api/temporal — time-pattern analysis
│           ├── timeseries.py       # /api/timeseries — historical trends
│           ├── correlation.py      # /api/correlation — feature correlations
│           └── prediction.py       # /api/prediction — CNN-LSTM model & metrics
│
└── frontend/                       # React + Vite frontend
    ├── index.html                  # HTML entry point
    ├── package.json                # Node dependencies & scripts
    ├── vite.config.js              # Vite configuration
    ├── tailwind.config.js          # Tailwind CSS configuration
    ├── postcss.config.js           # PostCSS configuration
    └── src/
        ├── main.jsx                # React app bootstrap
        ├── App.jsx                 # Root component & routing
        ├── index.css               # Global styles & design tokens
        ├── api/
        │   └── client.js           # Axios API client with base URL config
        ├── hooks/
        │   └── useApi.js           # Custom hook for data fetching
        ├── utils/
        │   └── aqi.js              # AQI category helpers & color mappings
        ├── components/
        │   ├── Header.jsx          # Top navigation bar
        │   ├── Sidebar.jsx         # Side navigation menu
        │   └── UI.jsx              # Shared UI component library (Cards, Charts, etc.)
        └── pages/
            ├── Overview.jsx        # Overview dashboard page
            ├── Spatial.jsx         # Spatial analysis page
            ├── Temporal.jsx        # Temporal analysis page
            ├── TimeSeries.jsx      # Time series viewer page
            ├── Correlation.jsx     # Correlation analysis page
            ├── Prediction.jsx      # Prediction & model metrics page
            └── CodeViewer.jsx      # In-app source code browser
```

---

## Dataset

- **File:** `backend/app/data.csv`
- **Coverage:** 9 air quality monitoring stations across Bengaluru
- **Key Columns:** `Timestamp`, `Station`, `PM2_5_AQI`, `NO2`, `RH_Percent`
- **Engineered Features:**
  - `DayOfWeek_sin`, `DayOfWeek_cos` — Cyclic temporal embeddings
  - `Month_sin`, `Month_cos` — Cyclic month embeddings
  - `AQI_lag1`, `AQI_lag2`, `AQI_lag7` — Lag features (per station)
  - `AQI_roll3_mean` — 3-day rolling mean (per station)

---

## Model Architecture

The prediction module uses a **CNN-LSTM** deep learning model for time-series forecasting.

```
Input Shape: (batch, SEQ_LEN=14, n_features=9)
      │
      ▼
Conv1D  ──► Local pattern extraction from time-series windows
      │
      ▼
LSTM Layer ──► Sequential memory & temporal dependency learning
      │
      ▼
Dense (output) ──► PM2.5 AQI prediction (next-day)
```

**Model Features:**
- **Sequence length:** 14 days lookback window
- **Input features (9):** `PM2_5_AQI`, `NO2`, `RH_Percent`, `DayOfWeek_sin`, `DayOfWeek_cos`, `AQI_lag1`, `AQI_lag2`, `AQI_lag7`, `AQI_roll3_mean`
- **Target:** `PM2_5_AQI` (next-day forecast)
- **Training:** Per-station models with MinMax scaling
- **Metrics:** RMSE, MAE, R²

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check & API info |
| GET | `/api/health` | Service liveness check |
| GET | `/api/overview` | Summary statistics & KPIs |
| GET | `/api/spatial` | Spatial/geographic data |
| GET | `/api/temporal` | Temporal pattern data |
| GET | `/api/timeseries` | Historical time-series data |
| GET | `/api/correlation` | Feature correlation matrices |
| GET | `/api/prediction` | CNN-LSTM predictions & metrics |

> 📖 Interactive API docs available at: `http://localhost:8000/docs`

---

## Getting Started

### Prerequisites

- **Python** 3.11+
- **Node.js** 18+
- **npm** 9+
- **Git**

---

### 1. Clone the Repository

```bash
git clone https://github.com/hollachinmaya/Bengaluru_AirPollution_Analysis_and_Prediction.git
cd Bengaluru_AirPollution_Analysis_and_Prediction
```
*(Note: If you downloaded the project zip as `bangalore_aq_app`, simply navigate into that folder instead: `cd bangalore_aq_app`)*

---

### 2. Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Create and activate a virtual environment
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Start the FastAPI server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at: **`http://localhost:8000`**

---

### 3. Frontend Setup

Open a **new terminal window** (leave the backend running):

```bash
# Navigate to the frontend directory from the project root
cd frontend

# Install Node dependencies
npm install

# Start the Vite development server
npm run dev
```

The dashboard will be available at: **`http://localhost:5173`**

---

## Monitoring Stations

| Station | Zone Type | Latitude | Longitude |
|---|---|---|---|
| Peenya | Industrial | 13.0283 | 77.5193 |
| Silkboard | Traffic Hub | 12.9171 | 77.6220 |
| BapujiNagar | Mixed | 12.9562 | 77.5543 |
| BTM | Residential | 12.9165 | 77.6101 |
| Hebbal | Traffic | 13.0350 | 77.5970 |
| Hombegowda | Residential | 12.9760 | 77.5760 |
| Jayanagar | Residential | 12.9255 | 77.5828 |
| Kadabasenahalli | Mixed | 12.8900 | 77.6100 |
| RVCE | Academic | 12.9230 | 77.4988 |

---

## AQI Categories

| AQI Range | Category | Color |
|---|---|---|
| 0 – 50 | Good | 🟢 Green |
| 51 – 100 | Moderate | 🟡 Yellow |
| 101 – 150 | Unhealthy for Sensitive Groups (USG) | 🟠 Orange |
| 151 – 200 | Unhealthy | 🔴 Red |
| 201 – 300 | Very Unhealthy | 🟣 Purple |
| 301+ | Hazardous | 🟤 Maroon |

---

## Dependencies

### Python (`requirements.txt`)
```
fastapi==0.111.0
uvicorn[standard]==0.29.0
pandas==2.3.3
numpy==1.26.4
scikit-learn==1.5.0
scipy==1.14.1
python-multipart==0.0.9
tensorflow==2.16.1
```

### Node (`package.json`)
```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.23.1",
    "recharts": "^2.12.7",
    "lucide-react": "^0.383.0",
    "axios": "^1.7.2",
    "clsx": "^2.1.1"
  }
}
```

---

## Authors

> **8th Semester B.E. Project**
> Department of Computer Science & Engineering
> Spatio-Temporal Analysis and Prediction of Air Quality in Bengaluru

---

*Built with ❤️ using FastAPI + React + TensorFlow*
