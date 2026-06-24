export const metadata = {
  title: 'About Shutterbug Camera Shop',
  description: 'Learn about Shutterbug Camera Shop, a focused used camera store built around tested vintage digital cameras and camera gear.'
};

export default function AboutPage() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-bold uppercase tracking-[0.28em] text-brass">About</p>
        <h1 className="mt-3 font-serif text-5xl font-bold text-ink">A real camera shop built from real inventory</h1>
        <div className="mt-8 grid gap-6 text-lg leading-8 text-ink/72">
          <p>
            Shutterbug Camera Shop specializes in tested vintage digital cameras, film cameras, and used camera gear. Our focus is simple: clear photos, clear condition notes, and cameras that are ready to shoot.
          </p>
          <p>
            Add your founder story here: how camera reselling grew from broader ecommerce, why Canon and Olympus vintage digital cameras became the core category, and why buyers should trust you over random marketplace listings.
          </p>
        </div>
      </div>
    </section>
  );
}
