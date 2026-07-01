import { ProductCard } from '@/components/ProductCard';
import { conditions, getCatalogProducts, getFilterOptions } from '@/lib/products';

export const metadata = {
  title: 'Shop Tested Vintage Cameras',
  description:
    'Shop tested vintage digital cameras, Canon PowerShot cameras, Nikon Coolpix, Sony Cyber-shot, film cameras, accessories, and used camera gear from Shutterbug Camera Shop.'
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

const includeOptions = [
  { value: 'battery', label: 'Includes battery' },
  { value: 'charger', label: 'Includes charger' },
  { value: 'actual-photos', label: 'Actual photos' },
  { value: 'tested', label: 'Tested / checked' },
  { value: 'parts-repair', label: 'Parts / repair' }
];

function asArray(value: string | string[] | undefined) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function asString(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? '' : value ?? '';
}

function HiddenFilterFields({
  query,
  selectedBrands,
  selectedTypes,
  selectedConditions,
  selectedAvailability,
  selectedIncludes,
  maxPrice
}: {
  query: string;
  selectedBrands: string[];
  selectedTypes: string[];
  selectedConditions: string[];
  selectedAvailability: string[];
  selectedIncludes: string[];
  maxPrice: string;
}) {
  return (
    <>
      <input type="hidden" name="q" value={query} />
      {selectedBrands.map((brand) => (
        <input key={`brand-${brand}`} type="hidden" name="brand" value={brand} />
      ))}
      {selectedTypes.map((type) => (
        <input key={`type-${type}`} type="hidden" name="type" value={type} />
      ))}
      {selectedConditions.map((condition) => (
        <input key={`condition-${condition}`} type="hidden" name="condition" value={condition} />
      ))}
      {selectedAvailability.map((availability) => (
        <input key={`availability-${availability}`} type="hidden" name="availability" value={availability} />
      ))}
      {selectedIncludes.map((include) => (
        <input key={`includes-${include}`} type="hidden" name="includes" value={include} />
      ))}
      {maxPrice ? <input type="hidden" name="maxPrice" value={maxPrice} /> : null}
    </>
  );
}

export default async function ShopPage({ searchParams }: Props) {
  const params = searchParams ? await searchParams : {};
  const query = asString(params.q).trim();
  const sort = asString(params.sort) || 'featured';
  const selectedBrands = asArray(params.brand);
  const selectedTypes = asArray(params.type);
  const selectedConditions = asArray(params.condition);
  const selectedAvailability = asArray(params.availability);
  const selectedIncludes = asArray(params.includes);
  const maxPrice = asString(params.maxPrice);
  const normalizedQuery = query.toLowerCase();
  const catalogProducts = await getCatalogProducts();
  const filterOptions = getFilterOptions(catalogProducts);

  const filteredProducts = catalogProducts.filter((product) => {
    const searchable = [
      product.title,
      product.brand,
      product.model,
      product.sku,
      product.condition,
      product.cameraType,
      product.format,
      product.shortDescription,
      product.seoDescription,
      ...product.badges,
      ...product.goodFor,
      ...product.included,
      ...product.tested,
      ...product.notes,
      ...product.cosmeticNotes,
      ...product.functionalNotes,
      ...product.flaws
    ]
      .join(' ')
      .toLowerCase();

    const matchesQuery = normalizedQuery ? searchable.includes(normalizedQuery) : true;
    const matchesBrand = selectedBrands.length ? selectedBrands.includes(product.brand) : true;
    const matchesType = selectedTypes.length ? selectedTypes.includes(product.cameraType) : true;
    const matchesCondition = selectedConditions.length ? selectedConditions.includes(product.condition) : true;
    const matchesAvailability = selectedAvailability.length ? selectedAvailability.includes(product.status) : true;
    const matchesPrice = maxPrice ? product.price <= Number(maxPrice) : true;
    const matchesIncludes =
      (selectedIncludes.includes('battery') ? product.includesBattery : true) &&
      (selectedIncludes.includes('charger') ? product.includesCharger : true) &&
      (selectedIncludes.includes('actual-photos') ? product.actualPhotos : true) &&
      (selectedIncludes.includes('tested') ? product.tested.length > 0 && product.tested[0] !== 'Testing pending' : true) &&
      (selectedIncludes.includes('parts-repair') ? product.partsRepair || product.condition === 'For Parts' : true);

    return (
      matchesQuery &&
      matchesBrand &&
      matchesType &&
      matchesCondition &&
      matchesAvailability &&
      matchesPrice &&
      matchesIncludes
    );
  });

  const visibleProducts = [...filteredProducts].sort((a, b) => {
    if (sort === 'price-asc') return a.price - b.price;
    if (sort === 'price-desc') return b.price - a.price;
    if (sort === 'condition') return conditions.indexOf(a.condition) - conditions.indexOf(b.condition);
    return 0;
  });

  const hasActiveFilters =
    query ||
    selectedBrands.length ||
    selectedTypes.length ||
    selectedConditions.length ||
    selectedAvailability.length ||
    selectedIncludes.length ||
    maxPrice;
  const activeFilterCount =
    selectedBrands.length +
    selectedTypes.length +
    selectedConditions.length +
    selectedAvailability.length +
    selectedIncludes.length +
    (maxPrice ? 1 : 0);

  return (
    <section className="px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[1fr_24rem] lg:items-end">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-moss">Shop cameras</p>
            <h1 className="mt-3 font-serif text-4xl font-bold text-ink sm:text-5xl">Shop Tested Vintage Cameras</h1>
            <p className="mt-4 text-base leading-7 text-ink/70 sm:mt-5 sm:text-lg sm:leading-8">
              Search used digital cameras, Canon PowerShot, Olympus, Nikon Coolpix, Sony Cyber-shot, film cameras,
              accessories, and clearly marked parts/repair gear.
            </p>
          </div>

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
                placeholder="Canon, Olympus, Coolpix..."
                className="min-w-0 flex-1 bg-transparent px-4 text-base text-ink outline-none placeholder:text-ink/40 sm:text-sm"
              />
              <button type="submit" className="bg-forest px-5 text-sm font-semibold text-white transition hover:bg-moss">
                Search
              </button>
            </div>
          </form>
        </div>

        <div className="mt-6 grid gap-4 rounded-lg border border-ink/10 bg-white px-4 py-4 shadow-sm sm:mt-8 sm:flex sm:flex-wrap sm:items-center sm:justify-between sm:px-5">
          <div>
            <p className="text-sm font-semibold text-ink">
              {visibleProducts.length} camera{visibleProducts.length === 1 ? '' : 's'} found
            </p>
            <p className="mt-1 text-sm text-ink/60">
              {query ? (
                <>
                  Search results for <span className="font-semibold text-ink">&ldquo;{query}&rdquo;</span>
                </>
              ) : (
                'Browse tested used camera inventory and coming-soon model pages.'
              )}
            </p>
          </div>
          <form action="/shop" className="flex flex-wrap items-center gap-2 sm:gap-3">
            <HiddenFilterFields
              query={query}
              selectedBrands={selectedBrands}
              selectedTypes={selectedTypes}
              selectedConditions={selectedConditions}
              selectedAvailability={selectedAvailability}
              selectedIncludes={selectedIncludes}
              maxPrice={maxPrice}
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
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="condition">Best condition</option>
            </select>
            <button type="submit" className="min-h-11 rounded-full bg-forest px-4 py-2 text-sm font-semibold text-white">
              Apply
            </button>
          </form>
        </div>

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
              brands={filterOptions.brands}
              cameraTypes={filterOptions.cameraTypes}
              selectedBrands={selectedBrands}
              selectedTypes={selectedTypes}
              selectedConditions={selectedConditions}
              selectedAvailability={selectedAvailability}
              selectedIncludes={selectedIncludes}
              maxPrice={maxPrice}
            />
          </div>
        </details>

        <div className="mt-8 grid gap-8 lg:grid-cols-[17rem_1fr]">
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
                brands={filterOptions.brands}
                cameraTypes={filterOptions.cameraTypes}
                selectedBrands={selectedBrands}
                selectedTypes={selectedTypes}
                selectedConditions={selectedConditions}
                selectedAvailability={selectedAvailability}
                selectedIncludes={selectedIncludes}
                maxPrice={maxPrice}
              />
            </div>
          </aside>

          <div className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-3">
            {visibleProducts.length > 0 ? (
              visibleProducts.map((product) => <ProductCard key={product.id} product={product} />)
            ) : (
              <div className="col-span-2 rounded-lg border border-ink/10 bg-white p-8 text-ink/70 xl:col-span-3">
                <p className="font-serif text-2xl font-bold text-ink">No matching cameras yet</p>
                <p className="mt-3 leading-7">
                  Try a broader brand, model family, or camera type. You can also contact Shutterbug and we can help
                  source a Canon PowerShot, Nikon Coolpix, Sony Cyber-shot, or another vintage digital camera.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function FilterForm({
  query,
  sort,
  brands,
  cameraTypes,
  selectedBrands,
  selectedTypes,
  selectedConditions,
  selectedAvailability,
  selectedIncludes,
  maxPrice
}: {
  query: string;
  sort: string;
  brands: string[];
  cameraTypes: string[];
  selectedBrands: string[];
  selectedTypes: string[];
  selectedConditions: string[];
  selectedAvailability: string[];
  selectedIncludes: string[];
  maxPrice: string;
}) {
  return (
    <form action="/shop" className="mt-5 grid gap-6">
      <input type="hidden" name="q" value={query} />
      <input type="hidden" name="sort" value={sort} />
      <FilterGroup title="Brand">
        {brands.map((brand) => (
          <Checkbox key={brand} name="brand" value={brand} label={brand} checked={selectedBrands.includes(brand)} />
        ))}
      </FilterGroup>
      <FilterGroup title="Camera Type">
        {cameraTypes.map((type) => (
          <Checkbox key={type} name="type" value={type} label={type} checked={selectedTypes.includes(type)} />
        ))}
      </FilterGroup>
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
      <FilterGroup title="Includes / Trust">
        {includeOptions.map((option) => (
          <Checkbox
            key={option.value}
            name="includes"
            value={option.value}
            label={option.label}
            checked={selectedIncludes.includes(option.value)}
          />
        ))}
      </FilterGroup>
      <div>
        <label htmlFor="max-price" className="text-sm font-semibold text-ink">
          Max price
        </label>
        <input
          id="max-price"
          name="maxPrice"
          type="number"
          min="0"
          step="25"
          defaultValue={maxPrice}
          placeholder="500"
          className="mt-2 min-h-11 w-full rounded-lg border border-ink/15 bg-cream px-3 py-2 text-base text-ink outline-none focus:border-moss sm:text-sm"
        />
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
        className="h-5 w-5 rounded border-ink/20 accent-[#24543a]"
      />
      {label}
    </label>
  );
}
