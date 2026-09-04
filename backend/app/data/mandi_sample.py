# Fallback mandi price samples used when the live data.gov.in call fails
# (rate limit, timeout, or no outbound network). Clearly flagged as sample
# data in the response (`source: sample_fallback`) so it's never presented
# as live pricing. Prices are realistic INR/quintal reference values.
# arrival_date is filled in at runtime with today's date by the service.

MANDI_SAMPLE_DATA = [
    # Onion
    {"state": "Maharashtra", "district": "Nashik", "market": "Nashik APMC", "commodity": "Onion", "variety": "Red", "arrival_date": "", "min_price": "1200", "max_price": "1800", "modal_price": "1500"},
    {"state": "Maharashtra", "district": "Nashik", "market": "Lasalgaon", "commodity": "Onion", "variety": "Red", "arrival_date": "", "min_price": "1150", "max_price": "1750", "modal_price": "1450"},
    {"state": "Madhya Pradesh", "district": "Indore", "market": "Indore Mandi", "commodity": "Onion", "variety": "Local", "arrival_date": "", "min_price": "1100", "max_price": "1600", "modal_price": "1350"},
    # Tomato
    {"state": "Karnataka", "district": "Kolar", "market": "Kolar APMC", "commodity": "Tomato", "variety": "Local", "arrival_date": "", "min_price": "800", "max_price": "1600", "modal_price": "1200"},
    {"state": "Telangana", "district": "Hyderabad", "market": "Bowenpally", "commodity": "Tomato", "variety": "Hybrid", "arrival_date": "", "min_price": "1000", "max_price": "2000", "modal_price": "1400"},
    {"state": "Maharashtra", "district": "Pune", "market": "Pune Market", "commodity": "Tomato", "variety": "Local", "arrival_date": "", "min_price": "900", "max_price": "1700", "modal_price": "1300"},
    # Potato
    {"state": "Uttar Pradesh", "district": "Agra", "market": "Agra Mandi", "commodity": "Potato", "variety": "Local", "arrival_date": "", "min_price": "800", "max_price": "1200", "modal_price": "1000"},
    {"state": "Bihar", "district": "Patna", "market": "Patna Market", "commodity": "Potato", "variety": "Local", "arrival_date": "", "min_price": "750", "max_price": "1150", "modal_price": "950"},
    {"state": "Punjab", "district": "Jalandhar", "market": "Jalandhar Mandi", "commodity": "Potato", "variety": "Kufri", "arrival_date": "", "min_price": "850", "max_price": "1250", "modal_price": "1050"},
    # Wheat
    {"state": "Punjab", "district": "Ludhiana", "market": "Ludhiana Mandi", "commodity": "Wheat", "variety": "Lokwan", "arrival_date": "", "min_price": "2100", "max_price": "2300", "modal_price": "2200"},
    {"state": "Haryana", "district": "Karnal", "market": "Karnal Mandi", "commodity": "Wheat", "variety": "Common", "arrival_date": "", "min_price": "2150", "max_price": "2400", "modal_price": "2250"},
    {"state": "Madhya Pradesh", "district": "Bhopal", "market": "Bhopal Mandi", "commodity": "Wheat", "variety": "Sharbati", "arrival_date": "", "min_price": "2300", "max_price": "2600", "modal_price": "2450"},
    # Rice
    {"state": "Telangana", "district": "Hyderabad", "market": "Bowenpally", "commodity": "Rice", "variety": "Common", "arrival_date": "", "min_price": "1800", "max_price": "2200", "modal_price": "2000"},
    {"state": "Chhattisgarh", "district": "Raipur", "market": "Raipur Mandi", "commodity": "Rice", "variety": "Common", "arrival_date": "", "min_price": "1750", "max_price": "2100", "modal_price": "1950"},
    # Cotton
    {"state": "Telangana", "district": "Warangal", "market": "Warangal Mandi", "commodity": "Cotton", "variety": "Medium Staple", "arrival_date": "", "min_price": "6500", "max_price": "7200", "modal_price": "6900"},
    {"state": "Andhra Pradesh", "district": "Guntur", "market": "Guntur Mandi", "commodity": "Cotton", "variety": "Medium Staple", "arrival_date": "", "min_price": "6600", "max_price": "7300", "modal_price": "7000"},
    # Sugarcane
    {"state": "Uttar Pradesh", "district": "Meerut", "market": "Meerut Mandi", "commodity": "Sugarcane", "variety": "Common", "arrival_date": "", "min_price": "340", "max_price": "360", "modal_price": "350"},
    {"state": "Maharashtra", "district": "Solapur", "market": "Solapur Market", "commodity": "Sugarcane", "variety": "Common", "arrival_date": "", "min_price": "330", "max_price": "355", "modal_price": "345"},
    # Maize
    {"state": "Karnataka", "district": "Davanagere", "market": "Davanagere Mandi", "commodity": "Maize", "variety": "Local", "arrival_date": "", "min_price": "1900", "max_price": "2200", "modal_price": "2050"},
    {"state": "Telangana", "district": "Nizamabad", "market": "Nizamabad Market", "commodity": "Maize", "variety": "Local", "arrival_date": "", "min_price": "1850", "max_price": "2150", "modal_price": "2000"},
    # Groundnut
    {"state": "Gujarat", "district": "Rajkot", "market": "Rajkot Mandi", "commodity": "Groundnut", "variety": "Local", "arrival_date": "", "min_price": "5500", "max_price": "6200", "modal_price": "5800"},
    {"state": "Gujarat", "district": "Junagadh", "market": "Junagadh Mandi", "commodity": "Groundnut", "variety": "Bunch", "arrival_date": "", "min_price": "5600", "max_price": "6300", "modal_price": "5900"},
    # Soybean
    {"state": "Madhya Pradesh", "district": "Indore", "market": "Indore Mandi", "commodity": "Soybean", "variety": "Local", "arrival_date": "", "min_price": "4500", "max_price": "4900", "modal_price": "4700"},
    {"state": "Madhya Pradesh", "district": "Ujjain", "market": "Ujjain Mandi", "commodity": "Soybean", "variety": "Local", "arrival_date": "", "min_price": "4450", "max_price": "4850", "modal_price": "4650"},
    # Banana
    {"state": "Maharashtra", "district": "Jalgaon", "market": "Jalgaon Market", "commodity": "Banana", "variety": "Local", "arrival_date": "", "min_price": "1200", "max_price": "1800", "modal_price": "1500"},
    # Green Chilli
    {"state": "Andhra Pradesh", "district": "Guntur", "market": "Guntur Mandi", "commodity": "Green Chilli", "variety": "Local", "arrival_date": "", "min_price": "3000", "max_price": "5000", "modal_price": "4000"},
    {"state": "Telangana", "district": "Khammam", "market": "Khammam Market", "commodity": "Green Chilli", "variety": "Local", "arrival_date": "", "min_price": "2800", "max_price": "4800", "modal_price": "3800"},
    # Turmeric
    {"state": "Telangana", "district": "Nizamabad", "market": "Nizamabad Market", "commodity": "Turmeric", "variety": "Salem", "arrival_date": "", "min_price": "13000", "max_price": "16000", "modal_price": "14500"},
    {"state": "Tamil Nadu", "district": "Erode", "market": "Erode Market", "commodity": "Turmeric", "variety": "Salem", "arrival_date": "", "min_price": "13500", "max_price": "16500", "modal_price": "15000"},
    # Ginger
    {"state": "Kerala", "district": "Ernakulam", "market": "Kochi Market", "commodity": "Ginger", "variety": "Local", "arrival_date": "", "min_price": "4000", "max_price": "5500", "modal_price": "4800"},
    # Mustard
    {"state": "Rajasthan", "district": "Jaipur", "market": "Jaipur Mandi", "commodity": "Mustard", "variety": "Local", "arrival_date": "", "min_price": "5000", "max_price": "5400", "modal_price": "5200"},
    {"state": "Rajasthan", "district": "Sri Ganganagar", "market": "Sri Ganganagar Mandi", "commodity": "Mustard", "variety": "Local", "arrival_date": "", "min_price": "5050", "max_price": "5450", "modal_price": "5250"},
    # Bajra
    {"state": "Rajasthan", "district": "Jaipur", "market": "Jaipur Mandi", "commodity": "Bajra", "variety": "Local", "arrival_date": "", "min_price": "2100", "max_price": "2400", "modal_price": "2250"},
    {"state": "Haryana", "district": "Hisar", "market": "Hisar Mandi", "commodity": "Bajra", "variety": "Local", "arrival_date": "", "min_price": "2150", "max_price": "2450", "modal_price": "2300"},
    # Arhar (Tur)
    {"state": "Karnataka", "district": "Kalaburagi", "market": "Kalaburagi Mandi", "commodity": "Arhar (Tur)", "variety": "Local", "arrival_date": "", "min_price": "7000", "max_price": "7600", "modal_price": "7300"},
    {"state": "Maharashtra", "district": "Latur", "market": "Latur Mandi", "commodity": "Arhar (Tur)", "variety": "Local", "arrival_date": "", "min_price": "7050", "max_price": "7650", "modal_price": "7350"},
    # Gram (Chana)
    {"state": "Rajasthan", "district": "Bikaner", "market": "Bikaner Mandi", "commodity": "Gram", "variety": "Local", "arrival_date": "", "min_price": "5400", "max_price": "5800", "modal_price": "5600"},
    {"state": "Madhya Pradesh", "district": "Bhopal", "market": "Bhopal Mandi", "commodity": "Gram", "variety": "Local", "arrival_date": "", "min_price": "5350", "max_price": "5750", "modal_price": "5550"},
]
