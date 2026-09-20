import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { compareNewest } from '../src/lib/storefront-sort.ts';
import { shopHref } from '../src/lib/shop-query.ts';
import { homePromotions } from '../src/lib/home-promotions.ts';

test('newest ordering uses creation time before the promotional new-arrival flag', () => {
  const older = { price: 20, createdAt: '2025-01-01', newArrival: true };
  const newer = { price: 30, createdAt: '2026-01-01', newArrival: false };
  assert.deepEqual([older, newer].sort(compareNewest), [newer, older]);
});

test('missing or invalid dates sort predictably', () => {
  assert.equal(Number.isFinite(compareNewest({ price: 1, createdAt: 'invalid' }, { price: 2 })), true);
});

test('removing a query or price chip actually clears that filter and preserves the others', () => {
  const params = { q: 'canon', maxPrice: '300', brand: ['Canon', 'Nikon'], sort: 'newest' };
  const url = new URL(shopHref(params, { remove: { name: 'q' } }), 'https://example.test');
  assert.equal(url.searchParams.has('q'), false);
  assert.deepEqual(url.searchParams.getAll('brand'), ['Canon', 'Nikon']);
  assert.equal(url.searchParams.get('maxPrice'), '300');
  assert.equal(new URL(shopHref(params, { remove: { name: 'maxPrice' } }), 'https://example.test').searchParams.has('maxPrice'), false);
});

test('removing one multi-select filter preserves its siblings', () => {
  const url = new URL(shopHref({ brand: ['Canon', 'Nikon'] }, { remove: { name: 'brand', value: 'Canon' } }), 'https://example.test');
  assert.deepEqual(url.searchParams.getAll('brand'), ['Nikon']);
});

test('the approved carousel order remains stable without the retired summer bonus', () => {
  assert.deepEqual(homePromotions.map((item) => item.id), [
    'canon-powershot', 'olympus-stylus', 'nikon-cameras', 'sell-your-camera'
  ]);
  assert.equal(homePromotions.some((item) => /30%|20%|free shipping|since 2008|authentic|warranty/i.test(`${item.title} ${item.description}`)), false);
  assert.equal(homePromotions.some((item) => item.desktopImage.startsWith('/carousel-')), false);
  assert.equal(homePromotions.every((item) => item.embeddedCopy === false), true);

  const homepage = fs.readFileSync('src/app/page.tsx', 'utf8');
  assert.doesNotMatch(homepage, /shutterbug-summer-sale-banner\.png/);
  assert.doesNotMatch(homepage, /20% off|authentic|warranty/i);
});

test('the shared shell owns the single main landmark and offers skip navigation', () => {
  const layout = fs.readFileSync('src/app/layout.tsx', 'utf8');
  assert.match(layout, /href="#main-content"/);
  assert.match(layout, /<main id="main-content"/);
  for (const path of ['src/app/bag/page.tsx', 'src/app/guides/page.tsx', 'src/app/amazon/page.tsx', 'src/app/sell-your-camera/page.tsx']) {
    assert.doesNotMatch(fs.readFileSync(path, 'utf8'), /<main[ >]/);
  }
});

test('global search language includes cameras and printers', () => {
  for (const path of ['src/components/Header.tsx', 'src/components/MobileHeader.tsx', 'src/app/shop/page.tsx']) {
    assert.match(fs.readFileSync(path, 'utf8'), /Search cameras, printers, brands & models/);
  }
});
