import Link from 'next/link';
import Image from 'next/image';
import { AccountMenu } from '@/components/AccountMenu';
import { categories, featuredCategorySlugs } from '@/lib/categories';
import { CartLink } from '@/components/cart/CartLink';
import { MobileMenu } from '@/components/MobileMenu';
import { getCustomerSession } from '@/lib/customer-auth';

const desktopCategories = featuredCategorySlugs
  .map((slug) => categories.find((category) => category.slug === slug))
  .filter(Boolean);

const categoryNavLabels: Record<string, string> = {
  'canon-powershot-cameras': 'Canon',
  'nikon-coolpix-cameras': 'Nikon'
};

const searchSuggestions = [
  'Canon PowerShot',
  'Olympus',
  'Nikon Coolpix',
  'Sony Cyber-shot',
  'Kodak EasyShare',
  'Panasonic Lumix',
  'Film Cameras',
  'Printers',
  'Lenses',
  'Battery Chargers',
  'Parts Repair'
];

const mobileQuickLinks = [
  { href: '/shop', label: 'Cameras' },
  { href: '/categories/vintage-digital-cameras', label: 'Vintage Digital' },
  { href: '/categories/film-cameras', label: 'Film' },
  { href: '/categories/lenses', label: 'Lenses' },
  { href: '/brands', label: 'Brands' },
  { href: '/sell-your-camera', label: 'Sell' }
];

export async function Header() {
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

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-cream/95 backdrop-blur">
      <div className="hidden border-b border-ink/10 bg-cream lg:block">
        <div className="mx-auto flex h-8 max-w-7xl items-center justify-between px-8 text-xs text-ink/70">
          <p className="font-medium">Tested vintage cameras | Real photos | Friendly support</p>
          <nav className="flex items-center gap-5">
            <Link href="/sell-your-camera" className="font-semibold text-moss transition hover:text-forest">
              Sell Your Camera
            </Link>
            <Link href="/testing-process" className="transition hover:text-ink">How We Test</Link>
            <Link href="/buyer-guarantee" className="transition hover:text-ink">Buyer Guarantee</Link>
            <Link href="/blog" className="transition hover:text-ink">Journal</Link>
            <Link href="/returns" className="transition hover:text-ink">Returns</Link>
            <Link href="/shipping" className="transition hover:text-ink">Shipping</Link>
            <Link href="/contact" className="font-semibold text-moss transition hover:text-forest">Customer Service</Link>
            {customer ? (
              <Link href="/account/orders" className="transition hover:text-ink">My Orders</Link>
            ) : (
              <Link href="/signup" className="transition hover:text-ink">Sign Up</Link>
            )}
          </nav>
        </div>
      </div>

      <div className="lg:hidden">
        <div className="pt-[env(safe-area-inset-top)]">
          <div className="flex min-h-16 items-center justify-between gap-3 px-3 py-2 sm:px-5">
            <Link href="/" className="flex min-w-0 shrink items-center" aria-label="Shutterbug Camera Shop home">
              <Image
                src="/shutterbug-header-logo-transparent.png"
                alt="Shutterbug Camera Shop"
                width={288}
                height={64}
                priority
                sizes="(min-width: 390px) 10rem, 9.25rem"
                className="h-auto w-[9.25rem] object-contain object-left min-[390px]:w-40"
              />
            </Link>
            <div className="flex shrink-0 items-center gap-2">
              <CartLink compact />
              <MobileMenu
                accountItems={customer ? accountItems : []}
                signedIn={Boolean(customer)}
                customerLabel={accountLabel}
              />
            </div>
          </div>

          <div className="px-3 pb-2 sm:px-5">
            <SearchForm
              id="mobile-header-search"
              placeholder="Search cameras, brands & models"
              variant="mobile"
            />
          </div>

          <nav
            aria-label="Popular shopping destinations"
            className="flex gap-5 overflow-x-auto border-t border-forest/10 px-4 py-2 text-sm font-semibold text-ink/75 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:px-6"
          >
            {mobileQuickLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex min-h-9 shrink-0 items-center border-b-2 border-transparent transition hover:border-moss hover:text-forest"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="mx-auto hidden max-w-7xl items-center gap-5 px-8 py-3 lg:flex">
        <Link href="/" className="flex shrink-0 items-center" aria-label="Shutterbug Camera Shop home">
          <Image
            src="/shutterbug-header-logo-transparent.png"
            alt="Shutterbug Camera Shop"
            width={288}
            height={64}
            priority
            sizes="18rem"
            className="h-16 w-72 object-contain object-left"
          />
        </Link>

        <SearchForm
          id="site-search"
          className="min-w-0 flex-1"
          placeholder="Search Canon PowerShot, Olympus, Nikon Coolpix..."
          variant="desktop"
        />

        <div className="flex items-center gap-2">
          {customer ? (
            <AccountMenu label={accountLabel} email={customer.email} />
          ) : (
            <>
              <Link href="/login" className="rounded-lg border border-ink/10 bg-white px-4 py-2 text-sm font-semibold text-ink shadow-sm transition hover:border-moss/40 hover:text-moss">Login</Link>
              <Link href="/signup" className="rounded-lg border border-ink/10 bg-white px-4 py-2 text-sm font-semibold text-ink shadow-sm transition hover:border-moss/40 hover:text-moss">Sign Up</Link>
            </>
          )}
        </div>

        <Link href="/shop" className="inline-flex rounded-full bg-forest px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-moss">Shop Cameras</Link>
        <CartLink />
      </div>

      <div className="hidden border-t border-ink/10 bg-cream lg:block">
        <nav className="mx-auto flex max-w-7xl items-center gap-7 px-8 py-2 text-sm font-semibold text-ink/78">
          <Link href="/shop" className="transition hover:text-moss">All Cameras</Link>
          {desktopCategories.map((category) => (
            <Link key={category!.slug} href={`/categories/${category!.slug}`} className="transition hover:text-moss">
              {categoryNavLabels[category!.slug] ?? category!.navLabel}
            </Link>
          ))}
          <Link href="/brands/olympus" className="transition hover:text-moss">Olympus</Link>
          <Link href="/testing-process" className="ml-auto text-moss transition hover:text-forest">Tested Gear Promise</Link>
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
  if (variant === 'mobile') {
    return (
      <form action="/shop" className={className} role="search">
        <label htmlFor={id} className="sr-only">Search tested camera inventory</label>
        <div className="relative flex h-12 items-center rounded-lg border border-forest/25 bg-mint shadow-[inset_0_2px_5px_rgba(36,84,58,0.08),0_2px_5px_rgba(35,43,32,0.08)] focus-within:border-moss focus-within:ring-2 focus-within:ring-sage">
          <span aria-hidden="true" className="pointer-events-none absolute left-3 text-xl leading-none text-forest">⌕</span>
          <input
            id={id}
            name="q"
            type="search"
            list={`${id}-suggestions`}
            placeholder={placeholder}
            enterKeyHint="search"
            className="h-full min-w-0 flex-1 bg-transparent pl-10 pr-12 text-sm text-ink outline-none placeholder:text-ink/45 min-[390px]:text-base"
          />
          <SearchSuggestions id={id} />
          <button
            type="submit"
            aria-label="Submit search"
            className="absolute right-1 flex h-10 w-10 items-center justify-center rounded-md text-xl text-forest transition hover:bg-sage focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss"
          >
            <span aria-hidden="true">⌕</span>
          </button>
        </div>
      </form>
    );
  }

  return (
    <form action="/shop" className={className} role="search">
      <label htmlFor={id} className="sr-only">Search tested camera inventory</label>
      <div className="flex h-12 overflow-hidden rounded-lg border border-ink/15 bg-white shadow-sm focus-within:border-moss focus-within:ring-2 focus-within:ring-sage">
        <input
          id={id}
          name="q"
          type="search"
          list={`${id}-suggestions`}
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent px-4 text-sm text-ink outline-none placeholder:text-ink/40"
        />
        <SearchSuggestions id={id} />
        <button type="submit" className="min-w-20 bg-forest px-5 text-sm font-semibold text-white transition hover:bg-moss">Search</button>
      </div>
    </form>
  );
}

function SearchSuggestions({ id }: { id: string }) {
  return (
    <datalist id={`${id}-suggestions`}>
      {searchSuggestions.map((suggestion) => (
        <option key={suggestion} value={suggestion} />
      ))}
    </datalist>
  );
}