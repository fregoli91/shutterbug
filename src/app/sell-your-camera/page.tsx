export const metadata = {
  title: 'Sell Your Camera',
  description:
    'Sell vintage digital cameras, film cameras, lenses, batteries, chargers, and camera gear to Shutterbug Camera Shop.'
};

const steps = [
  ['1. Tell us what you have', 'Share brand, model, condition, accessories, and whether it powers on.'],
  ['2. Send photos', 'Upload or email clear photos of the front, back, lens, screen, battery door, and accessories.'],
  ['3. Get an offer', 'We review demand, condition, missing parts, testing risk, and resale value.'],
  ['4. Ship or drop off', 'Use mail-in shipping or arrange a local drop-off when available.'],
  ['5. Get paid', 'Payment is sent after inspection confirms the details you provided.']
];

const wanted = [
  'Canon PowerShot',
  'Olympus compact digital cameras',
  'Nikon Coolpix',
  'Sony Cyber-shot',
  'Kodak EasyShare',
  'Fujifilm FinePix',
  'Film cameras',
  'Batteries, chargers, cards, cases, and bulk camera lots'
];

export default function SellYourCameraPage() {
  return (
    <section className="px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[1fr_28rem]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-moss">Trade-in and buyback</p>
            <h1 className="mt-3 font-serif text-5xl font-bold text-ink">Sell your vintage camera to Shutterbug</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-ink/70">
              We buy vintage digital cameras, film cameras, lenses, batteries, chargers, and camera gear. The best
              offers go to gear with clear photos, working batteries/chargers, and honest condition notes.
            </p>
            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {steps.map(([title, copy]) => (
                <div key={title} className="rounded-lg border border-ink/10 bg-white p-6 shadow-sm">
                  <p className="font-serif text-2xl font-bold text-ink">{title}</p>
                  <p className="mt-3 text-sm leading-7 text-ink/68">{copy}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid content-start gap-5">
            <img
              src="/shutterbug-trade-in.png"
              alt="Shutterbug trade-in counter accepting a vintage camera"
              className="aspect-square w-full rounded-lg border border-ink/10 bg-sand object-cover object-center shadow-sm"
            />

            <form className="rounded-lg border border-ink/10 bg-white p-6 shadow-soft">
              <p className="font-serif text-3xl font-bold text-ink">Start a Camera Quote</p>
              <p className="mt-3 text-sm leading-6 text-ink/65">
                No backend is connected yet, but this layout is ready for a form provider.
              </p>
              <div className="mt-6 grid gap-4">
                <label className="grid gap-2 text-sm font-semibold text-ink">
                  Your name
                  <input className="rounded-lg border border-ink/15 bg-cream px-3 py-3 outline-none focus:border-moss" />
                </label>
                <label className="grid gap-2 text-sm font-semibold text-ink">
                  Email
                  <input type="email" className="rounded-lg border border-ink/15 bg-cream px-3 py-3 outline-none focus:border-moss" />
                </label>
                <label className="grid gap-2 text-sm font-semibold text-ink">
                  Camera brand and model
                  <input
                    placeholder="Canon PowerShot SD1000"
                    className="rounded-lg border border-ink/15 bg-cream px-3 py-3 outline-none focus:border-moss"
                  />
                </label>
                <label className="grid gap-2 text-sm font-semibold text-ink">
                  What is included?
                  <textarea
                    rows={4}
                    placeholder="Battery, charger, memory card, case, known flaws..."
                    className="rounded-lg border border-ink/15 bg-cream px-3 py-3 outline-none focus:border-moss"
                  />
                </label>
                <button type="button" className="rounded-full bg-forest px-6 py-3 font-semibold text-white transition hover:bg-moss">
                  Start quote
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-14 rounded-lg border border-ink/10 bg-mint p-8">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-moss">Brands and gear we buy</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {wanted.map((item) => (
              <span key={item} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink/70 shadow-sm">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
