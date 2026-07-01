export const metadata = {
  title: 'Returns & Warranty',
  description: 'Return and condition policy for Shutterbug Camera Shop orders.'
};

export default function ReturnsPage() {
  return (
    <section className="px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-bold uppercase tracking-[0.28em] text-moss">Buyer confidence</p>
        <h1 className="mt-3 font-serif text-5xl font-bold text-ink">Returns and condition policy</h1>
        <div className="mt-8 rounded-lg border border-ink/10 bg-white p-8 shadow-soft">
          <p className="text-lg leading-8 text-ink/72">
            Used cameras should be described clearly before checkout. Return eligibility should be tied to whether the
            item arrives as described, while parts/repair items should be marked as-is before purchase.
          </p>
          <ul className="mt-6 grid list-disc gap-3 pl-5 text-ink/70">
            <li>Tested cameras should have a clear return window for not-as-described issues.</li>
            <li>Parts/repair items should be sold as-is with explicit condition disclosure.</li>
            <li>Serial numbers and packing photos should be retained for higher-value orders.</li>
            <li>Included accessories should match the listing notes.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
