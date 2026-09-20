import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { availableRelatedProducts } from '../src/lib/catalog-seo.ts';

const unit = (overrides = {}) => ({
  id: 'unit', status: 'active', quantity: 1, brand: 'Canon', model: 'PowerShot',
  categorySlug: 'vintage-digital-cameras', categorySlugs: ['vintage-digital-cameras'],
  cameraType: 'Vintage Digital', actualPhotos: true, heroImage: '/real-camera.jpg',
  shortDescription: 'A tested camera.', conditionSummary: 'Light wear.',
  tested: ['Power checked'], functionalNotes: [], flaws: [], ...overrides
});

test('related inventory excludes sold, empty, archived, and deleted records', () => {
  const current = unit({ id: 'current', status: 'sold_out', quantity: 0 });
  const available = unit({ id: 'available' });
  const candidates = [
    current,
    unit({ id: 'sold', status: 'sold_out', quantity: 0 }),
    unit({ id: 'empty', quantity: 0 }),
    unit({ id: 'archived', status: 'archived' }),
    available
  ];
  assert.deepEqual(availableRelatedProducts(current, candidates).map((product) => product.id), ['available']);
});

test('catalog queries expose active and sold products while archived or deleted records resolve as unavailable', () => {
  const products = fs.readFileSync('src/lib/products.ts', 'utf8');
  assert.match(products, /where: \{ status: \{ in: \[DbProductStatus\.ACTIVE, DbProductStatus\.SOLD_OUT\] \} \}/);
  assert.match(products, /dbProduct\.status === DbProductStatus\.ACTIVE \|\| dbProduct\.status === DbProductStatus\.SOLD_OUT/);
  assert.match(products, /return undefined;/);
  assert.match(products, /return product\.status === 'active' && \(product\.quantity \?\? 1\) > 0/);
});

test('sold structured data is OutOfStock and purchase controls render only for purchasable inventory', () => {
  const seo = fs.readFileSync('src/lib/seo-utils.ts', 'utf8');
  const productPage = fs.readFileSync('src/app/shop/[slug]/page.tsx', 'utf8');
  assert.match(seo, /if \(product\.status === 'active' && \(product\.quantity \?\? 1\) > 0\) return 'https:\/\/schema\.org\/InStock'/);
  assert.match(seo, /return 'https:\/\/schema\.org\/OutOfStock'/);
  assert.match(productPage, /\{purchasable \? \(\s*<AddToCartButton/s);
  assert.match(productPage, /This one has sold\./);
  assert.match(productPage, /Ask about availability/);
  assert.match(productPage, /Watch this model/);
});
