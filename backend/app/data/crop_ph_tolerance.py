CROP_PH_TOLERANCE = {
    "rice": (5.5, 6.5), "maize": (5.5, 7.0), "cotton": (6.0, 8.0), "sugarcane": (6.0, 7.5),
    "wheat": (6.0, 7.5), "jute": (6.0, 7.5), "coffee": (5.0, 6.5), "coconut": (5.5, 8.0),
    "papaya": (6.0, 6.5), "orange": (5.5, 7.5), "apple": (5.5, 6.5), "muskmelon": (6.0, 6.8),
    "watermelon": (5.5, 6.8), "grapes": (5.5, 6.5), "mango": (5.5, 7.5), "banana": (5.5, 7.0),
    "pomegranate": (5.5, 7.2), "lentil": (6.0, 7.5), "blackgram": (6.5, 7.5), "mungbean": (6.2, 7.2),
    "mothbeans": (6.0, 7.5), "pigeonpeas": (5.5, 7.0), "kidneybeans": (5.5, 6.5), "chickpea": (6.0, 8.0),
}

def classify_ph(avg_ph):
    if avg_ph < 5.5:
        return "strongly acidic"
    if avg_ph < 6.5:
        return "slightly acidic"
    if avg_ph <= 7.5:
        return "neutral"
    if avg_ph <= 8.5:
        return "slightly alkaline"
    return "strongly alkaline"

def water_quality_note(avg_ph, avg_ec, tds, hardness):
    issues = []
    if avg_ph is not None and (avg_ph < 6.5 or avg_ph > 8.5):
        issues.append("Water pH is outside the ideal 6.5-8.5 range for most crops.")
    if avg_ec is not None and avg_ec > 2.0:
        issues.append("EC above 2.0 dS/m indicates high salinity — may restrict crop choice.")
    if tds is not None and tds > 2000:
        issues.append("TDS above 2000 mg/L is generally unsuitable for irrigation.")
    if hardness is not None and hardness > 300:
        issues.append("Water hardness is high — may cause scaling in drip irrigation systems.")
    if not issues:
        issues.append("Water quality looks suitable for irrigation based on the values entered.")
    return issues
