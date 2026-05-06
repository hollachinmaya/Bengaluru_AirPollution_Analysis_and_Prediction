"""
app/routers/prediction.py
CNN-LSTM model with enriched feature engineering based on the research paper.
   - 14-day sliding window  (SEQ_LEN)
   - Two Conv1D layers + BatchNorm
   - LSTM x2
"""
from fastapi import APIRouter, HTTPException
import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
from app.core import load_df, FEATURES, TARGET, SEQ_LEN

router = APIRouter()

try:
    import tensorflow as tf
    from tensorflow.keras.models import Model
    from tensorflow.keras.layers import (
        Input, Conv1D, LSTM, Dense,
        Dropout, BatchNormalization
    )
    from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau
    from tensorflow.keras.optimizers import Adam
    TF_AVAILABLE = True
    tf.get_logger().setLevel('ERROR')
except ImportError:
    TF_AVAILABLE = False

_model_cache: dict = {}


def _build_cnn_lstm(seq_len, n_features):
    """Lightweight CNN → LSTM → Dense head optimised for CPU inference."""
    inp = Input(shape=(seq_len, n_features))

    # --- CNN block (32 filters for speed) ---
    x = Conv1D(32, kernel_size=3, activation='relu', padding='same')(inp)
    x = Conv1D(32, kernel_size=3, activation='relu', padding='same')(x)
    x = BatchNormalization()(x)

    # --- LSTM block (32 units for speed) ---
    x = LSTM(32, return_sequences=True)(x)
    x = LSTM(32, return_sequences=False)(x)
    x = Dropout(0.2)(x)

    # --- Dense head ---
    out = Dense(1)(x)

    model = Model(inp, out)
    model.compile(optimizer=Adam(1e-3), loss='mse', metrics=['mae'])
    return model


def _make_seqs(X, y, s):
    Xs, ys = [], []
    for i in range(s, len(X)):
        Xs.append(X[i-s:i])
        ys.append(y[i])
    return np.array(Xs), np.array(ys)


def _train_station(station):
    if station in _model_cache:
        return _model_cache[station]

    if not TF_AVAILABLE:
        raise HTTPException(503,
            "TensorFlow not installed. Run: pip install tensorflow  then restart uvicorn.")

    np.random.seed(42)
    tf.random.set_seed(42)

    df  = load_df()
    sdf = (df[df["Station"] == station]
           .dropna(subset=FEATURES + [TARGET])
           .sort_values("Timestamp").reset_index(drop=True))

    if len(sdf) < 150:
        raise HTTPException(404, f"Not enough data for {station}")

    sx, sy = MinMaxScaler(), MinMaxScaler()
    Xs = sx.fit_transform(sdf[FEATURES].values)
    ys = sy.fit_transform(sdf[[TARGET]].values).flatten()
    yr = sdf[TARGET].values

    seq = SEQ_LEN   # lookback window
    Xq, yq = _make_seqs(Xs, ys, seq)
    yrq    = yr[seq:]
    sp     = int(len(Xq) * 0.8)

    Xtr, Xte   = Xq[:sp], Xq[sp:]
    ytr        = yq[:sp]
    yte_r      = yrq[sp:]

    model   = _build_cnn_lstm(seq, len(FEATURES))
    history = model.fit(
        Xtr, ytr, validation_split=0.1, epochs=60, batch_size=32,
        callbacks=[
            EarlyStopping(monitor='val_loss', patience=10,
                          restore_best_weights=True, verbose=0),
            ReduceLROnPlateau(monitor='val_loss', factor=0.5,
                              patience=5, min_lr=1e-6, verbose=0),
        ], verbose=0,
    )

    cnn_pred = np.clip(
        sy.inverse_transform(model.predict(Xte, verbose=0)).flatten(), 0, 500)

    train_loss = [round(float(v), 6) for v in history.history['loss']]
    val_loss   = [round(float(v), 6) for v in history.history['val_loss']]

    def met(a, p):
        return dict(rmse=round(float(np.sqrt(mean_squared_error(a, p))), 2),
                    mae =round(float(mean_absolute_error(a, p)), 2),
                    r2  =round(float(r2_score(a, p)), 4))

    # Feature Importance (Proxy since RF is removed)
    fi = []

    n       = min(120, len(yte_r))
    idx     = np.linspace(0, len(yte_r)-1, n, dtype=int)
    dates_a = sdf["Timestamp"].values[seq:][sp:]

    result = {
        "station":   station,
        "metrics":   {
            "CNN-LSTM": met(yte_r, cnn_pred),
        },
        "actual":    [round(float(yte_r[i]),   1) for i in idx],
        "predicted": [round(float(cnn_pred[i]), 1) for i in idx],
        "dates":     [str(pd.Timestamp(dates_a[i]).date()) for i in idx],
        "train_loss":  train_loss,
        "val_loss":    val_loss,
        "feature_importance": fi,
        "architecture": {
            "layers": [
                {"name":"Input",       "shape":f"(batch,{seq},{len(FEATURES)})", "type":"input",  "params":""},
                {"name":"Conv1D",      "shape":f"(batch,{seq},32)", "type":"conv",   "params":"filters=32, kernel=3, ReLU"},
                {"name":"Conv1D",      "shape":f"(batch,{seq},32)", "type":"conv",   "params":"filters=32, kernel=3, ReLU"},
                {"name":"BatchNorm",   "shape":f"(batch,{seq},32)", "type":"pool",   "params":"Stabilises training"},
                {"name":"LSTM",        "shape":f"(batch,{seq},32)", "type":"lstm",   "params":"units=32, return_seq=True"},
                {"name":"LSTM",        "shape":"(batch,32)",        "type":"lstm",   "params":"units=32, return_seq=False"},
                {"name":"Dropout",     "shape":"(batch,32)",        "type":"pool",   "params":"rate=0.2"},
                {"name":"Output",      "shape":"(batch,1)",         "type":"output", "params":"AQI forecast"},
            ],
            "total_params": int(model.count_params()),
            "optimizer":    "Adam lr=1e-3 + ReduceLROnPlateau",
            "loss":         "MSE",
            "seq_len":      seq,
            "features":     FEATURES,
        },
    }
    _model_cache[station] = result
    return result


@router.get("/train/{station}")
def train_station(station: str): return _train_station(station)

@router.get("/metrics/{station}")
def get_metrics(station: str):
    d = _train_station(station)
    return {"station": station, "metrics": d["metrics"]}

@router.get("/forecast/{station}")
def get_forecast(station: str):
    d = _train_station(station)
    return {"station": station, "actual": d["actual"],
            "predicted": d["predicted"], "dates": d["dates"]}

@router.get("/loss/{station}")
def get_loss(station: str):
    d = _train_station(station)
    return {"station": station, "train_loss": d["train_loss"],
            "val_loss": d["val_loss"],
            "epochs": list(range(1, len(d["train_loss"])+1))}

@router.get("/feature-importance/{station}")
def get_feature_importance(station: str):
    d = _train_station(station)
    return {"station": station, "importance": d["feature_importance"]}

@router.get("/architecture")
def get_architecture():
    seq = SEQ_LEN
    return {"layers":[
        {"name":"Input",     "shape":f"(batch,{seq},{len(FEATURES)})", "type":"input",  "params":""},
        {"name":"Conv1D",    "shape":f"(batch,{seq},32)", "type":"conv",   "params":"filters=32, kernel=3, ReLU"},
        {"name":"Conv1D",    "shape":f"(batch,{seq},32)", "type":"conv",   "params":"filters=32, kernel=3, ReLU"},
        {"name":"BatchNorm", "shape":f"(batch,{seq},32)", "type":"pool",   "params":"Stabilises training"},
        {"name":"LSTM",      "shape":f"(batch,{seq},32)", "type":"lstm",   "params":"units=32, return_seq=True"},
        {"name":"LSTM",      "shape":"(batch,32)",        "type":"lstm",   "params":"units=32, return_seq=False"},
        {"name":"Dropout",   "shape":"(batch,32)",        "type":"pool",   "params":"rate=0.2"},
        {"name":"Output",    "shape":"(batch,1)",         "type":"output", "params":"AQI forecast"},
    ], "total_params":"~18,000", "optimizer":"Adam lr=1e-3", "loss":"MSE",
       "seq_len":seq, "features":FEATURES}
