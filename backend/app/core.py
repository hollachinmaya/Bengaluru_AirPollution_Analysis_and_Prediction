"""
app/core.py
Central data loading, preprocessing, and caching for all routes.
"""
import os
import numpy as np
import pandas as pd
from functools import lru_cache
from pathlib import Path

DATA_PATH = Path(__file__).parent / "data.csv"

FEATURES = [
    "PM2_5_AQI", "NO2", "RH_Percent",
    "DayOfWeek_sin", "DayOfWeek_cos",
    "AQI_lag1", "AQI_lag2", "AQI_lag7",
    "AQI_roll3_mean"
]
TARGET  = "PM2_5_AQI"
SEQ_LEN = 14

STATION_COORDS = {
    "Peenya":           [13.0283, 77.5193],
    "Silkboard":        [12.9171, 77.6220],
    "BapujiNagar":      [12.9562, 77.5543],
    "BTM":              [12.9165, 77.6101],
    "Hebbal":           [13.0350, 77.5970],
    "Hombegowda":       [12.9760, 77.5760],
    "Jayanagar":        [12.9255, 77.5828],
    "Kadabasenahalli":  [12.8900, 77.6100],
    "RVCE":             [12.9230, 77.4988],
}

ZONE_TYPES = {
    "Peenya": "Industrial", "Silkboard": "Traffic Hub",
    "BapujiNagar": "Mixed",  "BTM": "Residential",
    "Hebbal": "Traffic",     "Hombegowda": "Residential",
    "Jayanagar": "Residential", "Kadabasenahalli": "Mixed",
    "RVCE": "Academic",
}

MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]


@lru_cache(maxsize=1)
def load_df() -> pd.DataFrame:
    """Load and preprocess the dataset once, cache it in memory."""
    df = pd.read_csv(DATA_PATH)
    df["Timestamp"] = pd.to_datetime(df["Timestamp"], format="%d-%m-%Y")
    df["Year"]      = df["Timestamp"].dt.year
    df["Month"]     = df["Timestamp"].dt.month
    df["DayOfWeek"] = df["Timestamp"].dt.dayofweek
    df["MonthName"] = df["Timestamp"].dt.strftime("%b")
    df["DayName"]   = df["Timestamp"].dt.strftime("%a")
    df["PM2_5_AQI"] = df["PM2_5_AQI"].fillna(df["PM2_5_AQI"].median())

    # --- Cyclic temporal embeddings ---
    df["Month_sin"]      = np.sin(2 * np.pi * df["Month"] / 12)
    df["Month_cos"]      = np.cos(2 * np.pi * df["Month"] / 12)
    df["DayOfWeek_sin"]  = np.sin(2 * np.pi * df["DayOfWeek"] / 7)
    df["DayOfWeek_cos"]  = np.cos(2 * np.pi * df["DayOfWeek"] / 7)

    # --- Rolling statistics (per station, sorted by date) ---
    df = df.sort_values(["Station", "Timestamp"]).reset_index(drop=True)
    grp = df.groupby("Station")["PM2_5_AQI"]
    df["AQI_roll3_mean"]  = grp.transform(lambda x: x.shift(1).rolling(3, min_periods=1).mean()).bfill()

    # --- Explicit lag features (per station) ---
    df["AQI_lag1"]  = grp.transform(lambda x: x.shift(1)).bfill()
    df["AQI_lag2"]  = grp.transform(lambda x: x.shift(2)).bfill()
    df["AQI_lag7"]  = grp.transform(lambda x: x.shift(7)).bfill()

    return df


def aqi_label(aqi: float) -> str:
    if aqi <= 50:  return "Good"
    if aqi <= 100: return "Moderate"
    if aqi <= 150: return "USG"
    if aqi <= 200: return "Unhealthy"
    if aqi <= 300: return "Very Unhealthy"
    return "Hazardous"
