"""
Curated scheme reference data. These are well-established, publicly documented
central government schemes — the facts here (benefit amounts, premium rates)
are the stable headline terms of each scheme. Always show `official_link` and
`last_verified_note` so farmers can confirm current figures, since scheme
terms are revised by government notification from time to time and this
static list will not auto-update.

`state_scope` of "All India" means all states/UTs. Add more state-specific
schemes to STATE_SCHEMES as needed (Telangana included as a starting point
per the app's earlier context).
"""

CENTRAL_SCHEMES = [
    {
        "id": "pm-kisan",
        "name": "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
        "ministry": "Ministry of Agriculture & Farmers Welfare",
        "state_scope": "All India",
        "benefit_summary": "₹6,000 per year paid directly to the farmer's bank account in 3 equal instalments of ₹2,000 every 4 months.",
        "eligibility_rules": {
            "land_owning_farmer": True,
            "excludes_institutional_land_holders": True,
            "excludes_income_tax_payers": True,
            "excludes_constitutional_post_holders_and_serving_or_retired_govt_employees_above_certain_grade": True,
        },
        "eligibility_summary": "Small and marginal land-owning farmer families. Institutional landholders and certain higher-income categories (income tax payers, some government employees/pensioners) are excluded.",
        "documents_needed": ["Aadhaar", "Land ownership records", "Bank account (Aadhaar-linked)"],
        "official_link": "https://pmkisan.gov.in",
        "source_type": "curated_static",
    },
    {
        "id": "pmfby",
        "name": "PMFBY (Pradhan Mantri Fasal Bima Yojana)",
        "ministry": "Ministry of Agriculture & Farmers Welfare",
        "state_scope": "All India (state must opt in for the season; not all states participate every season)",
        "benefit_summary": "Crop insurance against yield loss from natural calamities, pests and disease. Farmer premium capped at 2% of sum insured for Kharif crops, 1.5% for Rabi crops, and 5% for annual commercial/horticultural crops; the rest is subsidised by central + state government.",
        "eligibility_rules": {
            "must_have_insurable_interest_in_notified_crop": True,
            "loanee_farmers_may_be_auto_enrolled": True,
            "non_loanee_farmers_can_opt_in_voluntarily": True,
        },
        "eligibility_summary": "All farmers (loanee and non-loanee) growing a notified crop in a notified area for the season, in a state that has opted into PMFBY that season.",
        "documents_needed": ["Aadhaar", "Land records / tenancy agreement", "Bank account", "Sowing certificate (for non-loanee farmers)"],
        "official_link": "https://pmfby.gov.in",
        "source_type": "curated_static",
    },
    {
        "id": "kcc",
        "name": "Kisan Credit Card (KCC)",
        "ministry": "Ministry of Agriculture & Farmers Welfare / RBI-NABARD",
        "state_scope": "All India",
        "benefit_summary": "Short-term credit for crop production, post-harvest expenses, and farm asset maintenance at concessional interest (effective ~4% p.a. for prompt repayers up to ₹3 lakh, after interest subvention).",
        "eligibility_rules": {
            "farmers_owner_cultivators": True,
            "tenant_farmers_oral_lessees_sharecroppers": True,
            "shg_or_joint_liability_group_farmers": True,
        },
        "eligibility_summary": "Individual farmers, tenant farmers, oral lessees and sharecroppers, and members of SHGs/Joint Liability Groups engaged in crop production, animal husbandry or fisheries.",
        "documents_needed": ["Aadhaar", "Land records or tenancy proof", "Passport photo", "Bank account"],
        "official_link": "https://www.myscheme.gov.in/schemes/kcc",
        "source_type": "curated_static",
    },
]

STATE_SCHEMES = {
    "telangana": [
        {
            "id": "rythu-bharosa",
            "name": "Rythu Bharosa (formerly Rythu Bandhu)",
            "ministry": "Government of Telangana, Agriculture Department",
            "state_scope": "Telangana",
            "benefit_summary": "Direct investment support paid per acre per season to land-owning farmers for crop input costs. Amounts are set by state government order each season — confirm the current rate on the official portal before relying on a figure.",
            "eligibility_rules": {"land_owning_farmer_in_telangana": True},
            "eligibility_summary": "Land-owning farmer families with cultivable land records in Telangana.",
            "documents_needed": ["Aadhaar", "Land records (Pahani/1-B)", "Bank account"],
            "official_link": "https://ryuthubharosa.telangana.gov.in",
            "source_type": "curated_static",
        },
        {
            "id": "rythu-bima",
            "name": "Rythu Bima",
            "ministry": "Government of Telangana, Agriculture Department",
            "state_scope": "Telangana",
            "benefit_summary": "Life insurance cover for land-owning farmers (₹5 lakh to the nominee in case of death, any cause), premium paid by the state government.",
            "eligibility_rules": {"land_owning_farmer_in_telangana": True, "age_range": "18-59 years at enrolment"},
            "eligibility_summary": "Land-owning farmers in Telangana aged 18-59 at enrolment; automatically covered, no premium payable by the farmer.",
            "documents_needed": ["Aadhaar", "Land records", "Nominee details"],
            "official_link": "https://ryuthubima.telangana.gov.in",
            "source_type": "curated_static",
        },
    ],
}


def get_all_schemes(state: str = None):
    schemes = list(CENTRAL_SCHEMES)
    if state:
        schemes += STATE_SCHEMES.get(state.strip().lower(), [])
    else:
        for state_list in STATE_SCHEMES.values():
            schemes += state_list
    return schemes


def get_scheme_by_id(scheme_id: str):
    for s in get_all_schemes():
        if s["id"] == scheme_id:
            return s
    return None

