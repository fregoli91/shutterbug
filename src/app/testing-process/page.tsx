export const metadata = {
  title: 'Camera Testing Process',
  description: 'How Shutterbug Camera Shop tests and grades used vintage digital cameras and camera gear.'
};

const tests = [
  'Power-on check',
  'Lens extension and zoom check',
  'Flash test when applicable',
  'LCD screen and menu check',
  'Button and dial response',
  'Memory card read/write check',
  'Sample photo check',
  'Battery and charger notes',
  'Cosmetic condition inspection',
  'Clear flaw disclosure'
];

export default function TestingProcessPage() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-bold uppercase tracking-[0.28em] text-brass">Trust page</p>
        <h1 className="mt-3 font-serif text-5xl font-bold text-ink">Our camera testing process</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-ink/70">
          Buyers of used cameras want to know what actually works. This page should become a major trust asset and be linked from every product page.
        </p>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {tests.map((test) => (
            <div key={test} className="rounded-lg border border-ink/10 bg-white p-5 text-ink/75 shadow-sm">
              <span className="font-semibold text-brass">Checked:</span> {test}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}