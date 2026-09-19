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

test('watchlist mutations are customer scoped and sold pages explain alert status', () => {
  const actions = fs.readFileSync('src/app/account/watchlist/actions.ts', 'utf8');
  const productPage = fs.readFileSync('src/app/shop/[slug]/page.tsx', 'utf8');
  assert.match(actions, /customerId: customer\.id/);
  assert.match(actions, /deleteMany\(\{ where: \{ id: watchId, customerId: customer\.id \} \}\)/);
  assert.match(productPage, /Watch this model/);
  assert.match(productPage, /Automatic alerts are not active yet/);
});