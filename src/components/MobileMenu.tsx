'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

type MobileMenuItem = {
  href: string;
  label: string;
};

const shopItems: MobileMenuItem[] = [
  { href: '/shop', label: 'Cameras' },
  { href: '/categories/vintage-digital-cameras', label: 'Vintage Digital Cameras' },
  { href: '/categories/film-cameras', label: 'Film Cameras' },
  { href: '/categories/lenses', label: 'Lenses' },
  { href: '/categories/printers', label: 'Printers' },
  { href: '/categories/camera-accessories', label: 'Accessories' }
];

const brandItems: MobileMenuItem[] = [
  { href: '/categories/canon-powershot-cameras', label: 'Canon' },
  { href: '/brands/olympus', label: 'Olympus' },
  { href: '/categories/sony-cyber-shot-cameras', label: 'Sony' },
  { href: '/categories/nikon-coolpix-cameras', label: 'Nikon' },
  { href: '/categories/polaroid-cameras', label: 'Polaroid' },
  { href: '/brands', label: 'View All Brands' }
];

const discoverItems: MobileMenuItem[] = [
  { href: '/shop', label: 'Fresh Camera Finds' },
  { href: '/blog', label: 'Shutterbug Journal' },
  { href: '/guides', label: 'Camera Guides' },
  { href: '/testing-process', label: 'How We Test Cameras' }
];

const animationDuration = 250;

export function MobileMenu({
  accountItems = [],
  signedIn = false,
  customerLabel
}: {
  accountItems?: MobileMenuItem[];
  signedIn?: boolean;
  customerLabel?: string;
}) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open || !mounted) return;
    const timer = window.setTimeout(() => setMounted(false), animationDuration);
    return () => window.clearTimeout(timer);
  }, [mounted, open]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const trigger = triggerRef.current;
    const backgroundElements = Array.from(document.querySelectorAll<HTMLElement>('main, footer'));
    const backgroundState = backgroundElements.map((element) => ({
      element,
      inert: element.inert,
      ariaHidden: element.getAttribute('aria-hidden')
    }));

    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;
    backgroundElements.forEach((element) => {
      element.inert = true;
      element.setAttribute('aria-hidden', 'true');
    });
    const focusTimer = window.setTimeout(() => closeButtonRef.current?.focus(), 0);

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
        return;
      }

      if (event.key !== 'Tab' || !drawerRef.current) return;
      const focusable = Array.from(
        drawerRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
      document.removeEventListener('keydown', handleKeyDown);
      window.clearTimeout(focusTimer);
      backgroundState.forEach(({ element, inert, ariaHidden }) => {
        element.inert = inert;
        if (ariaHidden === null) element.removeAttribute('aria-hidden');
        else element.setAttribute('aria-hidden', ariaHidden);
      });
      trigger?.focus();
    };
  }, [open]);

  function openMenu() {
    setMounted(true);
    window.setTimeout(() => setOpen(true), 0);
  }

  function closeMenu() {
    setOpen(false);
  }

  return (
    <div className="lg:hidden">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-navigation-drawer"
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={open ? closeMenu : openMenu}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-moss/30 bg-mint shadow-[inset_0_1px_0_rgba(255,255,255,0.75),0_2px_5px_rgba(35,43,32,0.12)] transition hover:border-moss/55 hover:bg-sage/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss"
      >
        <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
        <span aria-hidden="true" className="grid w-5 gap-1.5">
          <span className="h-0.5 rounded-full bg-forest" />
          <span className="h-0.5 rounded-full bg-moss" />
          <span className="h-0.5 rounded-full bg-forest" />
        </span>
      </button>

      {mounted ? (
        <div className="fixed inset-0 z-[70] h-[100dvh] max-h-[100dvh] overflow-hidden lg:hidden">
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={closeMenu}
            className={`absolute inset-0 bg-[#142014]/40 backdrop-blur-[1px] transition-opacity duration-[250ms] ease-out ${open ? 'opacity-100' : 'opacity-0'}`}
          />
          <div
            ref={drawerRef}
            id="mobile-navigation-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Shutterbug shop navigation"
            className={`absolute right-0 top-0 flex h-[100dvh] max-h-[100dvh] w-[min(26.25rem,93vw)] flex-col overflow-hidden border-l border-forest/15 bg-cream shadow-[-16px_0_45px_rgba(22,35,29,0.2)] transition-transform duration-[250ms] ease-out ${open ? 'translate-x-0' : 'translate-x-full'}`}
          >
            <div className="sticky top-0 z-10 flex min-h-[76px] shrink-0 items-center justify-between border-b border-forest/15 bg-cream/95 px-4 pb-3 pt-[calc(env(safe-area-inset-top)+0.75rem)]">
              <Link href="/" onClick={closeMenu} aria-label="Shutterbug Camera Shop home">
                <Image
                  src="/shutterbug-header-logo-transparent.png"
                  alt="Shutterbug Camera Shop"
                  width={216}
                  height={48}
                  sizes="9rem"
                  className="h-auto w-36 object-contain object-left"
                />
              </Link>
              <button
                ref={closeButtonRef}
                type="button"
                aria-label="Close menu"
                onClick={closeMenu}
                className="flex h-11 w-11 items-center justify-center rounded-[10px] border border-moss/25 bg-mint/75 text-forest shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_2px_5px_rgba(35,43,32,0.1)] transition hover:border-moss/45 hover:bg-sage/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-[calc(env(safe-area-inset-bottom)+1.5rem)] pt-4">
              <section className="pb-4">
                <p className="text-[13px] font-bold uppercase tracking-[0.17em] text-moss">Account</p>
                {signedIn ? (
                  <>
                    <p className="mt-2 px-2 text-sm font-bold text-ink">{customerLabel ?? 'My Account'}</p>
                    <nav className="mt-1 grid" aria-label="Customer account">
                      {accountItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={closeMenu}
                          className="flex min-h-11 items-center rounded-md px-2 py-2 text-sm font-semibold text-ink/78 transition hover:bg-mint hover:text-ink"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </nav>
                    <form action="/account/logout" method="post" className="mt-1" onSubmit={closeMenu}>
                      <button className="min-h-11 w-full rounded-md px-2 py-2 text-left text-sm font-semibold text-ink/78 transition hover:bg-mint hover:text-ink">Sign Out</button>
                    </form>
                  </>
                ) : (
                  <div className="mt-2 grid grid-cols-2 gap-2.5">
                    <Link href="/login" onClick={closeMenu} className="flex min-h-12 items-center justify-center rounded-lg border border-forest/20 bg-mint px-3 text-sm font-bold text-forest transition hover:bg-sage/35">Sign In</Link>
                    <Link href="/signup" onClick={closeMenu} className="flex min-h-12 items-center justify-center rounded-lg bg-forest px-3 text-sm font-bold text-white shadow-sm transition hover:bg-moss">Create Account</Link>
                  </div>
                )}
              </section>

              <MenuSection title="Shop" items={shopItems} onNavigate={closeMenu} />
              <MenuSection title="Shop by brand" items={brandItems} onNavigate={closeMenu} compact />
              <MenuSection title="Discover" items={discoverItems} onNavigate={closeMenu} />

              <section className="border-t border-forest/15 py-4">
                <p className="text-[13px] font-bold uppercase tracking-[0.17em] text-moss">Sell to us</p>
                <Link
                  href="/sell-your-camera"
                  onClick={closeMenu}
                  className="mt-2 flex min-h-[58px] items-center justify-between rounded-lg border border-moss/20 bg-mint/75 px-3 py-2.5 text-forest shadow-[inset_0_1px_0_rgba(255,255,255,0.75),0_2px_6px_rgba(35,43,32,0.08)] transition hover:border-moss/40 hover:bg-sage/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss"
                >
                  <span>
                    <span className="block text-base font-bold">Sell Your Camera</span>
                    <span className="mt-0.5 block text-sm text-ink/62">We buy used camera gear.</span>
                  </span>
                  <ArrowRightIcon />
                </Link>
              </section>

              <Link
                href="/contact"
                onClick={closeMenu}
                className="flex min-h-[68px] items-center gap-3 rounded-lg border border-forest/15 bg-mint/65 px-3 py-2.5 transition hover:border-moss/35 hover:bg-sage/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss"
              >
                <Image
                  src="/shutterbug-basic-character.png"
                  alt=""
                  width={48}
                  height={48}
                  sizes="3rem"
                  className="h-12 w-12 rounded-full bg-sand object-cover"
                  aria-hidden="true"
                />
                <span>
                  <span className="block text-sm font-bold text-ink">Need help finding a camera?</span>
                  <span className="mt-0.5 block text-xs text-ink/65">Friendly Shutterbug support</span>
                </span>
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function MenuSection({
  title,
  items,
  onNavigate,
  compact = false
}: {
  title: string;
  items: MobileMenuItem[];
  onNavigate: () => void;
  compact?: boolean;
}) {
  return (
    <section className="border-t border-forest/15 py-4 first:border-t-0 first:pt-0">
      <p className="text-[13px] font-bold uppercase tracking-[0.17em] text-moss">{title}</p>
      <nav className={compact ? 'mt-1.5 grid grid-cols-2 gap-x-3' : 'mt-1.5 grid'} aria-label={title}>
        {items.map((item, index) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className="flex min-h-[46px] items-center justify-between rounded-md px-2 py-1.5 text-[17px] font-semibold text-ink/78 transition hover:bg-mint hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss"
          >
            {item.label}
            {compact && index === items.length - 1 ? <ArrowRightIcon /> : null}
          </Link>
        ))}
      </nav>
    </section>
  );
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
