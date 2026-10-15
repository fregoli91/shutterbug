import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { getGuide } from '../src/lib/guides.ts';

test('the Y2K guide owns the requested informational variants and links to commercial hubs', () => {
  const guide = getGuide('y2k-digital-cameras');
  assert.ok(guide);
  const copy = [guide.title, guide.seoTitle, guide.description, guide.summary, ...guide.sections.flatMap((section) => [section.heading, ...section.paragraphs, ...(section.bullets ?? [])])].join(' ').toLowerCase();
  for (const phrase of ['used digital cameras', 'used canon camera', 'used canon powershot', "2000's cameras", '2000s cameras', 'millennium cameras', 'y2k used cameras', 'y2k cameras']) {
    assert.ok(copy.includes(phrase), `missing phrase: ${phrase}`);
  }
  const hrefs = new Set(guide.relatedLinks.map((link) => link.href));
  for (const href of ['/categories/digital-cameras', '/categories/vintage-digital-cameras', '/brands/canon', '/categories/canon-powershot-cameras']) assert.ok(hrefs.has(href));
});

test('commercial intent remains assigned to existing category and brand routes', () => {
  const seo = fs.readFileSync('src/lib/seo-content.ts', 'utf8');
  assert.match(seo, /'digital-cameras': \{[\s\S]*?title: 'Used Digital Cameras for Sale'/);
  assert.match(seo, /'vintage-digital-cameras': \{[\s\S]*?title: 'Vintage Digital Cameras & Used Digicams'/);
  assert.match(seo, /'canon-powershot-cameras': \{[\s\S]*?title: 'Used Canon PowerShot Cameras'/);
  assert.match(seo, /canon: \{[\s\S]*?title: 'Used Canon Cameras and Gear'/);
});

test('navigation, homepage, blog, products, and sitemap expose the new search path', () => {
  const files = [
    'src/components/DesktopNavigation.tsx',
    'src/app/page.tsx',
    'src/lib/blog.ts',
    'src/app/shop/[slug]/page.tsx'
  ].map((path) => fs.readFileSync(path, 'utf8')).join('\n');
  assert.match(files, /\/categories\/digital-cameras/);
  assert.match(files, /\/guides\/y2k-digital-cameras/);
  const sitemap = fs.readFileSync('src/app/sitemap.ts', 'utf8');
  assert.match(sitemap, /guides\.map/);
});

test('priority empty categories retain substantial content and crawlable next actions', () => {
  const page = fs.readFileSync('src/app/categories/[slug]/page.tsx', 'utf8');
  const emptyShelf = fs.readFileSync('src/components/EmptyShelf.tsx', 'utf8');
  assert.match(page, /profile\?\.supportingSections/);
  assert.match(page, /showWatchlist/);
  assert.match(emptyShelf, /account\/watchlist/);
  assert.match(emptyShelf, /sell-your-camera/);
  assert.match(page, /aria-label="Breadcrumb"/);
});
