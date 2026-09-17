# SEO phase 2: architecture and accuracy audit

Audit: 2026-09-13. Repository evidence plus a public homepage fetch. No production database, Search Console, Merchant Center account, field performance data, or authenticated customer data was available. The public fetch showed an empty fresh-inventory section; that is not proof of zero business inventory. A direct printer-page fetch failed in the research tool, so no live rendering claim is made for that page. The pasted brief ends mid-line in section 66; work follows all visible requirements.

## Implemented in this change

- Product metadata and sitemap share an explicit sold-unit quality gate. Active available units remain eligible; sold/zero-quantity units require actual non-placeholder photos, model, description, unit condition and recorded functional/testing/flaw information. Thin sold pages remain accessible with noindex,follow and leave the sitemap. This is a minimum screen, not a substitute for editorial review.
- Product pages clearly show sold/out-of-stock, last listed price and unit-specific context. Purchase buttons remain disabled through existing isPurchasable checks. Related inventory is available stock, excludes the current unit, and keeps printers separate from same-brand cameras.
- Saved ProductImage.alt values now reach the hero and gallery. Missing descriptions use neutral photo numbering, never an invented front/back/label view. Exact model and SKU appear visibly. Missing functional status no longer defaults to a claim of testing.
- Product category, brand and explicitly assigned secondary/family categories become crawlable related links. A reusable server-rendered RelatedLinks component avoids adding client JS. Visible product breadcrumbs accompany existing BreadcrumbList markup.
- Existing HP/Brother/Lexmark pages use printer titles/headings and appropriate empty states. Printer visitors are not invited to sell the printer through the camera workflow. Canon remains one hub with a distinct printer section and links to actual printer listings when present. The printer category now connects all four priority brands.
- Feed includes public sold records as out_of_stock rather than silently removing every sold unit; only real confirmed photos qualify. HTTP no-store removes the old hour cache plus day-long stale window. Feed price, condition and stock use the catalog snapshot. Google still updates on its own fetch/processing schedule; this is not instantaneous Merchant synchronization.
- Missing MPN/GTIN no longer produces identifier_exists=no. Lack of stored data is not evidence identifiers were never assigned. Existing verified identifier fields are preserved.
- Removed hardcoded free-shipping/feed policy, 1–3 day handling, 2–7 day transit and 14-day paid-mail-return markup because the visible policy pages do not establish those global terms. Merchant Center shipping settings must supply actual rates until policies are confirmed; omission may reduce eligibility if account-level data is also absent. No customer policy or checkout price was changed.
- Organization entity uses OnlineStore and actual support contacts, without implying a physical storefront, hours or address. Existing logo and Amazon relationship remain.
- Sitemap is dynamic and uses stored product updatedAt rather than claiming every page changed on every request. Static/taxonomy timestamps are omitted when a truthful update date is unavailable. Secondary category matching agrees with category page logic.
- Explicit printer classifications are excluded from broad vintage-camera aggregation. Unknown non-camera product categories do not default to a camera Google taxonomy classification.

## Architecture and editorial scope

The requested SEO_QUERY_MAP.md, SEO_CONTENT_ROADMAP.md and SEO_SEARCH_CONSOLE_PLAYBOOK.md are the maintained operating documents. They separate shopping, research, brand, exact model, seller and local intent. No new subtype, family or article was mass-generated. Section 56 specifically calls for review before implementing the first printer cluster; the roadmap is the review packet.

Camera categories, camera-family categories and three guides already exist. Improve these before adding aliases. PowerShot/Digital ELPH/IXUS belong to the current PowerShot destination pending verified regional relationships. Existing Olympus digital content can link Stylus/Tough/FE families without creating thin family pages. Printers stay at /categories/printers; /printers is not introduced. Existing brand hubs remain the parent for future family sections.

Model-data prerequisites: store exact manufacturer/model and use only verified identifiers; do not populate megapixels, sensor, battery, toner, duplex or driver claims from the brief's examples. Existing condition/testing/included/flaw fields support accurate unit descriptions now. A future sourced registry should store model/region, evidence URL/manual page, verification date and reviewer separately from unit facts.

## Coverage of remaining audit areas

| Area | Evidence / decision | Next validation |
|---|---|---|
| Homepage / crawl depth | Public homepage links Cameras, Vintage Digital, Film, Brands, Sell and Printers; lower printer feature names Canon/Brother/HP/Lexmark. Carousel placement is unchanged. | Sample rendered internal links after deployment; measure product depth with production catalog. |
| Category copy / cannibalization | Existing profiles place useful supporting copy below inventory; distinct category intents are mapped. Camera family routes already exist, including EasyShare and Exilim. | Review real GSC query/page overlap before consolidation; avoid arbitrary filter indexing. |
| Facets | Shop already uses noindex,follow on recognized search/filter/sort combinations with /shop canonical. Robots does not block those query URLs; admin/account/cart/checkout/API paths are blocked. | Inspect Google-rendered filtered URLs and crawl volume. Canonical is a signal, not a guarantee. |
| Sitemap | Priority/populated taxonomy, actual public products, guides/blog, trust and seller pages included; search/filter/private URLs excluded. | Verify deployed sitemap and selected canonical/indexing reports. Prioritized empty pages require periodic value review. |
| Image search | Product photos appear through next/image and metadata; saved alt is now preserved. Gallery supports multiple actual photos. | Operator supplies descriptive views, model label, ports, included items, flaws and test prints; verify CDN image fetch. Do not rename established assets blindly. |
| Article images / authors | Guides have Article image and organization author; Journal exposes representative image and author/date fields. | Replace generic illustrations with original relevant evidence when available; honest review dates and authorship. |
| Favicon / site name | Layout references square PNG icons including 192 and 512; robots allows public assets. WebSite name and existing brand logo are configured. | Fetch deployed icon as Googlebot/Image; inspect actual search display. Google controls final favicon/title/snippet selection. |
| Policy data | Written policies lack exact global rate/time/window terms used by old JSON-LD. Unsupported fields removed. | Owner confirms actual rates, regions, handling/transit estimates, returns window/fees and exceptions; align site, checkout and Merchant settings before adding ShippingService/MerchantReturnPolicy details. |
| Local / Amazon / seller | Existing Michigan, /amazon and camera trade-in pages retained. No evidence of public storefront hours or printer buyback. | Verify operator facts before local-business markup or printer seller pages. No city doorways or fabricated valuations. |
| External authority / AI / social | Roadmap includes sourced compatibility references and timelines when expertise exists; existing durable category/brand links remain. | Campaigns should link to the correct live intent destination. No purchased backlinks, AI-only pages or fabricated firsthand reports. |
| Core Web Vitals | Source uses responsive images, fixed dimensions/aspect ratios and mostly lazy lower images. First carousel image is eager/high priority; no placement change. | Measure field p75 LCP/CLS/INP in GSC/CrUX; run mobile lab traces. No performance scores are claimed here. |

## Image/performance evidence

Large source PNGs include shelf display 3,158,427 bytes, customer-service desk 2,897,194 bytes, storefront 2,840,790 bytes, returns page 2,754,059 bytes and trust banner 2,743,112 bytes. These are source sizes, not measured transferred sizes: next/image may deliver smaller responsive WebP. Preserve artwork quality; compare actual delivered dimensions/bytes and LCP traces before recompression. Carousel has fixed aspect ratios and first-slide eager loading; hidden slides still deserve network review. Added SEO links are server components. No new client JavaScript was added.

## Release and operational checks

Run lint, TypeScript, regression suite and production build. Validate a deployed active camera/printer and sold unit with Rich Results Test, then URL Inspection. Verify feed price/stock/photos/identifiers and Merchant account shipping/returns before enabling the updated feed. Test a real stock transition across page/schema/feed/sitemap; local synthetic tests cannot prove remote account synchronization. A database read failure currently falls back to an empty public catalog; future feed reliability work should distinguish backend failure from a genuinely empty feed with a 503/retry strategy. No production deployment or account changes performed.

## Current primary references

- [Google merchant listing markup](https://developers.google.com/search/docs/appearance/structured-data/merchant-listing)
- [Identifier exists: missing vs unassigned identifiers](https://support.google.com/merchants/answer/6324478)
- [Merchant return policy](https://developers.google.com/search/docs/appearance/structured-data/return-policy)
- [Shipping policy](https://developers.google.com/search/docs/appearance/structured-data/shipping-policy)
- [Organization and OnlineStore](https://developers.google.com/search/docs/appearance/structured-data/organization)
- [Faceted navigation](https://developers.google.com/crawling/docs/faceted-navigation)
- [Image search guidance](https://developers.google.com/search/docs/appearance/google-images)
- [Favicon requirements](https://developers.google.com/search/docs/appearance/favicon-in-search)
- [Core Web Vitals](https://developers.google.com/search/docs/appearance/core-web-vitals)

## Validation results

2026-09-13: npm run lint passed; npx tsc --noEmit passed; npm test passed all 21 tests (including four new catalog SEO regressions); npm run build passed; git diff --check passed. Production-build localhost smoke checks returned 200 for homepage, HP/Lexmark/Brother/Canon, printer category, filtered shop, sitemap, feed and 192px favicon. Sampled HTML contained one H1; printer brand titles, filtered noindex, parsable XML and feed no-store were checked. Local feed was empty because no database inventory was configured. Real active/sold product HTML and visual/mobile QA still need representative inventory; pure tests cover related-item and sold-indexing decisions. No Google Rich Results Test or remote account verification was claimed.
