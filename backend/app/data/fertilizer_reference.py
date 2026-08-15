CROP_NPK_PER_HECTARE = {
    "Rice": {"n": 120, "p": 60, "k": 40},
    "Wheat": {"n": 120, "p": 60, "k": 40},
    "Maize": {"n": 150, "p": 75, "k": 40},
    "Cotton": {"n": 100, "p": 50, "k": 50},
    "Sugarcane": {"n": 280, "p": 90, "k": 90},
    "Groundnut": {"n": 20, "p": 40, "k": 40},
    "Soybean": {"n": 30, "p": 60, "k": 40},
    "Tomato": {"n": 150, "p": 100, "k": 100},
    "Chilli": {"n": 100, "p": 50, "k": 50},
    "Onion": {"n": 100, "p": 50, "k": 50},
    "Potato": {"n": 150, "p": 80, "k": 100},
    "Bajra": {"n": 60, "p": 30, "k": 20},
    "Jowar": {"n": 80, "p": 40, "k": 20},
    "Gram": {"n": 20, "p": 40, "k": 20},
    "Mustard": {"n": 80, "p": 40, "k": 20},
}

STATE_SOIL_PROFILES = [
    {"state": "Telangana", "dominant_soil_type": "Red loamy / Black cotton", "typical_ph_range": "6.5-7.5"},
    {"state": "Andhra Pradesh", "dominant_soil_type": "Red sandy / Alluvial", "typical_ph_range": "6.0-7.5"},
    {"state": "Punjab", "dominant_soil_type": "Alluvial", "typical_ph_range": "7.0-8.0"},
    {"state": "Maharashtra", "dominant_soil_type": "Black cotton (regur)", "typical_ph_range": "7.0-8.5"},
    {"state": "Uttar Pradesh", "dominant_soil_type": "Alluvial", "typical_ph_range": "6.5-7.5"},
    {"state": "Tamil Nadu", "dominant_soil_type": "Red loamy / Laterite", "typical_ph_range": "6.0-7.0"},
    {"state": "Karnataka", "dominant_soil_type": "Red sandy / Black cotton", "typical_ph_range": "6.0-7.5"},
    {"state": "Gujarat", "dominant_soil_type": "Black cotton / Sandy", "typical_ph_range": "7.0-8.5"},
    {"state": "Madhya Pradesh", "dominant_soil_type": "Black cotton", "typical_ph_range": "7.0-8.0"},
    {"state": "Bihar", "dominant_soil_type": "Alluvial", "typical_ph_range": "6.5-7.5"},
    {"state": "West Bengal", "dominant_soil_type": "Alluvial / Laterite", "typical_ph_range": "5.5-7.0"},
    {"state": "Rajasthan", "dominant_soil_type": "Sandy / Arid", "typical_ph_range": "7.5-8.5"},
]

AREA_TO_HECTARE = {
    "acre": 0.4047,
    "hectare": 1.0,
    "guntha": 0.0101,
}
