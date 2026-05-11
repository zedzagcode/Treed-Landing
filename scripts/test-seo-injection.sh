#!/usr/bin/env bash

BASE="http://localhost:5000"
PASS=0
FAIL=0

check() {
  local label="$1"
  local url="$2"
  local pattern="$3"
  if curl -s "$url" | grep -qF "$pattern"; then
    echo "  PASS: $label"
    PASS=$((PASS + 1))
  else
    echo "  FAIL: $label — expected to find: $pattern"
    FAIL=$((FAIL + 1))
  fi
}

echo ""
echo "SEO injection checks against $BASE"
echo "============================================"

echo ""
echo "/ (home)"
check "title"     "$BASE/"        'AI Audio Guides for Museums | Conversational, Screen-Free Tours'
check "canonical" "$BASE/"        'href="https://treed.co/"'
check "og:url"    "$BASE/"        'content="https://treed.co/"'
check "og:image"  "$BASE/"        'content="https://treed.co/opengraph.jpg"'
check "robots"    "$BASE/"        'content="index,follow"'
check "JSON-LD"   "$BASE/"        'application/ld+json'

echo ""
echo "/handset"
check "title"     "$BASE/handset" "Screen-Free AI Audio Guide for Museums"
check "canonical" "$BASE/handset" 'href="https://treed.co/handset"'
check "og:url"    "$BASE/handset" 'content="https://treed.co/handset"'
check "og:image"  "$BASE/handset" 'content="https://treed.co/opengraph.jpg"'
check "Product"   "$BASE/handset" '"@type": "Product"'
check "Breadcrumb" "$BASE/handset" '"@type": "BreadcrumbList"'

echo ""
echo "/faq"
check "title"     "$BASE/faq"     "Museum Audio Guides, Deployment, Pricing"
check "canonical" "$BASE/faq"     'href="https://treed.co/faq"'
check "FAQPage"   "$BASE/faq"     '"@type": "FAQPage"'

echo ""
echo "/about"
check "title"     "$BASE/about"   'Reimagining Museum Experiences with Conversational AI'
check "canonical" "$BASE/about"   'href="https://treed.co/about"'
check "AboutPage" "$BASE/about"   '"@type": "AboutPage"'

echo ""
echo "/unknown-route (404 fallback)"
check "noindex"   "$BASE/some-missing-page" 'content="noindex,follow"'

echo ""
echo "============================================"
echo "Results: $PASS passed, $FAIL failed"
echo ""

[ "$FAIL" -eq 0 ] && exit 0 || exit 1
