# Google Merchant Center Setup

This guide connects Shutterbug Camera Shop's live inventory to Google Merchant Center for free product listings. Repository changes make the data available, but Merchant Center account verification and review must be completed manually.

## Feed URL

Use this scheduled data source:

```text
https://www.shutterbugcamerashop.com/google-merchant-feed.xml
```

The feed includes active, in-stock products that have a real product image. Draft, archived, sold-out, and placeholder-only products are excluded.

## Merchant Center Account Setup

1. Create or open the Shutterbug Camera Shop Merchant Center account.
2. Set the business country to the United States and language to English.
3. Add, verify, and claim `https://www.shutterbugcamerashop.com`.
4. Connect the same domain's Google Search Console property when prompted.
5. Add a product data source using the feed URL above.
6. Enable free listings for the United States.
7. Configure free standard shipping for the United States so Merchant Center matches the current checkout behavior.
8. Configure the store return policy in Merchant Center to match the published 14-day return policy.
9. Review Business information, customer service contact details, and checkout links for accuracy.
10. Open Needs attention after the first fetch and resolve every account-level and item-level issue.

Do not add a named return-policy label to the feed unless the same label has first been created in Merchant Center.

## Product Readiness Checklist

Before setting a product to Active, confirm:

- Quantity is greater than zero and the price is final.
- Title names the exact brand and model without promotional language.
- Description matches the actual item, condition, included accessories, and disclosed flaws.
- Brand and model are filled in.
- GTIN/UPC/EAN and MPN are entered only when they are genuinely assigned to the product. Never invent identifiers.
- The main image is an actual product photo, not the Shutterbug placeholder.
- Images are clear, unobstructed, and do not contain promotional overlays or watermarks.
- Images are at least 500 by 500 pixels where possible.
- Product condition is accurate, especially for used and parts/repair inventory.
- Landing-page price, availability, condition, and shipping match the feed.

Many vintage or one-off used cameras legitimately have no known GTIN or MPN. Leave both fields blank in that case; the feed will report that identifiers do not exist. If either identifier is known, enter it in the admin product form and the feed will include it.

## Validation

After deployment and database migration:

1. Open the feed URL and confirm it returns XML.
2. Confirm the response header `X-Shutterbug-Feed-Items` is greater than zero after active products with real images exist.
3. Inspect one item and confirm title, link, image, price, condition, brand, availability, shipping, and identifiers match its product page.
4. Test a product page in Google's Rich Results Test.
5. Fetch the feed in Merchant Center.
6. Allow Google time to process it, then review Needs attention.
7. Recheck diagnostics whenever price, availability, returns, or shipping behavior changes.

## Deployment Requirement

Apply the included Prisma migration in the configured production environment:

```bash
npx prisma migrate deploy
```

Do not run production migrations against an unconfirmed database URL.

## Ongoing Inventory Rules

- Inventory and feed availability update from the database.
- Paid Stripe orders decrement inventory through the verified webhook flow.
- Products with zero quantity are not eligible for purchase.
- Archive stale listings instead of reusing their product IDs for a different item.
- Keep each one-off used item tied to its own SKU, images, condition notes, and price.
