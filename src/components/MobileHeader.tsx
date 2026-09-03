'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { CartLink } from '@/components/cart/CartLink';
import { MobileMenu } from '@/components/MobileMenu';

type MobileHeaderItem = {
  href: string;
  label: string;
};

const quickLinks: MobileHeaderItem[] = [
  { href: '/shop', label: 'Cameras' },
  { href: '/shop?sort=newest', label: 'New Arrivals' },
  { href: '/categories/vintage-digital-cameras', label: 'Vintage Digital' },
  { href: '/categories/film-cameras', label: 'Film' },
  { href: '/categories/lenses', label: 'Lenses' },
  { href: '/brands/canon', label: 'Canon' },
  { href: '/brands/nikon', label: 'Nikon' },
  { href: '/brands/olympus', label: 'Olympus' },
  { href: '/brands', label: 'All Brands' },
  { href: '/blog', label: 'Journal' },
  { href: '/sell-your-camera', label: 'Sell or Trade' }
];

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

const transactionalPrefixes = ['/login', '/signup', '/cart', '/checkout', '/account', '/orders'];

export function MobileHeader({
  accountItems,
  signedIn,
  customerLabel
}: {
  accountItems: MobileHeaderItem[];
  signedIn: boolean;
  customerLabel: string;
}) {
  const pathname = usePathname();
  const transactional = transactionalPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const scrolledRef = useRef(false);
  const compact = transactional || scrolled;

  useEffect(() => {
    let frame = 0;

    function update() {
      frame = 0;
      const nextScrolled = scrolledRef.current ? window.scrollY > 8 : window.scrollY > 192;

      if (nextScrolled !== scrolledRef.current) {
        scrolledRef.current = nextScrolled;
        setScrolled(nextScrolled);
      }
    }

    function handleScroll() {
      if (!frame) frame = window.requestAnimationFrame(update);
    }

    update();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const showSearchRow = !compact || searchOpen;
  const showCategoryRow = !compact && !transactional;

  return (
    <div className="pt-[env(safe-area-inset-top)] lg:hidden">
      <div
        className={`flex items-center justify-between gap-2 px-3 transition-[height,padding] duration-200 ease-out sm:px-5 ${
          compact ? 'h-14 py-1.5' : 'h-[72px] py-2'
        }`}
      >
        <Link href="/" className="flex min-w-0 shrink items-center" aria-label="Shutterbug Camera Shop home">
          <Image
            src="/shutterbug-header-logo-transparent.png"
            alt="Shutterbug Camera Shop"
            width={288}
            height={64}
            priority
            sizes={compact ? '7.5rem' : '(min-width: 390px) 9rem, 8rem'}
            className={`h-auto object-contain object-left transition-[width] duration-200 ease-out ${
              compact ? 'w-[7.5rem]' : 'w-32 min-[390px]:w-36'
            }`}
          />
        </Link>

        <div className="flex shrink-0 items-center gap-1.5">
          {compact ? (
            <button
              type="button"
              aria-label={searchOpen ? 'Close search' : 'Open search'}
              aria-expanded={searchOpen}
              onClick={() => setSearchOpen((current) => !current)}
              className="flex h-11 w-11 items-center justify-center rounded-lg border border-forest/15 bg-cream text-forest transition hover:border-moss/45 hover:bg-mint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss"
            >
              <SearchIcon />
            </button>
          ) : null}
          <CartLink compact />
          <MobileMenu accountItems={accountItems} signedIn={signedIn} customerLabel={customerLabel} />
        </div>
      </div>

      <div
        className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out ${
          showSearchRow ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-3 pb-2 sm:px-5">
            <form action="/shop" role="search">
              <label htmlFor="mobile-header-search" className="sr-only">
                Search tested camera inventory
              </label>
              <div className="relative flex h-12 items-center rounded-lg border border-forest/25 bg-mint shadow-[inset_0_2px_5px_rgba(36,84,58,0.08),0_2px_5px_rgba(35,43,32,0.08)] focus-within:border-moss focus-within:ring-2 focus-within:ring-sage">
                <input
                  id="mobile-header-search"
                  name="q"
                  type="search"
                  list="mobile-header-search-suggestions"
                  placeholder="Search cameras, brands & models"
                  enterKeyHint="search"
                  className="h-full min-w-0 flex-1 bg-transparent pl-4 pr-12 text-sm text-ink outline-none placeholder:text-ink/45 min-[390px]:text-base"
                />
                <datalist id="mobile-header-search-suggestions">
                  {searchSuggestions.map((suggestion) => (
                    <option key={suggestion} value={suggestion} />
                  ))}
                </datalist>
                <button
                  type="submit"
                  aria-label="Submit search"
                  className="absolute right-1 flex h-10 w-10 items-center justify-center rounded-md text-forest transition hover:bg-sage focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss"
                >
                  <SearchIcon className="h-5 w-5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div
        className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out ${
          showCategoryRow ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="min-w-0 overflow-hidden">
          <div className="relative min-w-0 border-y border-forest bg-forest shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            <nav
              aria-label="Popular shopping destinations"
              className="h-12 w-full min-w-0 touch-pan-x overflow-x-scroll overscroll-x-contain text-[0.82rem] font-semibold text-cream/90 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              style={{ touchAction: 'pan-x' }}
            >
              <div className="flex h-full w-max min-w-full gap-5 px-4 sm:px-6">
                {quickLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex min-h-11 shrink-0 items-center whitespace-nowrap border-b-2 border-transparent transition hover:border-sage hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sage"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </nav>
            <span className="pointer-events-none absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-forest to-transparent" />
            <span className="pointer-events-none absolute inset-y-0 right-0 w-7 bg-gradient-to-l from-forest to-transparent" />
          </div>
        </div>
      </div>
    </div>
  );
}

function SearchIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={`${className} fill-none`}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </svg>
  );
}
