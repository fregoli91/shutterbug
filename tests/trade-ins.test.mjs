import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import { createTradeInReference, isCustomerEditableTradeIn, normalizeTradeInInput, tradeInSubmissionErrors } from '../src/lib/trade-ins.ts';

test('trade-in draft input is normalized and bounded', () => {
  const value=normalizeTradeInInput({itemType:'DIGITAL_CAMERA',brand:'  Canon ',model:' SD1000 ',quantity:999,condition:'GOOD',powersOn:true,includedItems:['Battery','Battery',''],payoutPreference:'CASH'});
  assert.equal(value.brand,'Canon');assert.equal(value.model,'SD1000');assert.equal(value.quantity,50);
  assert.deepEqual(value.includedItems,['Battery']);assert.equal(value.powersOn,true);
});

test('submission validation requires identity, condition, payout, and two photos', () => {
  const empty=normalizeTradeInInput({});
  assert.equal(tradeInSubmissionErrors(empty,0).length,6);
  const complete=normalizeTradeInInput({itemType:'FILM_CAMERA',brand:'Nikon',modelUnknown:true,condition:'FAIR',payoutPreference:'STORE_CREDIT'});
  assert.deepEqual(tradeInSubmissionErrors(complete,2),[]);
});

test('only drafts are customer-editable and references are nonsequential', () => {
  assert.equal(isCustomerEditableTradeIn('DRAFT'),true);
  assert.equal(isCustomerEditableTradeIn('SUBMITTED'),false);
  assert.equal(createTradeInReference(new Date('2026-09-18T00:00:00Z'),'a1b2c3d4'),'TI-2026-A1B2C3D4');
});

test('private routes enforce authentication, ownership, origin, and authenticated storage', () => {
  const update=fs.readFileSync('src/app/api/trade-ins/[id]/route.ts','utf8');
  const upload=fs.readFileSync('src/app/api/trade-ins/[id]/images/route.ts','utf8');
  const delivery=fs.readFileSync('src/app/api/trade-ins/images/[imageId]/route.ts','utf8');
  assert.match(update,/getCustomerSession/);assert.match(update,/customerId: customer\.id/);assert.match(update,/isSameOriginRequest/);
  assert.match(upload,/validateProductImage/);assert.match(upload,/type: 'authenticated'/);assert.match(upload,/customerId: customer\.id/);
  assert.match(delivery,/customerId: customer!\.id/);assert.match(delivery,/X-Robots-Tag/);
});

test('customer account pages are noindex while the public landing has a canonical and sitemap entry', () => {
  const account=fs.readFileSync('src/app/account/trade-ins/page.tsx','utf8');
  const detail=fs.readFileSync('src/app/account/trade-ins/[id]/page.tsx','utf8');
  const landing=fs.readFileSync('src/app/sell-your-camera/page.tsx','utf8');
  const sitemap=fs.readFileSync('src/app/sitemap.ts','utf8');
  assert.match(account,/robots:\{index:false,follow:false\}/);assert.match(detail,/robots:\{index:false,follow:false\}/);
  assert.match(landing,/canonical: '\/sell-your-camera'/);assert.match(sitemap,/'\/sell-your-camera'/);
});

test('offer responses and admin revisions are ownership-scoped and auditable', () => {
  const customer=fs.readFileSync('src/app/account/trade-ins/actions.ts','utf8');
  const admin=fs.readFileSync('src/app/admin/trade-ins/actions.ts','utf8');
  assert.match(customer,/tradeIn:\{customerId:customer\.id\}/);assert.match(customer,/OFFER_ACCEPTED/);assert.match(customer,/OFFER_DECLINED/);
  assert.match(admin,/SUPERSEDED/);assert.match(admin,/TradeInOfferKind\.REVISED/);assert.match(admin,/history:/);
});