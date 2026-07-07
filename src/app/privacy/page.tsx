import Link from 'next/link';
import type { ReactNode } from 'react';
import { site } from '@/lib/seo';

export const metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for Shutterbug Camera Shop customer accounts, orders, and support.'
};

const dataSections = [
  {
    title: 'Account and checkout information',
    copy: 'When you create an account or place an order, Shutterbug may receive your name, email address, shipping address, order details, and support messages.'
  },
  {
    title: 'Payment information',
    copy: 'Payments are processed through trusted checkout providers. Shutterbug keeps payment status and provider references for order support, but does not store full card numbers.'
  },
  {
    title: 'Product and support activity',
    copy: 'Liked products, order history, tracking updates, contact requests, and trade-in messages may be connected to your customer account.'
  },
  {
    title: 'Site activity',
    copy: 'Basic technical information may be used to operate the site, protect accounts, diagnose errors, and understand store performance.'
  }
];

export default function PrivacyPage() {
  return (
    <section className="px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-bold uppercase tracking-[0.28em] text-moss">Privacy</p>
        <h1 className="mt-3 font-serif text-5xl font-bold text-ink">Privacy policy</h1>
        <p className="mt-4 text-sm font-semibold text-ink/60">Last updated July 7, 2026</p>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-ink/72">
          Shutterbug Camera Shop uses customer information to operate the store, process orders, support customers, and
          keep account features connected. This page summarizes the practical privacy approach for the site.
        </p>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {dataSections.map((section) => (
            <article key={section.title} className="rounded-lg border border-ink/10 bg-white p-6 shadow-sm">
              <p className="font-serif text-2xl font-bold text-ink">{section.title}</p>
              <p className="mt-3 text-sm leading-6 text-ink/68">{section.copy}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 grid gap-6 rounded-lg border border-ink/10 bg-cream p-6 shadow-soft">
          <PolicyBlock title="How information is used">
            <p>
              Customer information is used to create accounts, verify emails, display order history, process checkout,
              fulfill orders, answer support questions, manage returns, reduce fraud, and improve the shopping
              experience.
            </p>
          </PolicyBlock>
          <PolicyBlock title="Sharing information">
            <p>
              Shutterbug may share the information needed to operate the store with service providers such as payment,
              hosting, email, shipping, analytics, database, and image-hosting providers. Shutterbug does not sell full
              payment card details because those details are handled by checkout processors.
            </p>
          </PolicyBlock>
          <PolicyBlock title="Your choices">
            <p>
              You can contact customer service to ask about account information, support history, order records, or
              privacy requests. Some order and transaction records may need to be retained for business, tax, fraud
              prevention, chargeback, or legal reasons.
            </p>
          </PolicyBlock>
          <PolicyBlock title="Contact">
            <p>
              Questions can be sent to{' '}
              <a className="font-semibold text-moss" href={`mailto:${site.supportEmail}`}>
                {site.supportEmail}
              </a>
              .
            </p>
          </PolicyBlock>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/account/settings" className="inline-flex min-h-11 items-center rounded-full bg-forest px-5 text-sm font-semibold text-white transition hover:bg-moss">
            Account settings
          </Link>
          <Link href="/terms" className="inline-flex min-h-11 items-center rounded-full border border-ink/15 bg-white px-5 text-sm font-semibold text-ink transition hover:border-moss hover:text-moss">
            Terms of service
          </Link>
        </div>
      </div>
    </section>
  );
}

function PolicyBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="font-serif text-2xl font-bold text-ink">{title}</h2>
      <div className="mt-2 text-sm leading-6 text-ink/68">{children}</div>
    </div>
  );
}
