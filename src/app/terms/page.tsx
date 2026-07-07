import Link from 'next/link';
import type { ReactNode } from 'react';
import { site } from '@/lib/seo';

export const metadata = {
  title: 'Terms of Service',
  description: 'Terms of service for shopping with Shutterbug Camera Shop.'
};

const termCards = [
  {
    title: 'Used and vintage gear',
    copy: 'Most Shutterbug products are used, vintage, or one-off items. Cosmetic wear and age-related variation should be expected unless the listing says otherwise.'
  },
  {
    title: 'Listing details matter',
    copy: 'Product-specific photos, condition grades, testing notes, included accessories, flaws, and parts/repair disclosures are part of the purchase description.'
  },
  {
    title: 'Checkout and payment',
    copy: 'Orders are subject to payment confirmation, inventory availability, fraud review, and accurate shipping information before fulfillment.'
  },
  {
    title: 'Support first',
    copy: 'If something looks wrong with an order, contact Shutterbug with the order number and photos so support can review the issue clearly.'
  }
];

export default function TermsPage() {
  return (
    <section className="px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-bold uppercase tracking-[0.28em] text-moss">Terms</p>
        <h1 className="mt-3 font-serif text-5xl font-bold text-ink">Terms of service</h1>
        <p className="mt-4 text-sm font-semibold text-ink/60">Last updated July 7, 2026</p>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-ink/72">
          These terms explain the practical rules for using Shutterbug Camera Shop, buying used camera gear, and keeping
          account and order activity connected.
        </p>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {termCards.map((card) => (
            <article key={card.title} className="rounded-lg border border-ink/10 bg-white p-6 shadow-sm">
              <p className="font-serif text-2xl font-bold text-ink">{card.title}</p>
              <p className="mt-3 text-sm leading-6 text-ink/68">{card.copy}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 grid gap-6 rounded-lg border border-ink/10 bg-cream p-6 shadow-soft">
          <TermsBlock title="Inventory and availability">
            <p>
              Many Shutterbug items are quantity-one cameras or accessories. Adding an item to a cart does not guarantee
              purchase until checkout is completed and payment is confirmed. If inventory changes unexpectedly,
              Shutterbug may cancel, refund, or contact the customer about next steps.
            </p>
          </TermsBlock>
          <TermsBlock title="Condition, testing, and parts/repair items">
            <p>
              Ready-to-shoot items should be described with clear testing and condition notes. Parts/repair items are
              sold as-is and should not be treated the same as tested ready-to-use cameras. If a function is unknown, the
              listing should say so instead of guessing.
            </p>
          </TermsBlock>
          <TermsBlock title="Returns and order issues">
            <p>
              Return eligibility depends on the product listing, item condition, and whether the item arrives as
              described. Product-specific return notes may differ from general policy language. Review the{' '}
              <Link href="/returns" className="font-semibold text-moss">
                returns page
              </Link>{' '}
              before purchasing.
            </p>
          </TermsBlock>
          <TermsBlock title="Accounts">
            <p>
              Customers are responsible for keeping login details secure and providing accurate account and checkout
              information. Shutterbug accounts are meant for order history, liked products, customer support, and future
              buyer conveniences.
            </p>
          </TermsBlock>
          <TermsBlock title="Contact">
            <p>
              Questions about these terms can be sent to{' '}
              <a className="font-semibold text-moss" href={`mailto:${site.supportEmail}`}>
                {site.supportEmail}
              </a>
              .
            </p>
          </TermsBlock>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/shop" className="inline-flex min-h-11 items-center rounded-full bg-forest px-5 text-sm font-semibold text-white transition hover:bg-moss">
            Shop cameras
          </Link>
          <Link href="/privacy" className="inline-flex min-h-11 items-center rounded-full border border-ink/15 bg-white px-5 text-sm font-semibold text-ink transition hover:border-moss hover:text-moss">
            Privacy policy
          </Link>
        </div>
      </div>
    </section>
  );
}

function TermsBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="font-serif text-2xl font-bold text-ink">{title}</h2>
      <div className="mt-2 text-sm leading-6 text-ink/68">{children}</div>
    </div>
  );
}
