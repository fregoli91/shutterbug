import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

test('legacy cart URL permanently redirects to the bag',()=>{
 const source=fs.readFileSync('src/app/cart/page.tsx','utf8');
 assert.match(source,/permanentRedirect\('\/bag'\)/);
});
test('bag panel reuses validated cart state and supports toggle and Escape behavior',()=>{
 const panel=fs.readFileSync('src/components/cart/BagPanel.tsx','utf8');
 const trigger=fs.readFileSync('src/components/cart/CartLink.tsx','utf8');
 const hook=fs.readFileSync('src/components/cart/useValidatedCart.ts','utf8');
 assert.match(panel,/setOpen\(value=>!value\)/);assert.match(panel,/event\.key==='Escape'/);
 assert.match(panel,/transition-\[grid-template-rows,opacity\]/);assert.match(panel,/inert=\{!open\}/);
 assert.match(trigger,/aria-expanded=\{open\}/);assert.match(trigger,/aria-controls="header-bag-panel"/);
 assert.match(hook,/fetch\('\/api\/cart\/validate'/);
});
test('bag page exposes real quantity, removal, checkout, and customer utilities',()=>{
 const page=fs.readFileSync('src/components/cart/CartPageClient.tsx','utf8');
 assert.match(page,/updateQuantity/);assert.match(page,/removeItem/);assert.match(page,/href="\/checkout"/);
 assert.match(page,/\/account\/likes/);assert.match(page,/Browse Cameras/);assert.match(page,/Browse Printers/);
});
test('header authentication access lives in the bag panel',()=>{
 const header=fs.readFileSync('src/components/Header.tsx','utf8');
 const panel=fs.readFileSync('src/components/cart/BagPanel.tsx','utf8');
 assert.doesNotMatch(header,/href="\/login"/);assert.doesNotMatch(header,/href="\/signup"/);assert.doesNotMatch(header,/AccountMenu/);
 assert.match(panel,/title="Sign In"/);assert.match(panel,/title="Create Account"/);
 assert.match(panel,/\/account\/orders/);assert.match(panel,/\/account\/likes/);
});
test('customer-facing routes point to bag and robots excludes transactional bag pages',()=>{
 for(const path of ['src/app/checkout/cancel/page.tsx','src/app/account/payment-methods/page.tsx','src/app/shop/[slug]/page.tsx']){
  assert.doesNotMatch(fs.readFileSync(path,'utf8'),/href="\/cart"/);
 }
 assert.match(fs.readFileSync('src/app/robots.ts','utf8'),/'\/bag'/);
 assert.match(fs.readFileSync('src/app/checkout/page.tsx','utf8'),/href="\/bag"/);
});