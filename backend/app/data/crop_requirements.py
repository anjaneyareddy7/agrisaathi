# Reference agronomic requirements for common Indian crops.
# TODO_API: replace with data.gov.in crop/soil requirement dataset once
# the API key is active. Keep this exact shape so the route/frontend
# don't need to change, only the data source.

CROP_REQUIREMENTS = [
    {"crop": "Rice", "soil_ph": "5.5–6.5", "nitrogen_kg_ha": "100–120", "phosphorus_kg_ha": "50–60",
     "potassium_kg_ha": "50–60", "moisture": "Standing water 5cm during vegetative stage",
     "temperature_c": "20–35", "water_requirement": "High (1200–1500mm/season)"},
    {"crop": "Wheat", "soil_ph": "6.0–7.5", "nitrogen_kg_ha": "120–150", "phosphorus_kg_ha": "60",
     "potassium_kg_ha": "40", "moisture": "Field capacity, avoid waterlogging",
     "temperature_c": "10–25", "water_requirement": "Medium (450–650mm/season)"},
    {"crop": "Cotton", "soil_ph": "6.0–8.0", "nitrogen_kg_ha": "80–120", "phosphorus_kg_ha": "40–60",
     "potassium_kg_ha": "40–60", "moisture": "Moderate, avoid waterlogging",
     "temperature_c": "21–30", "water_requirement": "Medium (700–1300mm/season)"},
    {"crop": "Maize", "soil_ph": "5.8–7.0", "nitrogen_kg_ha": "120–150", "phosphorus_kg_ha": "60–80",
     "potassium_kg_ha": "40–60", "moisture": "Field capacity, no waterlogging",
     "temperature_c": "18–27", "water_requirement": "Medium (500–800mm/season)"},
    {"crop": "Sugarcane", "soil_ph": "6.5–7.5", "nitrogen_kg_ha": "250–300", "phosphorus_kg_ha": "80–100",
     "potassium_kg_ha": "100–120", "moisture": "High, consistent irrigation",
     "temperature_c": "20–35", "water_requirement": "Very high (1800–2500mm/season)"},
    {"crop": "Groundnut", "soil_ph": "6.0–6.5", "nitrogen_kg_ha": "20–25", "phosphorus_kg_ha": "40–50",
     "potassium_kg_ha": "40–50", "moisture": "Light, sandy loam preferred",
     "temperature_c": "25–30", "water_requirement": "Low–Medium (500–700mm/season)"},
    {"crop": "Soybean", "soil_ph": "6.0–7.5", "nitrogen_kg_ha": "20–30", "phosphorus_kg_ha": "60–80",
     "potassium_kg_ha": "40", "moisture": "Well-drained, moderate moisture",
     "temperature_c": "20–30", "water_requirement": "Medium (450–700mm/season)"},
    {"crop": "Tomato", "soil_ph": "6.0–6.8", "nitrogen_kg_ha": "100–150", "phosphorus_kg_ha": "60–80",
     "potassium_kg_ha": "100–120", "moisture": "Consistent, avoid fluctuation",
     "temperature_c": "20–27", "water_requirement": "Medium (400–600mm/season)"},
    {"crop": "Chilli", "soil_ph": "6.0–7.0", "nitrogen_kg_ha": "100–120", "phosphorus_kg_ha": "50–60",
     "potassium_kg_ha": "50–60", "moisture": "Well-drained, moderate",
     "temperature_c": "20–30", "water_requirement": "Medium (600–800mm/season)"},
    {"crop": "Turmeric", "soil_ph": "5.5–7.5", "nitrogen_kg_ha": "60–120", "phosphorus_kg_ha": "50–60",
     "potassium_kg_ha": "100–120", "moisture": "High, well-drained loam",
     "temperature_c": "20–30", "water_requirement": "High (1500–2000mm/season)"},
]
