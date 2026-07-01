export const metadata = {
  title: 'Camera Testing Process',
  description:
    'How Shutterbug Camera Shop tests and grades used vintage digital cameras, film cameras, and camera gear.'
};

const digitalTests = [
  'Power on/off',
  'Lens extension and zoom',
  'Flash test when applicable',
  'LCD screen and menu visibility',
  'Button and dial response',
  'Battery door and compartment inspection',
  'Memory card read/write',
  'Photo capture and playback',
  'Charging or charger check when included',
  'Cosmetic inspection and flaw notes'
];

const conditionRules = [
  ['Mint', 'Near-new presentation with minimal visible wear.'],
  ['Excellent', 'Clean used condition with light normal wear and strong function checks.'],
  ['Good', 'Noticeable wear but usable and clearly described.'],
  ['Fair', 'Heavier cosmetic wear or limitations that are disclosed before purchase.'],
  ['For Parts', 'Sold as-is for repair, parts harvesting, display, or collector projects.']
];

export default function TestingProcessPage() {
  return (
    <section className="px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[1fr_24rem] lg:items-end">
          <div className="max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-moss">Trust page</p>
            <h1 className="mt-3 font-serif text-5xl font-bold text-ink">How Shutterbug tests used cameras</h1>
            <p className="mt-5 text-lg leading-8 text-ink/70">
              Vintage cameras are not new products. That is why every serious listing should separate what was tested,
              what is included, what flaws are visible, and what limitations still apply to older gear.
            </p>
          </div>
          <div className="rounded-lg border border-ink/10 bg-white p-6 shadow-sm">
            <p className="font-serif text-2xl font-bold text-ink">The promise</p>
            <p className="mt-3 text-sm leading-7 text-ink/68">
              Tested gear is described as tested. Parts/repair gear is marked clearly. Flaws are part of the listing,
              not a surprise after delivery.
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {digitalTests.map((test) => (
            <div key={test} className="rounded-lg border border-ink/10 bg-white p-5 text-ink/75 shadow-sm">
              <span className="font-semibold text-moss">Checked:</span> {test}
            </div>
          ))}
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          <div className="rounded-lg border border-ink/10 bg-white p-8 shadow-sm">
            <p className="font-serif text-3xl font-bold text-ink">Condition grading</p>
            <div className="mt-6 grid gap-4">
              {conditionRules.map(([grade, copy]) => (
                <div key={grade} className="rounded-lg bg-mint p-4">
                  <p className="font-semibold text-ink">{grade}</p>
                  <p className="mt-1 text-sm leading-6 text-ink/68">{copy}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-ink/10 bg-white p-8 shadow-sm">
            <p className="font-serif text-3xl font-bold text-ink">Parts/repair language</p>
            <p className="mt-4 leading-7 text-ink/70">
              Parts/repair items are treated differently from ready-to-shoot cameras. They may power on partially, have
              missing accessories, show lens/screen issues, or be useful only for repair projects. Those listings should
              be marked as-is before checkout.
            </p>
            <p className="mt-4 leading-7 text-ink/70">
              For film cameras, testing may differ by model. Listings should explain whether shutter, meter, film
              advance, lens, flash, or battery compartments were checked.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
