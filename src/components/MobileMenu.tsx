'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

type MobileMenuItem = {
  href: string;
  label: string;
};

export function MobileMenu({
  items,
  accountItems = [],
  signedIn = false,
  customerLabel
}: {
  items: MobileMenuItem[];
  accountItems?: MobileMenuItem[];
  signedIn?: boolean;
  customerLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent | TouchEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const triggerClass = signedIn
    ? 'flex h-11 max-w-[8rem] shrink-0 items-center gap-1.5 rounded-full border border-ink/15 bg-white px-1.5 pr-3 text-ink shadow-sm transition hover:border-moss/40 sm:h-12 sm:max-w-[10rem]'
    : 'flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-ink/15 bg-white p-0.5 text-ink shadow-sm transition hover:border-moss/40 sm:h-12 sm:w-12';

  return (
    <div ref={menuRef} className="relative lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={() => setOpen((current) => !current)}
        className={triggerClass}
      >
        <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
        {signedIn ? (
          <>
            <img
              src="/shutterbug-app-icon.png"
              alt=""
              className="h-8 w-8 rounded-full object-cover sm:h-9 sm:w-9"
              aria-hidden="true"
            />
            <span className="min-w-0 truncate text-xs font-bold sm:text-sm">{customerLabel ?? 'Account'}</span>
          </>
        ) : (
          <img
            src="/shutterbug-menu-icon.png"
            alt=""
            className="h-full w-full rounded-full object-cover"
            aria-hidden="true"
          />
        )}
      </button>

      {open ? (
        <div className="absolute right-0 top-14 z-50 w-[min(22rem,calc(100vw-1.5rem))] rounded-lg border border-ink/10 bg-white p-4 shadow-soft">
          <div className="mb-3 flex items-center gap-3 border-b border-ink/10 pb-3">
            <img src="/shutterbug-basic-character.png" alt="" className="h-12 w-12 rounded-full bg-sand object-cover" />
            <div>
              <p className="text-sm font-bold text-ink">{signedIn ? customerLabel ?? 'My Account' : 'Shutterbug'}</p>
              <p className="text-xs text-ink/60">
                {signedIn ? 'Orders, tracking, settings' : 'Tested used camera gear'}
              </p>
            </div>
          </div>
          <nav className="grid gap-1 text-sm font-semibold text-ink/78">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="min-h-11 rounded-md px-3 py-3 transition hover:bg-mint hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          {signedIn && accountItems.length ? (
            <div className="mt-3 border-t border-ink/10 pt-3">
              <p className="px-3 text-xs font-bold uppercase tracking-[0.16em] text-moss">Buyer account</p>
              <nav className="mt-2 grid gap-1 text-sm font-semibold text-ink/78">
                {accountItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="min-h-11 rounded-md px-3 py-3 transition hover:bg-mint hover:text-ink"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <form action="/account/logout" method="post" className="mt-2" onSubmit={() => setOpen(false)}>
                <button className="min-h-11 w-full rounded-md px-3 py-3 text-left text-sm font-semibold text-ink/78 transition hover:bg-mint hover:text-ink">
                  Sign Out
                </button>
              </form>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
