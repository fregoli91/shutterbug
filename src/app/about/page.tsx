export const metadata = {
  title: 'About Shutterbug Camera Shop',
  description:
    'Learn about Shutterbug Camera Shop, a focused used camera store built around tested vintage digital cameras and camera gear.'
};

export default function AboutPage() {
  return (
    <section className="px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-bold uppercase tracking-[0.28em] text-moss">About</p>
        <h1 className="mt-3 font-serif text-5xl font-bold text-ink">A real camera shop built for vintage camera buyers</h1>
        <div className="mt-8 grid gap-6 text-lg leading-8 text-ink/72">
          <p>
            Shutterbug Camera Shop specializes in tested vintage digital cameras, film cameras, and used camera gear.
            The goal is simple: make buying a used camera feel clear, focused, and trustworthy.
          </p>
          <p>
            We care about the details buyers need before checkout: actual photos, included accessories, condition grade,
            functional notes, cosmetic notes, and honest flaw disclosure. Camera-first inventory is the identity, not an
            afterthought.
          </p>
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
