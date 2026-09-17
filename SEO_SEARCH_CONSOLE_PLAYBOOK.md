# Monthly Search Console operating process

Maintained 2026-09-13. Owner: SEO/editorial lead; technical owner: storefront maintainer. This complements SEO_SEARCH_CONSOLE_CHECKLIST.md. No live Search Console or Merchant Center account data was accessed in this pass.

## Baseline and collection

On the first business week each month, export the most recent complete 28 days and previous 28 days, plus year-over-year where available. Note the property, date range, country, device, search type, data lag and export limits. Exclude incomplete recent days. Store exports privately in the approved analytics location; this document is a process, not a recurring automation.

Use query and page views for Web separately from Image. Review branded/nonbranded, camera/printer/accessory, mobile/desktop and US segments. Record clicks, impressions, CTR and average position, but do not treat average position as a precise rank or mix differently filtered exports. Anonymized queries and row limits mean query totals may not match page totals. Save deployment and stock-change dates alongside the baseline.

## Opportunity queue

| Signal | Investigation | Action |
|---|---|---|
| Impressions, average positions 5–20 | Match intent and primary destination in SEO_QUERY_MAP.md; inspect competitor result type without copying | Improve missing buyer information, model facts and relevant internal links; prioritize stock relevance. |
| Good position, low CTR | Compare same device/country/intent; check displayed result and whether listing sold | Improve accurate title/description, exact model and current availability. Never promise a CTR lift. |
| Rapid impression growth | Check which query/page and whether seasonality or new inventory explains it | Strengthen the existing destination and links; consider roadmap promotion only with evidence. |
| Unexpected model-number demand | Confirm exact brand/model and existing unit URLs | Improve the strongest real listing; retain useful sold examples; consider a sourced guide only for distinct research intent. |
| Printer or camera-brand traction | Compare category, brand and product contributions | Promote the relevant cluster, verify inventory and publish the next approved asset. |
| Image opportunities | Use Image search separately; inspect indexed image, alt, page context and real photos | Improve descriptive saved alt, original views, responsive delivery and image accessibility. |
| Visibility loss | Check indexing, canonical selection, robots, server errors, stock, seasonality, releases and search-type changes | Fix technical regressions first; improve or consolidate only after diagnosing the cause. |
| Multiple pages for the same query | Compare intent and click trends at query+page level | Keep unique unit pages; revise overlapping editorial/category intent and anchors. Redirect only genuine replacements. |

Use a configurable minimum-impression threshold suitable to actual site scale to reduce noise. Do not drop a valuable exact-model query just because volume is small. Compare changes over more than one period before causal claims.

## Technical and merchant review

1. Inspect indexing and sitemap reports. Sample homepage, digital, printer, one brand, guide, active product, useful sold product and thin sold product with URL Inspection. Confirm declared/selected canonicals and rendered crawlable links. Sold valuable pages should stay useful; thin sold pages should be noindex and absent from sitemap.
2. Confirm filtered /shop URLs remain crawlable for noindex processing; keep them out of sitemap and avoid generating link combinations. Do not add robots disallows for filters while depending on their noindex.
3. Review merchant listings and product snippets enhancements, Merchant Center product diagnostics, feed fetch timestamps and image issues. Compare one active and one sold unit across database, page, JSON-LD and fetched feed. Missing identifiers mean research needed, not identifier_exists=no.
4. Validate actual shipping rates/regions and return policy in Merchant Center. Code no longer supplies unsupported fixed policy details. Keep policy/account/product exceptions aligned before adding detailed markup.
5. Track field Core Web Vitals by device and template; use lab mobile tests to diagnose. Record p75 LCP, CLS and INP where field data exists. Targets: LCP <=2.5s, CLS <=0.1, INP <=200ms; do not report these as measured results. Trace LCP image, carousel, image dimensions, hydration and interaction costs.
6. Check manual actions, security issues and crawl errors. Run Rich Results Test after template changes and inspect a deployed URL; local tests do not prove Google eligibility.

## Decision log and follow-through

Record month, segment, query family, primary URL, baseline metrics, stock context, hypothesis, change, owner, release date and review date. Choose a small number of highest-value actions. Update query map and roadmap before adding pages. After release, allow recrawl time and compare equivalent periods; log observations and confounders without promising rankings. Escalate missing operator facts instead of publishing guesses.

Official references: [Performance report](https://support.google.com/webmasters/answer/7576553), [URL Inspection](https://support.google.com/webmasters/answer/9012289), [Core Web Vitals](https://developers.google.com/search/docs/appearance/core-web-vitals), [Merchant specification](https://support.google.com/merchants/answer/7052112), [Faceted navigation](https://developers.google.com/crawling/docs/faceted-navigation).
