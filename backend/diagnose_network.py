"""
Standalone network diagnostic -- run directly with `python3 diagnose_network.py`,
NOT through uvicorn/FastAPI. Isolates whether the ReadTimeout is caused by
httpx specifically, async specifically, or something else entirely.
"""
import time
import asyncio

URL = "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070"
PARAMS = {
    "api-key": "579b464db66ec23bdd0000017e324eb11b8a405b7971615772704fd5",
    "format": "json",
    "limit": 3,
    "filters[state.keyword]": "Telangana",
}

def test_requests_sync():
    print("\n--- TEST 1: requests library (sync, no async, no httpx) ---")
    try:
        import requests
        start = time.time()
        resp = requests.get(URL, params=PARAMS, timeout=20)
        elapsed = time.time() - start
        print(f"SUCCESS in {elapsed:.2f}s -- status {resp.status_code}, {len(resp.json().get('records', []))} records")
    except Exception as e:
        print(f"FAILED: {type(e).__name__}: {e}")

def test_httpx_sync():
    print("\n--- TEST 2: httpx library, SYNC client (no async, no event loop) ---")
    try:
        import httpx
        start = time.time()
        resp = httpx.get(URL, params=PARAMS, timeout=20)
        elapsed = time.time() - start
        print(f"SUCCESS in {elapsed:.2f}s -- status {resp.status_code}, {len(resp.json().get('records', []))} records")
    except Exception as e:
        print(f"FAILED: {type(e).__name__}: {e}")

async def test_httpx_async():
    print("\n--- TEST 3: httpx library, ASYNC client (plain asyncio, no uvicorn) ---")
    try:
        import httpx
        start = time.time()
        async with httpx.AsyncClient(timeout=20) as client:
            resp = await client.get(URL, params=PARAMS)
        elapsed = time.time() - start
        print(f"SUCCESS in {elapsed:.2f}s -- status {resp.status_code}, {len(resp.json().get('records', []))} records")
    except Exception as e:
        print(f"FAILED: {type(e).__name__}: {e}")

def test_httpx_async_uvloop():
    print("\n--- TEST 4: httpx async client, explicitly running under uvloop (matches uvicorn's real event loop) ---")
    try:
        import uvloop
        uvloop.install()
        print("uvloop installed for this test")
    except ImportError:
        print("uvloop not installed -- skipping this test")
        return
    asyncio.run(test_httpx_async())

if __name__ == "__main__":
    print(f"Python HTTP diagnostic -- testing {URL}")
    test_requests_sync()
    test_httpx_sync()
    asyncio.run(test_httpx_async())
    test_httpx_async_uvloop()
    print("\n--- DONE ---")
