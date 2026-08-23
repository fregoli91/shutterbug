import test from 'node:test';
import assert from 'node:assert/strict';
import {
  cleanInternalRedirect,
  isSameOriginRequest,
  safeJsonLd,
  safeProductImageUrl,
  safePublicUrl,
  safeTrackingUrl
} from '../src/lib/security.ts';
import { hasAllowedImageSignature, isAllowedImageType } from '../src/lib/image-upload-security.ts';
import { validateStripePaymentSnapshot } from '../src/lib/stripe-payment-validation.ts';

test('internal redirects reject external, protocol-relative, and backslash paths', () => {
  for (const value of ['https://evil.example', '//evil.example', '/\\evil', 'javascript:alert(1)', '']) {
    assert.equal(cleanInternalRedirect(value, '/account'), '/account');
  }
  assert.equal(cleanInternalRedirect('/account/orders?from=login#latest', '/account'), '/account/orders?from=login#latest');
});

test('public and tracking URLs require HTTPS', () => {
  assert.equal(safePublicUrl('http://example.com'), null);
  assert.equal(safeTrackingUrl('javascript:alert(1)'), null);
  assert.equal(safeTrackingUrl('https://tools.usps.com/track'), 'https://tools.usps.com/track');
});

test('product images allow local assets and Cloudinary only', () => {
  assert.equal(safeProductImageUrl('/images/product.png'), '/images/product.png');
  assert.equal(safeProductImageUrl('https://res.cloudinary.com/demo/image/upload/item.jpg'), 'https://res.cloudinary.com/demo/image/upload/item.jpg');
  assert.equal(safeProductImageUrl('https://evil.example/item.jpg'), null);
  assert.equal(safeProductImageUrl('javascript:alert(1)'), null);
});

test('JSON-LD escaping neutralizes closing script markup', () => {
  const output = safeJsonLd({ name: '</script><script>alert(1)</script>' });
  assert.equal(output.includes('</script>'), false);
  assert.equal(output.includes('\\u003c/script>'), true);
});

test('same-origin protection rejects cross-site form submissions', () => {
  const same = new Request('https://shop.example/api', { headers: { origin: 'https://shop.example' } });
  const cross = new Request('https://shop.example/api', { headers: { origin: 'https://evil.example' } });
  assert.equal(isSameOriginRequest(same), true);
  assert.equal(isSameOriginRequest(cross), false);
});

test('image signatures must match supported declared types', () => {
  assert.equal(isAllowedImageType('image/svg+xml'), false);
  assert.equal(hasAllowedImageSignature(Uint8Array.from([0xff, 0xd8, 0xff, 0x00]), 'image/jpeg'), true);
  assert.equal(hasAllowedImageSignature(Uint8Array.from([0x3c, 0x73, 0x76, 0x67]), 'image/jpeg'), false);
  assert.equal(
    hasAllowedImageSignature(Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), 'image/png'),
    true
  );
});

test('Stripe snapshot validation rejects amount, currency, state, and mode mismatches', () => {
  const valid = { amountTotal: 1000, currency: 'usd', paymentStatus: 'paid', livemode: false };
  assert.equal(validateStripePaymentSnapshot(valid, 1000, 'USD', 'sk_test_example'), null);
  assert.match(validateStripePaymentSnapshot({ ...valid, amountTotal: 999 }, 1000, 'USD', 'sk_test_example'), /amount/i);
  assert.match(validateStripePaymentSnapshot({ ...valid, currency: 'cad' }, 1000, 'USD', 'sk_test_example'), /currency/i);
  assert.match(validateStripePaymentSnapshot({ ...valid, paymentStatus: 'unpaid' }, 1000, 'USD', 'sk_test_example'), /not paid/i);
  assert.match(validateStripePaymentSnapshot({ ...valid, livemode: true }, 1000, 'USD', 'sk_test_example'), /mode/i);
});