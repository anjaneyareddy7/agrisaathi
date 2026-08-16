from app.data.govt_schemes import get_all_schemes, get_scheme_by_id

DISCLAIMER = (
    "This is an informational estimate based on publicly published scheme rules, "
    "not an official determination. Final eligibility and payment are decided by "
    "the scheme's implementing government department."
)

# Maps each rule key a scheme may declare -> the matching field name the
# farmer needs to have answered, and how to interpret it. Kept explicit and
# readable on purpose: this is a transparent checklist, not a black box.
RULE_CHECKS = {
    "land_owning_farmer": ("owns_land", True),
    "land_owning_farmer_in_telangana": ("owns_land", True),
    "excludes_institutional_land_holders": ("is_institutional_land_holder", False),
    "excludes_income_tax_payers": ("is_income_tax_payer", False),
    "excludes_constitutional_post_holders_and_serving_or_retired_govt_employees_above_certain_grade": ("is_govt_employee_above_grade", False),
    "must_have_insurable_interest_in_notified_crop": ("grows_notified_crop", True),
}


def list_schemes(state: str = None):
    return get_all_schemes(state)


def check_eligibility(scheme_id: str, answers) -> dict:
    scheme = get_scheme_by_id(scheme_id)
    if scheme is None:
        return None

    rules = scheme.get("eligibility_rules", {})
    matched = {}
    missing = []
    disqualified = False

    for rule_key, rule_value in rules.items():
        if rule_key not in RULE_CHECKS:
            continue  # informational-only rule (e.g. age_range text), not auto-checked
        field_name, required_value = RULE_CHECKS[rule_key]
        farmer_value = getattr(answers, field_name, None)

        if farmer_value is None:
            missing.append(field_name)
            continue

        matched[rule_key] = farmer_value
        if farmer_value != required_value:
            disqualified = True

    # Extra scheme-specific checks not covered by the generic rule map
    if scheme_id == "pmfby" and answers.state_participates_pmfby_this_season is False:
        disqualified = True
        matched["state_participates_pmfby_this_season"] = False
    elif scheme_id == "pmfby" and answers.state_participates_pmfby_this_season is None:
        missing.append("state_participates_pmfby_this_season")

    if disqualified:
        status = "likely_not_eligible"
        reason = "One or more answers don't match this scheme's published eligibility rules."
        next_steps = f"Review the exact rules on the official portal: {scheme['official_link']}"
    elif missing:
        status = "needs_more_info"
        reason = f"Missing {len(missing)} answer(s) needed to check this scheme's rules."
        next_steps = "Answer the remaining questions, or visit the official portal to check directly: " + scheme["official_link"]
    else:
        status = "likely_eligible"
        reason = "Your answers match this scheme's published eligibility rules."
        next_steps = f"Apply or verify final eligibility at the official portal: {scheme['official_link']}"

    return {
        "scheme_id": scheme_id,
        "status": status,
        "matched_rules": matched,
        "missing_info": missing,
        "reason": reason,
        "next_steps": next_steps,
        "disclaimer": DISCLAIMER,
    }

