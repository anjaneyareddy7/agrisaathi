import json
import uuid
from pathlib import Path
from datetime import datetime, timezone
from filelock import FileLock

STORAGE_FILE = Path(__file__).resolve().parent.parent / "data" / "storage" / "soil_records.json"
LOCK_FILE = str(STORAGE_FILE) + ".lock"

def _load():
    if not STORAGE_FILE.exists():
        return []
    with open(STORAGE_FILE) as f:
        return json.load(f)

def _save(records):
    STORAGE_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(STORAGE_FILE, "w") as f:
        json.dump(records, f, indent=2)

def list_records(order="-test_date"):
    records = _load()
    field = order.lstrip("-")
    descending = order.startswith("-")
    records.sort(key=lambda r: r.get(field) or "", reverse=descending)
    return records

def create_record(payload: dict):
    with FileLock(LOCK_FILE):
        records = _load()
        record = {
            **payload,
            "id": str(uuid.uuid4()),
            "created_date": datetime.now(timezone.utc).isoformat(),
        }
        records.insert(0, record)
        _save(records)
        return record
