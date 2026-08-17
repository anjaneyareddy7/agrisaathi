"""
Persists mandi price snapshots to disk so % change can be computed over
time. Every call to get_mandi_prices() should also call record_snapshot()
so history accumulates naturally as the app is used — no separate cron
job required for an MVP.
"""
import json
from pathlib import Path
from datetime import datetime, timezone

HISTORY_FILE = Path(__file__).resolve().parents[1] / "data" / "mandi_price_history.jsonl"
CHANGE_THRESHOLD_PCT = 5.0


def record_snapshot(prices: list[dict]):
    """Append today's fetched prices to the history file, one line per record."""
    HISTORY_FILE.parent.mkdir(parents=True, exist_ok=True)
    now = datetime.now(timezone.utc).isoformat()
    with open(HISTORY_FILE, "a", encoding="utf-8") as f:
        for p in prices:
            row = {
                "recorded_at": now,
                "market": p.get("market"),
                "commodity": p.get("commodity"),
                "modal_price": p.get("modal_price"),
            }
            if row["market"] and row["commodity"] and row["modal_price"] is not None:
                f.write(json.dumps(row) + "\n")


def compute_price_alerts() -> list[dict]:
    """
    For each (market, commodity), compare the two most recent recorded
    snapshots. Flag a change of CHANGE_THRESHOLD_PCT% or more.
    """
    if not HISTORY_FILE.exists():
        return []

    by_key = {}
    with open(HISTORY_FILE, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            try:
                row = json.loads(line)
            except json.JSONDecodeError:
                continue
            key = (row["market"], row["commodity"])
            by_key.setdefault(key, []).append(row)

    alerts = []
    for (market, commodity), rows in by_key.items():
        rows.sort(key=lambda r: r["recorded_at"])
        if len(rows) < 2:
            continue
        prev, latest = rows[-2], rows[-1]
        if not prev["modal_price"] or prev["modal_price"] == 0:
            continue
        pct_change = ((latest["modal_price"] - prev["modal_price"]) / prev["modal_price"]) * 100
        if abs(pct_change) >= CHANGE_THRESHOLD_PCT:
            alerts.append({
                "market": market,
                "commodity": commodity,
                "previous_price": prev["modal_price"],
                "current_price": latest["modal_price"],
                "pct_change": round(pct_change, 1),
                "direction": "up" if pct_change > 0 else "down",
                "recorded_at": latest["recorded_at"],
            })
    return alerts
