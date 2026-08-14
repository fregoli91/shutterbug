import assert from 'node:assert/strict';
import test from 'node:test';

import {
  isCustomerPurchase,
  removePurchasedCartLines,
  shouldProcessStripePayment
} from '../src/lib/purchase-lifecycle.ts';
import {
  createGuestOrderAccessToken,
  customerOrderPath,
  guestOrderAccessMatches
} from '../src/lib/order-access.ts';

test('paid checkout removes only purchased quantities from the cart', () => {
  const current = [
    { id: 'camera-a', quantity: 2 },
    { id: 'lens-b', quantity: 1 },
    { id: 'film-c', quantity: 3 }
  ];

  assert.deepEqual(removePurchasedCartLines(current, [
    { id: 'camera-a', quantity: 1 },
    { id: 'film-c', quantity: 2 }
  ]), [
    { id: 'camera-a', quantity: 1 },
    { id: 'lens-b', quantity: 1 },
    { id: 'film-c', quantity: 1 }
  ]);
});

test('duplicate or unpaid Stripe events do not claim payment processing', () => {
  assert.equal(shouldProcessStripePayment('PENDING', 'paid'), true);
  assert.equal(shouldProcessStripePayment('PAID', 'paid'), false);
  assert.equal(shouldProcessStripePayment('CANCELED', 'paid'), false);
  assert.equal(shouldProcessStripePayment('REFUNDED', 'paid'), false);
  assert.equal(shouldProcessStripePayment('PENDING', 'unpaid'), false);
});

test('account purchase history includes only paid or refunded purchases', () => {
  assert.equal(isCustomerPurchase('PAID'), true);
  assert.equal(isCustomerPurchase('REFUNDED'), true);
  assert.equal(isCustomerPurchase('PENDING'), false);
  assert.equal(isCustomerPurchase('FAILED'), false);
});

test('guest order access tokens are high entropy and compared exactly', () => {
  const token = createGuestOrderAccessToken();

  assert.ok(token.length >= 40);
  assert.equal(guestOrderAccessMatches(token, token), true);
  assert.equal(guestOrderAccessMatches(token, `${token}x`), false);
  assert.equal(guestOrderAccessMatches(token, null), false);
});

test('customer and guest order links use their protected access paths', () => {
  assert.equal(customerOrderPath({
    id: 'order-account',
    customerId: 'customer-1',
    guestAccessToken: null
  }), '/account/orders/order-account');

  assert.equal(customerOrderPath({
    id: 'order-guest',
    customerId: null,
    guestAccessToken: 'guest token'
  }), '/orders/order-guest?access=guest%20token');

  assert.equal(customerOrderPath({
    id: 'order-orphaned',
    customerId: null,
    guestAccessToken: null
  }), '/contact');
});
