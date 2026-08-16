"""
Tamper-evident hash-chain for Agri Helper advisory exchanges.
This is an HONEST local implementation (SHA-256 hash chain), NOT a real
distributed blockchain. Label it correctly in the UI: "Tamper-evident
record" rather than "Blockchain anchored" unless/until a real external
anchoring provider is wired in later (see production spec, section 4).

Stored as an append-only JSON log for now. Swap this for a proper DB table
or your existing blockchain_ledger.py once you show me its interface —
this file is self-contained on purpose so it can't break your build.
"""
import hashlib
import json
import os
import time
from typing import Optional

LEDGER_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "data", "advisory_ledger.jsonl")


def _last_hash() -> str:
    if not os.path.exists(LEDGER_PATH):
        return "0" * 64  # genesis
    last_line = None
    with open(LEDGER_PATH, "r", encoding="utf-8") as f:
        for line in f:
            if line.strip():
                last_line = line
    if not last_line:
        return "0" * 64
    return json.loads(last_line)["record_hash"]


def append_record(
    request_type: str,
    user_input_text: str,
    advice_output: str,
    sources: list[str],
    model_name: str = "rag+groq",
) -> str:
    """Appends a tamper-evident record and returns its hash."""
    previous_hash = _last_hash()
    payload = {
        "previous_record_hash": previous_hash,
        "request_type": request_type,
        "user_input_text": user_input_text,
        "advice_output": advice_output,
        "sources": sources,
        "model_name": model_name,
        "created_at": time.time(),
    }
    record_hash = hashlib.sha256(
        json.dumps(payload, sort_keys=True).encode("utf-8")
    ).hexdigest()
    payload["record_hash"] = record_hash

    os.makedirs(os.path.dirname(LEDGER_PATH), exist_ok=True)
    with open(LEDGER_PATH, "a", encoding="utf-8") as f:
        f.write(json.dumps(payload) + "\n")

    return record_hash


def verify_chain() -> bool:
    """Walks the whole ledger and confirms no record was altered/removed."""
    if not os.path.exists(LEDGER_PATH):
        return True
    prev = "0" * 64
    with open(LEDGER_PATH, "r", encoding="utf-8") as f:
        for line in f:
            if not line.strip():
                continue
            rec = json.loads(line)
            if rec["previous_record_hash"] != prev:
                return False
            check = dict(rec)
            stored_hash = check.pop("record_hash")
            recomputed = hashlib.sha256(json.dumps(check, sort_keys=True).encode("utf-8")).hexdigest()
            if recomputed != stored_hash:
                return False
            prev = stored_hash
    return True
