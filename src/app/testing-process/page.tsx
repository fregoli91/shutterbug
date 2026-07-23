import Image from 'next/image';

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
        <div className="grid gap-8 lg:grid-cols-[1fr_28rem] lg:items-center">
          <div className="max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-moss">Trust page</p>
            <h1 className="mt-3 font-serif text-5xl font-bold text-ink">How Shutterbug tests used cameras</h1>
            <p className="mt-5 text-lg leading-8 text-ink/70">
              Vintage cameras are not new products. That is why every serious listing should separate what was tested,
              what is included, what flaws are visible, and what limitations still apply to older gear.
            </p>
          </div>
          <div className="overflow-hidden rounded-lg border border-ink/10 bg-white shadow-sm">
            <Image
              src="/shutterbug-testing-process-hero.png"
              alt="Shutterbug character carefully testing a vintage camera"
              width={1600}
              height={900}
              sizes="(min-width: 1024px) 28rem, 100vw"
              className="aspect-[16/9] w-full bg-sand object-cover object-center"
            />
            <div className="p-6">
              <p className="font-serif text-2xl font-bold text-ink">The promise</p>
              <p className="mt-3 text-sm leading-7 text-ink/68">
              Tested gear is described as tested. Parts/repair gear is marked clearly. Flaws are part of the listing,
              not a surprise after delivery.
              </p>
            </div>
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
            <Image
              src="/shutterbug-condition-grading.png"
              alt="Shutterbug condition grading display for used cameras"
              width={1200}
              height={900}
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="mb-6 aspect-[4/3] w-full rounded-lg bg-cream object-contain object-center"
            />
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
            <Image
              src="/shutterbug-parts-repair-page.png"
              alt="Parts and repair items disclosure explaining sold as-is camera listings"
              width={1536}
              height={1024}
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="mb-6 aspect-[3/2] w-full rounded-lg bg-cream object-contain object-center"
            />
            <p className="font-serif text-3xl font-bold text-ink">Parts / Repair Items</p>
            <p className="mt-4 leading-7 text-ink/70">
              Parts/repair cameras are not treated the same as ready-to-shoot cameras. These items are sold as-is and
              may have partial power, missing accessories, lens or screen issues, damaged parts, or untested functions.
            </p>
            <p className="mt-4 leading-7 text-ink/70">
              Every parts/repair listing should clearly explain what was checked, what was not checked, what is
              included, and what issues are visible. If a function is unknown, we say so instead of guessing.
            </p>
            <p className="mt-4 leading-7 text-ink/70">
              For film cameras, testing varies by model. Listings should note whether the shutter, film advance,
              rewind, meter, lens, flash, battery compartment, and door/latch were checked when applicable.
            </p>
            <p className="mt-4 leading-7 text-ink/70">
              Our goal is to make the condition clear before checkout, so buyers know whether they are purchasing a
              ready-to-shoot camera or a repair/project item.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
