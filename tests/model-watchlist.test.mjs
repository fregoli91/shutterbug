import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { buildModelWatchTarget } from '../src/lib/model-watch-key.ts';

test('model watch keys normalize equivalent brand and model input', () => {
  const left = buildModelWatchTarget({ brand: ' Canon ', model: 'PowerShot   SD1000', categorySlug: 'Vintage-Digital-Cameras' });
  const right = buildModelWatchTarget({ brand: 'canon', model: 'powershot sd1000', categorySlug: 'vintage-digital-cameras' });
  assert.equal(left?.key, right?.key);
  assert.equal(left?.brand, 'Canon');
  assert.equal(left?.model, 'PowerShot SD1000');
  assert.equal(buildModelWatchTarget({ brand: '', model: 'SD1000' }), null);
});

test('model watch persistence prevents duplicate models per customer', () => {
  const migration = fs.readFileSync('prisma/migrations/20260919120000_customer_model_watchlist/migration.sql', 'utf8');
  assert.match(migration, /CREATE UNIQUE INDEX "CustomerModelWatch_customerId_key_key" ON "CustomerModelWatch"\("customerId", "key"\)/);
  assert.match(migration, /FOREIGN KEY \("customerId"\).*ON DELETE CASCADE/s);
});

test('watchlist reads and mutations are scoped to the signed-in customer', () => {
  const modelWatchlist = fs.readFileSync('src/lib/model-watchlist.ts', 'utf8');
  const actions = fs.readFileSync('src/app/account/watchlist/actions.ts', 'utf8');
  assert.match(modelWatchlist, /where: \{ customerId \}/);
  assert.match(actions, /deleteMany\(\{ where: \{ id: watchId, customerId: customer\.id \} \}\)/);
  assert.match(actions, /customerId_key: \{ customerId: customer\.id, key: target\.key \}/);
});

test('watchlist toggles only public products and uses the database slug', () => {
  const actions = fs.readFileSync('src/app/account/watchlist/actions.ts', 'utf8');
  const productPage = fs.readFileSync('src/app/shop/[slug]/page.tsx', 'utf8');
  assert.match(actions, /ProductStatus\.ACTIVE, ProductStatus\.SOLD_OUT/);
  assert.match(actions, /select: \{ slug: true,/);
  assert.match(actions, /revalidateWatchlistSurfaces\(product\.slug, redirectTo\)/);
  assert.doesNotMatch(actions, /formData\.get\('productSlug'\)/);
  assert.doesNotMatch(productPage, /name="productSlug"/);
});

test('duplicate concurrent saves are idempotent and guest return paths are preserved', () => {
  const actions = fs.readFileSync('src/app/account/watchlist/actions.ts', 'utf8');
  assert.match(actions, /error\.code === 'P2002'/);
  assert.match(actions, /login\?returnTo=\$\{encodeURIComponent\(redirectTo\)\}/);
  assert.match(actions, /login\?returnTo=%2Faccount%2Fwatchlist/);
});

test('sold pages expose the watch CTA and explain alert availability', () => {
  const productPage = fs.readFileSync('src/app/shop/[slug]/page.tsx', 'utf8');
  const watchlistPage = fs.readFileSync('src/app/account/watchlist/page.tsx', 'utf8');
  assert.match(productPage, /Watch this model/);
  assert.match(productPage, /Automatic alerts are not active yet/);
  assert.match(watchlistPage, /No watched models yet/);
  assert.match(watchlistPage, /availability=sold_out/);
});
