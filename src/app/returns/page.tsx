export const metadata = {
  title: 'Returns & Warranty',
  description: 'Return and condition policy for Shutterbug Camera Shop orders.'
};

export default function ReturnsPage() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-bold uppercase tracking-[0.28em] text-brass">Buyer confidence</p>
        <h1 className="mt-3 font-serif text-5xl font-bold text-ink">Returns and condition policy</h1>
        <div className="mt-8 rounded-lg border border-ink/10 bg-white p-8 shadow-soft">
          <p className="text-lg leading-8 text-ink/72">
            Replace this starter copy with your final policy before launch. Be clear about return window, buyer responsibility, parts/repair exceptions, and what happens if an item arrives not as described.
          </p>
          <ul className="mt-6 grid list-disc gap-3 pl-5 text-ink/70">
            <li>Premium tested cameras should have a simple return window.</li>
            <li>Parts/repair items should be sold as-is with explicit condition disclosure.</li>
            <li>Serial numbers and packing photos should be retained for high-value items.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}