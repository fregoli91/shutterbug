# Shutterbug Camera Shop Starter

A camera-first Next.js starter for shutterbugcamerashop.com.

## Goal

Launch a professional camera brand quickly with:

- Camera-first homepage
- Product catalog
- Product detail pages with testing notes
- Category pages
- Sell Your Camera page
- Trust pages: testing process, returns, about, contact
- Sitemap and robots routes
- Product structured data on product pages

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Replace sample inventory

Edit:

```txt
src/lib/products.ts
```

For each real product, add:

- Real SKU
- Brand and model
- Real price
- Exact included accessories
- Testing checklist
- Condition notes
- Product image paths
- Checkout URL

Use `inventory-template.csv` as your intake worksheet before copying items into `products.ts`.

## Add real photos

Put product photos inside:

```txt
public/products/your-sku/image-1.jpg
```

Then update the product image paths in `src/lib/products.ts`:

```ts
heroImage: '/products/your-sku/image-1.jpg'
gallery: ['/products/your-sku/image-1.jpg', '/products/your-sku/image-2.jpg']
```

## Fast checkout options for launch

For the first live version, use hosted checkout links instead of building custom checkout:

- Shopify product checkout links / Buy Button
- Stripe Payment Links
- PayPal invoice or PayPal hosted checkout
- Amazon/Mercari links as a temporary fallback, if needed

Put the checkout URL in each product's `checkoutUrl` field.

## Launch checklist

1. Replace placeholder logo if desired.
2. Replace support email in `src/lib/seo.ts`.
3. Add 10-30 real camera listings.
4. Add real photos for every live product.
5. Replace sample policy language on `/returns`.
6. Replace About page copy with the real Shutterbug story.
7. Connect checkout links.
8. Deploy to Vercel or Render.
9. Point shutterbugcamerashop.com to the deployment.
10. Submit sitemap to Google Search Console.

## Recommended first categories

- Vintage Digital Cameras
- Film Cameras
- Camera Accessories
- Parts & Repair

Keep video games and collectibles secondary until the camera brand is established.
