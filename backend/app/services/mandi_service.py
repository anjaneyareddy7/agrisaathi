import httpx
from app.core.config import settings
from app.services.price_history_service import record_snapshot

DATA_GOV_RESOURCE_ID = "9ef84268-d588-465a-a308-a864a43d0070"
DATA_GOV_BASE = f"https://api.data.gov.in/resource/{DATA_GOV_RESOURCE_ID}"

# Force IPv4 -- works around a common ReadTimeout caused by broken IPv6 routes
_transport = httpx.AsyncHTTPTransport(local_address="0.0.0.0")

DEFAULT_HEADERS = {
    "User-Agent": "AgriSaathi/1.0 (+https://agri-saathi-grow.base44.app)",
}


async def get_mandi_prices(state: str = None, commodity: str = None, limit: int = 20):
    api_key = settings.data_gov_api_key or "579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b"
    params = {
        "api-key": api_key,
        "format": "json",
        "limit": limit,
    }
    if state:
        params["filters[state.keyword]"] = state
    if commodity:
        params["filters[commodity]"] = commodity

    try:
        async with httpx.AsyncClient(timeout=20, transport=_transport, headers=DEFAULT_HEADERS) as client:
            resp = await client.get(DATA_GOV_BASE, params=params)
            resp.raise_for_status()
            data = resp.json()

        records = data.get("records", [])
        note = None
        if api_key.startswith("579b464db00"):
            note = "Using data.gov.in's public sample key -- limited and often rate-limited. Register at data.gov.in for a full key."

        if not records:
            raise ValueError("empty records from live API")

        # Only real, live records feed price-change alerts — never the
        # static sample fallback, which would produce fake "changes".
        normalized = []
        for r in records:
            try:
                normalized.append({
                    "market": r.get("market"),
                    "commodity": r.get("commodity"),
                    "modal_price": float(r.get("modal_price")) if r.get("modal_price") not in (None, "") else None,
                })
            except (TypeError, ValueError):
                continue
        record_snapshot(normalized)

        return {"records": records, "source": "data.gov.in", "note": note}

    except Exception as e:
        import logging
        logging.getLogger(__name__).warning(f"Mandi price live fetch failed ({type(e).__name__}: {e}), using sample fallback")
        from app.data.mandi_sample import MANDI_SAMPLE_DATA
        filtered = MANDI_SAMPLE_DATA
        if state:
            filtered = [r for r in filtered if r["state"].lower() == state.lower()]
        if commodity:
            filtered = [r for r in filtered if r["commodity"].lower() == commodity.lower()]
        return {
            "records": filtered or MANDI_SAMPLE_DATA[:limit],
            "source": "sample_fallback",
            "note": "Live data.gov.in call failed (rate limit or network) -- showing bundled sample data.",
        }
