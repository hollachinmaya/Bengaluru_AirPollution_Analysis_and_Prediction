"""
app/routers/temporal.py
Seasonal, yearly, and weekday-weekend temporal decomposition.
Supports ?pollutant=PM2_5_AQI|SO2_AQI|NO2_AQI on all endpoints.
"""
from fastapi import APIRouter, Query
from app.core import load_df, MONTH_NAMES, resolve_pollutant

router = APIRouter()


@router.get("/seasonal")
def get_seasonal(pollutant: str = Query(default="PM2_5_AQI")):
    col = resolve_pollutant(pollutant)
    df = load_df()
    monthly = (
        df.groupby("Month")[col]
        .mean()
        .round(2)
        .reset_index()
    )
    monthly["month_name"] = monthly["Month"].apply(lambda x: MONTH_NAMES[x - 1])
    monthly = monthly.rename(columns={col: "value"})
    monthly["pollutant"] = pollutant
    return monthly.to_dict(orient="records")


@router.get("/seasonal/{station}")
def get_seasonal_station(station: str, pollutant: str = Query(default="PM2_5_AQI")):
    col = resolve_pollutant(pollutant)
    df = load_df()
    sdf = df[df["Station"] == station]
    monthly = (
        sdf.groupby("Month")[col]
        .mean()
        .round(2)
        .reset_index()
    )
    monthly["month_name"] = monthly["Month"].apply(lambda x: MONTH_NAMES[x - 1])
    monthly = monthly.rename(columns={col: "value"})
    monthly["pollutant"] = pollutant
    return monthly.to_dict(orient="records")


@router.get("/yearly")
def get_yearly(pollutant: str = Query(default="PM2_5_AQI")):
    col = resolve_pollutant(pollutant)
    df = load_df()
    yearly = (
        df.groupby(["Year", "Station"])[col]
        .mean()
        .round(2)
        .reset_index()
    )
    yearly.columns = ["year", "station", "mean_value"]
    yearly["pollutant"] = pollutant
    return yearly.to_dict(orient="records")


@router.get("/weekly")
def get_weekly(pollutant: str = Query(default="PM2_5_AQI")):
    col = resolve_pollutant(pollutant)
    df = load_df()
    order = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    weekly = (
        df.groupby("DayName")[col]
        .mean()
        .round(2)
        .reset_index()
    )
    weekly.columns = ["day", "mean_value"]
    weekly["order"] = weekly["day"].map({d: i for i, d in enumerate(order)})
    weekly = weekly.sort_values("order").drop(columns="order")

    weekday_avg = weekly[~weekly["day"].isin(["Sat", "Sun"])]["mean_value"].mean()
    weekend_avg = weekly[weekly["day"].isin(["Sat", "Sun"])]["mean_value"].mean()
    return {
        "data":        weekly.to_dict(orient="records"),
        "weekday_avg": round(float(weekday_avg), 2),
        "weekend_avg": round(float(weekend_avg), 2),
        "delta":       round(float(weekday_avg - weekend_avg), 2),
        "pollutant":   pollutant,
    }
