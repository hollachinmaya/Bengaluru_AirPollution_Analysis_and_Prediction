"""
app/routers/timeseries.py
Monthly time-series, year-over-year change, and volatility endpoints.
Supports ?pollutant=PM2_5_AQI|SO2_AQI|NO2_AQI on all endpoints.
"""
from fastapi import APIRouter, Query
from app.core import load_df, resolve_pollutant

router = APIRouter()


@router.get("/monthly")
def get_monthly_all(pollutant: str = Query(default="PM2_5_AQI")):
    col = resolve_pollutant(pollutant)
    df = load_df()
    df["month_key"] = df["Timestamp"].dt.to_period("M").astype(str)
    monthly = (
        df.groupby(["month_key", "Station"])[col]
        .mean()
        .round(2)
        .reset_index()
    )
    monthly.columns = ["month", "station", "aqi"]
    return monthly.to_dict(orient="records")


@router.get("/monthly/{station}")
def get_monthly_station(station: str, pollutant: str = Query(default="PM2_5_AQI")):
    col = resolve_pollutant(pollutant)
    df = load_df()
    sdf = df[df["Station"] == station].copy()
    sdf["month_key"] = sdf["Timestamp"].dt.to_period("M").astype(str)
    monthly = (
        sdf.groupby("month_key")[col]
        .mean()
        .round(2)
        .reset_index()
    )
    monthly.columns = ["month", "aqi"]
    return monthly.to_dict(orient="records")


@router.get("/yoy")
def get_year_over_year(pollutant: str = Query(default="PM2_5_AQI")):
    col = resolve_pollutant(pollutant)
    df = load_df()
    yearly = (
        df.groupby(["Year", "Station"])[col]
        .mean()
        .round(2)
        .reset_index()
    )
    yearly.columns = ["year", "station", "mean_aqi"]
    years = sorted(yearly["year"].unique())
    result = []
    for s in yearly["station"].unique():
        s_data = yearly[yearly["station"] == s]
        for i, yr in enumerate(years[1:], 1):
            curr = s_data[s_data["year"] == yr]["mean_aqi"].values
            prev = s_data[s_data["year"] == years[i - 1]]["mean_aqi"].values
            if len(curr) and len(prev):
                result.append({
                    "station": s,
                    "year":    int(yr),
                    "delta":   round(float(curr[0] - prev[0]), 2),
                })
    return result


@router.get("/volatility")
def get_volatility(pollutant: str = Query(default="PM2_5_AQI")):
    col = resolve_pollutant(pollutant)
    df = load_df()
    vol = (
        df.groupby("Station")[col]
        .std()
        .round(2)
        .reset_index()
        .sort_values(col, ascending=False)
    )
    vol.columns = ["station", "std_aqi"]
    return vol.to_dict(orient="records")
