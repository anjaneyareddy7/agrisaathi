#!/usr/bin/env bash
set -e

echo "==> Creating Animal Encyclopedia data file..."
mkdir -p src/data

cat > src/data/animalEncyclopedia.json << 'ANIMALJSON'
{
  "categories": [
    {
      "id": "poultry",
      "name": "Poultry",
      "icon": "Bird",
      "color": "amber",
      "types": [
        {
          "id": "broiler-chicken",
          "name": "Broiler Chicken",
          "purpose": "Meat",
          "breeds": [
            { "name": "Cobb 400", "origin": "Imported/Hybrid", "traits": "Fast growth, ready in 35-42 days, high FCR efficiency" },
            { "name": "Ross 308", "origin": "Imported/Hybrid", "traits": "High breast meat yield, robust in Indian climate" },
            { "name": "Vencobb 400", "origin": "India (Venkateshwara)", "traits": "Popular in Indian broiler farms, disease resistant" }
          ],
          "housing": {
            "type": "Deep litter / cage-free shed",
            "space_requirement": "1 sq ft per bird (0-3 weeks), 1.5 sq ft per bird (after)",
            "temperature_range": "32-35°C (week 1), reducing 3°C/week to 24°C",
            "humidity": "50-70%",
            "ventilation": "Cross ventilation, exhaust fans in summer",
            "notes": "Litter depth 5-8 cm (rice husk/wood shavings), keep dry to avoid coccidiosis"
          },
          "feed": {
            "type": "Pre-starter, Starter, Finisher (commercial pellet/mash)",
            "daily_quantity": "20g/bird (day 1) rising to 120-150g/bird (week 5-6)",
            "key_ingredients": "Maize, soybean meal, fish meal, vitamin-mineral premix",
            "water_requirement": "Free access, roughly 1.8-2x feed intake by volume"
          },
          "vaccination_schedule": [
            { "age": "Day 1", "vaccine": "Marek's Disease (at hatchery)", "disease_prevented": "Marek's disease", "route": "Subcutaneous" },
            { "age": "Day 5-7", "vaccine": "Newcastle Disease (Lasota) + IB", "disease_prevented": "Newcastle disease, Infectious Bronchitis", "route": "Eye drop / drinking water" },
            { "age": "Day 14", "vaccine": "Gumboro (IBD) 1st dose", "disease_prevented": "Infectious Bursal Disease", "route": "Drinking water" },
            { "age": "Day 21", "vaccine": "Gumboro (IBD) booster", "disease_prevented": "Infectious Bursal Disease", "route": "Drinking water" },
            { "age": "Day 28", "vaccine": "Newcastle Disease booster", "disease_prevented": "Newcastle disease", "route": "Drinking water" }
          ],
          "yield_timeline": [
            { "stage": "Chick placement", "age_range": "Day 0", "milestone": "40-45g body weight" },
            { "stage": "Brooding", "age_range": "Day 0-14", "milestone": "Reach 300-400g" },
            { "stage": "Growing", "age_range": "Day 15-28", "milestone": "Reach 1.0-1.3kg" },
            { "stage": "Finishing", "age_range": "Day 29-42", "milestone": "Market weight 1.8-2.2kg" },
            { "stage": "Market ready", "age_range": "Day 35-42", "milestone": "Sale/slaughter" }
          ],
          "common_diseases": ["Coccidiosis", "Newcastle disease", "Infectious Bursal Disease (Gumboro)", "Colibacillosis", "Heat stress"],
          "economics": { "typical_flock_size": "500-5000 birds", "fcr_target": "1.6-1.8", "cycle_days": 42 }
        },
        {
          "id": "layer-chicken",
          "name": "Layer Chicken (Egg)",
          "purpose": "Eggs",
          "breeds": [
            { "name": "BV-300 (Bhim variety)", "origin": "India (CARI)", "traits": "Backyard/commercial layer, brown eggs" },
            { "name": "White Leghorn", "origin": "Italy/Imported", "traits": "High egg production, white eggs, ~300 eggs/year" },
            { "name": "Rhode Island Red", "origin": "USA/Imported", "traits": "Dual purpose, brown eggs, hardy" }
          ],
          "housing": {
            "type": "Cage system or deep litter",
            "space_requirement": "450-550 sq cm per bird in cage; 2-2.5 sq ft in litter system",
            "temperature_range": "18-27°C optimal for laying",
            "humidity": "60-70%",
            "ventilation": "Continuous airflow, avoid ammonia buildup",
            "notes": "16 hours light exposure/day needed for peak laying"
          },
          "feed": {
            "type": "Chick mash, Grower mash, Layer mash (16-18% protein)",
            "daily_quantity": "110-120g/bird/day during laying",
            "key_ingredients": "Maize, soybean meal, calcium (limestone/oyster shell), DCP",
            "water_requirement": "250-300 ml/bird/day"
          },
          "vaccination_schedule": [
            { "age": "Day 1", "vaccine": "Marek's Disease", "disease_prevented": "Marek's disease", "route": "Subcutaneous" },
            { "age": "Day 7", "vaccine": "Newcastle (Lasota)", "disease_prevented": "Newcastle disease", "route": "Eye drop" },
            { "age": "Day 14, 28", "vaccine": "Gumboro (IBD) 1st & booster", "disease_prevented": "Infectious Bursal Disease", "route": "Drinking water" },
            { "age": "Week 6-8", "vaccine": "Fowl Pox", "disease_prevented": "Fowl Pox", "route": "Wing web stab" },
            { "age": "Week 8-10", "vaccine": "Newcastle Disease (R2B) booster", "disease_prevented": "Newcastle disease", "route": "Intramuscular" },
            { "age": "Week 16-18", "vaccine": "Newcastle + IB pre-lay booster", "disease_prevented": "Newcastle disease, IB", "route": "Intramuscular" }
          ],
          "yield_timeline": [
            { "stage": "Chick", "age_range": "0-8 weeks", "milestone": "Growth phase" },
            { "stage": "Grower/Pullet", "age_range": "8-18 weeks", "milestone": "Skeletal development" },
            { "stage": "Point of lay", "age_range": "18-20 weeks", "milestone": "First eggs" },
            { "stage": "Peak production", "age_range": "26-40 weeks", "milestone": "85-90% lay rate" },
            { "stage": "Productive life", "age_range": "Up to 72-80 weeks", "milestone": "Culling/molting decision" }
          ],
          "common_diseases": ["Newcastle disease", "Infectious Bronchitis", "Fowl typhoid", "Egg drop syndrome", "Mites/lice"],
          "economics": { "typical_flock_size": "200-10000 birds", "avg_eggs_per_year": "280-300", "laying_period_weeks": 62 }
        },
        {
          "id": "desi-backyard-chicken",
          "name": "Desi / Backyard Chicken",
          "purpose": "Dual purpose (meat + eggs), low-input",
          "breeds": [
            { "name": "Kadaknath", "origin": "Madhya Pradesh, India", "traits": "Black meat, high protein/iron, premium price" },
            { "name": "Aseel", "origin": "India (Andhra/Telangana)", "traits": "Hardy, fighting/meat breed, disease resistant" },
            { "name": "Vanaraja", "origin": "India (PDP/DPR)", "traits": "Free-range dual purpose, colored plumage" }
          ],
          "housing": {
            "type": "Free-range with night shelter",
            "space_requirement": "8-10 birds per 100 sq ft shelter + open range",
            "temperature_range": "Tolerates 10-40°C",
            "humidity": "Tolerant, avoid waterlogging",
            "ventilation": "Open shed with predator-proof fencing",
            "notes": "Provide raised perches and dust-bathing area"
          },
          "feed": {
            "type": "Kitchen waste, grains, greens + supplement mash",
            "daily_quantity": "80-100g supplementary feed/bird/day (rest foraged)",
            "key_ingredients": "Broken maize/rice, greens, insects, mineral mixture",
            "water_requirement": "Clean water ad-lib, refresh daily"
          },
          "vaccination_schedule": [
            { "age": "Day 1", "vaccine": "Marek's Disease", "disease_prevented": "Marek's disease", "route": "Subcutaneous" },
            { "age": "Day 7", "vaccine": "Newcastle (Lasota)", "disease_prevented": "Newcastle disease", "route": "Eye drop" },
            { "age": "Day 21", "vaccine": "Gumboro (IBD)", "disease_prevented": "Infectious Bursal Disease", "route": "Drinking water" },
            { "age": "Week 6", "vaccine": "Fowl Pox", "disease_prevented": "Fowl Pox", "route": "Wing web stab" },
            { "age": "Week 12", "vaccine": "Ranikhet (R2B) booster", "disease_prevented": "Newcastle disease", "route": "Intramuscular" }
          ],
          "yield_timeline": [
            { "stage": "Chick", "age_range": "0-8 weeks", "milestone": "Brooding, supplemental feed" },
            { "stage": "Grower", "age_range": "8-20 weeks", "milestone": "Free-ranging begins" },
            { "stage": "Meat maturity", "age_range": "16-24 weeks", "milestone": "1.2-1.8kg live weight" },
            { "stage": "Egg laying start", "age_range": "22-26 weeks", "milestone": "First eggs, ~120-150 eggs/year" }
          ],
          "common_diseases": ["Newcastle disease", "Fowl pox", "External parasites (mites/lice)", "Coccidiosis"],
          "economics": { "typical_flock_size": "10-100 birds", "avg_eggs_per_year": "120-150", "premium_market": "Kadaknath commands 3-5x regular price" }
        }
      ]
    },
    {
      "id": "dairy",
      "name": "Dairy (Cattle & Buffalo)",
      "icon": "Milk",
      "color": "blue",
      "types": [
        {
          "id": "hf-cross-cattle",
          "name": "Holstein Friesian Cross Cattle",
          "purpose": "Milk",
          "breeds": [
            { "name": "HF Cross (50-75% exotic blood)", "origin": "Crossbred, India-wide", "traits": "High milk yield, needs good management" },
            { "name": "Jersey Cross", "origin": "Crossbred, India-wide", "traits": "Higher fat %, smaller body, heat tolerant" }
          ],
          "housing": {
            "type": "Loose housing / tied shed with shade",
            "space_requirement": "40-45 sq ft covered + 60-80 sq ft open per animal",
            "temperature_range": "Comfort zone 10-24°C, needs cooling/fans above 30°C",
            "humidity": "Moderate; avoid damp flooring",
            "ventilation": "Open sides, ridge ventilation, fans/sprinklers in summer",
            "notes": "Non-slip flooring, separate calving pen recommended"
          },
          "feed": {
            "type": "Green fodder + dry fodder + concentrate mix",
            "daily_quantity": "25-35kg green fodder, 5-7kg dry fodder, 1kg concentrate per 2.5L milk",
            "key_ingredients": "Napier/hybrid grass, maize/jowar fodder, cottonseed cake, mineral mixture, salt",
            "water_requirement": "70-100 litres/day (more in summer/lactation)"
          },
          "vaccination_schedule": [
            { "age": "4 months (calf)", "vaccine": "Brucellosis (S19, female calves only)", "disease_prevented": "Brucellosis", "route": "Subcutaneous, one-time" },
            { "age": "Annual", "vaccine": "FMD (Foot and Mouth Disease)", "disease_prevented": "FMD", "route": "Subcutaneous, every 6 months" },
            { "age": "Annual", "vaccine": "Haemorrhagic Septicaemia (HS)", "disease_prevented": "HS", "route": "Subcutaneous, before monsoon" },
            { "age": "Annual", "vaccine": "Black Quarter (BQ)", "disease_prevented": "Black Quarter", "route": "Subcutaneous, before monsoon" },
            { "age": "Annual", "vaccine": "Theileriosis (in endemic zones)", "disease_prevented": "Theileriosis", "route": "As per vet advice" }
          ],
          "yield_timeline": [
            { "stage": "Calf", "age_range": "0-3 months", "milestone": "Colostrum then milk feeding" },
            { "stage": "Heifer growth", "age_range": "3-15 months", "milestone": "Weight gain, deworming" },
            { "stage": "Breeding age", "age_range": "15-18 months", "milestone": "First AI/service (~300kg body wt)" },
            { "stage": "First calving", "age_range": "~27-30 months", "milestone": "Lactation begins" },
            { "stage": "Peak lactation", "age_range": "60-90 days post-calving", "milestone": "10-18 litres/day (mgmt dependent)" },
            { "stage": "Dry period", "age_range": "60 days before next calving", "milestone": "Rest before next lactation" }
          ],
          "common_diseases": ["Mastitis", "FMD", "Milk fever", "Bloat", "Tick-borne diseases (Theileriosis)"],
          "economics": { "avg_milk_yield_l_per_day": "10-18", "lactation_days": 305, "calving_interval_months": "13-14" }
        },
        {
          "id": "gir-cattle",
          "name": "Gir Cattle (Indigenous)",
          "purpose": "Milk (A2 milk premium)",
          "breeds": [
            { "name": "Gir", "origin": "Gujarat, India", "traits": "Heat tolerant, disease resistant, A2 milk, distinctive curved horns" }
          ],
          "housing": {
            "type": "Open shed, tolerant of extensive systems",
            "space_requirement": "35-40 sq ft per animal",
            "temperature_range": "Tolerates up to 40°C well",
            "humidity": "Tolerant of dry and humid conditions",
            "ventilation": "Simple open shed sufficient",
            "notes": "Very hardy, lower input requirement than exotic breeds"
          },
          "feed": {
            "type": "Green fodder, dry fodder, moderate concentrate",
            "daily_quantity": "20-25kg green fodder, 4-6kg dry fodder, 2-3kg concentrate",
            "key_ingredients": "Local grasses, groundnut cake, mineral mixture",
            "water_requirement": "50-70 litres/day"
          },
          "vaccination_schedule": [
            { "age": "4 months (calf, female)", "vaccine": "Brucellosis (S19)", "disease_prevented": "Brucellosis", "route": "Subcutaneous, one-time" },
            { "age": "Twice yearly", "vaccine": "FMD", "disease_prevented": "FMD", "route": "Subcutaneous" },
            { "age": "Annual, pre-monsoon", "vaccine": "HS + BQ combined", "disease_prevented": "Haemorrhagic Septicaemia, Black Quarter", "route": "Subcutaneous" }
          ],
          "yield_timeline": [
            { "stage": "Calf", "age_range": "0-3 months", "milestone": "Milk-fed" },
            { "stage": "Heifer", "age_range": "3-24 months", "milestone": "Slower maturity than crossbreds" },
            { "stage": "First calving", "age_range": "~36-40 months", "milestone": "Lactation begins" },
            { "stage": "Lactation", "age_range": "Per cycle ~300 days", "milestone": "6-10 litres/day average" }
          ],
          "common_diseases": ["FMD", "Tick infestation", "Mastitis (lower incidence than exotic breeds)"],
          "economics": { "avg_milk_yield_l_per_day": "6-10", "milk_premium": "A2 milk sells 1.5-2x regular price", "calving_interval_months": "14-16" }
        },
        {
          "id": "murrah-buffalo",
          "name": "Murrah Buffalo",
          "purpose": "Milk (high fat %)",
          "breeds": [
            { "name": "Murrah", "origin": "Haryana/Punjab, India", "traits": "Jet black, curled horns, highest milk yield among buffalo breeds" }
          ],
          "housing": {
            "type": "Shed with wallowing/water access",
            "space_requirement": "40 sq ft per animal + wallow pond access",
            "temperature_range": "Needs cooling above 30°C; wallowing critical in summer",
            "humidity": "Tolerates humidity well with water access",
            "ventilation": "Shade essential, sprinklers/wallow pond recommended",
            "notes": "Provide shade and water access to avoid heat stress (low sweat glands)"
          },
          "feed": {
            "type": "Green fodder + dry fodder + concentrate",
            "daily_quantity": "25-30kg green fodder, 6-8kg dry fodder, 1kg concentrate per 2L milk",
            "key_ingredients": "Berseem/lucerne, wheat/paddy straw, cottonseed cake, mineral mixture",
            "water_requirement": "80-100 litres/day including wallowing"
          },
          "vaccination_schedule": [
            { "age": "4 months (female calf)", "vaccine": "Brucellosis (S19)", "disease_prevented": "Brucellosis", "route": "Subcutaneous, one-time" },
            { "age": "Twice yearly", "vaccine": "FMD", "disease_prevented": "FMD", "route": "Subcutaneous" },
            { "age": "Annual, pre-monsoon", "vaccine": "HS + BQ", "disease_prevented": "Haemorrhagic Septicaemia, Black Quarter", "route": "Subcutaneous" }
          ],
          "yield_timeline": [
            { "stage": "Calf", "age_range": "0-3 months", "milestone": "Milk-fed" },
            { "stage": "Heifer growth", "age_range": "3-24 months", "milestone": "Weight gain" },
            { "stage": "Breeding age", "age_range": "24-30 months", "milestone": "First service" },
            { "stage": "First calving", "age_range": "~36-40 months", "milestone": "Lactation begins" },
            { "stage": "Peak lactation", "age_range": "60-100 days post-calving", "milestone": "8-14 litres/day, 6-7% fat" }
          ],
          "common_diseases": ["Mastitis", "FMD", "Heat stress", "Reproductive disorders (anoestrus)"],
          "economics": { "avg_milk_yield_l_per_day": "8-14", "fat_content_pct": "6-7", "calving_interval_months": "15-18" }
        }
      ]
    },
    {
      "id": "goat-sheep",
      "name": "Goat & Sheep",
      "icon": "PawPrint",
      "color": "orange",
      "types": [
        {
          "id": "boer-goat",
          "name": "Boer Goat",
          "purpose": "Meat",
          "breeds": [
            { "name": "Boer", "origin": "South Africa/Imported", "traits": "Fast growth, high meat yield, often crossed with local breeds" },
            { "name": "Boer x Osmanabadi", "origin": "Crossbred India", "traits": "Combines growth rate with local disease resistance" }
          ],
          "housing": {
            "type": "Raised slatted-floor shed",
            "space_requirement": "10-12 sq ft per adult goat",
            "temperature_range": "15-30°C comfortable",
            "humidity": "Low humidity preferred, avoid dampness (foot rot risk)",
            "ventilation": "Good airflow, dry bedding essential",
            "notes": "Raised flooring reduces parasite load and keeps animals dry"
          },
          "feed": {
            "type": "Browse/grazing + concentrate supplement",
            "daily_quantity": "3-4kg green fodder/browse, 200-400g concentrate for growers",
            "key_ingredients": "Tree leaves (subabul, neem), legume fodder, maize/groundnut cake mix",
            "water_requirement": "3-5 litres/day"
          },
          "vaccination_schedule": [
            { "age": "3 months", "vaccine": "Enterotoxaemia (ET)", "disease_prevented": "Enterotoxaemia", "route": "Subcutaneous" },
            { "age": "Annual", "vaccine": "PPR (Peste des Petits Ruminants)", "disease_prevented": "PPR", "route": "Subcutaneous" },
            { "age": "Annual, pre-monsoon", "vaccine": "FMD", "disease_prevented": "FMD", "route": "Subcutaneous" },
            { "age": "Every 3 months", "vaccine": "Deworming (not vaccine, routine)", "disease_prevented": "Internal parasites", "route": "Oral" }
          ],
          "yield_timeline": [
            { "stage": "Kid", "age_range": "0-3 months", "milestone": "Milk-fed, weaning at 3 months" },
            { "stage": "Grower", "age_range": "3-8 months", "milestone": "Rapid weight gain, 150-200g/day" },
            { "stage": "Market weight", "age_range": "8-10 months", "milestone": "30-40kg live weight" },
            { "stage": "Breeding age (doe)", "age_range": "8-10 months", "milestone": "First breeding" }
          ],
          "common_diseases": ["PPR", "Enterotoxaemia", "Foot rot", "Internal parasites (worms)"],
          "economics": { "litter_size": "1-2 kids", "kidding_interval_months": "8", "adg_g_per_day": "150-200" }
        },
        {
          "id": "sirohi-goat",
          "name": "Sirohi Goat (Indigenous)",
          "purpose": "Dual purpose (meat + milk)",
          "breeds": [
            { "name": "Sirohi", "origin": "Rajasthan, India", "traits": "Hardy, drought tolerant, good for semi-arid regions" }
          ],
          "housing": {
            "type": "Simple shed, extensive grazing",
            "space_requirement": "8-10 sq ft per adult",
            "temperature_range": "Tolerates hot, dry climate well",
            "humidity": "Low humidity preferred",
            "ventilation": "Natural, open shed adequate",
            "notes": "Well suited to low-input extensive/semi-intensive systems"
          },
          "feed": {
            "type": "Grazing/browsing based",
            "daily_quantity": "Mostly grazed; 100-200g concentrate for lactating does",
            "key_ingredients": "Local shrubs, grasses, crop residues",
            "water_requirement": "2-4 litres/day"
          },
          "vaccination_schedule": [
            { "age": "3 months", "vaccine": "Enterotoxaemia (ET)", "disease_prevented": "Enterotoxaemia", "route": "Subcutaneous" },
            { "age": "Annual", "vaccine": "PPR", "disease_prevented": "PPR", "route": "Subcutaneous" },
            { "age": "Annual, pre-monsoon", "vaccine": "FMD", "disease_prevented": "FMD", "route": "Subcutaneous" }
          ],
          "yield_timeline": [
            { "stage": "Kid", "age_range": "0-3 months", "milestone": "Weaning" },
            { "stage": "Grower", "age_range": "3-10 months", "milestone": "Moderate growth, 80-100g/day" },
            { "stage": "Breeding age", "age_range": "10-12 months", "milestone": "First breeding" },
            { "stage": "Market weight", "age_range": "10-12 months", "milestone": "20-25kg live weight" }
          ],
          "common_diseases": ["PPR", "Foot and mouth disease", "Internal parasites"],
          "economics": { "litter_size": "1-2 kids", "kidding_interval_months": "8-10", "milk_yield_l_per_day": "0.5-1" }
        },
        {
          "id": "deccani-sheep",
          "name": "Deccani Sheep",
          "purpose": "Meat & wool",
          "breeds": [
            { "name": "Deccani", "origin": "Maharashtra/Telangana/Karnataka, India", "traits": "Hardy, adapted to semi-arid grazing, coarse wool" }
          ],
          "housing": {
            "type": "Simple open shed / night penning",
            "space_requirement": "8-10 sq ft per adult",
            "temperature_range": "Tolerates hot, dry climate",
            "humidity": "Low humidity, prone to foot rot in wet conditions",
            "ventilation": "Open shed adequate",
            "notes": "Traditionally reared under extensive/migratory grazing systems"
          },
          "feed": {
            "type": "Grazing based, crop residues in dry season",
            "daily_quantity": "Mostly grazed; supplement 100-150g concentrate for lambs",
            "key_ingredients": "Pasture grass, crop stubble, tree fodder",
            "water_requirement": "2-3 litres/day"
          },
          "vaccination_schedule": [
            { "age": "3 months", "vaccine": "Enterotoxaemia (ET)", "disease_prevented": "Enterotoxaemia", "route": "Subcutaneous" },
            { "age": "Annual", "vaccine": "PPR", "disease_prevented": "PPR", "route": "Subcutaneous" },
            { "age": "Annual", "vaccine": "Sheep Pox", "disease_prevented": "Sheep pox", "route": "Subcutaneous" }
          ],
          "yield_timeline": [
            { "stage": "Lamb", "age_range": "0-3 months", "milestone": "Weaning" },
            { "stage": "Grower", "age_range": "3-8 months", "milestone": "Growth on pasture" },
            { "stage": "Market weight", "age_range": "8-12 months", "milestone": "20-25kg live weight" }
          ],
          "common_diseases": ["PPR", "Sheep pox", "Foot rot", "Internal parasites"],
          "economics": { "lambing_pct": "100-120%", "wool_yield_kg_per_year": "0.5-1" }
        }
      ]
    },
    {
      "id": "fisheries",
      "name": "Fisheries / Aquaculture",
      "icon": "Fish",
      "color": "cyan",
      "types": [
        {
          "id": "rohu-catla-imc",
          "name": "Indian Major Carp (Rohu, Catla, Mrigal)",
          "purpose": "Food fish, composite culture",
          "breeds": [
            { "name": "Rohu (Labeo rohita)", "origin": "Native, India", "traits": "Column feeder, fast growing" },
            { "name": "Catla (Catla catla)", "origin": "Native, India", "traits": "Surface feeder, largest of the three" },
            { "name": "Mrigal (Cirrhinus mrigala)", "origin": "Native, India", "traits": "Bottom feeder, completes the composite system" }
          ],
          "housing": {
            "type": "Earthen pond",
            "space_requirement": "0.4-1 hectare pond typical for small farmers",
            "temperature_range": "25-32°C optimal",
            "humidity": "N/A (aquatic)",
            "ventilation": "Aeration recommended at high stocking density",
            "notes": "Pond depth 1.5-2m, maintain dissolved oxygen above 4 mg/L"
          },
          "feed": {
            "type": "Supplementary floating/sinking pellet + natural pond productivity",
            "daily_quantity": "2-4% of body weight/day, adjusted by growth",
            "key_ingredients": "Rice bran, oil cake, fish meal, pond fertilization (organic/inorganic) to boost plankton",
            "water_requirement": "Pond water quality: pH 7-8.5, ammonia <0.1 mg/L"
          },
          "vaccination_schedule": [
            { "age": "N/A", "vaccine": "No standard vaccines; focus on water quality & biosecurity", "disease_prevented": "General disease prevention", "route": "Pond management" },
            { "age": "Stocking", "vaccine": "Fingerling disinfection dip (salt/KMnO4)", "disease_prevented": "Fungal/bacterial infection at stocking", "route": "Dip treatment" }
          ],
          "yield_timeline": [
            { "stage": "Fry stocking", "age_range": "Day 0", "milestone": "Stock 2-3 inch fingerlings" },
            { "stage": "Nursery to grow-out", "age_range": "Month 1-4", "milestone": "Reach 100-200g" },
            { "stage": "Grow-out", "age_range": "Month 5-10", "milestone": "Reach 700g-1.2kg" },
            { "stage": "Harvest", "age_range": "10-12 months", "milestone": "Full harvest / partial harvesting begins month 8" }
          ],
          "common_diseases": ["EUS (Epizootic Ulcerative Syndrome)", "Argulosis (fish lice)", "Gill rot", "Dropsy"],
          "economics": { "stocking_density_per_hectare": "5000-8000 fingerlings", "expected_yield_kg_per_hectare": "3000-5000", "culture_period_months": "10-12" }
        },
        {
          "id": "tilapia",
          "name": "Tilapia",
          "purpose": "Food fish, fast-growing",
          "breeds": [
            { "name": "GIFT Tilapia (Genetically Improved Farmed Tilapia)", "origin": "Improved strain, cultured in India", "traits": "Fast growth, tolerant of poor water quality, high yield" }
          ],
          "housing": {
            "type": "Pond or biofloc/RAS tank system",
            "space_requirement": "Flexible: pond, tank, or cage culture",
            "temperature_range": "26-32°C optimal",
            "humidity": "N/A (aquatic)",
            "ventilation": "Aeration essential in high-density systems (biofloc/RAS)",
            "notes": "Tolerates low oxygen and brackish water better than carps"
          },
          "feed": {
            "type": "Floating pellet feed (25-32% protein)",
            "daily_quantity": "3-5% of body weight/day, reducing as fish grows",
            "key_ingredients": "Soybean meal, fish meal, rice bran, vitamin premix",
            "water_requirement": "pH 6.5-8.5, temperature stability critical"
          },
          "vaccination_schedule": [
            { "age": "N/A", "vaccine": "No routine vaccination; biosecurity and water quality management primary", "disease_prevented": "General disease prevention", "route": "Pond/tank management" }
          ],
          "yield_timeline": [
            { "stage": "Fingerling stocking", "age_range": "Day 0", "milestone": "Stock 10-15g fingerlings" },
            { "stage": "Grow-out", "age_range": "Month 1-4", "milestone": "Reach 300-500g" },
            { "stage": "Harvest", "age_range": "5-6 months", "milestone": "Market size 500-800g" }
          ],
          "common_diseases": ["Streptococcosis", "Columnaris disease", "Parasitic infestation"],
          "economics": { "stocking_density_per_m3_biofloc": "50-100 fish", "fcr_target": "1.2-1.5", "culture_period_months": "5-6" }
        },
        {
          "id": "freshwater-prawn",
          "name": "Freshwater Prawn (Scampi)",
          "purpose": "High value export/domestic sale",
          "breeds": [
            { "name": "Macrobrachium rosenbergii (Giant Freshwater Prawn)", "origin": "Native, farmed India-wide", "traits": "High market value, needs quality hatchery seed" }
          ],
          "housing": {
            "type": "Earthen pond, monoculture or polyculture with carps",
            "space_requirement": "0.2-0.5 hectare typical",
            "temperature_range": "28-31°C optimal",
            "humidity": "N/A (aquatic)",
            "ventilation": "Moderate aeration recommended",
            "notes": "Provide substrate/shelters to reduce cannibalism"
          },
          "feed": {
            "type": "Sinking pellet feed, high protein",
            "daily_quantity": "5-8% of body weight/day, reducing with growth",
            "key_ingredients": "Fish meal, soybean meal, shrimp head meal, vitamin-mineral mix",
            "water_requirement": "Dissolved oxygen >4mg/L, pH 7-8.5"
          },
          "vaccination_schedule": [
            { "age": "N/A", "vaccine": "No vaccines available; disease-free (SPF) seed sourcing is key prevention", "disease_prevented": "White tail disease and general prevention", "route": "Seed quality/biosecurity" }
          ],
          "yield_timeline": [
            { "stage": "Post-larvae stocking", "age_range": "Day 0", "milestone": "Stock PL30-40 juveniles" },
            { "stage": "Grow-out", "age_range": "Month 1-4", "milestone": "Reach 20-30g" },
            { "stage": "Harvest", "age_range": "5-7 months", "milestone": "Market size 40-60g" }
          ],
          "common_diseases": ["White tail disease", "Black gill disease", "Muscle necrosis"],
          "economics": { "stocking_density_per_hectare": "40000-60000 PL", "expected_yield_kg_per_hectare": "800-1500", "culture_period_months": "6-7" }
        }
      ]
    },
    {
      "id": "apiculture",
      "name": "Apiculture (Bee Keeping)",
      "icon": "Flower2",
      "color": "yellow",
      "types": [
        {
          "id": "apis-cerana-indica",
          "name": "Indian Bee (Apis cerana indica)",
          "purpose": "Honey, pollination, low input",
          "breeds": [
            { "name": "Apis cerana indica", "origin": "Native, India", "traits": "Hardy, disease resistant, suited to small holdings and hilly areas" }
          ],
          "housing": {
            "type": "Wooden bee box (hive) with frames",
            "space_requirement": "Standard hive box; place in shaded, quiet area near forage",
            "temperature_range": "Tolerates wide range, avoid direct harsh sun/rain",
            "humidity": "Moderate, avoid waterlogged sites",
            "ventilation": "Hive entrance regulator for airflow and pest control",
            "notes": "Locate near flowering crops/forests within 2-3 km foraging range"
          },
          "feed": {
            "type": "Natural forage (nectar & pollen); sugar syrup during dearth period",
            "daily_quantity": "Sugar syrup (1:1) as supplementary feed in dearth season",
            "key_ingredients": "Diverse flowering plants nearby for nectar/pollen sources",
            "water_requirement": "Nearby clean water source for the colony"
          },
          "vaccination_schedule": [
            { "age": "N/A", "vaccine": "No vaccines; routine hive inspection for Varroa mites, wax moth, and foulbrood", "disease_prevented": "General colony health management", "route": "Hive inspection/treatment" }
          ],
          "yield_timeline": [
            { "stage": "Colony establishment", "age_range": "Month 0-1", "milestone": "Queen settled, brood building" },
            { "stage": "Colony buildup", "age_range": "Month 2-3", "milestone": "Population growth, comb building" },
            { "stage": "Honey flow season", "age_range": "Season dependent (2-3 flows/year)", "milestone": "First honey harvest" },
            { "stage": "Harvest", "age_range": "Per flow season", "milestone": "5-10 kg honey/colony/year" }
          ],
          "common_diseases": ["Sacbrood virus", "European foulbrood", "Wax moth infestation", "Varroa mites (less common than in exotic bees)"],
          "economics": { "avg_honey_yield_kg_per_year": "5-10", "colonies_per_acre_forage": "4-6" }
        },
        {
          "id": "apis-mellifera",
          "name": "European Bee (Apis mellifera)",
          "purpose": "Commercial honey production",
          "breeds": [
            { "name": "Apis mellifera (Italian bee)", "origin": "Imported, widely used commercially in India", "traits": "High honey yield, less aggressive, needs more management" }
          ],
          "housing": {
            "type": "Langstroth hive box with frames",
            "space_requirement": "Standard Langstroth hive; commercial apiaries hold 20-100+ hives",
            "temperature_range": "Sensitive to extreme heat; shade essential above 35°C",
            "humidity": "Moderate, avoid high humidity zones",
            "ventilation": "Hive ventilation gaps essential in summer",
            "notes": "Often migrated seasonally to follow crop flowering (mustard, sunflower, litchi)"
          },
          "feed": {
            "type": "Natural forage + sugar syrup/pollen substitute during dearth",
            "daily_quantity": "Sugar syrup (1:1 spring buildup, 2:1 winter feeding)",
            "key_ingredients": "Mass-flowering crops (mustard, sunflower, eucalyptus) preferred",
            "water_requirement": "Nearby water source essential"
          },
          "vaccination_schedule": [
            { "age": "N/A", "vaccine": "No vaccines; regular Varroa mite treatment and foulbrood monitoring required", "disease_prevented": "Varroosis, foulbrood, nosema", "route": "Hive treatment (miticide strips, monitoring)" }
          ],
          "yield_timeline": [
            { "stage": "Colony establishment", "age_range": "Month 0-1", "milestone": "Queen introduction, brood buildup" },
            { "stage": "Buildup for flow", "age_range": "Month 2", "milestone": "Population peaks before flowering season" },
            { "stage": "Honey flow", "age_range": "Season dependent (e.g. mustard Dec-Feb)", "milestone": "Main honey harvest" },
            { "stage": "Harvest", "age_range": "2-3 harvests/year", "milestone": "25-40 kg honey/colony/year" }
          ],
          "common_diseases": ["Varroosis (Varroa mites)", "European/American foulbrood", "Nosema disease", "Sacbrood virus"],
          "economics": { "avg_honey_yield_kg_per_year": "25-40", "migratory_beekeeping": "Common for mustard/sunflower/litchi flow" }
        }
      ]
    },
    {
      "id": "piggery",
      "name": "Piggery",
      "icon": "PawPrint",
      "color": "pink",
      "types": [
        {
          "id": "large-white-yorkshire",
          "name": "Large White Yorkshire Pig",
          "purpose": "Meat",
          "breeds": [
            { "name": "Large White Yorkshire", "origin": "Imported, widely reared in NE India and elsewhere", "traits": "Fast growth, large litter size, high meat yield" },
            { "name": "Large White Yorkshire x Desi Cross", "origin": "Crossbred, India", "traits": "Balances growth rate with local adaptability" }
          ],
          "housing": {
            "type": "Concrete floor pen with wallow area",
            "space_requirement": "15-20 sq ft per adult pig",
            "temperature_range": "18-27°C optimal; needs shade/wallow above 30°C",
            "humidity": "Moderate; ensure good drainage",
            "ventilation": "Open-sided shed with good airflow",
            "notes": "Separate farrowing pens for sows near delivery"
          },
          "feed": {
            "type": "Commercial/formulated feed + kitchen waste supplementation",
            "daily_quantity": "1-1.5kg (growers) to 2.5-3kg (adults/lactating sows)/day",
            "key_ingredients": "Maize, rice bran, broken rice, soybean meal, mineral mixture",
            "water_requirement": "10-15 litres/day"
          },
          "vaccination_schedule": [
            { "age": "6-8 weeks", "vaccine": "Classical Swine Fever (CSF)", "disease_prevented": "Classical Swine Fever", "route": "Subcutaneous/Intramuscular" },
            { "age": "Annual booster", "vaccine": "CSF booster", "disease_prevented": "Classical Swine Fever", "route": "Subcutaneous" },
            { "age": "As per outbreak risk", "vaccine": "FMD (in endemic areas)", "disease_prevented": "FMD", "route": "Subcutaneous" }
          ],
          "yield_timeline": [
            { "stage": "Piglet", "age_range": "0-2 months", "milestone": "Weaning at 6-8 weeks" },
            { "stage": "Grower", "age_range": "2-6 months", "milestone": "Rapid weight gain, ~500-700g/day" },
            { "stage": "Market weight", "age_range": "6-8 months", "milestone": "80-100kg live weight" },
            { "stage": "Breeding age (sow)", "age_range": "7-8 months", "milestone": "First service" }
          ],
          "common_diseases": ["Classical Swine Fever", "African Swine Fever (regional risk)", "Foot and mouth disease", "Parasitic worms"],
          "economics": { "litter_size": "8-12 piglets", "farrowing_interval_months": "6", "fcr_target": "3.0-3.5" }
        }
      ]
    },
    {
      "id": "rabbit",
      "name": "Rabbit Farming",
      "icon": "Rabbit",
      "color": "violet",
      "types": [
        {
          "id": "new-zealand-white",
          "name": "New Zealand White Rabbit",
          "purpose": "Meat & fur",
          "breeds": [
            { "name": "New Zealand White", "origin": "Imported, widely reared in India", "traits": "Fast growth, large litters, docile temperament" },
            { "name": "Soviet Chinchilla", "origin": "Imported", "traits": "Good meat quality, dense fur" }
          ],
          "housing": {
            "type": "Raised wire-mesh cage system",
            "space_requirement": "2-3 sq ft per adult rabbit (cage)",
            "temperature_range": "15-25°C optimal; heat stress above 30°C",
            "humidity": "Low humidity preferred",
            "ventilation": "Good airflow essential, avoid drafts on kits",
            "notes": "Elevated cages keep animals clean and reduce parasite/disease load"
          },
          "feed": {
            "type": "Pelleted rabbit feed + green fodder/hay",
            "daily_quantity": "100-150g pellet + green fodder ad-lib per adult",
            "key_ingredients": "Lucerne/alfalfa hay, grains, mineral mixture",
            "water_requirement": "0.5-1 litre/day, more for lactating does"
          },
          "vaccination_schedule": [
            { "age": "6-8 weeks", "vaccine": "Rabbit Haemorrhagic Disease (RHD) - where available/at risk", "disease_prevented": "RHD", "route": "Subcutaneous" },
            { "age": "As advised", "vaccine": "Myxomatosis (where prevalent)", "disease_prevented": "Myxomatosis", "route": "Subcutaneous" }
          ],
          "yield_timeline": [
            { "stage": "Kit", "age_range": "0-4 weeks", "milestone": "Nursing, weaning at 4-6 weeks" },
            { "stage": "Grower", "age_range": "1-3 months", "milestone": "Rapid growth" },
            { "stage": "Market weight", "age_range": "3-4 months", "milestone": "2-2.5kg live weight" },
            { "stage": "Breeding age", "age_range": "5-6 months", "milestone": "First breeding" }
          ],
          "common_diseases": ["Coccidiosis", "Ear mites", "Respiratory infections (snuffles)", "Digestive disorders"],
          "economics": { "litter_size": "6-8 kits", "kindling_interval_days": "42-45", "fcr_target": "3.0" }
        }
      ]
    }
  ]
}
ANIMALJSON

echo "==> Validating JSON..."
python3 -c "import json; json.load(open('src/data/animalEncyclopedia.json')); print('animalEncyclopedia.json OK')"

echo "==> Creating AnimalEncyclopedia list page..."
cat > src/pages/AnimalEncyclopedia.jsx << 'LISTJSX'
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, PawPrint, ChevronRight } from 'lucide-react';
import { useLang } from '@/lib/i18n';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import PageHeader from '@/components/PageHeader';
import animalData from '@/data/animalEncyclopedia.json';

const CATEGORY_COLORS = {
  amber: 'bg-amber-50 border-amber-100 text-amber-700',
  blue: 'bg-blue-50 border-blue-100 text-blue-700',
  orange: 'bg-orange-50 border-orange-100 text-orange-700',
  cyan: 'bg-cyan-50 border-cyan-100 text-cyan-700',
  yellow: 'bg-yellow-50 border-yellow-100 text-yellow-700',
  pink: 'bg-pink-50 border-pink-100 text-pink-700',
  violet: 'bg-violet-50 border-violet-100 text-violet-700',
};

export default function AnimalEncyclopedia() {
  const { t } = useLang();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = animalData.categories;

  const filteredCategories = useMemo(() => {
    const q = query.trim().toLowerCase();
    return categories
      .filter((c) => activeCategory === 'all' || c.id === activeCategory)
      .map((c) => ({
        ...c,
        types: c.types.filter((tItem) =>
          !q ||
          tItem.name.toLowerCase().includes(q) ||
          tItem.purpose.toLowerCase().includes(q) ||
          tItem.breeds.some((b) => b.name.toLowerCase().includes(q))
        ),
      }))
      .filter((c) => c.types.length > 0);
  }, [categories, query, activeCategory]);

  return (
    <div>
      <PageHeader titleKey="animalEncyclopedia" icon={PawPrint} />
      <p className="text-xs text-gray-500 mb-3">
        {t('animalEncyclopediaIntro')}
      </p>

      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('searchAnimalType')}
          className="pl-9"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-3 -mx-1 px-1">
        <button
          onClick={() => setActiveCategory('all')}
          className={`shrink-0 text-xs font-medium px-3 py-1.5 rounded-full border transition ${
            activeCategory === 'all'
              ? 'bg-green-600 text-white border-green-600'
              : 'bg-white text-gray-600 border-gray-200'
          }`}
        >
          {t('allCategories')}
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCategory(c.id)}
            className={`shrink-0 text-xs font-medium px-3 py-1.5 rounded-full border transition ${
              activeCategory === c.id
                ? 'bg-green-600 text-white border-green-600'
                : 'bg-white text-gray-600 border-gray-200'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {filteredCategories.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-8">{t('noAnimalTypesFound')}</p>
      )}

      {filteredCategories.map((c) => (
        <div key={c.id} className="mb-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">{c.name}</h3>
          <div className="grid grid-cols-1 gap-2">
            {c.types.map((tItem) => (
              <Card
                key={tItem.id}
                className={`cursor-pointer hover:shadow-md transition ${CATEGORY_COLORS[c.color] || ''}`}
                onClick={() => navigate(`/animal-encyclopedia/${c.id}/${tItem.id}`)}
              >
                <CardContent className="pt-3 pb-3 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">{tItem.name}</p>
                    <p className="text-xs text-gray-500 truncate">{tItem.purpose}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {tItem.breeds.slice(0, 2).map((b) => (
                        <Badge key={b.name} className="bg-white/70 text-gray-600 border border-gray-200 text-[10px]">
                          {b.name}
                        </Badge>
                      ))}
                      {tItem.breeds.length > 2 && (
                        <Badge className="bg-white/70 text-gray-500 border border-gray-200 text-[10px]">
                          +{tItem.breeds.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400 shrink-0" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
LISTJSX

echo "==> Creating AnimalEncyclopediaDetail page..."
cat > src/pages/AnimalEncyclopediaDetail.jsx << 'DETAILJSX'
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Home, Syringe, Utensils, Thermometer, TrendingUp,
  AlertTriangle, IndianRupee, Droplets,
} from 'lucide-react';
import { useLang } from '@/lib/i18n';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import PageHeader from '@/components/PageHeader';
import animalData from '@/data/animalEncyclopedia.json';

export default function AnimalEncyclopediaDetail() {
  const { categoryId, typeId } = useParams();
  const navigate = useNavigate();
  const { t } = useLang();

  const category = animalData.categories.find((c) => c.id === categoryId);
  const animal = category?.types.find((tItem) => tItem.id === typeId);

  if (!animal) {
    return (
      <div>
        <PageHeader titleKey="animalEncyclopedia" icon={Home} />
        <p className="text-sm text-gray-400 text-center py-8">{t('animalTypeNotFound')}</p>
        <button onClick={() => navigate('/animal-encyclopedia')} className="text-sm text-green-700 flex items-center gap-1 mx-auto">
          <ArrowLeft className="h-4 w-4" />{t('backToEncyclopedia')}
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => navigate('/animal-encyclopedia')}
        className="flex items-center gap-1 text-xs text-gray-500 mb-2"
      >
        <ArrowLeft className="h-3.5 w-3.5" />{t('backToEncyclopedia')}
      </button>

      <div className="mb-4">
        <h1 className="text-lg font-bold text-gray-800">{animal.name}</h1>
        <p className="text-sm text-gray-500">{category.name} &middot; {animal.purpose}</p>
      </div>

      {/* Breeds */}
      <Card className="mb-3">
        <CardContent className="pt-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">{t('breeds')}</h3>
          <div className="space-y-2">
            {animal.breeds.map((b) => (
              <div key={b.name} className="border border-gray-100 rounded-lg p-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-medium">{b.name}</p>
                  <Badge className="bg-gray-100 text-gray-600 text-[10px]">{b.origin}</Badge>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{b.traits}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Housing / Environment */}
      <Card className="mb-3">
        <CardContent className="pt-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
            <Thermometer className="h-4 w-4 text-blue-600" />{t('housingEnvironment')}
          </h3>
          <dl className="text-xs text-gray-600 space-y-1.5">
            <div><dt className="inline font-medium text-gray-700">{t('housingType')}: </dt><dd className="inline">{animal.housing.type}</dd></div>
            <div><dt className="inline font-medium text-gray-700">{t('spaceRequirement')}: </dt><dd className="inline">{animal.housing.space_requirement}</dd></div>
            <div><dt className="inline font-medium text-gray-700">{t('temperatureRange')}: </dt><dd className="inline">{animal.housing.temperature_range}</dd></div>
            <div><dt className="inline font-medium text-gray-700">{t('humidity')}: </dt><dd className="inline">{animal.housing.humidity}</dd></div>
            <div><dt className="inline font-medium text-gray-700">{t('ventilation')}: </dt><dd className="inline">{animal.housing.ventilation}</dd></div>
            {animal.housing.notes && (
              <p className="text-[11px] text-gray-500 italic mt-1">{animal.housing.notes}</p>
            )}
          </dl>
        </CardContent>
      </Card>

      {/* Feed */}
      <Card className="mb-3">
        <CardContent className="pt-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
            <Utensils className="h-4 w-4 text-amber-600" />{t('feedRequirements')}
          </h3>
          <dl className="text-xs text-gray-600 space-y-1.5">
            <div><dt className="inline font-medium text-gray-700">{t('feedType')}: </dt><dd className="inline">{animal.feed.type}</dd></div>
            <div><dt className="inline font-medium text-gray-700">{t('dailyQuantity')}: </dt><dd className="inline">{animal.feed.daily_quantity}</dd></div>
            <div><dt className="inline font-medium text-gray-700">{t('keyIngredients')}: </dt><dd className="inline">{animal.feed.key_ingredients}</dd></div>
            <div className="flex items-center gap-1"><Droplets className="h-3 w-3 text-cyan-500" /><dt className="inline font-medium text-gray-700">{t('waterRequirement')}: </dt><dd className="inline">{animal.feed.water_requirement}</dd></div>
          </dl>
        </CardContent>
      </Card>

      {/* Vaccination Schedule */}
      <Card className="mb-3">
        <CardContent className="pt-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
            <Syringe className="h-4 w-4 text-rose-600" />{t('vaccinationSchedule')}
          </h3>
          <div className="space-y-2">
            {animal.vaccination_schedule.map((v, i) => (
              <div key={i} className="flex gap-2 border-l-2 border-rose-200 pl-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Badge className="bg-rose-50 text-rose-700 text-[10px]">{v.age}</Badge>
                    <span className="text-xs font-medium">{v.vaccine}</span>
                  </div>
                  <p className="text-[11px] text-gray-500">
                    {t('prevents')}: {v.disease_prevented} &middot; {t('route')}: {v.route}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Yield Timeline */}
      <Card className="mb-3">
        <CardContent className="pt-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4 text-green-600" />{t('yieldTimeline')}
          </h3>
          <div className="relative pl-4 space-y-3">
            <div className="absolute left-1.5 top-1 bottom-1 w-px bg-green-200" />
            {animal.yield_timeline.map((y, i) => (
              <div key={i} className="relative">
                <div className="absolute -left-4 top-1 h-2.5 w-2.5 rounded-full bg-green-500" />
                <p className="text-xs font-semibold text-gray-700">{y.stage} <span className="text-gray-400 font-normal">&middot; {y.age_range}</span></p>
                <p className="text-[11px] text-gray-500">{y.milestone}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Common Diseases */}
      <Card className="mb-3">
        <CardContent className="pt-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
            <AlertTriangle className="h-4 w-4 text-orange-600" />{t('commonDiseases')}
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {animal.common_diseases.map((d) => (
              <Badge key={d} className="bg-orange-50 text-orange-700 text-[10px]">{d}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Economics */}
      {animal.economics && (
        <Card className="mb-4">
          <CardContent className="pt-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
              <IndianRupee className="h-4 w-4 text-emerald-600" />{t('quickFacts')}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(animal.economics).map(([k, v]) => (
                <div key={k} className="bg-emerald-50 border border-emerald-100 rounded-lg p-2">
                  <p className="text-[10px] text-gray-500 capitalize">{k.replace(/_/g, ' ')}</p>
                  <p className="text-xs font-semibold text-emerald-700">{String(v)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
DETAILJSX

echo "==> Patching src/App.jsx (adds import + routes, idempotent)..."
python3 - << 'PYEOF'
import re

path = "src/App.jsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

changed = False

import_line_1 = "import AnimalEncyclopedia from './pages/AnimalEncyclopedia.jsx';"
import_line_2 = "import AnimalEncyclopediaDetail from './pages/AnimalEncyclopediaDetail.jsx';"

if import_line_1 not in content:
    page_imports = list(re.finditer(r"^import .+ from '\./pages/.+\.jsx';\s*$", content, re.MULTILINE))
    if page_imports:
        last = page_imports[-1]
        insert_at = last.end()
        content = (
            content[:insert_at]
            + "\n" + import_line_1
            + "\n" + import_line_2
            + content[insert_at:]
        )
        changed = True
    else:
        print("WARNING: could not find a './pages/*.jsx' import line to anchor on.")
        print("Add these two imports manually near the top of src/App.jsx:")
        print("  " + import_line_1)
        print("  " + import_line_2)

route_line_1 = '        <Route path="/animal-encyclopedia" element={<AnimalEncyclopedia />} />'
route_line_2 = '        <Route path="/animal-encyclopedia/:categoryId/:typeId" element={<AnimalEncyclopediaDetail />} />'

if route_line_1 not in content:
    idx = content.find("</Routes>")
    if idx != -1:
        content = content[:idx] + route_line_1 + "\n" + route_line_2 + "\n      " + content[idx:]
        changed = True
    else:
        print("WARNING: could not find '</Routes>' to anchor on.")
        print("Add these two routes manually inside your <Routes> block in src/App.jsx:")
        print("  " + route_line_1)
        print("  " + route_line_2)

if changed:
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print("src/App.jsx patched successfully.")
else:
    print("src/App.jsx already up to date (no changes made).")
PYEOF

echo ""
echo "==> Done. New route: /animal-encyclopedia (list) and /animal-encyclopedia/:categoryId/:typeId (detail)."
echo "==> If your app has a sidebar/menu component, add a link there too, e.g.:"
echo '    <NavLink to="/animal-encyclopedia">Animal Encyclopedia</NavLink>'
