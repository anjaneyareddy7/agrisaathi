"""
Tests whether api.data.gov.in silently stalls requests based on User-Agent /
header fingerprint. curl succeeds, every Python client fails identically --
this isolates exactly which header(s) matter.
Run with: python3 diagnose_useragent.py
"""
import time
import requests
from app.core.config import settings

URL = "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070"
BASE_PARAMS = {
    "api-key": settings.data_gov_api_key,
    "format": "json",
    "limit": 3,
    "filters[state.keyword]": "Telangana",
}

# Each variant changes only the User-Agent so we can see exactly what curl
# has that requests/httpx don't.
UA_VARIANTS = {
    "requests default (baseline, expected to fail)": None,
    "curl-mimicking UA":                             "curl/8.4.0",
    "real Chrome UA":                                 "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "generic Mozilla token only":                     "Mozilla/5.0",
    "empty User-Agent string":                        "",
}

def run_variant(label, ua_value, timeout=12):
    print(f"\n--- {label} ---")
    headers = {}
    if ua_value is not None:
        headers["User-Agent"] = ua_value
    try:
        start = time.time()
        resp = requests.get(URL, params=BASE_PARAMS, headers=headers, timeout=timeout)
        elapsed = time.time() - start
        n = len(resp.json().get("records", []))
        print(f"SUCCESS in {elapsed:.2f}s -- status {resp.status_code}, {n} records")
        return True
    except requests.exceptions.ReadTimeout:
        print(f"FAILED: ReadTimeout after {timeout}s")
        return False
    except Exception as e:
        print(f"FAILED: {type(e).__name__}: {e}")
        return False

if __name__ == "__main__":
    print(f"Testing {URL}")
    print(f"Key loaded from settings: {'yes' if settings.data_gov_api_key else 'NO -- check .env'}")
    results = {}
    for label, ua in UA_VARIANTS.items():
        results[label] = run_variant(label, ua)

    print("\n=== SUMMARY ===")
    for label, ok in results.items():
        print(f"{'PASS' if ok else 'FAIL'}  -- {label}")
