import Link from 'next/link';
import { categories, featuredCategorySlugs } from '@/lib/categories';
import { CartLink } from '@/components/cart/CartLink';

const primaryNav = [
  { href: '/shop', label: 'Shop Cameras' },
  { href: '/categories/vintage-digital-cameras', label: 'Categories' },
  { href: '/sell-your-camera', label: 'Sell Your Camera' },
  { href: '/testing-process', label: 'Testing Process' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' }
];

const desktopCategories = featuredCategorySlugs
  .map((slug) => categories.find((category) => category.slug === slug))
  .filter(Boolean);

export function Header() {
  const mobileCategories = desktopCategories.slice(0, 5);

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-cream/95 backdrop-blur">
      <div className="hidden border-b border-ink/10 bg-cream lg:block">
        <div className="mx-auto flex h-8 max-w-7xl items-center justify-between px-8 text-xs text-ink/70">
          <p className="font-medium">Tested vintage cameras, electronics, and friendly support.</p>
          <nav className="flex items-center gap-5">
            <Link href="/testing-process" className="transition hover:text-ink">
              How We Test
            </Link>
            <Link href="/returns" className="transition hover:text-ink">
              Returns
            </Link>
            <Link href="/contact" className="font-semibold text-moss transition hover:text-forest">
              Customer Service
            </Link>
          </nav>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6 sm:py-3 lg:gap-5 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center" aria-label="Shutterbug Camera Shop home">
          <img
            src="/shutterbug-header-logo-transparent.png"
            alt="Shutterbug Camera Shop"
            className="h-11 w-48 object-contain object-left sm:h-14 sm:w-64"
          />
        </Link>

        <SearchForm
          id="site-search"
          className="hidden min-w-0 flex-1 lg:block"
          placeholder="Search Canon PowerShot, Olympus, Nikon Coolpix..."
          variant="desktop"
        />

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/contact"
            className="rounded-lg border border-ink/10 bg-white px-4 py-2 text-sm leading-tight shadow-sm transition hover:border-moss/40"
          >
            <span className="block text-xs font-bold uppercase tracking-[0.16em] text-moss">Ask an expert</span>
            <span className="block font-semibold text-ink">Customer service</span>
          </Link>
          <Link
            href="/sell-your-camera"
            className="rounded-lg border border-ink/10 bg-white px-4 py-2 text-sm leading-tight shadow-sm transition hover:border-moss/40"
          >
            <span className="block text-xs font-bold uppercase tracking-[0.16em] text-moss">Trade in</span>
            <span className="block font-semibold text-ink">Sell your camera</span>
          </Link>
        </div>

        <Link
          href="/shop"
          className="hidden rounded-full bg-forest px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-moss sm:inline-flex"
        >
          Shop Cameras
        </Link>

        <div className="hidden sm:block">
          <CartLink />
        </div>

        <details className="relative lg:hidden">
          <summary className="flex min-h-12 cursor-pointer list-none items-center justify-center rounded-full border border-ink/15 bg-white px-4 py-2.5 text-sm font-semibold text-ink shadow-sm transition hover:border-moss/40 [&::-webkit-details-marker]:hidden">
            Menu
          </summary>
          <div className="absolute right-0 top-14 z-50 w-[min(22rem,calc(100vw-2rem))] rounded-lg border border-ink/10 bg-white p-4 shadow-soft">
            <div className="mb-3 flex items-center gap-3 border-b border-ink/10 pb-3">
              <img src="/shutterbug-mascot-front.png" alt="" className="h-12 w-12 rounded-full bg-sand object-cover" />
              <div>
                <p className="text-sm font-bold text-ink">Shutterbug</p>
                <p className="text-xs text-ink/60">Tested used camera gear</p>
              </div>
            </div>
            <nav className="grid gap-1 text-sm font-semibold text-ink/78">
              {primaryNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="min-h-11 rounded-md px-3 py-3 transition hover:bg-mint hover:text-ink"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-3 border-t border-ink/10 pt-3 sm:hidden">
              <CartLink />
            </div>
          </div>
        </details>
      </div>

      <div className="border-t border-ink/10 px-4 pb-3 sm:px-6 lg:hidden">
        <SearchForm
          id="mobile-header-search"
          placeholder="Search Canon, Nikon, Sony..."
          variant="mobile"
        />
      </div>

      <div className="border-t border-ink/10 bg-cream lg:hidden">
        <nav className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-2 text-sm font-semibold text-ink/75 sm:px-6">
          <Link href="/shop" className="flex min-h-10 shrink-0 items-center rounded-full bg-forest px-4 text-white">
            All cameras
          </Link>
          {mobileCategories.map((category) => (
            <Link
              key={category!.slug}
              href={`/categories/${category!.slug}`}
              className="flex min-h-10 shrink-0 items-center rounded-full border border-ink/10 bg-white px-4 shadow-sm transition hover:border-moss/40 hover:text-moss"
            >
              {category!.navLabel}
            </Link>
          ))}
        </nav>
      </div>

      <div className="hidden border-t border-ink/10 bg-cream lg:block">
        <nav className="mx-auto flex max-w-7xl items-center gap-7 px-8 py-2 text-sm font-semibold text-ink/78">
          <Link href="/shop" className="transition hover:text-moss">
            All Cameras
          </Link>
          {desktopCategories.map((category) => (
            <Link key={category!.slug} href={`/categories/${category!.slug}`} className="transition hover:text-moss">
              {category!.navLabel}
            </Link>
          ))}
          <Link href="/testing-process" className="ml-auto text-moss transition hover:text-forest">
            Tested Gear Promise
          </Link>
        </nav>
      </div>
    </header>
  );
}

function SearchForm({
  id,
  className,
  placeholder,
  variant
}: {
  id: string;
  className?: string;
  placeholder: string;
  variant: 'desktop' | 'mobile';
}) {
  const shellClass =
    variant === 'desktop'
      ? 'flex h-12 overflow-hidden rounded-lg border border-ink/15 bg-white shadow-sm focus-within:border-moss focus-within:ring-2 focus-within:ring-sage'
      : 'flex min-h-12 overflow-hidden rounded-full border border-ink/15 bg-white shadow-sm focus-within:border-moss focus-within:ring-2 focus-within:ring-sage';

  return (
    <form action="/shop" className={className}>
      <label htmlFor={id} className="sr-only">
        Search tested camera inventory
      </label>
      <div className={shellClass}>
        <input
          id={id}
          name="q"
          type="search"
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent px-4 text-base text-ink outline-none placeholder:text-ink/40 lg:text-sm"
        />
        <button
          type="submit"
          className="min-w-20 bg-forest px-4 text-sm font-semibold text-white transition hover:bg-moss sm:px-5"
        >
          Search
        </button>
      </div>
    </form>
  );
}
