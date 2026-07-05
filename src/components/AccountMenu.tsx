import Link from 'next/link';

const accountLinks = [
  { href: '/account', label: 'Dashboard', copy: 'Account overview' },
  { href: '/account/orders', label: 'My Orders', copy: 'Purchase history' },
  { href: '/account/track', label: 'Track Orders', copy: 'Shipping status' },
  { href: '/account/addresses', label: 'Saved Addresses', copy: 'Checkout details' },
  { href: '/account/payment-methods', label: 'Payment Methods', copy: 'Secure payment info' },
  { href: '/account/settings', label: 'Settings', copy: 'Name, email, sign out' },
  { href: '/contact', label: 'Help & Support', copy: 'Ask about an order' }
];

export function AccountMenu({ label, email }: { label: string; email: string }) {
  return (
    <details className="group relative hidden lg:block">
      <summary className="flex min-h-11 cursor-pointer list-none items-center rounded-lg border border-ink/10 bg-white px-4 text-sm font-semibold text-ink shadow-sm transition hover:border-moss/40 hover:text-moss [&::-webkit-details-marker]:hidden">
        {label}
      </summary>
      <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-lg border border-ink/10 bg-white p-4 shadow-soft">
        <div className="border-b border-ink/10 pb-3">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-moss">Customer account</p>
          <p className="mt-1 truncate font-serif text-2xl font-bold text-ink">{label}</p>
          <p className="mt-1 truncate text-sm text-ink/60">{email}</p>
        </div>

        <nav className="mt-3 grid gap-1">
          {accountLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 transition hover:bg-mint hover:text-ink"
            >
              <span className="block text-sm font-semibold text-ink">{item.label}</span>
              <span className="block text-xs text-ink/55">{item.copy}</span>
            </Link>
          ))}
        </nav>

        <form action="/account/logout" method="post" className="mt-3 border-t border-ink/10 pt-3">
          <button className="min-h-11 w-full rounded-full border border-ink/15 bg-cream px-4 text-sm font-semibold text-ink transition hover:border-moss hover:text-moss">
            Sign out
          </button>
        </form>
      </div>
    </details>
  );
}
