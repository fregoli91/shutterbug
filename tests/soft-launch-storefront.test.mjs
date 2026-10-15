import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('the sitewide announcement uses one compact, dismissible soft-launch message', () => {
  const announcement = fs.readFileSync('src/components/SoftLaunchAnnouncement.tsx', 'utf8');
  const header = fs.readFileSync('src/components/Header.tsx', 'utf8');
  assert.match(announcement, /Soft launch/);
  assert.match(announcement, /tested &amp; photographed/);
  assert.match(announcement, /localStorage/);
  assert.match(announcement, /Dismiss soft-launch announcement/);
  assert.match(header, /<SoftLaunchAnnouncement \/>/);
});

test('empty shelves provide honest shop, learn, sell, and model-watch next steps', () => {
  const empty = fs.readFileSync('src/components/EmptyShelf.tsx', 'utf8');
  const category = fs.readFileSync('src/app/categories/[slug]/page.tsx', 'utf8');
  assert.match(empty, /Fresh finds are on the way/);
  assert.match(empty, /photographing and testing/);
  assert.match(empty, /Explore guides/);
  assert.match(empty, /Model watchlist/);
  assert.match(category, /Fresh cameras are being tested and photographed/);
  assert.match(category, /More printers are being inspected and prepared for the shelf/);
});

test('sample inventory is empty and the Merchant feed accepts prepared active items only', () => {
  const products = fs.readFileSync('src/lib/products.ts', 'utf8');
  const feed = fs.readFileSync('src/app/google-merchant-feed.xml/route.ts', 'utf8');
  const templateRows = fs.readFileSync('inventory-template.csv', 'utf8').trim().split(/\r?\n/);
  assert.match(products, /export const products: Product\[\] = \[\];/);
  assert.equal(templateRows.length, 1);
  assert.match(feed, /isActiveProduct\(product\)/);
  assert.match(feed, /isStorefrontReadyProduct\(product\)/);
  assert.match(feed, /isConfirmedProductPhotoUrl\(image\)/);
});

test('all private account pages inherit an explicit noindex policy', () => {
  const layout = fs.readFileSync('src/app/account/layout.tsx', 'utf8');
  assert.match(layout, /robots:\s*\{\s*index:\s*false,\s*follow:\s*false\s*\}/);
});

test('the admin editor explains every storefront publishing requirement', () => {
  const form = fs.readFileSync('src/components/admin/ProductForm.tsx', 'utf8');
  assert.match(form, /Publishing readiness/);
  assert.match(form, /Confirmed real product photos/);
  assert.match(form, /Testing notes/);
  assert.match(form, /Included-item details/);
  assert.match(form, /stay off the public storefront and Merchant feed until every check passes/);
});

test('sold item pages distinguish verified model reference from available inventory', () => {
  const page = fs.readFileSync('src/app/shop/[slug]/page.tsx', 'utf8');
  const card = fs.readFileSync('src/components/ProductCard.tsx', 'utf8');
  assert.match(page, /Verified item archive/);
  assert.match(page, /This one has sold/);
  assert.match(page, /Watch this model/);
  assert.match(page, /not available to purchase/);
  assert.match(card, /Sold — model library/);
});
