import csv
from pathlib import Path
from functools import lru_cache

CSV_DIR = Path(__file__).resolve().parent / "csv"


@lru_cache(maxsize=None)
def load_csv(filename: str) -> list[dict]:
    path = CSV_DIR / filename
    if not path.exists():
        return []
    with open(path, newline="", encoding="utf-8-sig") as f:
        return list(csv.DictReader(f))
