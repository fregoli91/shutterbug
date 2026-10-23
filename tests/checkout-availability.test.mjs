import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { isCheckoutAvailable } from '../src/lib/checkout-availability.ts';

const configured = {
  CHECKOUT_ENABLED: 'true',
  STRIPE_SECRET_KEY: 'configured-secret-key',
  STRIPE_WEBHOOK_SECRET: 'configured-webhook-secret'
};

test('checkout fails closed unless the owner flag and both Stripe server secrets exist', () => {
  assert.equal(isCheckoutAvailable(configured), true);
  assert.equal(isCheckoutAvailable({ ...configured, CHECKOUT_ENABLED: 'false' }), false);
  assert.equal(isCheckoutAvailable({ ...configured, CHECKOUT_ENABLED: undefined }), false);
  assert.equal(isCheckoutAvailable({ ...configured, STRIPE_SECRET_KEY: '' }), false);
  assert.equal(isCheckoutAvailable({ ...configured, STRIPE_WEBHOOK_SECRET: '' }), false);
});

test('checkout page and mutation use the same server-side gate', () => {
  const page = fs.readFileSync('src/app/checkout/page.tsx', 'utf8');
  const action = fs.readFileSync('src/app/checkout/actions.ts', 'utf8');
  const guardPosition = action.indexOf('if (!isCheckoutAvailable())');
  const databasePosition = action.indexOf('const prisma = requirePrisma()');

  assert.match(page, /if \(!isCheckoutAvailable\(\)\)/);
  assert.match(page, /Online purchases are coming soon/);
  assert.ok(guardPosition >= 0 && guardPosition < databasePosition);
});
