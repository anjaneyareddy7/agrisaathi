#!/usr/bin/env bash
set -euo pipefail

: "${DATA_GOV_API_KEY:?DATA_GOV_API_KEY is not set}"

source data_gov_resources.env

mkdir -p data_gov_test

success=0
failed=0

for i in $(seq -w 1 72); do
    resource_var="DATA_GOV_RESOURCE_${i}"
    resource_id="${!resource_var}"
    output="data_gov_test/resource_${i}.json"
    url="${DATA_GOV_BASE_URL}/${resource_id}?api-key=${DATA_GOV_API_KEY}&format=json&limit=1"

    if curl -fsS --retry 2 --connect-timeout 10 --max-time 30 "$url" -o "$output"; then
        if grep -q '"records"' "$output" || grep -q '"field"' "$output" || grep -q '"error"' "$output"; then
            printf 'RESOURCE_%s %s\n' "$i" "RESPONDED"
            success=$((success + 1))
        else
            printf 'RESOURCE_%s %s\n' "$i" "UNKNOWN_RESPONSE"
            failed=$((failed + 1))
        fi
    else
        printf 'RESOURCE_%s %s\n' "$i" "FAILED"
        failed=$((failed + 1))
    fi
done

printf 'TOTAL=%s\n' "$DATA_GOV_RESOURCE_COUNT"
printf 'RESPONDED=%s\n' "$success"
printf 'FAILED=%s\n' "$failed"
