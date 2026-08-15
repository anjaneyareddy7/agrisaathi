from app.data.fertilizer_requirements import CROP_NPK_PER_HA, ACRE_TO_HECTARE, GUNTHA_TO_ACRE

DISCLAIMER = "Estimates only. Always confirm with a soil test."

def calculate_fertilizer(payload):
    crop_key = payload.crop.strip().lower()
    if crop_key not in CROP_NPK_PER_HA:
        return None

    total_acres = payload.acres + (payload.guntha * GUNTHA_TO_ACRE)
    total_hectares = total_acres * ACRE_TO_HECTARE
    req = CROP_NPK_PER_HA[crop_key]

    def block(nutrient, soil_val):
        recommended = req[nutrient] * total_hectares
        supplied = (soil_val * total_hectares) if soil_val is not None else 0
        return {
            "recommended_kg": round(recommended, 2),
            "soil_supplies_kg": round(supplied, 2),
            "dosage_needed_kg": round(max(recommended - supplied, 0), 2),
        }

    ph_note = "Soil pH is in normal range." if payload.soil_ph is None else (
        "Soil is acidic. Consider liming." if payload.soil_ph < 6.0 else
        "Soil is alkaline. Consider gypsum." if payload.soil_ph > 7.5 else
        "Soil pH is in normal range."
    )

    return {
        "crop": crop_key,
        "total_area_acres": round(total_acres, 3),
        "total_area_hectares": round(total_hectares, 3),
        "N": block("N", payload.soil_n),
        "P": block("P", payload.soil_p),
        "K": block("K", payload.soil_k),
        "ph_note": ph_note,
        "disclaimer": DISCLAIMER,
    }
