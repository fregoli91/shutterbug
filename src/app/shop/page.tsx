import { safeJsonLd } from '@/lib/security';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { ProductLikeButton } from '@/components/ProductLikeButton';
import { ProductCard } from '@/components/ProductCard';
import { ShopSort } from '@/components/ShopSort';
import { ShopFilterDrawer } from '@/components/ShopFilterDrawer';
import { EmptyShelf } from '@/components/EmptyShelf';
import { compareNewest } from '@/lib/storefront-sort';
import { LayoutGrid, List, X } from 'lucide-react';
import { AddToCartButton } from '@/components/cart/AddToCartButton';
import { INCLUDE_FILTER_OPTIONS } from '@/lib/catalog';
import { categories } from '@/lib/categories';
import {
  conditions,
  formatPrice,
  getAvailabilityLabel,
  getCatalogProducts,
  getFilterOptions,
  isPurchasable,
  type Product
} from '@/lib/products';
import { getLikedProductIds } from '@/lib/customer-likes';
import { getCustomerSession } from '@/lib/customer-auth';
import { site } from '@/lib/seo';
import { buildBreadcrumbJsonLd, buildCollectionPageJsonLd, jsonLdGraph } from '@/lib/seo-utils';

import { shopHref, type SearchParams } from '@/lib/shop-query';
type Props = {
  searchParams?: Promise<SearchParams>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = (await searchParams) ?? {};
  const hasFilters = Object.values(params).some((value) =>
    Array.isArray(value) ? value.some(Boolean) : Boolean(value)
  );

  return {
    title: 'Used Cameras for Sale',
    description:
      'Shop tested used vintage digital cameras, film cameras, lenses, accessories, parts and repair gear, and camera equipment from Shutterbug Camera Shop.',
    alternates: { canonical: '/shop' },
    robots: hasFilters ? { index: false, follow: true } : undefined,
    openGraph: {
      title: 'Used Cameras for Sale | Shutterbug Camera Shop',
      description:
        'Browse tested vintage digital cameras, film cameras, lenses, accessories, and used camera gear with honest condition notes.',
      url: `${site.domain}/shop`,
      type: 'website'
    }
  };
}
const availabilityOptions = [
  { value: 'active', label: 'In stock' },
  { value: 'sold_out', label: 'Sold out' }
];

const categoryLabels = new Map(categories.map((category) => [category.slug, category.name]));
const includeLabels = new Map(INCLUDE_FILTER_OPTIONS.map((option) => [option.value, option.label]));
const availabilityLabels = new Map(availabilityOptions.map((option) => [option.value, option.label]));
const popularSearches = [
  ['Canon PowerShot', '/categories/canon-powershot-cameras'],
  ['Nikon Coolpix', '/categories/nikon-coolpix-cameras'],
  ['Olympus', '/brands/olympus'],
  ['Sony Cyber-shot', '/categories/sony-cyber-shot-cameras'],
  ['Film cameras', '/categories/film-cameras'],
  ['Printers', '/categories/printers'],
  ['Lenses', '/categories/lenses'],
  ['Battery chargers', '/categories/batteries-chargers']
];

function asArray(value: string | string[] | undefined) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function asString(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? '' : value ?? '';
}

function labelForSlug(slug: string) {
  return categoryLabels.get(slug) ?? slug.replace(/-/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function isTested(product: Product) {
  const status = product.functionalStatus ?? '';
  return (
    status === 'Tested' ||
    status === 'Ready to Shoot' ||
    status === 'Fully Functional' ||
    (product.tested.length > 0 && product.tested[0] !== 'Testing pending')
  );
}

function HiddenFilterFields({
  query,
  selectedBrands,
  selectedCategories,
  selectedCameraTypes,
  selectedProductTypes,
  selectedConditions,
  selectedFunctionalStatuses,
  selectedAvailability,
  selectedIncludes,
  selectedLensMounts,
  selectedFilmFormats,
  selectedStorageTypes,
  minPrice,
  maxPrice,
  view
}: {
  query: string;
  selectedBrands: string[];
  selectedCategories: string[];
  selectedCameraTypes: string[];
  selectedProductTypes: string[];
  selectedConditions: string[];
  selectedFunctionalStatuses: string[];
  selectedAvailability: string[];
  selectedIncludes: string[];
  selectedLensMounts: string[];
  selectedFilmFormats: string[];
  selectedStorageTypes: string[];
  minPrice: string;
  maxPrice: string;
  view: string;
}) {
  const hidden = [
    ...selectedBrands.map((value) => ['brand', value]),
    ...selectedCategories.map((value) => ['category', value]),
    ...selectedCameraTypes.map((value) => ['type', value]),
    ...selectedProductTypes.map((value) => ['productType', value]),
    ...selectedConditions.map((value) => ['condition', value]),
    ...selectedFunctionalStatuses.map((value) => ['functionalStatus', value]),
    ...selectedAvailability.map((value) => ['availability', value]),
    ...selectedIncludes.map((value) => ['includes', value]),
    ...selectedLensMounts.map((value) => ['lensMount', value]),
    ...selectedFilmFormats.map((value) => ['filmFormat', value]),
    ...selectedStorageTypes.map((value) => ['storageType', value])
  ];

  return (
    <>
      <input type="hidden" name="q" value={query} />
      {hidden.map(([name, value]) => (
        <input key={`${name}-${value}`} type="hidden" name={name} value={value} />
      ))}
      {minPrice ? <input type="hidden" name="minPrice" value={minPrice} /> : null}
      {maxPrice ? <input type="hidden" name="maxPrice" value={maxPrice} /> : null}
      {view === 'list' ? <input type="hidden" name="view" value="list" /> : null}
    </>
  );
}

export default async function ShopPage({ searchParams }: Props) {
  const params = searchParams ? await searchParams : {};
  const query = asString(params.q).trim();
  const sort = asString(params.sort) || 'newest';
  const view = asString(params.view) === 'list' ? 'list' : 'grid';
  const selectedBrands = asArray(params.brand);
  const selectedCategories = asArray(params.category);
  const selectedCameraTypes = asArray(params.type);
  const selectedProductTypes = asArray(params.productType);
  const selectedConditions = asArray(params.condition);
  const selectedFunctionalStatuses = asArray(params.functionalStatus);
  const selectedAvailability = asArray(params.availability);
  const selectedIncludes = asArray(params.includes);
  const selectedLensMounts = asArray(params.lensMount);
  const selectedFilmFormats = asArray(params.filmFormat);
  const selectedStorageTypes = asArray(params.storageType);
  const minPrice = asString(params.minPrice);
  const maxPrice = asString(params.maxPrice);
  const normalizedQuery = query.toLowerCase();
  const catalogProducts = await getCatalogProducts();
  const filterOptions = getFilterOptions(catalogProducts);

  const filteredProducts = catalogProducts.filter((product) => {
    const searchable = [
      product.title,
      product.brand,
      product.manufacturer,
      product.model,
      product.sku,
      product.condition,
      product.functionalStatus,
      product.cameraType,
      product.format,
      product.categorySlug,
      product.subcategorySlug,
      product.productType,
      product.lensMount,
      product.filmFormat,
      product.storageType,
      product.shortDescription,
      product.seoDescription,
      ...(product.tags ?? []),
      ...product.badges,
      ...product.goodFor,
      ...product.included,
      ...product.tested,
      ...product.notes,
      ...product.cosmeticNotes,
      ...product.functionalNotes,
      ...product.flaws
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    const productCategories = [product.categorySlug, product.subcategorySlug, ...product.categorySlugs].filter(Boolean);
    const matchesQuery = normalizedQuery ? searchable.includes(normalizedQuery) : true;
    const matchesBrand = selectedBrands.length ? selectedBrands.includes(product.brand) : true;
    const matchesCategory = selectedCategories.length
      ? selectedCategories.some((category) => productCategories.includes(category))
      : true;
    const matchesCameraType = selectedCameraTypes.length ? selectedCameraTypes.includes(product.cameraType) : true;
    const matchesProductType = selectedProductTypes.length
      ? selectedProductTypes.includes(product.productType ?? '')
      : true;
    const matchesCondition = selectedConditions.length ? selectedConditions.includes(product.condition) : true;
    const matchesFunctionalStatus = selectedFunctionalStatuses.length
      ? selectedFunctionalStatuses.includes(product.functionalStatus ?? '')
      : true;
    const matchesAvailability = selectedAvailability.length ? selectedAvailability.includes(product.status) : true;
    const matchesMinPrice = minPrice ? product.price >= Number(minPrice) : true;
    const matchesMaxPrice = maxPrice ? product.price <= Number(maxPrice) : true;
    const matchesLensMount = selectedLensMounts.length ? selectedLensMounts.includes(product.lensMount ?? '') : true;
    const matchesFilmFormat = selectedFilmFormats.length ? selectedFilmFormats.includes(product.filmFormat ?? '') : true;
    const matchesStorageType = selectedStorageTypes.length
      ? selectedStorageTypes.includes(product.storageType ?? '')
      : true;
    const matchesIncludes =
      (selectedIncludes.includes('battery') ? product.includesBattery : true) &&
      (selectedIncludes.includes('charger') ? product.includesCharger : true) &&
      (selectedIncludes.includes('memory-card') ? product.includesMemoryCard : true) &&
      (selectedIncludes.includes('strap') ? product.includesStrap : true) &&
      (selectedIncludes.includes('case') ? product.includesCase : true) &&
      (selectedIncludes.includes('manual') ? product.includesManual : true) &&
      (selectedIncludes.includes('original-box') ? product.includesOriginalBox : true) &&
      (selectedIncludes.includes('sample-photos') ? product.samplePhotos : true) &&
      (selectedIncludes.includes('actual-photos') ? product.actualPhotos : true) &&
      (selectedIncludes.includes('tested') ? isTested(product) : true) &&
      (selectedIncludes.includes('parts-repair') ? product.partsRepair || product.condition === 'For Parts' : true);

    return (
      matchesQuery &&
      matchesBrand &&
      matchesCategory &&
      matchesCameraType &&
      matchesProductType &&
      matchesCondition &&
      matchesFunctionalStatus &&
      matchesAvailability &&
      matchesMinPrice &&
      matchesMaxPrice &&
      matchesLensMount &&
      matchesFilmFormat &&
      matchesStorageType &&
      matchesIncludes
    );
  });

  const visibleProducts = [...filteredProducts].sort((a, b) => {
    if (sort === 'newest') return compareNewest(a, b);
    if (sort === 'stock') {
      const rank = { active: 0, sold_out: 1, draft: 2, archived: 3 };
      return rank[a.status] - rank[b.status];
    }
    if (sort === 'price-asc') return a.price - b.price;
    if (sort === 'price-desc') return b.price - a.price;
    if (sort === 'condition') return conditions.indexOf(a.condition) - conditions.indexOf(b.condition);
    if (sort === 'brand') return a.brand.localeCompare(b.brand) || a.title.localeCompare(b.title);
    return Number(Boolean(b.featured)) - Number(Boolean(a.featured));
  });

  const activeFilterCount =
    selectedBrands.length +
    selectedCategories.length +
    selectedCameraTypes.length +
    selectedProductTypes.length +
    selectedConditions.length +
    selectedFunctionalStatuses.length +
    selectedAvailability.length +
    selectedIncludes.length +
    selectedLensMounts.length +
    selectedFilmFormats.length +
    selectedStorageTypes.length +
    (minPrice ? 1 : 0) +
    (maxPrice ? 1 : 0);
  const hasActiveFilters = Boolean(query || activeFilterCount);
  const customer = await getCustomerSession();
  const likedProductIds = await getLikedProductIds(
    customer?.id,
    visibleProducts.map((product) => product.id)
  );
  const structuredData = jsonLdGraph([
    buildCollectionPageJsonLd({
      name: query ? `Search results for ${query}` : 'Shop Tested Vintage Cameras',
      description:
        'Browse Shutterbug Camera Shop inventory with search, filters, prices, condition notes, and availability.',
      url: '/shop',
      products: visibleProducts
    }),
    buildBreadcrumbJsonLd([
      { name: 'Home', url: '/' },
      { name: 'Shop', url: '/shop' }
    ])
  ]);

  return (
    <section className="px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(structuredData) }} />
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[1fr_32rem] lg:items-center">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-moss">Shop cameras</p>
            <h1 className="mt-3 font-serif text-3xl font-bold text-ink sm:text-4xl">Cameras & gear</h1>
            <p className="mt-4 text-base leading-7 text-ink/70 sm:mt-5 sm:text-lg sm:leading-8">
              Vintage digital, film, lenses and more. Find your next camera with clear condition notes and real product photos.
            </p>
          </div>

          <div className="grid gap-4">
            <Image
              src="/shutterbug-shop-cameras-page.png"
              alt="Camera display inside Shutterbug Camera Shop"
              width={1600}
              height={900}
              sizes="(min-width: 1024px) 32rem, 100vw"
              className="aspect-[16/9] w-full rounded-lg border border-ink/10 bg-sand object-cover object-center shadow-sm"
            />

            <form action="/shop" className="border-t border-ink/10 pt-4">
              <label htmlFor="shop-search" className="text-sm font-semibold text-ink">
                Search inventory
              </label>
              <div className="mt-3 flex h-12 overflow-hidden rounded-lg border border-ink/15 bg-cream focus-within:border-moss focus-within:ring-2 focus-within:ring-sage">
                <input
                  id="shop-search"
                  name="q"
                  type="search"
                  defaultValue={query}
                  placeholder="Search cameras, brands & models"
                  className="min-w-0 flex-1 bg-transparent px-4 text-base text-ink outline-none placeholder:text-ink/40 sm:text-sm"
                />
                <button type="submit" className="bg-forest px-5 text-sm font-semibold text-white transition hover:bg-moss">
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-6 grid gap-4 border-y border-ink/10 py-4 sm:mt-8 sm:flex sm:flex-wrap sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-ink">
              {visibleProducts.length ? `${visibleProducts.length} item${visibleProducts.length === 1 ? '' : 's'} found` : 'Explore the collection'}
            </p>
            <p className="mt-1 text-sm text-ink/60">
              {query ? (
                <>
                  Search results for <span className="font-semibold text-ink">&ldquo;{query}&rdquo;</span>
                </>
              ) : (
                'Explore cameras and gear with clear condition notes.'
              )}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <ShopFilterDrawer count={activeFilterCount}>
            <FilterForm
              query={query}
              sort={sort}
              options={filterOptions}
              selectedBrands={selectedBrands}
              selectedCategories={selectedCategories}
              selectedCameraTypes={selectedCameraTypes}
              selectedProductTypes={selectedProductTypes}
              selectedConditions={selectedConditions}
              selectedFunctionalStatuses={selectedFunctionalStatuses}
              selectedAvailability={selectedAvailability}
              selectedIncludes={selectedIncludes}
              selectedLensMounts={selectedLensMounts}
              selectedFilmFormats={selectedFilmFormats}
              selectedStorageTypes={selectedStorageTypes}
              minPrice={minPrice}
              maxPrice={maxPrice}
              view={view}
            />
            </ShopFilterDrawer>
          <ShopSort value={sort}>
            <HiddenFilterFields
              query={query}
              selectedBrands={selectedBrands}
              selectedCategories={selectedCategories}
              selectedCameraTypes={selectedCameraTypes}
              selectedProductTypes={selectedProductTypes}
              selectedConditions={selectedConditions}
              selectedFunctionalStatuses={selectedFunctionalStatuses}
              selectedAvailability={selectedAvailability}
              selectedIncludes={selectedIncludes}
              selectedLensMounts={selectedLensMounts}
              selectedFilmFormats={selectedFilmFormats}
              selectedStorageTypes={selectedStorageTypes}
              minPrice={minPrice}
              maxPrice={maxPrice}
              view={view}
            />
          </ShopSort>
          </div>
        </div>

        <div className="mt-4 grid gap-3 border-t border-ink/10 pt-4 lg:flex lg:items-center lg:justify-between">
          <ActiveFilterChips
            params={params}
            query={query}
            selectedBrands={selectedBrands}
            selectedCategories={selectedCategories}
            selectedCameraTypes={selectedCameraTypes}
            selectedProductTypes={selectedProductTypes}
            selectedConditions={selectedConditions}
            selectedFunctionalStatuses={selectedFunctionalStatuses}
            selectedAvailability={selectedAvailability}
            selectedIncludes={selectedIncludes}
            selectedLensMounts={selectedLensMounts}
            selectedFilmFormats={selectedFilmFormats}
            selectedStorageTypes={selectedStorageTypes}
            minPrice={minPrice}
            maxPrice={maxPrice}
          />
          <div className="flex shrink-0 items-center gap-2 text-sm font-semibold text-ink/70">
            <span>View</span>
            <Link
              href={shopHref(params, { set: { view: undefined } })}
              aria-label="Grid view" aria-current={view === 'grid' ? 'true' : undefined} title="Grid view"
              className={`rounded-full px-3 py-2 ${view === 'grid' ? 'bg-forest text-white' : 'bg-cream text-ink hover:text-moss'}`}
            >
              <LayoutGrid className="h-5 w-5" aria-hidden="true" />
            </Link>
            <Link
              href={shopHref(params, { set: { view: 'list' } })}
              aria-label="List view" aria-current={view === 'list' ? 'true' : undefined} title="List view"
              className={`rounded-full px-3 py-2 ${view === 'list' ? 'bg-forest text-white' : 'bg-cream text-ink hover:text-moss'}`}
            >
              <List className="h-5 w-5" aria-hidden="true" />
            </Link>
          </div>
        </div>

        {!hasActiveFilters ? (
          <div className="mt-4 border-b border-ink/10 pb-4">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-moss">Popular searches</p>
            <div className="mt-2 flex gap-4 overflow-x-auto pb-2">
              {popularSearches.map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  className="shrink-0 whitespace-nowrap py-2 text-sm font-semibold text-moss transition hover:underline"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-8 grid gap-8 lg:grid-cols-[18rem_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-44 max-h-[calc(100dvh-12rem)] overflow-y-auto border-r border-ink/10 pr-5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-moss">Filters</p>
                {hasActiveFilters ? (
                  <Link href="/shop" className="text-sm font-semibold text-forest hover:text-moss">
                    Clear
                  </Link>
                ) : null}
              </div>
              <FilterForm
                query={query}
                sort={sort}
                options={filterOptions}
                selectedBrands={selectedBrands}
                selectedCategories={selectedCategories}
                selectedCameraTypes={selectedCameraTypes}
                selectedProductTypes={selectedProductTypes}
                selectedConditions={selectedConditions}
                selectedFunctionalStatuses={selectedFunctionalStatuses}
                selectedAvailability={selectedAvailability}
                selectedIncludes={selectedIncludes}
                selectedLensMounts={selectedLensMounts}
                selectedFilmFormats={selectedFilmFormats}
                selectedStorageTypes={selectedStorageTypes}
                minPrice={minPrice}
                maxPrice={maxPrice}
                view={view}
              />
            </div>
          </aside>

          {visibleProducts.length > 0 ? (
            view === 'list' ? (
              <div className="grid gap-4">
                {visibleProducts.map((product) => (
                  <ProductListResult
                    key={product.id}
                    product={product}
                    liked={likedProductIds.has(product.id)}
                    signedIn={Boolean(customer)}
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-3">
                {visibleProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    liked={likedProductIds.has(product.id)}
                    signedIn={Boolean(customer)}
                  />
                ))}
              </div>
            )
          ) : (
            <EmptyShelf filtered={hasActiveFilters} title={hasActiveFilters ? "No cameras match those filters." : "Nothing on the shelf right now."} description={hasActiveFilters ? "Try a broader search or clear your filters to explore the full collection." : "Our inventory changes as cameras arrive. Check back soon or explore our buying guides while you browse."} />
          )}
        </div>
      </div>
    </section>
  );
}

function ActiveFilterChips({
  params,
  query,
  selectedBrands,
  selectedCategories,
  selectedCameraTypes,
  selectedProductTypes,
  selectedConditions,
  selectedFunctionalStatuses,
  selectedAvailability,
  selectedIncludes,
  selectedLensMounts,
  selectedFilmFormats,
  selectedStorageTypes,
  minPrice,
  maxPrice
}: {
  params: SearchParams;
  query: string;
  selectedBrands: string[];
  selectedCategories: string[];
  selectedCameraTypes: string[];
  selectedProductTypes: string[];
  selectedConditions: string[];
  selectedFunctionalStatuses: string[];
  selectedAvailability: string[];
  selectedIncludes: string[];
  selectedLensMounts: string[];
  selectedFilmFormats: string[];
  selectedStorageTypes: string[];
  minPrice: string;
  maxPrice: string;
}) {
  const chips = [
    ...(query ? [{ label: `Search: ${query}`, href: shopHref(params, { remove: { name: 'q' } }) }] : []),
    ...selectedBrands.map((value) => ({ label: value, href: shopHref(params, { remove: { name: 'brand', value } }) })),
    ...selectedCategories.map((value) => ({
      label: labelForSlug(value),
      href: shopHref(params, { remove: { name: 'category', value } })
    })),
    ...selectedCameraTypes.map((value) => ({ label: value, href: shopHref(params, { remove: { name: 'type', value } }) })),
    ...selectedProductTypes.map((value) => ({
      label: value,
      href: shopHref(params, { remove: { name: 'productType', value } })
    })),
    ...selectedConditions.map((value) => ({
      label: value,
      href: shopHref(params, { remove: { name: 'condition', value } })
    })),
    ...selectedFunctionalStatuses.map((value) => ({
      label: value,
      href: shopHref(params, { remove: { name: 'functionalStatus', value } })
    })),
    ...selectedAvailability.map((value) => ({
      label: availabilityLabels.get(value) ?? value,
      href: shopHref(params, { remove: { name: 'availability', value } })
    })),
    ...selectedIncludes.map((value) => ({
      label: includeLabels.get(value) ?? value,
      href: shopHref(params, { remove: { name: 'includes', value } })
    })),
    ...selectedLensMounts.map((value) => ({
      label: value,
      href: shopHref(params, { remove: { name: 'lensMount', value } })
    })),
    ...selectedFilmFormats.map((value) => ({
      label: value,
      href: shopHref(params, { remove: { name: 'filmFormat', value } })
    })),
    ...selectedStorageTypes.map((value) => ({
      label: value,
      href: shopHref(params, { remove: { name: 'storageType', value } })
    })),
    ...(minPrice ? [{ label: `Min $${minPrice}`, href: shopHref(params, { remove: { name: 'minPrice' } }) }] : []),
    ...(maxPrice ? [{ label: `Max $${maxPrice}`, href: shopHref(params, { remove: { name: 'maxPrice' } }) }] : [])
  ];

  if (!chips.length) {
    return null;
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold text-ink/70">Active filters</span>
        {chips.map((chip) => (
          <Link
            key={`${chip.label}-${chip.href}`}
            href={chip.href}
            aria-label={`Remove ${chip.label} filter`} className="inline-flex min-h-11 items-center gap-2 rounded-md border border-ink/10 bg-cream px-3 py-1.5 text-sm font-semibold text-ink/72 transition hover:border-moss/35 hover:text-moss"
          >
            {chip.label} <X aria-hidden="true" className="h-3.5 w-3.5" />
          </Link>
        ))}
        <Link href="/shop" className="rounded-full bg-forest px-3 py-1.5 text-sm font-semibold text-white">
          Clear all
        </Link>
      </div>
    </div>
  );
}

function ProductListResult({
  product,
  liked,
  signedIn
}: {
  product: Product;
  liked: boolean;
  signedIn: boolean;
}) {
  const purchasable = isPurchasable(product);
  const productHref = `/shop/${product.slug}`;
  const keyDetails = [
    product.functionalStatus,
    product.conditionSummary,
    ...product.tested,
    ...product.included
  ].filter(Boolean).slice(0, 5);

  return (
    <article className="grid gap-4 border-t border-ink/10 pt-4 transition hover:border-moss/35 hover:shadow-soft md:grid-cols-[11rem_1fr_12rem]">
      <div className="relative rounded-lg bg-sand p-3">
        <Link href={productHref} className="block">
          <Image
            src={product.heroImage}
            alt={product.title}
            width={320}
            height={320}
            sizes="11rem"
            unoptimized={product.heroImage.endsWith('.svg')}
            className="aspect-square w-full object-contain"
          />
        </Link>
        <div className="absolute right-2 top-2 z-20">
          <ProductLikeButton
            productId={product.id}
            productSlug={product.slug}
            liked={liked}
            signedIn={signedIn}
            redirectTo={productHref}
            className={`flex h-11 w-11 items-center justify-center rounded-full border shadow-sm transition ${
              liked
                ? 'border-forest bg-forest text-white hover:bg-moss'
                : 'border-ink/10 bg-white text-ink hover:border-moss hover:text-moss'
            }`}
          />
        </div>
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.12em]">
          <span className="rounded-full bg-mint px-3 py-1 text-forest">{getAvailabilityLabel(product.status)}</span>
          <span className="rounded-full bg-sage px-3 py-1 text-ink/70">{product.condition}</span>
          {product.partsRepair || product.condition === 'For Parts' ? (
            <span className="rounded-full bg-sand px-3 py-1 text-ink/70">Parts / repair</span>
          ) : null}
        </div>
        <p className="mt-4 text-xs font-bold uppercase tracking-[0.16em] text-moss">{product.brand}</p>
        <Link href={productHref} className="mt-2 block">
          <h2 className="font-serif text-2xl font-bold leading-tight text-ink transition hover:text-moss">{product.title}</h2>
        </Link>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-ink/66">{product.shortDescription}</p>
        <ul className="mt-4 grid gap-1 text-sm text-ink/68 sm:grid-cols-2">
          {keyDetails.map((detail) => (
            <li key={detail} className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-moss" />
              <span>{detail}</span>
            </li>
          ))}
        </ul>

      </div>
      <div className="grid content-start gap-3 md:justify-items-end">
        <p className="text-2xl font-bold text-ink">{formatPrice(product.price)}</p>
        <p className="text-sm text-ink/60">Ships from Shutterbug</p>
        {purchasable ? (
          <AddToCartButton
            productId={product.id}
            className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-forest px-5 py-3 text-sm font-semibold text-white transition hover:bg-moss"
          />
        ) : (
          <Link
            href="/contact"
            className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-ink/15 bg-cream px-5 py-3 text-sm font-semibold text-ink transition hover:border-moss hover:text-moss"
          >
            Ask about this item
          </Link>
        )}
        <Link
          href={productHref}
          className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-ink/15 bg-white px-5 py-3 text-sm font-semibold text-ink transition hover:border-moss hover:text-moss"
        >
          View details
        </Link>
      </div>
    </article>
  );
}

function FilterForm({
  query,
  sort,
  options,
  selectedBrands,
  selectedCategories,
  selectedCameraTypes,
  selectedProductTypes,
  selectedConditions,
  selectedFunctionalStatuses,
  selectedAvailability,
  selectedIncludes,
  selectedLensMounts,
  selectedFilmFormats,
  selectedStorageTypes,
  minPrice,
  maxPrice,
  view
}: {
  query: string;
  sort: string;
  options: ReturnType<typeof getFilterOptions>;
  selectedBrands: string[];
  selectedCategories: string[];
  selectedCameraTypes: string[];
  selectedProductTypes: string[];
  selectedConditions: string[];
  selectedFunctionalStatuses: string[];
  selectedAvailability: string[];
  selectedIncludes: string[];
  selectedLensMounts: string[];
  selectedFilmFormats: string[];
  selectedStorageTypes: string[];
  minPrice: string;
  maxPrice: string;
  view: string;
}) {
  const advancedActive = selectedCameraTypes.length + selectedProductTypes.length +
    selectedFunctionalStatuses.length + selectedIncludes.length + selectedLensMounts.length +
    selectedFilmFormats.length + selectedStorageTypes.length;

  return (
    <form action="/shop" className="mt-4 grid gap-5">
      <input type="hidden" name="q" value={query} />
      <input type="hidden" name="sort" value={sort} />
      {view === 'list' ? <input type="hidden" name="view" value="list" /> : null}
      <FilterGroup title="Category">
        {options.categories.map((category) => (
          <Checkbox key={category} name="category" value={category} label={labelForSlug(category)} checked={selectedCategories.includes(category)} />
        ))}
      </FilterGroup>
      <FilterGroup title="Brand">
        {options.brands.map((brand) => (
          <Checkbox key={brand} name="brand" value={brand} label={brand} checked={selectedBrands.includes(brand)} />
        ))}
      </FilterGroup>
      <fieldset>
        <legend className="text-sm font-semibold text-ink">Price</legend>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <label className="grid gap-1 text-xs text-ink/70">
            Minimum ($)
            <input name="minPrice" type="number" min="0" step="1" defaultValue={minPrice} placeholder="Any"
              className="min-h-11 w-full rounded-md border border-ink/20 bg-white px-3 text-base text-ink focus:outline-moss" />
          </label>
          <label className="grid gap-1 text-xs text-ink/70">
            Maximum ($)
            <input name="maxPrice" type="number" min="0" step="1" defaultValue={maxPrice} placeholder="Any"
              className="min-h-11 w-full rounded-md border border-ink/20 bg-white px-3 text-base text-ink focus:outline-moss" />
          </label>
        </div>
      </fieldset>
      <FilterGroup title="Condition">
        {conditions.map((condition) => (
          <Checkbox key={condition} name="condition" value={condition} label={condition} checked={selectedConditions.includes(condition)} />
        ))}
      </FilterGroup>
      <FilterGroup title="Availability">
        {availabilityOptions.map((option) => (
          <Checkbox key={option.value} name="availability" value={option.value} label={option.label} checked={selectedAvailability.includes(option.value)} />
        ))}
      </FilterGroup>
      <details open={advancedActive > 0} className="border-y border-forest/15 py-2">
        <summary className="min-h-11 cursor-pointer py-3 text-sm font-semibold text-forest">
          More filters{advancedActive ? ` (${advancedActive})` : ''}
        </summary>
        <div className="grid gap-5 py-3">
          <CompactCheckboxGroup title="Camera type" name="type" options={options.cameraTypes} selected={selectedCameraTypes} />
          <CompactCheckboxGroup title="Product type" name="productType" options={options.productTypes} selected={selectedProductTypes} />
          <CompactCheckboxGroup title="Functional condition" name="functionalStatus" options={options.functionalStatuses} selected={selectedFunctionalStatuses} />
          <FilterGroup title="Included accessories & details">
            {INCLUDE_FILTER_OPTIONS.map((option) => (
              <Checkbox key={option.value} name="includes" value={option.value} label={option.label} checked={selectedIncludes.includes(option.value)} />
            ))}
          </FilterGroup>
          <CompactCheckboxGroup title="Lens mount" name="lensMount" options={options.lensMounts} selected={selectedLensMounts} />
          <CompactCheckboxGroup title="Film format" name="filmFormat" options={options.filmFormats} selected={selectedFilmFormats} />
          <CompactCheckboxGroup title="Storage / media" name="storageType" options={options.storageTypes} selected={selectedStorageTypes} />
        </div>
      </details>
      <div className="sticky bottom-0 grid grid-cols-[1fr_auto] items-center gap-3 border-t border-forest/15 bg-cream py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <button type="submit" className="min-h-11 rounded-md bg-forest px-4 py-3 text-sm font-semibold text-white hover:bg-moss focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-moss">Show results</button>
        <Link href="/shop" className="inline-flex min-h-11 items-center px-2 text-sm font-semibold text-forest hover:underline">Clear all</Link>
      </div>
    </form>
  );
}
function CompactCheckboxGroup({
  title,
  name,
  options,
  selected
}: {
  title: string;
  name: string;
  options: string[];
  selected: string[];
}) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold text-ink">{title}</legend>
      <div className="mt-2 grid max-h-52 gap-1 overflow-y-auto">
        {options.map((option) => (
          <Checkbox key={option} name={name} value={option} label={option} checked={selected.includes(option)} />
        ))}
      </div>
    </fieldset>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold text-ink">{title}</legend>
      <div className="mt-2 grid max-h-52 gap-1 overflow-y-auto">{children}</div>
    </fieldset>
  );
}

function Checkbox({
  name,
  value,
  label,
  checked
}: {
  name: string;
  value: string;
  label: string;
  checked: boolean;
}) {
  return (
    <label className="flex min-h-11 items-center gap-3 rounded-lg px-2 text-sm text-ink/70 transition hover:bg-mint">
      <input
        type="checkbox"
        name={name}
        value={value}
        defaultChecked={checked}
        className="h-5 w-5 shrink-0 rounded border-ink/20 accent-[#24543a]"
      />
      <span>{label}</span>
    </label>
  );
}
