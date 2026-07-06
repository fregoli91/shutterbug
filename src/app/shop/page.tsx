import Link from 'next/link';
import { ProductLikeButton } from '@/components/ProductLikeButton';
import { ProductCard } from '@/components/ProductCard';
import { AddToCartButton } from '@/components/cart/AddToCartButton';
import { INCLUDE_FILTER_OPTIONS, POPULAR_CAMERA_BRANDS } from '@/lib/catalog';
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

export const metadata = {
  title: 'Shop Tested Vintage Cameras',
  description:
    'Shop tested vintage digital cameras, film cameras, lenses, accessories, parts and repair gear, and used camera equipment from Shutterbug Camera Shop.'
};

type SearchParams = Record<string, string | string[] | undefined>;
type Props = {
  searchParams?: Promise<SearchParams>;
};

const availabilityOptions = [
  { value: 'in-stock', label: 'In stock' },
  { value: 'coming-soon', label: 'Coming soon' },
  { value: 'sold-out', label: 'Sold out' }
];

const categoryLabels = new Map(categories.map((category) => [category.slug, category.name]));
const includeLabels = new Map(INCLUDE_FILTER_OPTIONS.map((option) => [option.value, option.label]));
const availabilityLabels = new Map(availabilityOptions.map((option) => [option.value, option.label]));
const popularSearches = [
  ['Canon PowerShot', '/shop?q=Canon+PowerShot'],
  ['Nikon Coolpix', '/shop?q=Nikon+Coolpix'],
  ['Olympus', '/shop?q=Olympus'],
  ['Sony Cyber-shot', '/shop?q=Sony+Cyber-shot'],
  ['Film cameras', '/categories/film-cameras'],
  ['Lenses', '/categories/lenses'],
  ['Battery chargers', '/shop?productType=Battery+Chargers']
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

function toUrlSearchParams(params: SearchParams) {
  const next = new URLSearchParams();
  Object.entries(params).forEach(([name, value]) => {
    if (!value) return;
    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item) next.append(name, item);
      });
      return;
    }
    next.set(name, value);
  });
  return next;
}

function shopHref(
  params: SearchParams,
  {
    set,
    remove
  }: {
    set?: Record<string, string | string[] | undefined>;
    remove?: { name: string; value?: string };
  }
) {
  const next = toUrlSearchParams(params);
  if (remove) {
    const values = next.getAll(remove.name).filter((value) => remove.value === undefined || value !== remove.value);
    next.delete(remove.name);
    values.forEach((value) => next.append(remove.name, value));
  }
  Object.entries(set ?? {}).forEach(([name, value]) => {
    next.delete(name);
    if (!value) return;
    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item) next.append(name, item);
      });
      return;
    }
    next.set(name, value);
  });
  const query = next.toString();
  return query ? `/shop?${query}` : '/shop';
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
  const sort = asString(params.sort) || 'featured';
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
    if (sort === 'newest') return Number(Boolean(b.newArrival)) - Number(Boolean(a.newArrival));
    if (sort === 'stock') {
      const rank = { 'in-stock': 0, 'coming-soon': 1, 'sold-out': 2 };
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

  return (
    <section className="px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[1fr_32rem] lg:items-center">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-moss">Shop cameras</p>
            <h1 className="mt-3 font-serif text-4xl font-bold text-ink sm:text-5xl">Shop Shutterbug Inventory</h1>
            <p className="mt-4 text-base leading-7 text-ink/70 sm:mt-5 sm:text-lg sm:leading-8">
              Search tested vintage digital cameras, film cameras, lenses, accessories, parts/repair gear, and used
              camera equipment by brand, category, condition, format, and included accessories.
            </p>
          </div>

          <div className="grid gap-4">
            <img
              src="/shutterbug-shop-cameras-page.png"
              alt="Camera display inside Shutterbug Camera Shop"
              className="aspect-[16/9] w-full rounded-lg border border-ink/10 bg-sand object-cover object-center shadow-sm"
            />

            <form action="/shop" className="rounded-lg border border-ink/10 bg-white p-4 shadow-sm">
              <label htmlFor="shop-search" className="text-sm font-semibold text-ink">
                Search inventory
              </label>
              <div className="mt-3 flex h-12 overflow-hidden rounded-lg border border-ink/15 bg-cream focus-within:border-moss focus-within:ring-2 focus-within:ring-sage">
                <input
                  id="shop-search"
                  name="q"
                  type="search"
                  defaultValue={query}
                  placeholder="Canon, Coolpix, Lumix, lens, charger..."
                  className="min-w-0 flex-1 bg-transparent px-4 text-base text-ink outline-none placeholder:text-ink/40 sm:text-sm"
                />
                <button type="submit" className="bg-forest px-5 text-sm font-semibold text-white transition hover:bg-moss">
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-6 grid gap-4 rounded-lg border border-ink/10 bg-white px-4 py-4 shadow-sm sm:mt-8 sm:flex sm:flex-wrap sm:items-center sm:justify-between sm:px-5">
          <div>
            <p className="text-sm font-semibold text-ink">
              {visibleProducts.length} item{visibleProducts.length === 1 ? '' : 's'} found
            </p>
            <p className="mt-1 text-sm text-ink/60">
              {query ? (
                <>
                  Search results for <span className="font-semibold text-ink">&ldquo;{query}&rdquo;</span>
                </>
              ) : (
                'Browse used camera inventory, coming-soon pages, and clearly marked parts/repair gear.'
              )}
            </p>
          </div>
          <form action="/shop" className="flex flex-wrap items-center gap-2 sm:gap-3">
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
            <label htmlFor="sort" className="text-sm font-semibold text-ink/70">
              Sort
            </label>
            <select
              id="sort"
              name="sort"
              defaultValue={sort}
              className="min-h-11 rounded-lg border border-ink/15 bg-cream px-3 py-2 text-sm text-ink outline-none focus:border-moss"
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="stock">In stock first</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="condition">Best condition</option>
              <option value="brand">Brand A-Z</option>
            </select>
            <button type="submit" className="min-h-11 rounded-full bg-forest px-4 py-2 text-sm font-semibold text-white">
              Apply
            </button>
          </form>
        </div>

        <div className="mt-4 grid gap-3 rounded-lg border border-ink/10 bg-white p-4 shadow-sm lg:flex lg:items-center lg:justify-between">
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
              className={`rounded-full px-3 py-2 ${view === 'grid' ? 'bg-forest text-white' : 'bg-cream text-ink hover:text-moss'}`}
            >
              Grid
            </Link>
            <Link
              href={shopHref(params, { set: { view: 'list' } })}
              className={`rounded-full px-3 py-2 ${view === 'list' ? 'bg-forest text-white' : 'bg-cream text-ink hover:text-moss'}`}
            >
              List
            </Link>
          </div>
        </div>

        {!hasActiveFilters ? (
          <div className="mt-4 rounded-lg border border-ink/10 bg-mint p-4 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-moss">Popular searches</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {popularSearches.map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink/72 shadow-sm transition hover:text-moss"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        ) : null}

        <details className="mt-4 overflow-hidden rounded-lg border border-ink/10 bg-white shadow-sm lg:hidden">
          <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-bold uppercase tracking-[0.14em] text-moss [&::-webkit-details-marker]:hidden">
            <span>Filters</span>
            <span className="rounded-full bg-mint px-3 py-1 text-xs tracking-normal text-forest">
              {activeFilterCount ? `${activeFilterCount} active` : 'Refine'}
            </span>
          </summary>
          <div className="max-h-[72svh] overflow-y-auto border-t border-ink/10 p-4">
            {hasActiveFilters ? (
              <a href="/shop" className="inline-flex min-h-10 items-center text-sm font-semibold text-forest hover:text-moss">
                Clear all filters
              </a>
            ) : null}
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
        </details>

        <div className="mt-8 grid gap-8 lg:grid-cols-[18rem_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-44 rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-moss">Filters</p>
                {hasActiveFilters ? (
                  <a href="/shop" className="text-sm font-semibold text-forest hover:text-moss">
                    Clear
                  </a>
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
            <NoResults />
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
    return <p className="text-sm text-ink/65">Use search or filters to narrow by brand, condition, format, and included accessories.</p>;
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold text-ink/70">Active filters</span>
        {chips.map((chip) => (
          <Link
            key={`${chip.label}-${chip.href}`}
            href={chip.href}
            className="rounded-full border border-ink/10 bg-cream px-3 py-1.5 text-sm font-semibold text-ink/72 transition hover:border-moss/35 hover:text-moss"
          >
            {chip.label} x
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
  const cartItem = {
    id: product.id,
    slug: product.slug,
    title: product.title,
    image: product.heroImage,
    condition: product.condition,
    priceCents: product.priceCents ?? Math.round(product.price * 100),
    quantity: 1,
    maxQuantity: product.quantity ?? 1
  };

  return (
    <article className="grid gap-4 rounded-lg border border-ink/10 bg-white p-4 shadow-sm transition hover:border-moss/35 hover:shadow-soft md:grid-cols-[11rem_1fr_12rem]">
      <div className="relative rounded-lg bg-sand p-3">
        <Link href={productHref} className="block">
        <img src={product.heroImage} alt={product.title} className="aspect-square w-full object-contain" />
        </Link>
        <ProductLikeButton
          productId={product.id}
          productSlug={product.slug}
          liked={liked}
          signedIn={signedIn}
          redirectTo={productHref}
          className={`absolute right-2 top-2 flex h-10 w-10 items-center justify-center rounded-full border shadow-sm transition ${
            liked
              ? 'border-forest bg-forest text-white hover:bg-moss'
              : 'border-ink/10 bg-white text-ink hover:border-moss hover:text-moss'
          }`}
        />
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
        <label className="mt-4 inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-ink/65">
          <input type="checkbox" className="h-4 w-4 rounded border-ink/20 accent-[#24543a]" />
          Compare
        </label>
      </div>
      <div className="grid content-start gap-3 md:justify-items-end">
        <p className="text-2xl font-bold text-ink">{formatPrice(product.price)}</p>
        <p className="text-sm text-ink/60">Ships from Shutterbug</p>
        {purchasable ? (
          <AddToCartButton
            item={cartItem}
            className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-forest px-5 py-3 text-sm font-semibold text-white transition hover:bg-moss"
          />
        ) : (
          <Link
            href="/contact"
            className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-ink/15 bg-cream px-5 py-3 text-sm font-semibold text-ink transition hover:border-moss hover:text-moss"
          >
            Request alert
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

function NoResults() {
  return (
    <div className="rounded-lg border border-ink/10 bg-white p-8 text-ink/70">
      <p className="font-serif text-2xl font-bold text-ink">No matching items yet</p>
      <p className="mt-3 leading-7">
        Try a broader brand, category, or product type. You can also contact Shutterbug and we can help source a camera,
        lens, charger, or repair item.
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        {popularSearches.map(([label, href]) => (
          <Link
            key={href}
            href={href}
            className="rounded-full border border-ink/10 bg-cream px-4 py-2 text-sm font-semibold text-ink/72 transition hover:text-moss"
          >
            Try {label}
          </Link>
        ))}
        <Link href="/contact" className="rounded-full bg-forest px-4 py-2 text-sm font-semibold text-white">
          Ask Shutterbug
        </Link>
      </div>
    </div>
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
  const popularBrands = options.brands.filter((brand) => POPULAR_CAMERA_BRANDS.includes(brand));
  const moreBrands = options.brands.filter((brand) => !POPULAR_CAMERA_BRANDS.includes(brand));
  const selectedMoreBrands = selectedBrands.filter((brand) => moreBrands.includes(brand));

  return (
    <form action="/shop" className="mt-5 grid gap-6">
      <input type="hidden" name="q" value={query} />
      <input type="hidden" name="sort" value={sort} />
      {view === 'list' ? <input type="hidden" name="view" value="list" /> : null}

      <FilterGroup title="Popular brands">
        {popularBrands.map((brand) => (
          <Checkbox key={brand} name="brand" value={brand} label={brand} checked={selectedBrands.includes(brand)} />
        ))}
        <details className="rounded-lg border border-ink/10 bg-cream/50" open={selectedMoreBrands.length > 0}>
          <summary className="cursor-pointer list-none px-3 py-2 text-sm font-semibold text-forest [&::-webkit-details-marker]:hidden">
            More brands
          </summary>
          <div className="grid max-h-64 gap-1 overflow-y-auto border-t border-ink/10 p-2">
            {moreBrands.map((brand) => (
              <Checkbox key={brand} name="brand" value={brand} label={brand} checked={selectedBrands.includes(brand)} />
            ))}
          </div>
        </details>
      </FilterGroup>

      <FilterGroup title="Category">
        {options.categories.map((category) => (
          <Checkbox
            key={category}
            name="category"
            value={category}
            label={labelForSlug(category)}
            checked={selectedCategories.includes(category)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Gear type">
        {options.cameraTypes.map((type) => (
          <Checkbox key={type} name="type" value={type} label={type} checked={selectedCameraTypes.includes(type)} />
        ))}
      </FilterGroup>

      <details className="rounded-lg border border-ink/10 bg-white">
        <summary className="cursor-pointer list-none px-3 py-2 text-sm font-semibold text-ink [&::-webkit-details-marker]:hidden">
          Product type / subcategory
        </summary>
        <div className="grid max-h-72 gap-1 overflow-y-auto border-t border-ink/10 p-2">
          {options.productTypes.map((type) => (
            <Checkbox
              key={type}
              name="productType"
              value={type}
              label={type}
              checked={selectedProductTypes.includes(type)}
            />
          ))}
        </div>
      </details>

      <FilterGroup title="Condition">
        {conditions.map((condition) => (
          <Checkbox
            key={condition}
            name="condition"
            value={condition}
            label={condition}
            checked={selectedConditions.includes(condition)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Functional status">
        {options.functionalStatuses.map((status) => (
          <Checkbox
            key={status}
            name="functionalStatus"
            value={status}
            label={status}
            checked={selectedFunctionalStatuses.includes(status)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Availability">
        {availabilityOptions.map((option) => (
          <Checkbox
            key={option.value}
            name="availability"
            value={option.value}
            label={option.label}
            checked={selectedAvailability.includes(option.value)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Includes / trust">
        {INCLUDE_FILTER_OPTIONS.map((option) => (
          <Checkbox
            key={option.value}
            name="includes"
            value={option.value}
            label={option.label}
            checked={selectedIncludes.includes(option.value)}
          />
        ))}
      </FilterGroup>

      <details className="rounded-lg border border-ink/10 bg-white">
        <summary className="cursor-pointer list-none px-3 py-2 text-sm font-semibold text-ink [&::-webkit-details-marker]:hidden">
          Format, mount, and media
        </summary>
        <div className="grid gap-5 border-t border-ink/10 p-3">
          <CompactCheckboxGroup
            title="Lens mount"
            name="lensMount"
            options={options.lensMounts}
            selected={selectedLensMounts}
          />
          <CompactCheckboxGroup
            title="Film format"
            name="filmFormat"
            options={options.filmFormats}
            selected={selectedFilmFormats}
          />
          <CompactCheckboxGroup
            title="Storage / media"
            name="storageType"
            options={options.storageTypes}
            selected={selectedStorageTypes}
          />
        </div>
      </details>

      <div>
        <p className="text-sm font-semibold text-ink">Price range</p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <input
            id="min-price"
            name="minPrice"
            type="number"
            min="0"
            step="25"
            defaultValue={minPrice}
            placeholder="Min"
            className="min-h-11 w-full rounded-lg border border-ink/15 bg-cream px-3 py-2 text-base text-ink outline-none focus:border-moss sm:text-sm"
          />
          <input
            id="max-price"
            name="maxPrice"
            type="number"
            min="0"
            step="25"
            defaultValue={maxPrice}
            placeholder="Max"
            className="min-h-11 w-full rounded-lg border border-ink/15 bg-cream px-3 py-2 text-base text-ink outline-none focus:border-moss sm:text-sm"
          />
        </div>
      </div>

      <button
        type="submit"
        className="min-h-12 rounded-full bg-forest px-5 py-3 text-sm font-semibold text-white transition hover:bg-moss"
      >
        Apply filters
      </button>
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
      <div className="mt-2 grid gap-1">
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
      <div className="mt-3 grid gap-2">{children}</div>
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
