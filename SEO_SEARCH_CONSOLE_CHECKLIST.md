# Shutterbug Search Console Checklist

## Initial Setup

- [ ] Verify the domain property for `shutterbugcamerashop.com`.
- [ ] Confirm `https://www.shutterbugcamerashop.com` is the working canonical host.
- [ ] Submit `https://www.shutterbugcamerashop.com/sitemap.xml`.
- [ ] Confirm `robots.txt` references the same `www` sitemap.
- [ ] Verify the site in Google Merchant Center and connect it to Search Console.
- [ ] Confirm the Merchant feed URL is `https://www.shutterbugcamerashop.com/google-merchant-feed.xml`.

## URL Inspection

For each representative page:

- [ ] Test the live URL.
- [ ] Confirm Google-selected canonical matches the declared `www` canonical.
- [ ] Confirm the page is allowed by robots and has no unintended `noindex`.
- [ ] View crawled HTML and confirm the H1, product/category copy, internal links, and JSON-LD are present.
- [ ] Request indexing only after the page has useful content and any inventory shown is accurate.

## First 20 URLs to Inspect

1. `https://www.shutterbugcamerashop.com/`
2. `https://www.shutterbugcamerashop.com/shop`
3. `https://www.shutterbugcamerashop.com/categories/vintage-cameras`
4. `https://www.shutterbugcamerashop.com/categories/vintage-digital-cameras`
5. `https://www.shutterbugcamerashop.com/categories/digital-cameras`
6. `https://www.shutterbugcamerashop.com/categories/compact-digital-cameras`
7. `https://www.shutterbugcamerashop.com/categories/point-and-shoot-cameras`
8. `https://www.shutterbugcamerashop.com/categories/ccd-digital-cameras`
9. `https://www.shutterbugcamerashop.com/categories/film-cameras`
10. `https://www.shutterbugcamerashop.com/categories/35mm-film-cameras`
11. `https://www.shutterbugcamerashop.com/categories/instant-cameras`
12. `https://www.shutterbugcamerashop.com/categories/lenses`
13. `https://www.shutterbugcamerashop.com/brands/canon`
14. `https://www.shutterbugcamerashop.com/brands/olympus`
15. `https://www.shutterbugcamerashop.com/brands/nikon`
16. `https://www.shutterbugcamerashop.com/brands/sony`
17. `https://www.shutterbugcamerashop.com/brands/polaroid`
18. `https://www.shutterbugcamerashop.com/guides/how-to-buy-a-used-camera`
19. `https://www.shutterbugcamerashop.com/used-cameras-michigan`
20. `https://www.shutterbugcamerashop.com/sell-your-camera`

Also inspect one active product URL with real photos and one useful sold product URL. The exact URLs should be selected from current inventory instead of documented as permanent examples.

## Rich Results and Merchant Listings

- [ ] Test an active product in Google's Rich Results Test.
- [ ] Confirm name, image, brand, SKU, condition, price, currency, availability, seller, shipping, and return policy match the visible page.
- [ ] Confirm no fake rating/review data appears.
- [ ] Confirm sold items return `OutOfStock` and cannot be added to cart.
- [ ] Review Merchant listings enhancements and resolve warnings using real data only.
- [ ] Confirm products without actual images are excluded from the Merchant feed.

## Indexing and Quality Reports

- [ ] Review Page Indexing weekly during the first month.
- [ ] Investigate duplicate/canonical conflicts instead of requesting every variation.
- [ ] Expect filtered `/shop?...` pages to be `noindex,follow`.
- [ ] Check that empty non-priority taxonomy pages remain out of the index.
- [ ] Review Crawl Stats for unexpected parameter crawling.
- [ ] Review Core Web Vitals on mobile and desktop.
- [ ] Check Google Images traffic for product and category imagery.

## Query Monitoring

Every four weeks, export Performance data by query and page. Record:

- Queries with impressions but average position 8-30.
- Queries with strong position but weak click-through rate.
- Category and brand pages gaining non-branded impressions.
- Exact model searches producing product impressions.
- New words buyers use that are absent from page copy or product fields.
- Image-search queries that expose useful photography or filename opportunities.

Use that evidence to choose the next guide, improve a title/description, or strengthen one established landing page. Do not create pages solely because a keyword tool lists a phrase.
