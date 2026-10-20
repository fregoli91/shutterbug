import test from 'node:test';
import assert from 'node:assert/strict';
import {
  lookupOrderConfirmation,
  normalizeOrderConfirmationSessionId
} from '../src/lib/order-confirmation-lookup.ts';
import { readFileSync } from 'node:fs';

const matchesGuestAccess = (expected, provided) => Boolean(expected && provided && expected === provided);

const order = {
  id: 'synthetic-order',
  customerId: 'synthetic-customer',
  guestAccessToken: 'synthetic-access'
};

test('malformed confirmation requests stop before database access', async () => {
  let queries = 0;
  const findOrder = async () => {
    queries += 1;
    return order;
  };

  assert.equal(normalizeOrderConfirmationSessionId('   '), null);
  assert.equal(normalizeOrderConfirmationSessionId('x'.repeat(256)), null);
  assert.deepEqual(
    await lookupOrderConfirmation({
      sessionId: '',
      access: null,
      getCustomer: async () => null,
      matchesGuestAccess,
      findOrder
    }),
    { kind: 'not-found' }
  );
  assert.equal(queries, 0);
});

test('nonexistent and unauthorized orders share the same not-found result', async () => {
  const nonexistent = await lookupOrderConfirmation({
    sessionId: 'synthetic-session',
    access: null,
    getCustomer: async () => null,
    matchesGuestAccess,
    findOrder: async () => null
  });
  const unauthorized = await lookupOrderConfirmation({
    sessionId: 'synthetic-session',
    access: null,
    getCustomer: async () => null,
    matchesGuestAccess,
    findOrder: async () => order
  });

  assert.deepEqual(nonexistent, { kind: 'not-found' });
  assert.deepEqual(unauthorized, { kind: 'not-found' });
});

test('confirmation lookup allows only the owning customer or matching guest token', async () => {
  const owner = await lookupOrderConfirmation({
    sessionId: 'synthetic-session',
    access: null,
    getCustomer: async () => ({ id: 'synthetic-customer' }),
    matchesGuestAccess,
    findOrder: async () => order
  });
  const guest = await lookupOrderConfirmation({
    sessionId: 'synthetic-session',
    access: 'synthetic-access',
    getCustomer: async () => null,
    matchesGuestAccess,
    findOrder: async () => order
  });

  assert.equal(owner.kind, 'found');
  assert.equal(guest.kind, 'found');
});

test('database failures become a controlled unavailable result', async () => {
  const result = await lookupOrderConfirmation({
    sessionId: 'synthetic-session',
    access: null,
    getCustomer: async () => null,
    matchesGuestAccess,
    findOrder: async () => {
      throw new Error('sensitive database detail');
    }
  });

  assert.deepEqual(result, { kind: 'unavailable' });
  assert.equal('error' in result, false);
});

test('confirmation query selects only fields needed by the public response', () => {
  const source = readFileSync(new URL('../src/lib/order-confirmation.ts', import.meta.url), 'utf8');
  const selection = source.slice(source.indexOf('export const orderConfirmationSelect'), source.indexOf('export type ConfirmationOrder'));
  assert.doesNotMatch(selection, /stripeRefundId/);
  assert.match(selection, /guestAccessToken:\s*true/);
  assert.match(selection, /productTitle:\s*true/);
});
