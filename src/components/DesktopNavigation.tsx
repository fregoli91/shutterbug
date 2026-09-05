'use client';

import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const menus = {
  Cameras: [
    ['All Cameras', '/shop'],
    ['Vintage Digital Cameras', '/categories/vintage-digital-cameras'],
    ['Film Cameras', '/categories/film-cameras'],
    ['Point & Shoot', '/categories/point-and-shoot-cameras'],
    ['DSLR', '/categories/dslr-cameras'],
    ['Mirrorless', '/categories/mirrorless-cameras'],
    ['Instant Cameras', '/categories/instant-cameras'],
    ['Parts & Repair', '/categories/parts-repair']
  ],
  Brands: [
    ['Canon', '/brands/canon'], ['Olympus', '/brands/olympus'],
    ['Sony', '/brands/sony'], ['Nikon', '/brands/nikon'],
    ['Fujifilm', '/brands/fujifilm'], ['Pentax', '/brands/pentax'],
    ['Polaroid', '/brands/polaroid'], ['Kodak', '/brands/kodak'],
    ['View All Brands', '/brands']
  ],
  Accessories: [
    ['Lenses', '/categories/lenses'],
    ['All Accessories', '/categories/camera-accessories'],
    ['Batteries & Chargers', '/categories/batteries-chargers']
  ]
};
type MenuName = keyof typeof menus;
const linkStyle = 'inline-flex min-h-11 items-center gap-1.5 whitespace-nowrap rounded px-3 text-sm font-semibold transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage';

export function DesktopNavigation() {
  const [open, setOpen] = useState<MenuName | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const buttons = useRef<Partial<Record<MenuName, HTMLButtonElement | null>>>({});

  useEffect(() => {
    if (!open) return;
    function dismiss(event: Event) {
      if (event.target instanceof Node && !navRef.current?.contains(event.target)) setOpen(null);
    }
    document.addEventListener('pointerdown', dismiss, true);
    document.addEventListener('focusin', dismiss);
    return () => {
      document.removeEventListener('pointerdown', dismiss, true);
      document.removeEventListener('focusin', dismiss);
    };
  }, [open]);

  function dropdown(name: MenuName) {
    return (
      <div className="relative">
        <button
          ref={(element) => { buttons.current[name] = element; }}
          type="button"
          className={linkStyle}
          aria-expanded={open === name}
          aria-controls={`desktop-menu-${name}`}
          onClick={() => setOpen(open === name ? null : name)}
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown') {
              event.preventDefault();
              setOpen(name);
              requestAnimationFrame(() => document.getElementById(`desktop-menu-${name}`)?.querySelector('a')?.focus());
            }
          }}
        >
          {name === 'Accessories' ? 'Lenses & Accessories' : name}
          <ChevronDown className={`h-3.5 w-3.5 transition-transform motion-reduce:transition-none ${open === name ? 'rotate-180' : ''}`} aria-hidden="true" />
        </button>
        <div
          id={`desktop-menu-${name}`}
          hidden={open !== name}
          className="absolute left-0 top-full z-50 w-[22rem] border border-forest/15 bg-cream p-3 text-ink shadow-lg"
        >
          <p className="px-3 py-2 text-xs font-semibold uppercase text-moss">{name === 'Brands' ? 'Shop by brand' : `Explore ${name.toLowerCase()}`}</p>
          <ul className="grid grid-cols-2 gap-1">
            {menus[name].map(([label, href]) => (
              <li key={href}>
                <Link href={href} onClick={() => setOpen(null)} className="flex min-h-11 items-center rounded px-3 py-2 text-sm hover:bg-mint focus-visible:outline focus-visible:outline-2 focus-visible:outline-moss">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="hidden border-t border-forest bg-forest text-cream lg:block">
      <nav ref={navRef} aria-label="Main shopping navigation" className="mx-auto flex max-w-7xl items-center justify-between gap-1 px-5"
        onKeyDown={(event) => {
          if (event.key === 'Escape' && open) {
            buttons.current[open]?.focus();
            setOpen(null);
          }
        }}>
        {dropdown('Cameras')}
        <Link className={linkStyle} href="/categories/vintage-digital-cameras" onClick={() => setOpen(null)}>Vintage Digital</Link>
        <Link className={linkStyle} href="/categories/film-cameras" onClick={() => setOpen(null)}>Film</Link>
        {dropdown('Brands')}
        {dropdown('Accessories')}
        <Link className={linkStyle} href="/categories/printers" onClick={() => setOpen(null)}>Printers</Link>
        <Link className={linkStyle} href="/sell-your-camera" onClick={() => setOpen(null)}>Sell to Us</Link>
      </nav>
    </div>
  );
}