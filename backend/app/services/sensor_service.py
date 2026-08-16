from app.data.crop_ph_tolerance import CROP_PH_TOLERANCE, classify_ph, water_quality_note

def analyze_soil(payload):
    samples = payload.ph_samples
    avg_ph = sum(samples) / len(samples)
    min_ph = min(samples)
    max_ph = max(samples)
    variation = round(max_ph - min_ph, 2)

    if variation > 1.0:
        variation_note = "High variation across samples — soil pH is inconsistent across the field. Consider testing zones separately."
    elif variation > 0.5:
        variation_note = "Moderate variation — soil is reasonably uniform but watch for pockets of imbalance."
    else:
        variation_note = "Low variation — soil pH is consistent across the sampled area."

    suitable = [
        crop for crop, (lo, hi) in CROP_PH_TOLERANCE.items()
        if lo <= avg_ph <= hi
    ]
    suitable.sort()

    return {
        "sample_count": len(samples),
        "avg_ph": round(avg_ph, 2),
        "min_ph": min_ph,
        "max_ph": max_ph,
        "variation": variation,
        "ph_classification": classify_ph(avg_ph),
        "variation_note": variation_note,
        "suitable_crops": suitable,
    }

def analyze_water(payload):
    ph_values = [s.ph for s in payload.samples if s.ph is not None]
    ec_values = [s.ec for s in payload.samples if s.ec is not None]
    avg_ph = round(sum(ph_values) / len(ph_values), 2) if ph_values else None
    avg_ec = round(sum(ec_values) / len(ec_values), 2) if ec_values else None

    issues = water_quality_note(avg_ph, avg_ec, payload.tds, payload.hardness)

    return {
        "sample_count": len(payload.samples),
        "avg_ph": avg_ph,
        "avg_ec": avg_ec,
        "issues": issues,
    }
