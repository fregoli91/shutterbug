'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Equal, X } from 'lucide-react';
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
  { href: '/categories/camera-accessories', label: 'Accessories' },
  { href: '/categories/parts-repair', label: 'Parts & Repair' }
];

const brandItems: MobileMenuItem[] = [
  { href: '/categories/canon-powershot-cameras', label: 'Canon' },
  { href: '/brands/olympus', label: 'Olympus' },
  { href: '/categories/sony-cyber-shot-cameras', label: 'Sony' },
  { href: '/categories/nikon-coolpix-cameras', label: 'Nikon' },
  { href: '/categories/polaroid-cameras', label: 'Polaroid' },
  { href: '/brands/fujifilm', label: 'Fujifilm' },
  { href: '/brands/pentax', label: 'Pentax' },
  { href: '/brands/kodak', label: 'Kodak' },
  { href: '/brands', label: 'View All Brands' }
];

const discoverItems: MobileMenuItem[] = [
  { href: '/shop?sort=newest', label: 'Fresh Camera Finds' },
  { href: '/blog', label: 'Shutterbug Journal' },
  { href: '/guides', label: 'Camera Guides' },
  { href: '/testing-process', label: 'How We Test' },
  { href: '/buyer-guarantee', label: 'Buyer Guarantee' }
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
  const [panel, setPanel] = useState<'main' | 'brands' | 'discover' | 'account'>('main');
  const panelHeadingRef = useRef<HTMLHeadingElement>(null);
  const panelTriggerRef = useRef<HTMLButtonElement | null>(null);
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

  function openPanel(next: 'brands' | 'discover' | 'account', trigger: HTMLButtonElement) {
    panelTriggerRef.current = trigger;
    setPanel(next);
    window.requestAnimationFrame(() => panelHeadingRef.current?.focus());
  }

  function backToMenu() {
    const panelName = panel;
    setPanel('main');
    window.requestAnimationFrame(() => drawerRef.current?.querySelector<HTMLButtonElement>(`[data-panel-trigger="${panelName}"]`)?.focus());
  }

  function openMenu() {
    setPanel('main');
    setMounted(true);
    window.setTimeout(() => setOpen(true), 0);
  }

  function closeMenu() {
    setOpen(false);
  }

  const secondaryItems = panel === 'brands' ? brandItems : panel === 'discover' ? discoverItems : signedIn ? accountItems : [
    { href: '/login', label: 'Sign in' },
    { href: '/signup', label: 'Create account' }
  ];
  const panelTitle = panel === 'brands' ? 'Brands' : panel === 'discover' ? 'Discover' : 'Your account';
  const primaryLinkClass = 'flex min-h-12 items-center py-2 text-2xl font-semibold leading-tight text-forest transition hover:text-moss focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss';

  return (
    <div className="lg:hidden">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-navigation-drawer"
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={open ? closeMenu : openMenu}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-forest transition hover:bg-forest/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss"
      >
        <Equal aria-hidden="true" className="h-6 w-6" strokeWidth={1.5} />
      </button>

      {mounted ? (
        <div className="fixed inset-0 z-[70] h-[100dvh] overflow-hidden lg:hidden">
          <div
            ref={drawerRef}
            id="mobile-navigation-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Shutterbug shop navigation"
            inert={!open}
            className={`absolute inset-0 flex h-[100dvh] flex-col bg-cream transition-[opacity,transform] duration-[250ms] ease-out motion-reduce:transition-none ${open ? 'translate-y-0 opacity-100' : '-translate-y-3 opacity-0'}`}
          >
            <div className="flex min-h-16 shrink-0 items-center justify-between px-3 pb-2 pt-[calc(env(safe-area-inset-top)+0.5rem)] sm:px-5">
              {panel === 'main' ? (
                <Link href="/" onClick={closeMenu} aria-label="Shutterbug Camera Shop home">
                  <Image src="/shutterbug-header-logo-transparent.png" alt="Shutterbug Camera Shop" width={216} height={48} sizes="8rem" className="h-auto w-32 object-contain object-left" />
                </Link>
              ) : (
                <button type="button" aria-label="Back to main menu" onClick={backToMenu} className="flex h-11 items-center gap-1 rounded-md pr-3 text-sm font-medium text-forest hover:bg-forest/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss">
                  <ChevronLeft aria-hidden="true" size={22} strokeWidth={1.5} /> Menu
                </button>
              )}
              <button ref={closeButtonRef} type="button" aria-label="Close menu" onClick={closeMenu} className="flex h-11 w-11 items-center justify-center rounded-md text-forest hover:bg-forest/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss">
                <X aria-hidden="true" size={22} strokeWidth={1.5} />
              </button>
            </div>

            <div key={panel} className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-7 pb-[calc(env(safe-area-inset-bottom)+1.5rem)] pt-3 sm:px-10">
              <div className="mx-auto max-w-xl">
                {panel === 'main' ? (
                  <>
                    <nav aria-label="Shop" className="grid">
                      {shopItems.slice(0, 3).map((item) => (
                        <Link key={item.href} href={item.href} onClick={closeMenu} className={primaryLinkClass}>{item.label.replace(' Cameras', ' cameras')}</Link>
                      ))}
                      <button type="button" data-panel-trigger="brands" onClick={(event) => openPanel('brands', event.currentTarget)} className={`${primaryLinkClass} justify-between text-left`}>
                        Brands <ChevronRight aria-hidden="true" size={20} strokeWidth={1.5} className="text-moss" />
                      </button>
                      {shopItems.slice(3, 6).map((item) => (
                        <Link key={item.href} href={item.href} onClick={closeMenu} className={primaryLinkClass}>{item.label}</Link>
                      ))}
                      <Link href="/sell-your-camera" onClick={closeMenu} className={primaryLinkClass}>Sell your camera</Link>
                      <button type="button" data-panel-trigger="discover" onClick={(event) => openPanel('discover', event.currentTarget)} className={`${primaryLinkClass} justify-between text-left`}>
                        Discover <ChevronRight aria-hidden="true" size={20} strokeWidth={1.5} className="text-moss" />
                      </button>
                    </nav>
                    <nav aria-label="Account and support" className="mt-6 grid border-t border-forest/10 pt-4 text-sm font-medium text-forest">
                      <button type="button" data-panel-trigger="account" onClick={(event) => openPanel('account', event.currentTarget)} className="flex min-h-11 items-center justify-between text-left hover:text-moss focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss">
                        {signedIn ? 'Your account' : 'Sign in / Create account'} <ChevronRight aria-hidden="true" size={16} />
                      </button>
                      <Link href="/contact" onClick={closeMenu} className="flex min-h-11 items-center hover:text-moss">Contact & support</Link>
                      <Link href="/categories/parts-repair" onClick={closeMenu} className="flex min-h-11 items-center hover:text-moss">Parts & repair</Link>
                    </nav>
                  </>
                ) : (
                  <>
                    <h2 ref={panelHeadingRef} tabIndex={-1} className="mb-5 text-sm font-medium text-moss outline-none">{panelTitle}</h2>
                    {panel === 'account' && signedIn && customerLabel ? <p className="mb-3 break-words text-sm text-ink/65">{customerLabel}</p> : null}
                    <nav aria-label={panelTitle} className="grid">
                      {secondaryItems.map((item) => (
                        <Link key={item.href} href={item.href} onClick={closeMenu} className={primaryLinkClass}>{item.label}</Link>
                      ))}
                    </nav>
                    {panel === 'account' && signedIn ? (
                      <form action="/account/logout" method="post" onSubmit={closeMenu} className="mt-5 border-t border-forest/10 pt-3">
                        <button className="min-h-11 text-sm font-medium text-forest">Sign out</button>
                      </form>
                    ) : null}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}