import Link from 'next/link';

export const metadata = {
  title: 'Sell Your Camera',
  description: 'Sell your vintage digital camera, film camera, or camera gear to Shutterbug Camera Shop.'
};

export default function SellYourCameraPage() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-bold uppercase tracking-[0.28em] text-brass">Trade-in and buyback</p>
        <h1 className="mt-3 font-serif text-5xl font-bold text-ink">Sell your old camera to Shutterbug</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-ink/70">
          This page should become your inventory acquisition engine. Start with a simple form link, then build a full quote workflow later.
        </p>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            ['1. Tell us what you have', 'Brand, model, condition, accessories, and photos.'],
            ['2. Get an estimate', 'We review demand, condition, missing parts, and resale value.'],
            ['3. Ship or meet locally', 'Use a prepaid label, local drop-off, or scheduled bulk pickup when available.']
          ].map(([title, copy]) => (
            <div key={title} className="rounded-lg border border-ink/10 bg-white p-7 shadow-sm">
              <p className="font-serif text-2xl font-bold text-ink">{title}</p>
              <p className="mt-3 text-sm leading-7 text-ink/68">{copy}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 rounded-lg border border-ink/10 bg-white p-8 shadow-soft">
          <h2 className="font-serif text-3xl font-bold text-ink">Wanted cameras</h2>
          <p className="mt-4 text-ink/70">Canon PowerShot, Olympus compact cameras, Nikon Coolpix, Sony Cyber-shot, Kodak EasyShare, Fujifilm FinePix, film cameras, lenses, chargers, batteries, and bulk camera lots.</p>
          <Link href="/contact" className="mt-7 inline-flex rounded-full bg-brass px-7 py-3 font-semibold text-white transition hover:bg-moss">Contact us to sell</Link>
        </div>
      </div>
    </section>
  );
}