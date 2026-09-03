#!/usr/bin/env bash
# Post-deploy smoke check for https://persano.github.io (OPS-03, Phase 1 Plan 01-02).
# Targets the LIVE site. Right after a deploy, GitHub Pages CDN propagation
# needs a short retry window (~60s) — wait before declaring failure.
# Re-run before Play submission to re-verify the Play-critical privacy URL.
set -u

BASE="https://persano.github.io"
FAIL=0

expect_status() {
  local url="$1" want="$2" got
  got="$(curl -s -o /dev/null -w '%{http_code}' "$url")"
  printf '%s -> %s\n' "$url" "$got"
  if [ "$got" != "$want" ]; then
    printf 'FAIL: expected HTTP %s\n' "$want"
    FAIL=1
  fi
}

# 200 checks: hub, new contact form URL, Play-critical privacy URL,
# pre-existing root files (OPS-03 regression)
for u in \
  "$BASE/" \
  "$BASE/geohist/contact.html" \
  "$BASE/geohist/privacy.html" \
  "$BASE/app-ads.txt" \
  "$BASE/google7da873f4e9609872.html" ; do
  expect_status "$u" 200
done

# Custom 404: unknown path must return 404 AND serve 404.html's body
# (hub link present), not GitHub's default error page (CONT-05)
URL="$BASE/does-not-exist"
CODE="$(curl -s -o /dev/null -w '%{http_code}' "$URL")"
printf '%s -> %s\n' "$URL" "$CODE"
if [ "$CODE" != "404" ]; then
  printf 'FAIL: expected HTTP 404\n'
  FAIL=1
fi
if ! curl -s "$URL" | grep -qi "back to the hub"; then
  printf 'FAIL: 404 body missing hub-link text\n'
  FAIL=1
fi

# Hidden-file warning-sign check (research Pitfall 2): .nojekyll must be served
expect_status "$BASE/.nojekyll" 200

if [ "$FAIL" -ne 0 ]; then
  printf 'SMOKE CHECK: FAILED\n'
  exit 1
fi
printf 'SMOKE CHECK: ALL PASS\n'
