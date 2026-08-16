"""
data.gov.in resource IDs — every entry below was verified directly against
the API documentation text the user uploaded (AGRISAATHI-API-KEYS.md), not
carried over from an unverified secondhand transcript.
"""

DATAGOV_RESOURCES = {
    "mandi_prices": {
        "resource_id": "9ef84268-d588-465a-a308-a864a43d0070",
        "title": "Current Daily Price of Various Commodities from Various Markets (Mandi)",
        "filters": ["state.keyword", "district", "market", "commodity", "variety", "grade"],
    },
    "variety_market_prices": {
        "resource_id": "35985678-0d79-46b4-9ed6-6f13308a1d24",
        "title": "Variety-wise Daily Market Prices Data of Commodity",
        "filters": ["State", "District", "Commodity", "Arrival_Date"],
    },
    "soil_moisture": {
        "resource_id": "4554a3c8-74e3-4f93-8727-8fd92161e345",
        "title": "Daily data of Soil Moisture",
        "filters": ["Year", "Month", "State", "District", "Agency_name"],
    },
    "district_crop_production": {
        "resource_id": "35be999b-0208-4354-b557-f6ca9a5355de",
        "title": "District-wise, season-wise crop production statistics from 1997",
        "filters": [],
    },
    "horticulture_varieties": {
        "resource_id": "46f587a9-7476-443e-915f-fc756a6b4e2c",
        "title": "List of certified varieties of horticultural crops",
        "filters": [],
    },
    "pincode_directory": {
        "resource_id": "5c2f62fe-5afa-4119-a499-fec9d604d5bd",
        "title": "All India Pincode Directory till last month",
        "filters": [],
    },
    "veterinary_institutions": {
        "resource_id": "7d21b6cf-3382-46fd-884d-7df485cfedaf",
        "title": "State & UT-wise Number of Veterinary Institutions",
        "filters": [],
    },
    "fertilizer_dealers_by_district": {
        "resource_id": "56f40018-fd03-4010-94a3-f34ca7b43f7c",
        "title": "Details of Number of Dealers in Each District of India (Chemical Fertilizers, up to 2013-14)",
        "filters": [],
    },
    "fertilizer_subsidy": {
        "resource_id": "2e0e6c04-97f2-456b-9309-bf605650cb11",
        "title": "Details of Year-wise Subsidy on Fertilizer Products",
        "filters": [],
    },
    "pesticide_dealers_license": {
        "resource_id": "8db62b11-d6a1-41bd-8d9d-5d560b47b8a6",
        "title": "Pesticides Dealers License Report",
        "filters": [],
    },
    "kcc_farmer_queries": {
        "resource_id": "cef25fe2-9231-4128-8aec-2c948fedd43f",
        "title": "Kisan Call Centre (KCC) - Transcripts of farmers' queries & answers",
        "filters": ["StateName", "year", "month"],
    },
    "seasonal_temperature": {
        "resource_id": "45787c4b-3210-4fd0-b120-63336e042370",
        "title": "Seasonal and Annual Mean Temperature Series 1901-2021",
        "filters": [],
    },
    "livestock_census_himachal_pradesh": {"resource_id": "819e6f8f-f47a-4cf4-888d-1339b4a4f4ad", "title": "Livestock Census - Himachal Pradesh", "filters": []},
    "livestock_census_sikkim": {"resource_id": "0c61ebaf-5b93-44ce-a50d-e313ee09b639", "title": "Livestock Census - Sikkim", "filters": []},
    "livestock_census_haryana": {"resource_id": "d8b39a01-5aa8-419a-a6a0-6a7f5d9b47d2", "title": "Livestock Census - Haryana", "filters": []},
    "livestock_census_rajasthan": {"resource_id": "f16b0fcb-62e4-4777-9a9e-52c0ab69940b", "title": "Livestock Census - Rajasthan", "filters": []},
    "livestock_census_gujarat": {"resource_id": "339fbef8-8d3e-4c70-a1e1-759d2f25211f", "title": "Livestock Census - Gujarat", "filters": []},
    "livestock_census_punjab": {"resource_id": "406217bf-76c4-442a-89ef-ecc8c6708c95", "title": "Livestock Census - Punjab", "filters": []},
    "livestock_census_goa": {"resource_id": "3ac95c73-0a21-4d05-9e01-6276471af711", "title": "Livestock Census - Goa", "filters": []},
    "livestock_census_puducherry": {"resource_id": "b5614586-e093-4aae-9983-b699c21f09a6", "title": "Livestock Census - Puducherry", "filters": []},
    "livestock_census_daman_diu": {"resource_id": "87e31c05-bd02-4241-85f4-c7fc6fa98a68", "title": "Livestock Census - Daman and Diu", "filters": []},
    "livestock_census_odisha": {"resource_id": "18658cc3-c778-4482-bd2b-bcbf1dbb309d", "title": "Livestock Census - Odisha", "filters": []},
    "livestock_census_dadra_nagar_haveli": {"resource_id": "0c67102e-d2d4-48c0-a4af-f88be236d486", "title": "Livestock Census - Dadra and Nagar Haveli", "filters": []},
    "livestock_census_nagaland": {"resource_id": "24923144-653a-489e-bf2b-69013a94e53b", "title": "Livestock Census - Nagaland", "filters": []},
    "livestock_census_chhattisgarh": {"resource_id": "70480cbe-1d80-433f-b601-7f657e8fe090", "title": "Livestock Census - Chhattisgarh", "filters": []},
    "livestock_census_mizoram": {"resource_id": "7cb44e0b-2676-4782-983c-231ae41abaf4", "title": "Livestock Census - Mizoram", "filters": []},
    "livestock_census_meghalaya": {"resource_id": "f63903c2-8e1d-4d5d-b059-d939f25aae0b", "title": "Livestock Census - Meghalaya", "filters": []},
    "livestock_census_chandigarh": {"resource_id": "dd873e0f-d23a-41d4-83c7-4bac87b62397", "title": "Livestock Census - Chandigarh", "filters": []},
    "livestock_census_manipur": {"resource_id": "3ebc4ca9-8ed7-4ae8-a0b0-07c879d0f024", "title": "Livestock Census - Manipur", "filters": []},
    "livestock_census_bihar": {"resource_id": "8b43a5f3-8c61-4dfe-8e28-98b9734b625c", "title": "Livestock Census - Bihar", "filters": []},
    "livestock_census_maharashtra": {"resource_id": "0935d4a7-647e-49ac-a28e-b0890342515c", "title": "Livestock Census - Maharashtra", "filters": []},
    "livestock_census_assam": {"resource_id": "6ef56e3a-6d60-4170-ab2d-bdf6e181a12b", "title": "Livestock Census - Assam", "filters": []},
    "livestock_census_madhya_pradesh": {"resource_id": "de0d9673-8d01-48c5-8cdd-65ca7ced4bf4", "title": "Livestock Census - Madhya Pradesh", "filters": []},
    "livestock_census_west_bengal": {"resource_id": "4e92f370-ee59-4d97-871f-0108b32df4f7", "title": "Livestock Census - West Bengal", "filters": []},
    "livestock_census_arunachal_pradesh": {"resource_id": "7a7f44c0-860b-43dd-b6c5-dbcd7f846221", "title": "Livestock Census - Arunachal Pradesh", "filters": []},
    "livestock_census_lakshadweep": {"resource_id": "6d28e51c-1a6f-44ed-919b-5b5e63576039", "title": "Livestock Census - Lakshadweep", "filters": []},
    "livestock_census_uttarakhand": {"resource_id": "734c8386-42b1-4c8c-86f1-be6a20fd14c0", "title": "Livestock Census - Uttarakhand", "filters": []},
    "livestock_census_andhra_pradesh": {"resource_id": "d5d764b5-ea87-4665-8c1a-22c2a10f7e66", "title": "Livestock Census - Andhra Pradesh", "filters": []},
    "livestock_census_kerala": {"resource_id": "6a35cf54-7fea-4b25-8493-6c3e2fe72529", "title": "Livestock Census - Kerala", "filters": []},
    "livestock_census_uttar_pradesh": {"resource_id": "58323ceb-b546-4395-af3b-76efadb6907b", "title": "Livestock Census - Uttar Pradesh", "filters": []},
    "livestock_census_andaman_nicobar": {"resource_id": "846d21d7-0fc7-4c91-a853-2081647ce601", "title": "Livestock Census - Andaman and Nicobar", "filters": []},
    "livestock_census_karnataka": {"resource_id": "54411c6a-fc46-49b0-bca2-7433fabcef81", "title": "Livestock Census - Karnataka", "filters": []},
    "livestock_census_tripura": {"resource_id": "28fc86c8-82c8-4f19-af07-749de58abe3f", "title": "Livestock Census - Tripura", "filters": []},
    "livestock_census_jharkhand": {"resource_id": "93f4744f-2dc2-47f9-a3b1-f8700124ab15", "title": "Livestock Census - Jharkhand", "filters": []},
    "livestock_census_telangana": {"resource_id": "317f3cbd-75f4-422d-8e53-7282ce4b1cfd", "title": "Livestock Census - Telangana", "filters": []},
    "livestock_census_jammu_kashmir": {"resource_id": "a3f30913-cd7a-4465-97c4-c54f0c962721", "title": "Livestock Census - Jammu and Kashmir", "filters": []},
    "livestock_census_tamil_nadu": {"resource_id": "297b2340-3751-446d-8c56-7a4f4a6fde86", "title": "Livestock Census - Tamil Nadu", "filters": []},

    "fertilizer_production_monthly": {
        "resource_id": "373358c8-63fd-4612-8f2b-9ce483422312",
        "title": "Product wise and Month wise production of chemical Fertilizers",
        "filters": [],
    },
    "cold_storage_distribution": {
        "resource_id": "0b827ac7-ebad-47c1-9cc9-816ce4ab10a7",
        "title": "Sector-wise distribution of cold storages in India (as on 31.12.2009)",
        "filters": [],
    },
    "fertilizer_demand_availability_rabi": {
        "resource_id": "e636c081-9a0a-45ed-8531-d3d33f31f90c",
        "title": "Fertilizer-wise Details of Demand, Availability, Consumption and Closing Stock of Fertilizers during Ongoing Rabi 2024-25",
        "filters": [],
    },
    "fertilizer_demand_supply_kharif": {
        "resource_id": "7ea27976-ff4e-4077-8c3b-ca3bc14a0bb8",
        "title": "State/UT-wise Details of Demand, Supply and Consumption of All Fertilizer During Kharif 2024-25",
        "filters": [],
    },
    "pm_kisan_beneficiaries": {
        "resource_id": "388208c6-d82a-4190-90df-91aa2c326fec",
        "title": "Village and Gender-wise Beneficiaries Count under PM-KISAN Scheme",
        "filters": [],
    },
    "pmfby_funds_allocated": {
        "resource_id": "2c0d784b-de75-42e5-9146-689eb0ba407a",
        "title": "Year-wise Details of Funds Allocated and Utilised under Pradhan Mantri Fasal Bima Yojana (PMFBY) 2020-21 to 2024-25",
        "filters": [],
    },
}

# NOT VERIFIED / NOT FOUND in the primary source: air_quality_index,
# demand_and_supply_commodities, cold_storage_distribution, and a few others
# mentioned in earlier (unverified) discussion. Add these only after
# confirming the resource ID against api.data.gov.in yourself.

STATE_TO_LIVESTOCK_CENSUS_KEY = {
    "himachal pradesh": "livestock_census_himachal_pradesh", "sikkim": "livestock_census_sikkim",
    "haryana": "livestock_census_haryana", "rajasthan": "livestock_census_rajasthan",
    "gujarat": "livestock_census_gujarat", "punjab": "livestock_census_punjab",
    "goa": "livestock_census_goa", "puducherry": "livestock_census_puducherry",
    "daman and diu": "livestock_census_daman_diu", "odisha": "livestock_census_odisha",
    "dadra and nagar haveli": "livestock_census_dadra_nagar_haveli", "nagaland": "livestock_census_nagaland",
    "chhattisgarh": "livestock_census_chhattisgarh", "mizoram": "livestock_census_mizoram",
    "meghalaya": "livestock_census_meghalaya", "chandigarh": "livestock_census_chandigarh",
    "manipur": "livestock_census_manipur", "bihar": "livestock_census_bihar",
    "maharashtra": "livestock_census_maharashtra", "assam": "livestock_census_assam",
    "madhya pradesh": "livestock_census_madhya_pradesh", "west bengal": "livestock_census_west_bengal",
    "arunachal pradesh": "livestock_census_arunachal_pradesh", "lakshadweep": "livestock_census_lakshadweep",
    "uttarakhand": "livestock_census_uttarakhand", "andhra pradesh": "livestock_census_andhra_pradesh",
    "kerala": "livestock_census_kerala", "uttar pradesh": "livestock_census_uttar_pradesh",
    "andaman and nicobar": "livestock_census_andaman_nicobar", "karnataka": "livestock_census_karnataka",
    "tripura": "livestock_census_tripura", "jharkhand": "livestock_census_jharkhand",
    "telangana": "livestock_census_telangana", "jammu and kashmir": "livestock_census_jammu_kashmir",
    "tamil nadu": "livestock_census_tamil_nadu",
}
