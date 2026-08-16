LIVESTOCK_DETAILS = {
    "Broiler": {
        "category": "poultry", "description": "Fast-growing meat chicken breed",
        "origin": "Cross-bred commercial line (India-wide)",
        "environment": {"housing": "Deep litter or cage system, well-ventilated shed", "space": "1 sq ft per bird", "temperature": "21-24°C brooding, ambient after 3 weeks"},
        "feed_schedule": [
            {"stage": "Starter (0-2 weeks)", "diet": "22-23% protein crumble feed"},
            {"stage": "Grower (2-4 weeks)", "diet": "20-21% protein pellet feed"},
            {"stage": "Finisher (4-6 weeks)", "diet": "18-19% protein feed"},
        ],
        "vaccination_schedule": [
            {"age": "Day 1", "vaccine": "Marek's disease (hatchery)"},
            {"age": "Day 7", "vaccine": "Newcastle Disease (Lasota)"},
            {"age": "Day 14", "vaccine": "Infectious Bursal Disease (IBD)"},
        ],
        "growth_timeline": [
            {"stage": "Chick", "duration": "0-2 weeks", "notes": "Brooding, high care"},
            {"stage": "Grower", "duration": "2-4 weeks", "notes": "Rapid weight gain"},
            {"stage": "Market ready", "duration": "5-6 weeks", "notes": "1.8-2.2 kg live weight"},
        ],
        "common_diseases": ["Newcastle Disease", "Coccidiosis", "Infectious Bursal Disease"],
        "quick_facts": {"maturity_days": "35-42", "yield": "1.8-2.2 kg live weight", "market_price_range": "₹90-140/kg live"},
    },
    "Layer (BV-300)": {
        "category": "poultry", "description": "Egg-laying hybrid chicken",
        "origin": "Commercial hybrid line",
        "environment": {"housing": "Cage system, 550-600 sq cm per bird", "space": "450-550 cm² per bird in cage", "temperature": "18-27°C optimal for laying"},
        "feed_schedule": [
            {"stage": "Chick (0-8 weeks)", "diet": "20% protein starter"},
            {"stage": "Grower (8-18 weeks)", "diet": "16% protein grower feed"},
            {"stage": "Layer (18+ weeks)", "diet": "16-18% protein, high calcium layer feed"},
        ],
        "vaccination_schedule": [
            {"age": "Day 1", "vaccine": "Marek's disease"},
            {"age": "Week 6", "vaccine": "Fowl Pox"},
            {"age": "Week 16-18", "vaccine": "Newcastle Disease booster"},
        ],
        "growth_timeline": [
            {"stage": "Chick", "duration": "0-8 weeks", "notes": "Growth phase"},
            {"stage": "Pullet", "duration": "8-18 weeks", "notes": "Pre-lay development"},
            {"stage": "Laying", "duration": "18-72 weeks", "notes": "Peak lay at 26-32 weeks"},
        ],
        "common_diseases": ["Newcastle Disease", "Fowl Typhoid", "Infectious Coryza"],
        "quick_facts": {"maturity_days": "126-140 to first egg", "yield": "280-300 eggs/year", "market_price_range": "₹5-6/egg"},
    },
    "Kadaknath": {
        "category": "poultry", "description": "Indigenous black-meat breed, prized for medicinal value",
        "origin": "Jhabua, Madhya Pradesh, India",
        "environment": {"housing": "Free-range or backyard system preferred", "space": "2-3 sq ft per bird free-range", "temperature": "Hardy, tolerates wide range"},
        "feed_schedule": [
            {"stage": "Chick (0-8 weeks)", "diet": "20% protein starter, can free-range forage"},
            {"stage": "Grower/Adult", "diet": "Grains, kitchen waste, forage supplemented with feed"},
        ],
        "vaccination_schedule": [
            {"age": "Day 7", "vaccine": "Newcastle Disease"},
            {"age": "Day 21", "vaccine": "IBD"},
        ],
        "growth_timeline": [
            {"stage": "Chick", "duration": "0-8 weeks", "notes": "Slow growth vs broiler"},
            {"stage": "Market ready", "duration": "16-20 weeks", "notes": "1-1.2 kg"},
        ],
        "common_diseases": ["Newcastle Disease", "Coccidiosis"],
        "quick_facts": {"maturity_days": "112-140", "yield": "1-1.2 kg, 80-100 eggs/year", "market_price_range": "₹800-1200/kg live"},
    },
    "Vanaraja": {
        "category": "poultry", "description": "Dual-purpose (meat+egg) breed for backyard rearing",
        "origin": "Developed by ICAR-DPR, Hyderabad",
        "environment": {"housing": "Backyard/free-range suited", "space": "2-3 sq ft per bird", "temperature": "Hardy, disease resistant"},
        "feed_schedule": [
            {"stage": "Chick (0-8 weeks)", "diet": "19-20% protein starter"},
            {"stage": "Grower/Adult", "diet": "Grain mix + forage, low-input feeding"},
        ],
        "vaccination_schedule": [
            {"age": "Day 7", "vaccine": "Newcastle Disease"},
            {"age": "Day 21", "vaccine": "IBD"},
        ],
        "growth_timeline": [
            {"stage": "Chick", "duration": "0-8 weeks", "notes": "Moderate growth"},
            {"stage": "Market ready", "duration": "12-14 weeks", "notes": "1.5-2 kg"},
        ],
        "common_diseases": ["Newcastle Disease", "Fowl Pox"],
        "quick_facts": {"maturity_days": "84-98", "yield": "1.5-2 kg, 120-140 eggs/year", "market_price_range": "₹200-300/kg live"},
    },
    "Gir": {
        "category": "dairy", "description": "Indigenous dairy cattle breed, heat tolerant",
        "origin": "Gir forests, Gujarat, India",
        "environment": {"housing": "Open shed with shade, well-drained floor", "space": "40-50 sq ft per animal", "temperature": "Highly heat and disease tolerant"},
        "feed_schedule": [
            {"stage": "Calf (0-3 months)", "diet": "Milk + calf starter"},
            {"stage": "Heifer", "diet": "Green fodder + concentrate 1-2 kg/day"},
            {"stage": "Lactating", "diet": "Green fodder, dry fodder, 1 kg concentrate per 2.5L milk"},
        ],
        "vaccination_schedule": [
            {"age": "4 months+", "vaccine": "Foot and Mouth Disease (6-monthly)"},
            {"age": "Annual", "vaccine": "Hemorrhagic Septicemia (before monsoon)"},
        ],
        "growth_timeline": [
            {"stage": "Calf", "duration": "0-6 months", "notes": "Milk-fed period"},
            {"stage": "Heifer", "duration": "6-30 months", "notes": "First calving ~30-36 months"},
            {"stage": "Lactation", "duration": "300 days/cycle", "notes": "Peak yield 60-90 days post-calving"},
        ],
        "common_diseases": ["Foot and Mouth Disease", "Mastitis", "Hemorrhagic Septicemia"],
        "quick_facts": {"maturity_days": "900-1080 (first calving)", "yield": "10-12 litres/day average", "market_price_range": "₹40-55/litre"},
    },
    "Sahiwal": {
        "category": "dairy", "description": "High-yielding indigenous dairy breed",
        "origin": "Punjab region (India/Pakistan)",
        "environment": {"housing": "Open shed, good ventilation", "space": "40-50 sq ft per animal", "temperature": "Heat tolerant, tick resistant"},
        "feed_schedule": [
            {"stage": "Calf (0-3 months)", "diet": "Milk + calf starter"},
            {"stage": "Heifer", "diet": "Green fodder + 1-2 kg concentrate/day"},
            {"stage": "Lactating", "diet": "Green + dry fodder, concentrate per yield"},
        ],
        "vaccination_schedule": [
            {"age": "4 months+", "vaccine": "FMD (6-monthly)"},
            {"age": "Annual", "vaccine": "Hemorrhagic Septicemia"},
        ],
        "growth_timeline": [
            {"stage": "Calf", "duration": "0-6 months", "notes": "Milk-fed"},
            {"stage": "Heifer", "duration": "6-30 months", "notes": "First calving ~30 months"},
            {"stage": "Lactation", "duration": "300 days/cycle", "notes": "10-16 L/day peak"},
        ],
        "common_diseases": ["Mastitis", "FMD", "Tick-borne diseases (lower risk)"],
        "quick_facts": {"maturity_days": "900-960 (first calving)", "yield": "10-16 litres/day average", "market_price_range": "₹40-55/litre"},
    },
    "Murrah Buffalo": {
        "category": "dairy", "description": "High-yielding buffalo breed, top milk fat content",
        "origin": "Haryana/Punjab, India",
        "environment": {"housing": "Shaded shed, wallow/water access helpful", "space": "50-60 sq ft per animal", "temperature": "Needs shade/cooling in extreme heat"},
        "feed_schedule": [
            {"stage": "Calf (0-3 months)", "diet": "Milk + calf starter"},
            {"stage": "Heifer", "diet": "Green fodder + 1.5-2 kg concentrate/day"},
            {"stage": "Lactating", "diet": "Green + dry fodder, 1 kg concentrate per 2L milk"},
        ],
        "vaccination_schedule": [
            {"age": "4 months+", "vaccine": "FMD (6-monthly)"},
            {"age": "Annual", "vaccine": "Hemorrhagic Septicemia"},
        ],
        "growth_timeline": [
            {"stage": "Calf", "duration": "0-6 months", "notes": "Milk-fed"},
            {"stage": "Heifer", "duration": "6-36 months", "notes": "First calving ~36-40 months"},
            {"stage": "Lactation", "duration": "300-310 days/cycle", "notes": "Fat content 6-7%"},
        ],
        "common_diseases": ["Mastitis", "FMD", "Hemorrhagic Septicemia"],
        "quick_facts": {"maturity_days": "1080-1200 (first calving)", "yield": "8-10 litres/day average", "market_price_range": "₹55-70/litre"},
    },
    "HF Crossbred": {
        "category": "dairy", "description": "Holstein Friesian crossbred, very high milk yield",
        "origin": "Cross of Holstein Friesian with indigenous breeds",
        "environment": {"housing": "Well-ventilated shed, cooling essential in summer", "space": "40-50 sq ft per animal", "temperature": "Sensitive to heat stress, needs shade/fans"},
        "feed_schedule": [
            {"stage": "Calf (0-3 months)", "diet": "Milk + calf starter"},
            {"stage": "Heifer", "diet": "Green fodder + 2 kg concentrate/day"},
            {"stage": "Lactating", "diet": "TMR or green+dry fodder, 1 kg concentrate per 2-2.5L milk"},
        ],
        "vaccination_schedule": [
            {"age": "4 months+", "vaccine": "FMD (6-monthly)"},
            {"age": "Annual", "vaccine": "Hemorrhagic Septicemia"},
        ],
        "growth_timeline": [
            {"stage": "Calf", "duration": "0-6 months", "notes": "Milk-fed"},
            {"stage": "Heifer", "duration": "6-24 months", "notes": "First calving ~24-27 months"},
            {"stage": "Lactation", "duration": "300 days/cycle", "notes": "15-20L/day, needs high-quality feed"},
        ],
        "common_diseases": ["Mastitis", "Milk Fever", "Heat stress related infertility"],
        "quick_facts": {"maturity_days": "720-810 (first calving)", "yield": "15-20 litres/day average", "market_price_range": "₹35-45/litre"},
    },
    "Rohu": {
        "category": "fisheries", "description": "Major carp, most popular freshwater food fish in India",
        "origin": "Indo-Gangetic plains",
        "environment": {"housing": "Freshwater pond, 1-1.5m depth", "space": "5000-8000 fingerlings/acre", "temperature": "25-32°C optimal"},
        "feed_schedule": [
            {"stage": "Fry", "diet": "Zooplankton, powdered feed 35% protein"},
            {"stage": "Fingerling", "diet": "Pelleted feed 30% protein"},
            {"stage": "Grow-out", "diet": "25% protein floating/sinking pellets"},
        ],
        "vaccination_schedule": [
            {"age": "N/A", "vaccine": "No standard vaccination; pond hygiene and water quality management is primary disease control"},
        ],
        "growth_timeline": [
            {"stage": "Fry", "duration": "0-1 month", "notes": "Nursery rearing"},
            {"stage": "Fingerling", "duration": "1-3 months", "notes": "Stocking size 10-15 cm"},
            {"stage": "Grow-out", "duration": "8-12 months", "notes": "Market size 800g-1.2kg"},
        ],
        "common_diseases": ["Argulosis (fish lice)", "Fin rot", "EUS (Epizootic Ulcerative Syndrome)"],
        "quick_facts": {"maturity_days": "240-365", "yield": "2.5-4 tonnes/acre/year", "market_price_range": "₹120-180/kg"},
    },
    "Catla": {
        "category": "fisheries", "description": "Fast-growing major carp, surface feeder",
        "origin": "Indo-Gangetic plains",
        "environment": {"housing": "Freshwater pond, 1-1.5m depth", "space": "5000-8000 fingerlings/acre (polyculture)", "temperature": "25-32°C optimal"},
        "feed_schedule": [
            {"stage": "Fry", "diet": "Zooplankton, powdered feed"},
            {"stage": "Fingerling", "diet": "Pelleted feed 28-30% protein"},
            {"stage": "Grow-out", "diet": "22-25% protein pellets"},
        ],
        "vaccination_schedule": [
            {"age": "N/A", "vaccine": "No standard vaccination; water quality management primary"},
        ],
        "growth_timeline": [
            {"stage": "Fry", "duration": "0-1 month", "notes": "Nursery rearing"},
            {"stage": "Fingerling", "duration": "1-3 months", "notes": "Fastest growing of major carps"},
            {"stage": "Grow-out", "duration": "8-10 months", "notes": "Market size 1-1.5kg"},
        ],
        "common_diseases": ["Argulosis", "Dropsy", "EUS"],
        "quick_facts": {"maturity_days": "240-300", "yield": "2.5-4 tonnes/acre/year (polyculture)", "market_price_range": "₹130-190/kg"},
    },
    "Mrigal": {
        "category": "fisheries", "description": "Bottom-feeding major carp, used in polyculture",
        "origin": "Indo-Gangetic plains",
        "environment": {"housing": "Freshwater pond, bottom feeder needs silty substrate", "space": "Stocked at 20% in polyculture mix", "temperature": "25-32°C optimal"},
        "feed_schedule": [
            {"stage": "Fry", "diet": "Zooplankton, powdered feed"},
            {"stage": "Fingerling", "diet": "Pelleted feed 25-28% protein"},
            {"stage": "Grow-out", "diet": "20-22% protein sinking pellets"},
        ],
        "vaccination_schedule": [
            {"age": "N/A", "vaccine": "No standard vaccination; water quality management primary"},
        ],
        "growth_timeline": [
            {"stage": "Fry", "duration": "0-1 month", "notes": "Nursery rearing"},
            {"stage": "Fingerling", "duration": "1-3 months", "notes": "Slower than Catla/Rohu"},
            {"stage": "Grow-out", "duration": "10-12 months", "notes": "Market size 600-900g"},
        ],
        "common_diseases": ["Argulosis", "Fin rot"],
        "quick_facts": {"maturity_days": "300-365", "yield": "Part of 2.5-4 tonnes/acre polyculture", "market_price_range": "₹110-160/kg"},
    },
    "Pangasius": {
        "category": "fisheries", "description": "Fast-growing catfish, intensive aquaculture",
        "origin": "Mekong basin, widely farmed in India",
        "environment": {"housing": "Deep pond (2-2.5m), high stocking density tolerant", "space": "8000-10000 fingerlings/acre", "temperature": "26-32°C optimal"},
        "feed_schedule": [
            {"stage": "Fry", "diet": "35% protein starter feed"},
            {"stage": "Fingerling", "diet": "30% protein pellets"},
            {"stage": "Grow-out", "diet": "25-28% protein floating pellets"},
        ],
        "vaccination_schedule": [
            {"age": "N/A", "vaccine": "No standard vaccination; biosecurity and water quality primary"},
        ],
        "growth_timeline": [
            {"stage": "Fry", "duration": "0-1 month", "notes": "Nursery"},
            {"stage": "Fingerling", "duration": "1-2 months", "notes": "Fast growth rate"},
            {"stage": "Grow-out", "duration": "6-8 months", "notes": "Market size 1-1.5kg"},
        ],
        "common_diseases": ["Bacterial gill disease", "Motile Aeromonas Septicemia"],
        "quick_facts": {"maturity_days": "180-240", "yield": "8-12 tonnes/acre/year intensive", "market_price_range": "₹90-130/kg"},
    },
    "Tilapia": {
        "category": "fisheries", "description": "Hardy, fast-breeding freshwater fish",
        "origin": "Africa, widely farmed globally including India",
        "environment": {"housing": "Pond or tank, tolerates low oxygen/poor water", "space": "10000-15000/acre", "temperature": "25-32°C, tolerates wide range"},
        "feed_schedule": [
            {"stage": "Fry", "diet": "35-40% protein starter"},
            {"stage": "Fingerling", "diet": "28-30% protein"},
            {"stage": "Grow-out", "diet": "24-26% protein pellets"},
        ],
        "vaccination_schedule": [
            {"age": "N/A", "vaccine": "No standard vaccination; monosex culture recommended to control overbreeding"},
        ],
        "growth_timeline": [
            {"stage": "Fry", "duration": "0-1 month", "notes": "Nursery"},
            {"stage": "Fingerling", "duration": "1-2 months", "notes": "Breeds very fast, monosex preferred"},
            {"stage": "Grow-out", "duration": "5-7 months", "notes": "Market size 500-800g"},
        ],
        "common_diseases": ["Streptococcosis", "Columnaris disease"],
        "quick_facts": {"maturity_days": "150-210", "yield": "3-5 tonnes/acre/year", "market_price_range": "₹100-150/kg"},
    },
    "Apis mellifera": {
        "category": "apiculture", "description": "European/Italian honeybee, high honey yield",
        "origin": "Introduced from Europe, widely used commercially in India",
        "environment": {"housing": "Langstroth hive boxes", "space": "1 colony per hive, apiary spacing 3-4m", "temperature": "Prefers moderate climate, avoid extreme heat"},
        "feed_schedule": [
            {"stage": "Dearth period", "diet": "Sugar syrup (1:1) feeding to sustain colony"},
            {"stage": "Buildup period", "diet": "Natural forage + pollen substitute if needed"},
        ],
        "vaccination_schedule": [
            {"age": "N/A", "vaccine": "No vaccination; disease control via hive hygiene and mite (Varroa) management"},
        ],
        "growth_timeline": [
            {"stage": "Colony buildup", "duration": "2-3 months", "notes": "Population growth pre-flowering season"},
            {"stage": "Honey flow", "duration": "2-3 months", "notes": "Main harvest period during flowering"},
        ],
        "common_diseases": ["Varroa mite infestation", "European Foul Brood", "Nosema disease"],
        "quick_facts": {"maturity_days": "N/A (colony-based)", "yield": "25-40 kg honey/colony/year", "market_price_range": "₹300-500/kg honey"},
    },
    "Apis cerana indica": {
        "category": "apiculture", "description": "Indian native honeybee, hardy, lower yield than Apis mellifera",
        "origin": "Native to Indian subcontinent",
        "environment": {"housing": "Newton/ISI hive boxes (smaller than Langstroth)", "space": "1 colony per hive", "temperature": "Well adapted to Indian climate variations"},
        "feed_schedule": [
            {"stage": "Dearth period", "diet": "Sugar syrup feeding"},
            {"stage": "Buildup period", "diet": "Natural forage"},
        ],
        "vaccination_schedule": [
            {"age": "N/A", "vaccine": "No vaccination; hive hygiene primary control"},
        ],
        "growth_timeline": [
            {"stage": "Colony buildup", "duration": "2-3 months", "notes": "Slower buildup than Apis mellifera"},
            {"stage": "Honey flow", "duration": "2-3 months", "notes": "Harvest period"},
        ],
        "common_diseases": ["Thai Sacbrood Virus", "Varroa mite (lower susceptibility)"],
        "quick_facts": {"maturity_days": "N/A (colony-based)", "yield": "6-10 kg honey/colony/year", "market_price_range": "₹300-500/kg honey"},
    },
    "Vannamei (Litopenaeus vannamei)": {
        "category": "aquaculture_prawns", "description": "Pacific white shrimp, dominant farmed shrimp species",
        "origin": "Native to Pacific coast of Latin America, widely farmed in India",
        "environment": {"housing": "Lined pond, aerated, controlled salinity", "space": "60-100 PL/sq m stocking density", "temperature": "28-32°C, salinity 10-25 ppt"},
        "feed_schedule": [
            {"stage": "PL (post-larvae)", "diet": "40% protein starter crumble"},
            {"stage": "Grow-out", "diet": "32-38% protein pelleted feed, 4-5 feedings/day"},
        ],
        "vaccination_schedule": [
            {"age": "N/A", "vaccine": "No vaccination; SPF (specific pathogen free) seed and biosecurity critical"},
        ],
        "growth_timeline": [
            {"stage": "PL stocking", "duration": "0-1 month", "notes": "Acclimatization"},
            {"stage": "Grow-out", "duration": "3-4 months", "notes": "Market size 25-35 g (30-40 count/kg)"},
        ],
        "common_diseases": ["White Spot Syndrome Virus", "Early Mortality Syndrome"],
        "quick_facts": {"maturity_days": "90-120", "yield": "4-8 tonnes/acre/crop (intensive)", "market_price_range": "₹280-400/kg"},
    },
    "Black Tiger Prawn (Penaeus monodon)": {
        "category": "aquaculture_prawns", "description": "Large tiger prawn, high export value",
        "origin": "Indo-Pacific, traditional Indian brackish water culture",
        "environment": {"housing": "Brackish water pond, extensive or semi-intensive", "space": "10-25 PL/sq m stocking density", "temperature": "26-32°C, salinity 15-25 ppt"},
        "feed_schedule": [
            {"stage": "PL", "diet": "40% protein starter"},
            {"stage": "Grow-out", "diet": "30-35% protein feed"},
        ],
        "vaccination_schedule": [
            {"age": "N/A", "vaccine": "No vaccination; SPF seed and pond biosecurity critical"},
        ],
        "growth_timeline": [
            {"stage": "PL stocking", "duration": "0-1 month", "notes": "Acclimatization"},
            {"stage": "Grow-out", "duration": "4-5 months", "notes": "Market size 30-40 g"},
        ],
        "common_diseases": ["White Spot Syndrome Virus", "Monodon Baculovirus"],
        "quick_facts": {"maturity_days": "120-150", "yield": "1-2 tonnes/acre/crop (extensive)", "market_price_range": "₹400-600/kg"},
    },
    "Osmanabadi": {
        "category": "small_ruminants", "description": "Dual-purpose (meat+milk) goat breed",
        "origin": "Maharashtra, India",
        "environment": {"housing": "Raised slatted floor shed preferred", "space": "10-12 sq ft per adult goat", "temperature": "Hardy, adapts to varied climate"},
        "feed_schedule": [
            {"stage": "Kid (0-3 months)", "diet": "Milk + creep feed from 3 weeks"},
            {"stage": "Grower/Adult", "diet": "Grazing + green fodder + 200-300g concentrate/day"},
        ],
        "vaccination_schedule": [
            {"age": "3 months+", "vaccine": "PPR (Peste des Petits Ruminants)"},
            {"age": "Annual", "vaccine": "Enterotoxaemia, FMD"},
        ],
        "growth_timeline": [
            {"stage": "Kid", "duration": "0-3 months", "notes": "Milk-fed"},
            {"stage": "Grower", "duration": "3-8 months", "notes": "Weaning to puberty"},
            {"stage": "Market ready", "duration": "8-12 months", "notes": "25-30 kg live weight"},
        ],
        "common_diseases": ["PPR", "Enterotoxaemia", "Foot rot"],
        "quick_facts": {"maturity_days": "240-365", "yield": "25-30 kg live weight, 0.5-1L milk/day", "market_price_range": "₹350-450/kg live"},
    },
    "Boer": {
        "category": "small_ruminants", "description": "Meat-purpose goat breed, fast growth",
        "origin": "South Africa, imported/crossbred in India",
        "environment": {"housing": "Well-ventilated shed, raised floor", "space": "12-15 sq ft per adult", "temperature": "Moderate tolerance, needs shelter in extreme heat"},
        "feed_schedule": [
            {"stage": "Kid (0-3 months)", "diet": "Milk + creep feed"},
            {"stage": "Grower/Adult", "diet": "High-quality fodder + 300-400g concentrate/day"},
        ],
        "vaccination_schedule": [
            {"age": "3 months+", "vaccine": "PPR"},
            {"age": "Annual", "vaccine": "Enterotoxaemia, FMD"},
        ],
        "growth_timeline": [
            {"stage": "Kid", "duration": "0-3 months", "notes": "Milk-fed, fast growth"},
            {"stage": "Grower", "duration": "3-6 months", "notes": "Rapid weight gain, best growth rate among goats"},
            {"stage": "Market ready", "duration": "6-9 months", "notes": "30-40 kg live weight"},
        ],
        "common_diseases": ["PPR", "Enterotoxaemia", "Pneumonia"],
        "quick_facts": {"maturity_days": "180-270", "yield": "30-40 kg live weight", "market_price_range": "₹400-550/kg live"},
    },
    "Deccani (sheep)": {
        "category": "small_ruminants", "description": "Hardy indigenous sheep breed, meat and coarse wool",
        "origin": "Maharashtra/Karnataka plateau, India",
        "environment": {"housing": "Open shed, minimal shelter needed", "space": "10-12 sq ft per adult", "temperature": "Very hardy, drought tolerant"},
        "feed_schedule": [
            {"stage": "Lamb (0-3 months)", "diet": "Milk + grazing from 1 month"},
            {"stage": "Grower/Adult", "diet": "Grazing on natural pasture, minimal supplementation"},
        ],
        "vaccination_schedule": [
            {"age": "3 months+", "vaccine": "PPR"},
            {"age": "Annual", "vaccine": "Enterotoxaemia, Sheep Pox"},
        ],
        "growth_timeline": [
            {"stage": "Lamb", "duration": "0-3 months", "notes": "Milk-fed"},
            {"stage": "Grower", "duration": "3-10 months", "notes": "Slow growth, extensive grazing"},
            {"stage": "Market ready", "duration": "10-12 months", "notes": "20-25 kg live weight"},
        ],
        "common_diseases": ["PPR", "Sheep Pox", "Enterotoxaemia"],
        "quick_facts": {"maturity_days": "300-365", "yield": "20-25 kg live weight, coarse wool", "market_price_range": "₹300-400/kg live"},
    },
    "Nellore (sheep)": {
        "category": "small_ruminants", "description": "Large-framed meat sheep breed",
        "origin": "Andhra Pradesh, India",
        "environment": {"housing": "Open shed with shade", "space": "10-12 sq ft per adult", "temperature": "Hardy, heat tolerant"},
        "feed_schedule": [
            {"stage": "Lamb (0-3 months)", "diet": "Milk + grazing from 1 month"},
            {"stage": "Grower/Adult", "diet": "Grazing + crop residue supplementation"},
        ],
        "vaccination_schedule": [
            {"age": "3 months+", "vaccine": "PPR"},
            {"age": "Annual", "vaccine": "Enterotoxaemia, Sheep Pox"},
        ],
        "growth_timeline": [
            {"stage": "Lamb", "duration": "0-3 months", "notes": "Milk-fed"},
            {"stage": "Grower", "duration": "3-9 months", "notes": "Good growth rate for indigenous breed"},
            {"stage": "Market ready", "duration": "9-12 months", "notes": "28-35 kg live weight"},
        ],
        "common_diseases": ["PPR", "Enterotoxaemia", "Foot rot"],
        "quick_facts": {"maturity_days": "270-365", "yield": "28-35 kg live weight", "market_price_range": "₹350-450/kg live"},
    },
}
