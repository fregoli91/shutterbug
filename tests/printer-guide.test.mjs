import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { getGuide } from '../src/lib/guides.ts';

test('printer testing guide states conditional checks and listing-level limits', () => {
  const guide = getGuide('how-we-test-used-printers');
  assert.ok(guide);
  const copy = guide.sections.flatMap((section) => [...section.paragraphs, ...(section.bullets ?? [])]).join(' ');
  assert.match(copy, /when compatible paper and usable ink, toner/i);
  assert.match(copy, /treat it as unverified/i);
  assert.match(copy, /should not describe the unit as fully tested/i);
});

test('printer shopping paths link to the dedicated testing guide', () => {
  const categoryPage = fs.readFileSync('src/app/categories/[slug]/page.tsx', 'utf8');
  const productPage = fs.readFileSync('src/app/shop/[slug]/page.tsx', 'utf8');
  assert.match(categoryPage, /guides\/how-we-test-used-printers/);
  assert.match(productPage, /guides\/how-we-test-used-printers/);
});