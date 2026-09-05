import test from 'node:test';
import assert from 'node:assert/strict';
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

test('the campaign order and final trade-in bonus remain unchanged', () => {
  assert.deepEqual(homePromotions.map((item) => item.id), [
    'canon-powershot', 'olympus-stylus', 'nikon-cameras', 'sell-your-camera', 'summer-trade-in-bonus'
  ]);
});