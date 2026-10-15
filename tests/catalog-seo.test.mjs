import test from 'node:test';
import assert from 'node:assert/strict';
import { availableRelatedProducts, hasRealProductImage, isConfirmedProductPhotoUrl, isIndexableProduct, isPrinter, isStorefrontReadyProduct } from '../src/lib/catalog-seo.ts';

const unit = (overrides = {}) => ({
  id: 'camera', brand: 'Canon', model: 'PowerShot SD1000', categorySlug: 'vintage-digital-cameras',
  categorySlugs: ['vintage-digital-cameras'], status: 'active', quantity: 1,
  actualPhotos: true, heroImage: 'https://res.cloudinary.com/example/image/upload/unit.jpg',
  shortDescription: 'Silver unit with a marked body.', conditionSummary: 'Wear on the corner.',
  price: 199, included: ['Battery'], tested: ['Power and capture checked'], functionalNotes: [], flaws: [], ...overrides
});

test('sold and zero-quantity units require useful original unit content to remain indexable', () => {
  assert.equal(isIndexableProduct(unit({ status: 'sold_out' })), true);
  assert.equal(isIndexableProduct(unit({ quantity: 0, actualPhotos: false })), false);
  assert.equal(isIndexableProduct(unit({ status: 'sold_out', conditionSummary: '' })), false);
  assert.equal(isIndexableProduct(unit({ status: 'draft' })), false);
  assert.equal(isIndexableProduct(unit({ status: 'archived' })), false);
});

test('placeholder and unconfirmed photos never qualify as real merchant photographs', () => {
  assert.equal(hasRealProductImage(unit()), true);
  assert.equal(hasRealProductImage(unit({ heroImage: '/shutterbug-product-placeholder.png' })), false);
  assert.equal(hasRealProductImage(unit({ heroImage: '/shutterbug-category-digital.png' })), false);
  assert.equal(hasRealProductImage(unit({ actualPhotos: false })), false);
  assert.equal(isConfirmedProductPhotoUrl('https://example.com/item.jpg'), false);
  assert.equal(isConfirmedProductPhotoUrl('https://res.cloudinary.com/demo/image/upload/v1/shutterbug-products/item.jpg'), true);
});

test('active storefront inventory requires a real offer and prepared exact-item listing', () => {
  assert.equal(isStorefrontReadyProduct(unit()), true);
  assert.equal(isStorefrontReadyProduct(unit({ heroImage: '/shutterbug-product-placeholder.png' })), false);
  assert.equal(isStorefrontReadyProduct(unit({ actualPhotos: false })), false);
  assert.equal(isStorefrontReadyProduct(unit({ price: 0 })), false);
  assert.equal(isStorefrontReadyProduct(unit({ tested: [] })), false);
  assert.equal(isStorefrontReadyProduct(unit({ included: [] })), false);
  assert.equal(isStorefrontReadyProduct(unit({ status: 'sold_out' })), false);
  assert.equal(isIndexableProduct(unit({ tested: [] })), false);
});

test('sold Canon printer suggests available printers, not same-brand cameras or sold stock', () => {
  const printer = unit({ id: 'printer', categorySlug: 'printers', categorySlugs: ['printers'], status: 'sold_out' });
  const available = unit({ id: 'available', brand: 'HP', categorySlug: 'printers', categorySlugs: ['printers'] });
  const sold = { ...available, id: 'sold', status: 'sold_out' };
  const empty = { ...available, id: 'empty', quantity: 0 };
  assert.deepEqual(availableRelatedProducts(printer, [unit(), sold, empty, available, printer]).map(p => p.id), ['available']);
});

test('printer classification uses explicit category or product type, never model-name guesses', () => {
  assert.equal(isPrinter(unit({ productType: 'Laser Printers' })), true);
  assert.equal(isPrinter(unit({ model: 'Photo Printer' })), false);
});
