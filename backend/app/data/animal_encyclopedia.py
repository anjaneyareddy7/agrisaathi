# Reference data for common Indian livestock/aquaculture categories.
# TODO_API: replace with data.gov.in livestock/animal husbandry dataset
# once API key is available — keep the same shape (category, breeds,
# vaccination_schedule, feed, environment, yield_timeline) so the
# frontend and route below don't need to change, only this file's source.

ANIMAL_CATEGORIES = [
    {
        "category": "poultry",
        "label": "Poultry (Layer/Broiler)",
        "breeds": ["Broiler", "Layer (BV-300)", "Kadaknath", "Vanaraja"],
        "vaccination_schedule": [
            {"age": "Day 1", "vaccine": "Marek's Disease", "route": "Subcutaneous"},
            {"age": "Day 7", "vaccine": "Newcastle Disease (Lasota)", "route": "Eye drop"},
            {"age": "Day 14", "vaccine": "Infectious Bursal Disease (IBD)", "route": "Drinking water"},
            {"age": "Day 21", "vaccine": "IBD booster", "route": "Drinking water"},
            {"age": "Day 28", "vaccine": "Newcastle Disease booster", "route": "Drinking water"},
        ],
        "feed": "Starter mash (0-3 wks, 21-23% protein), grower mash (3-6 wks), layer/finisher mash after",
        "environment": "28-32°C brooding temp, dry bedding, 16 hrs light/day for layers",
        "yield_timeline": "Broilers: market-ready in 6 weeks. Layers: start laying at 18-20 weeks.",
    },
    {
        "category": "dairy",
        "label": "Dairy Cattle/Buffalo",
        "breeds": ["Gir", "Sahiwal", "Murrah Buffalo", "HF Crossbred"],
        "vaccination_schedule": [
            {"age": "4 months", "vaccine": "Foot and Mouth Disease (FMD)", "route": "Intramuscular, repeat every 6 months"},
            {"age": "6 months", "vaccine": "Haemorrhagic Septicaemia (HS)", "route": "Annual, before monsoon"},
            {"age": "6 months", "vaccine": "Black Quarter (BQ)", "route": "Annual"},
            {"age": "8 months", "vaccine": "Brucellosis (females only, once)", "route": "Subcutaneous"},
        ],
        "feed": "Green fodder + dry fodder + concentrate mix (1kg concentrate per 2.5L milk yield)",
        "environment": "Well-ventilated shed, 4-5 sq.m per animal, clean water ad-lib",
        "yield_timeline": "First calving ~30 months, lactation ~305 days, dry period ~60 days",
    },
    {
        "category": "fisheries",
        "label": "Freshwater Fisheries",
        "breeds": ["Rohu", "Catla", "Mrigal", "Pangasius", "Tilapia"],
        "vaccination_schedule": [
            {"age": "N/A", "vaccine": "No standard vaccination — focus on water quality and biosecurity", "route": "N/A"},
        ],
        "feed": "Floating pellet feed, 3-5% of body weight/day, protein 25-35% depending on stage",
        "environment": "Pond depth 1.5-2m, dissolved oxygen >5mg/L, pH 6.5-8.5, stocking 5000-8000/acre",
        "yield_timeline": "Harvest in 8-10 months, average 2-3 tonnes/acre/year",
    },
    {
        "category": "apiculture",
        "label": "Apiculture (Beekeeping)",
        "breeds": ["Apis mellifera", "Apis cerana indica"],
        "vaccination_schedule": [
            {"age": "N/A", "vaccine": "No vaccination — monitor for Varroa mites and disease signs", "route": "N/A"},
        ],
        "feed": "Sugar syrup (1:1) during dearth period, natural forage otherwise",
        "environment": "Away from pesticide spraying, flowering plants within 2-3km, shade for hives",
        "yield_timeline": "Honey harvest 2-3 times/year, 20-25kg/colony/year average",
    },
    {
        "category": "aquaculture_prawns",
        "label": "Prawn/Shrimp Farming",
        "breeds": ["Vannamei (Litopenaeus vannamei)", "Black Tiger Prawn (Penaeus monodon)"],
        "vaccination_schedule": [
            {"age": "N/A", "vaccine": "No vaccination — biosecurity and water quality management critical", "route": "N/A"},
        ],
        "feed": "Formulated shrimp feed, 3-8% body weight/day, protein 32-38%",
        "environment": "Salinity 15-25 ppt, pH 7.5-8.5, aeration required, pond liner recommended",
        "yield_timeline": "Harvest in 90-120 days, 2 crops/year possible in favorable climate",
    },
    {
        "category": "small_ruminants",
        "label": "Goat/Sheep Herd",
        "breeds": ["Osmanabadi", "Boer", "Deccani (sheep)", "Nellore (sheep)"],
        "vaccination_schedule": [
            {"age": "3 months", "vaccine": "Peste des Petits Ruminants (PPR)", "route": "Subcutaneous, annual"},
            {"age": "6 months", "vaccine": "Enterotoxaemia (ET)", "route": "Before monsoon, annual"},
            {"age": "6 months", "vaccine": "Foot and Mouth Disease (FMD)", "route": "Every 6 months"},
        ],
        "feed": "Grazing + concentrate supplement (200-300g/day for lactating does)",
        "environment": "Raised slatted-floor shed, 1-1.5 sq.m per adult, good ventilation",
        "yield_timeline": "Goats: kidding at 12-15 months, 2 kiddings in 3 years typical",
    },
]


# Flat per-animal list, derived from ANIMAL_CATEGORIES above.
# This is what app/services/livestock_service.py expects: one entry per
# breed, each carrying its category's reference data. Keeping ANIMAL_CATEGORIES
# (grouped) AND ANIMAL_ENCYCLOPEDIA (flat) both available so neither the
# pre-existing livestock encyclopedia service nor the newer category-view
# route/page need to change shape.
ANIMAL_ENCYCLOPEDIA = [
    {
        "name_en": breed,
        "category": cat["category"],
        "category_label": cat["label"],
        "vaccination_schedule": cat["vaccination_schedule"],
        "feed": cat["feed"],
        "environment": cat["environment"],
        "yield_timeline": cat["yield_timeline"],
    }
    for cat in ANIMAL_CATEGORIES
    for breed in cat["breeds"]
]
