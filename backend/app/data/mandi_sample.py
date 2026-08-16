# Fallback mandi price samples used when the live data.gov.in call fails
# (rate limit, timeout, or network issue). Clearly flagged as sample data
# in the response so it's never presented as live/current pricing.
MANDI_SAMPLE_DATA = [
    {"state": "Telangana", "district": "Hyderabad", "market": "Bowenpally", "commodity": "Rice", "variety": "Common", "arrival_date": "sample", "min_price": "1800", "max_price": "2200", "modal_price": "2000"},
    {"state": "Telangana", "district": "Warangal", "market": "Warangal Mandi", "commodity": "Cotton", "variety": "Medium Staple", "arrival_date": "sample", "min_price": "6500", "max_price": "7200", "modal_price": "6900"},
    {"state": "Punjab", "district": "Ludhiana", "market": "Ludhiana Mandi", "commodity": "Wheat", "variety": "Common", "arrival_date": "sample", "min_price": "2100", "max_price": "2300", "modal_price": "2200"},
    {"state": "Maharashtra", "district": "Nashik", "market": "Nashik APMC", "commodity": "Onion", "variety": "Red", "arrival_date": "sample", "min_price": "1200", "max_price": "1800", "modal_price": "1500"},
    {"state": "Uttar Pradesh", "district": "Meerut", "market": "Meerut Mandi", "commodity": "Sugarcane", "variety": "Common", "arrival_date": "sample", "min_price": "340", "max_price": "360", "modal_price": "350"},
]
