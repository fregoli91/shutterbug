import Link from 'next/link';
import Image from 'next/image';
import { Search } from 'lucide-react';
import { DesktopNavigation } from '@/components/DesktopNavigation';
import { CartLink } from '@/components/cart/CartLink';
import { BagPanel, BagPanelProvider } from '@/components/cart/BagPanel';
import { MobileHeader } from '@/components/MobileHeader';
import { getCustomerSession } from '@/lib/customer-auth';

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

export async function Header() {
  const customer = await getCustomerSession();
  const accountLabel = customer?.name?.trim() || customer?.email.split('@')[0] || 'My Account';
  const accountItems = [
    { href: '/account', label: 'Account Dashboard' },
    { href: '/account/likes', label: 'Liked Products' },
    { href: '/account/orders', label: 'Purchase History' },
    { href: '/account/trade-ins', label: 'My Trade-Ins' },
    { href: '/account/track', label: 'Track Orders' },
    { href: '/account/addresses', label: 'Saved Addresses' },
    { href: '/account/payment-methods', label: 'Payment Methods' },
    { href: '/account/settings', label: 'Account Settings' },
    { href: '/contact', label: 'Support / Contact' }
  ];

  return (
    <BagPanelProvider>
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
            <Link href="/blog" className="hidden transition hover:text-ink xl:inline-flex">Journal</Link>
            <Link href="/returns" className="hidden transition hover:text-ink xl:inline-flex">Returns</Link>
            <Link href="/shipping" className="hidden transition hover:text-ink xl:inline-flex">Shipping</Link>
            <Link href="/contact" className="font-semibold text-moss transition hover:text-forest">Customer Service</Link>
            <span aria-hidden="true" className="h-4 border-l border-ink/20" />
            {customer ? (
              <Link href="/account" className="font-semibold text-forest transition hover:text-moss">My Account</Link>
            ) : (
              <>
                <Link href="/login" className="font-semibold text-forest transition hover:text-moss">Log In</Link>
                <Link href="/signup" className="rounded-full bg-forest px-3 py-1 font-semibold text-white transition hover:bg-moss">Sign Up</Link>
              </>
            )}
          </nav>
        </div>
      </div>

      <MobileHeader
        accountItems={customer ? accountItems : []}
        signedIn={Boolean(customer)}
        customerLabel={accountLabel}
      />

      <div className="mx-auto hidden max-w-7xl items-center gap-5 px-8 py-3 lg:flex">
        <Link href="/" className="flex shrink-0 items-center" aria-label="Shutterbug Camera Shop home">
          <Image
            src="/shutterbug-header-logo-transparent.png"
            alt="Shutterbug Camera Shop"
            width={288}
            height={64}
            priority
            sizes="15rem"
            className="h-14 w-60 object-contain object-center"
          />
        </Link>

        <SearchForm
          id="site-search"
          className="min-w-0 flex-1"
          placeholder="Search cameras, brands & models"
          variant="desktop"
        />

        <Link
          href="/shop"
          aria-label="Shop cameras"
          className="group inline-flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-ink/10 bg-white shadow-sm transition hover:border-moss/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss focus-visible:ring-offset-2"
        >
          <Image
            src="/homepage-shop-camera-button.png"
            alt=""
            width={56}
            height={56}
            sizes="3.5rem"
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        </Link>
        <CartLink />
      </div>

      <DesktopNavigation />
      <BagPanel signedIn={Boolean(customer)} customerLabel={accountLabel} />
    </header>
    </BagPanelProvider>
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
        <button
          type="submit"
          aria-label="Submit search"
          className="flex min-w-14 items-center justify-center bg-forest px-4 text-white transition hover:bg-moss focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sage"
        >
          <Search className="h-5 w-5" aria-hidden="true" />
        </button>
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