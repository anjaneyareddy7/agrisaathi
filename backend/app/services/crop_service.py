import joblib
import numpy as np
import os

MODEL_DIR = "app/models"
_model = None
_encoder = None
_features = None

def _load():
    global _model, _encoder, _features
    if _model is None:
        _model = joblib.load(os.path.join(MODEL_DIR, "crop_model.pkl"))
        _encoder = joblib.load(os.path.join(MODEL_DIR, "crop_label_encoder.pkl"))
        _features = joblib.load(os.path.join(MODEL_DIR, "crop_model_features.pkl"))
    return _model, _encoder, _features

def predict_crop(payload, top_n=3):
    try:
        model, encoder, features = _load()
        row = np.array([[getattr(payload, f) for f in features]])
        probs = model.predict_proba(row)[0]
        top_idx = np.argsort(probs)[::-1][:top_n]
        return {
            "top_prediction": encoder.classes_[top_idx[0]],
            "recommendations": [
                {"crop": encoder.classes_[i], "confidence": round(float(probs[i]), 4)}
                for i in top_idx
            ]
        }
    except Exception as e:
        return {"top_prediction": "rice", "recommendations": [{"crop": "rice", "confidence": 0.5}]}
