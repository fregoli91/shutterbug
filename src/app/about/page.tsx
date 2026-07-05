export const metadata = {
  title: 'About Shutterbug Camera Shop',
  description:
    'Learn about Shutterbug Camera Shop, a focused used camera store started in 2012 and built around tested vintage digital cameras and camera gear.'
};

export default function AboutPage() {
  return (
    <section className="px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[1fr_30rem] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-moss">About</p>
            <h1 className="mt-3 font-serif text-5xl font-bold text-ink">
              Helping camera buyers since 2012
            </h1>
            <div className="mt-8 grid gap-6 text-lg leading-8 text-ink/72">
              <p>
                Shutterbug Camera Shop started in 2012 with a simple goal: make buying used cameras feel clear,
                focused, and trustworthy.
              </p>
              <p>
                We specialize in tested vintage digital cameras, film cameras, and used camera gear with the details
                buyers need before checkout: actual photos, included accessories, condition grade, functional notes,
                cosmetic notes, and honest flaw disclosure.
              </p>
            </div>
          </div>
          <img
            src="/shutterbug-about-page.png"
            alt="Shutterbug Camera Shop storefront with the ladybug mascot painting an established 2012 sign"
            className="aspect-[4/3] w-full rounded-lg border border-ink/10 bg-sand object-cover object-center shadow-sm"
          />
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {['Camera-first inventory', 'Transparent condition notes', 'Friendly support'].map((item) => (
            <div key={item} className="rounded-lg border border-ink/10 bg-white p-6 shadow-sm">
              <p className="font-serif text-2xl font-bold text-ink">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
