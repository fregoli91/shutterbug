import Link from 'next/link';

type AccountFeaturePageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  children: React.ReactNode;
};

export function AccountFeaturePage({ eyebrow, title, intro, children }: AccountFeaturePageProps) {
  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_18rem]">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-moss">{eyebrow}</p>
          <h1 className="mt-3 font-serif text-5xl font-bold text-ink">{title}</h1>
          <p className="mt-4 max-w-3xl leading-7 text-ink/70">{intro}</p>
          <div className="mt-8">{children}</div>
        </div>

        <aside className="grid content-start gap-3 rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
          <p className="font-serif text-2xl font-bold text-ink">Account tools</p>
          <AccountLink href="/account" label="Dashboard" />
          <AccountLink href="/account/orders" label="My Orders" />
          <AccountLink href="/account/track" label="Track Orders" />
          <AccountLink href="/account/addresses" label="Saved Addresses" />
          <AccountLink href="/account/payment-methods" label="Payment Methods" />
          <AccountLink href="/account/settings" label="Settings" />
          <AccountLink href="/contact" label="Support" />
        </aside>
      </div>
    </section>
  );
}

function AccountLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="rounded-md bg-cream px-3 py-3 text-sm font-semibold text-ink transition hover:text-moss"
    >
      {label}
    </Link>
  );
}
