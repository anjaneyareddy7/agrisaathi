import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score
import joblib
import os

DATA_PATH = "data/crop_recommendation.csv"
MODEL_DIR = "app/models"
os.makedirs(MODEL_DIR, exist_ok=True)

try:
    df = pd.read_csv(DATA_PATH)
    FEATURES = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]
    X = df[FEATURES]
    le = LabelEncoder()
    y = le.fit_transform(df["label"])

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    acc = accuracy_score(y_test, model.predict(X_test))
    print(f"✅ Model accuracy: {acc:.4f}")

    joblib.dump(model, os.path.join(MODEL_DIR, "crop_model.pkl"))
    joblib.dump(le, os.path.join(MODEL_DIR, "crop_label_encoder.pkl"))
    joblib.dump(FEATURES, os.path.join(MODEL_DIR, "crop_model_features.pkl"))
    print("✅ Model saved to app/models/")
except Exception as e:
    print(f"⚠️  Model training skipped: {e}")
