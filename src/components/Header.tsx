import Link from 'next/link';
import { AccountMenu } from '@/components/AccountMenu';
import { categories, featuredCategorySlugs } from '@/lib/categories';
import { CartLink } from '@/components/cart/CartLink';
import { MobileMenu } from '@/components/MobileMenu';
import { getCustomerSession } from '@/lib/customer-auth';

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

const searchSuggestions = [
  'Canon PowerShot',
  'Olympus',
  'Nikon Coolpix',
  'Sony Cyber-shot',
  'Kodak EasyShare',
  'Panasonic Lumix',
  'Film Cameras',
  'Lenses',
  'Battery Chargers',
  'Parts Repair'
];

export async function Header() {
  const mobileCategories = desktopCategories.slice(0, 5);
  const customer = await getCustomerSession();
  const accountLabel = customer?.name?.trim() || customer?.email.split('@')[0] || 'My Account';
  const accountItems = [
    { href: '/account', label: 'Account Dashboard' },
    { href: '/account/likes', label: 'Liked Products' },
    { href: '/account/orders', label: 'Purchase History' },
    { href: '/account/track', label: 'Track Orders' },
    { href: '/account/addresses', label: 'Saved Addresses' },
    { href: '/account/payment-methods', label: 'Payment Methods' },
    { href: '/account/settings', label: 'Account Settings' },
    { href: '/contact', label: 'Support / Contact' }
  ];
  const mobileNav = [
    ...primaryNav,
    ...(customer
      ? []
      : [
          { href: '/login', label: 'Login' },
          { href: '/signup', label: 'Sign Up' }
        ]),
    { href: '/returns', label: 'Returns' }
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-cream/95 backdrop-blur">
      <div className="hidden border-b border-ink/10 bg-cream lg:block">
        <div className="mx-auto flex h-8 max-w-7xl items-center justify-between px-8 text-xs text-ink/70">
          <p className="font-medium">Tested vintage cameras | Real photos | Friendly support</p>
          <nav className="flex items-center gap-5">
            <Link href="/sell-your-camera" className="font-semibold text-moss transition hover:text-forest">
              Sell Your Camera
            </Link>
            <Link href="/testing-process" className="transition hover:text-ink">
              How We Test
            </Link>
            <Link href="/returns" className="transition hover:text-ink">
              Returns
            </Link>
            <Link href="/contact" className="font-semibold text-moss transition hover:text-forest">
              Customer Service
            </Link>
            {customer ? (
              <Link href="/account/orders" className="transition hover:text-ink">
                My Orders
              </Link>
            ) : (
              <Link href="/signup" className="transition hover:text-ink">
                Sign Up
              </Link>
            )}
          </nav>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center gap-1.5 px-2 py-2 sm:gap-2 sm:px-4 sm:py-3 lg:gap-5 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center" aria-label="Shutterbug Camera Shop home">
          <img
            src="/shutterbug-header-logo-transparent.png"
            alt="Shutterbug Camera Shop"
            className="h-11 w-28 object-contain object-left min-[430px]:h-12 min-[430px]:w-36 sm:h-14 sm:w-56 lg:h-16 lg:w-72"
          />
        </Link>

        <SearchForm
          id="mobile-header-search"
          className="min-w-0 flex-1 lg:hidden"
          placeholder="Search cameras, lenses..."
          variant="mobile"
        />

        <div className="lg:hidden">
          <CartLink compact />
        </div>

        <SearchForm
          id="site-search"
          className="hidden min-w-0 flex-1 lg:block"
          placeholder="Search Canon PowerShot, Olympus, Nikon Coolpix..."
          variant="desktop"
        />

        <div className="hidden items-center gap-2 lg:flex">
          {customer ? (
            <AccountMenu label={accountLabel} email={customer.email} />
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg border border-ink/10 bg-white px-4 py-2 text-sm font-semibold text-ink shadow-sm transition hover:border-moss/40 hover:text-moss"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="rounded-lg border border-ink/10 bg-white px-4 py-2 text-sm font-semibold text-ink shadow-sm transition hover:border-moss/40 hover:text-moss"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        <Link
          href="/shop"
          className="hidden rounded-full bg-forest px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-moss lg:inline-flex"
        >
          Shop Cameras
        </Link>

        <div className="hidden lg:block">
          <CartLink />
        </div>

        <MobileMenu
          items={mobileNav}
          accountItems={customer ? accountItems : []}
          signedIn={Boolean(customer)}
          customerLabel={accountLabel}
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
          <Link href="/categories/lenses" className="transition hover:text-moss">
            Lenses
          </Link>
          <Link href="/categories/camera-accessories" className="transition hover:text-moss">
            Accessories
          </Link>
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
      : 'flex min-h-11 overflow-hidden rounded-full border border-ink/15 bg-white shadow-sm focus-within:border-moss focus-within:ring-2 focus-within:ring-sage sm:min-h-12';

  const inputClass =
    variant === 'desktop'
      ? 'min-w-0 flex-1 bg-transparent px-4 text-sm text-ink outline-none placeholder:text-ink/40'
      : 'min-w-0 flex-1 bg-transparent px-3 text-sm text-ink outline-none placeholder:text-ink/40 sm:px-4 sm:text-base';

  const buttonClass =
    variant === 'desktop'
      ? 'min-w-20 bg-forest px-5 text-sm font-semibold text-white transition hover:bg-moss'
      : 'min-w-12 bg-forest px-3 text-xs font-semibold text-white transition hover:bg-moss sm:min-w-20 sm:px-5 sm:text-sm';

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
          list={`${id}-suggestions`}
          placeholder={placeholder}
          className={inputClass}
        />
        <datalist id={`${id}-suggestions`}>
          {searchSuggestions.map((suggestion) => (
            <option key={suggestion} value={suggestion} />
          ))}
        </datalist>
        <button
          type="submit"
          className={buttonClass}
        >
          <span className="hidden sm:inline">Search</span>
          <span className="sm:hidden">Go</span>
        </button>
      </div>
    </form>
  );
}
