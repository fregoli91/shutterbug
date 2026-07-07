import Link from 'next/link';

export const metadata = {
  title: 'Returns & Warranty',
  description: 'Return and condition policy for Shutterbug Camera Shop orders.'
};

const returnSteps = [
  ['1. Contact support', 'Send the order number, a short description of the issue, and clear photos when helpful.'],
  ['2. Keep everything together', 'Hold onto the camera, accessories, packaging, serial numbers, and any included items.'],
  ['3. Review the listing', 'Shutterbug compares the received item against the product photos, testing notes, and condition details.'],
  ['4. Resolve the issue', 'Eligible issues may be handled with a return, exchange path, refund, or other support resolution.']
];

export default function ReturnsPage() {
  return (
    <section className="px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[1fr_34rem] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-moss">Buyer confidence</p>
            <h1 className="mt-3 font-serif text-5xl font-bold text-ink">Returns and condition policy</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-ink/72">
              We want you to love your gear. If something arrives not as described, we will help make it right.
            </p>
          </div>
          <img
            src="/shutterbug-returns-page.png"
            alt="Easy returns guide for Shutterbug Camera Shop"
            className="aspect-[16/9] w-full rounded-lg border border-ink/10 bg-cream object-contain object-center shadow-sm"
          />
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {returnSteps.map(([title, copy]) => (
            <article key={title} className="rounded-lg border border-ink/10 bg-white p-6 shadow-sm">
              <p className="font-serif text-2xl font-bold text-ink">{title}</p>
              <p className="mt-3 text-sm leading-6 text-ink/68">{copy}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 grid gap-6 rounded-lg border border-ink/10 bg-cream p-8 shadow-soft lg:grid-cols-2">
          <div>
            <p className="font-serif text-3xl font-bold text-ink">Ready-to-shoot cameras</p>
            <p className="mt-4 text-sm leading-7 text-ink/70">
              Tested cameras should match the product page: real photos, included accessories, testing checklist,
              condition notes, and disclosed flaws. If a ready-to-shoot camera arrives materially different from the
              listing, contact support quickly so the order can be reviewed.
            </p>
          </div>
          <div>
            <p className="font-serif text-3xl font-bold text-ink">Parts/repair items</p>
            <p className="mt-4 text-sm leading-7 text-ink/70">
              Parts/repair cameras are sold as-is and are not treated the same as tested ready-to-use gear. These
              listings should clearly explain what was checked, what was not checked, included accessories, visible
              issues, and unknown functions.
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-lg border border-ink/10 bg-white p-6 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-moss">Before you buy</p>
          <h2 className="mt-3 font-serif text-3xl font-bold text-ink">Read the listing closely.</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-ink/70">
            Used gear varies from item to item. Product-specific return notes, condition disclosures, and parts/repair
            labels should be reviewed before checkout. When in doubt, ask a question before buying.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/contact" className="inline-flex min-h-11 items-center rounded-full bg-forest px-5 text-sm font-semibold text-white transition hover:bg-moss">
              Contact support
            </Link>
            <Link href="/shipping" className="inline-flex min-h-11 items-center rounded-full border border-ink/15 bg-cream px-5 text-sm font-semibold text-ink transition hover:border-moss hover:text-moss">
              Shipping policy
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
