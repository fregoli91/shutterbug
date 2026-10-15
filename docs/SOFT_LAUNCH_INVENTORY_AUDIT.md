# Soft-launch and pre-inventory storefront audit

Audit date: 2026-10-14

## Positioning decision

The published sitewide treatment uses one message:

> **Soft launch** — Fresh inventory is added as each item is tested & photographed.

It is compact, dismissible, and stored locally after dismissal. “Soft launch” is not repeated on category, brand, shop, product, or account pages.

Two reviewed alternatives remain unpublished:

1. **Shutterbug is stocking the shelves** — New cameras, printers and gear are being prepared for the shop now.
2. **Fresh finds are arriving** — Every item is photographed, tested and described before it hits the shelf.

## Inventory-dependent surfaces audited

| Surface | Previous behavior | Soft-launch behavior |
| --- | --- | --- |
| Homepage Fresh Finds | Generic empty shelf | Explains that real items are being photographed, tested, and documented; links to categories, guides, selling, and the model watchlist |
| Shop results | Generic “nothing on the shelf” message | Honest stocking state when unfiltered; filter-specific recovery when a search has no matches |
| Category pages | “No [category] available” | Camera and printer-specific preparation copy, guides, model watchlist entry point, and sell/contact action |
| Brand pages | Generic no-inventory copy | Brand-specific preparation copy with guides, model watchlist, and sell/contact action |
| Sold product pages | Out-of-stock treatment | Verified item archive, explicit sold state, no Add to Bag, last-listed-price label, model watch, brand/category links, and available alternatives |
| Customer account | Many equal-weight utility cards | Orders, Saved Finds, Model Watchlist, Trade-ins, and Profile are the primary dashboard structure |
| Merchant feed | Real-image items could include sold products | Only active, positive-quantity, storefront-ready items with confirmed real images are eligible |

## Three catalog states

### Available now

Database items appear publicly as active offers only when they have positive quantity, a positive price, confirmed actual photos, a non-placeholder hero image, condition summary, description, tests, and included-item details. Product and Offer schema is reserved for these real listings and verified sold listings.

### Sold and model library

A sold exact-item URL remains public only when it has real photos, a model, useful descriptions, condition details, and recorded testing or flaw information. The page says the individual unit sold, removes purchasing controls, labels the price as the last listed price, links to its category and brand, supports exact-model watching, and suggests real available alternatives.

### Watchlist and wanted

The existing database model supports exact-model watches created from real sold or active product records. The account watchlist remains private and `noindex`. Automatic email or text alerts are explicitly described as inactive. Category and family alert persistence was not added because the current schema does not support it cleanly; public empty states link into the existing watchlist without claiming that a category has been followed.

## Fake inventory prevention

- Removed the legacy in-code sample catalog containing invented active prices and a fabricated sold example.
- Removed the populated sample row from `inventory-template.csv`; it is now a header-only import template.
- Incomplete active database items are withheld from public catalog reads until their exact-item listing is ready.
- Thin sold records are withheld unless they meet the existing useful-content and real-photo indexability rule.
- Merchant Center receives only prepared active inventory with confirmed real images.
- No reviews, viewers, purchases, scarcity messages, stock counts, sale history, or future products were fabricated.

## Model-family authority

Existing family pages cover Canon PowerShot and Digital ELPH, Olympus Stylus/mju, Sony Cyber-shot, Nikon Coolpix, Fujifilm FinePix, Kodak EasyShare, Panasonic Lumix, and Casio Exilim. A useful Pentax Optio family page was added. Digital ELPH remains part of the stronger Canon PowerShot hub instead of becoming a thin duplicate. Family pages explain power, storage, lens, flash, LCD, condition, testing, guides, trade-ins, and related routes even when inventory is empty.

## Internal linking and crawlability

- Homepage category cards retain strategic camera and printer destinations regardless of current stock.
- Category product grids remain before extended buying content.
- Empty categories keep crawlable links to guides, related families, the watchlist, and trade-ins.
- The Y2K guide links to priority families, including Casio Exilim and Pentax Optio.
- Priority family/category pages remain server rendered, canonical, sitemap eligible, and indexable at zero inventory.
- Private account and watchlist pages remain `noindex`.

## Owner decisions remaining

1. Decide whether automatic model-watch email alerts should be built and what consent/frequency rules they require.
2. Decide whether category/family watching is valuable enough to justify a new persisted watch type and notification workflow.
3. Confirm every live database product marked Active has the intended price, quantity, real photos, tests, condition details, and included items. The storefront now withholds incomplete records, but source facts still require owner review.
4. Decide whether “Soft launch” dismissal should persist indefinitely, as it does now, or expire after a chosen period.
5. Monitor Search Console and Merchant Center after deployment; do not infer ranking gains before data accumulates.

## Guardrails

Stripe, checkout, payments, orders, inventory reservation, trade-in backend, authentication, and security-sensitive flows were not rewritten.
