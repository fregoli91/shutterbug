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

export function MobileMenu({
  accountItems = [],
  signedIn = false,
  customerLabel
}: {
  accountItems?: MobileMenuItem[];
  signedIn?: boolean;
  customerLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const trigger = triggerRef.current;
    document.body.style.overflow = 'hidden';
    const focusFrame = window.requestAnimationFrame(() => closeButtonRef.current?.focus());

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
      document.removeEventListener('keydown', handleKeyDown);
      window.cancelAnimationFrame(focusFrame);
      trigger?.focus();
    };
  }, [open]);

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
        onClick={() => setOpen((current) => !current)}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-moss/30 bg-mint shadow-[inset_0_1px_0_rgba(255,255,255,0.75),0_2px_5px_rgba(35,43,32,0.12)] transition hover:border-moss/55 hover:bg-sage/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss"
      >
        <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
        <span aria-hidden="true" className="grid w-5 gap-1.5">
          <span className="h-0.5 rounded-full bg-forest" />
          <span className="h-0.5 rounded-full bg-moss" />
          <span className="h-0.5 rounded-full bg-forest" />
        </span>
      </button>

      {open ? (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={closeMenu}
            className="absolute inset-0 bg-ink/35 backdrop-blur-[1px]"
          />
          <div
            ref={drawerRef}
            id="mobile-navigation-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Shutterbug shop navigation"
            className="absolute right-0 top-0 flex h-[100dvh] w-[min(23rem,92vw)] flex-col overflow-hidden border-l border-forest/15 bg-cream shadow-[-18px_0_60px_rgba(22,35,29,0.22)]"
          >
            <div className="flex items-center justify-between border-b border-forest/15 px-5 pb-4 pt-[max(1rem,env(safe-area-inset-top))]">
              <Link href="/" onClick={closeMenu} aria-label="Shutterbug Camera Shop home">
                <Image
                  src="/shutterbug-header-logo-transparent.png"
                  alt="Shutterbug Camera Shop"
                  width={216}
                  height={48}
                  sizes="10rem"
                  className="h-auto w-40 object-contain object-left"
                />
              </Link>
              <button
                ref={closeButtonRef}
                type="button"
                aria-label="Close menu"
                onClick={closeMenu}
                className="flex h-11 w-11 items-center justify-center rounded-lg border border-forest/15 bg-sand/70 text-2xl leading-none text-forest shadow-sm transition hover:bg-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss"
              >
                <span aria-hidden="true">X</span>
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5">
              <MenuSection title="Shop" items={shopItems} onNavigate={closeMenu} />
              <MenuSection title="Shop by brand" items={brandItems} onNavigate={closeMenu} compact />
              <MenuSection title="Discover" items={discoverItems} onNavigate={closeMenu} />

              <section className="border-t border-forest/15 py-5">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-moss">Sell to us</p>
                <Link
                  href="/sell-your-camera"
                  onClick={closeMenu}
                  className="mt-2 flex min-h-11 items-center justify-between rounded-md px-2 py-2.5 font-semibold text-ink transition hover:bg-mint"
                >
                  Sell Your Camera <span aria-hidden="true">-&gt;</span>
                </Link>
              </section>

              <section className="border-t border-forest/15 py-5">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-moss">Account</p>
                {signedIn ? (
                  <>
                    <p className="mt-3 px-2 text-sm font-bold text-ink">{customerLabel ?? 'My Account'}</p>
                    <nav className="mt-1 grid" aria-label="Customer account">
                      {accountItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={closeMenu}
                          className="flex min-h-11 items-center rounded-md px-2 py-2.5 text-sm font-semibold text-ink/78 transition hover:bg-mint hover:text-ink"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </nav>
                    <form action="/account/logout" method="post" className="mt-1" onSubmit={closeMenu}>
                      <button className="min-h-11 w-full rounded-md px-2 py-2.5 text-left text-sm font-semibold text-ink/78 transition hover:bg-mint hover:text-ink">Sign Out</button>
                    </form>
                  </>
                ) : (
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <Link href="/login" onClick={closeMenu} className="flex min-h-11 items-center justify-center rounded-lg border border-forest/20 bg-mint px-3 text-sm font-bold text-forest">Sign In</Link>
                    <Link href="/signup" onClick={closeMenu} className="flex min-h-11 items-center justify-center rounded-lg bg-forest px-3 text-sm font-bold text-white">Create Account</Link>
                  </div>
                )}
              </section>

              <Link
                href="/contact"
                onClick={closeMenu}
                className="mb-[max(1rem,env(safe-area-inset-bottom))] flex items-center gap-3 rounded-lg border border-forest/15 bg-mint p-3"
              >
                <Image
                  src="/shutterbug-basic-character.png"
                  alt=""
                  width={52}
                  height={52}
                  sizes="3.25rem"
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
    <section className="border-t border-forest/15 py-5 first:border-t-0 first:pt-0">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-moss">{title}</p>
      <nav className={compact ? 'mt-2 grid grid-cols-2 gap-x-4' : 'mt-2 grid'} aria-label={title}>
        {items.map((item, index) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className="flex min-h-11 items-center justify-between rounded-md px-2 py-2.5 text-sm font-semibold text-ink/78 transition hover:bg-mint hover:text-ink"
          >
            {item.label}
            {compact && index === items.length - 1 ? <span aria-hidden="true">-&gt;</span> : null}
          </Link>
        ))}
      </nav>
    </section>
  );
}