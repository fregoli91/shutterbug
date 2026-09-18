import { safeJsonLd } from '@/lib/security';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { site } from '@/lib/seo';
import { buildBreadcrumbJsonLd, jsonLdGraph } from '@/lib/seo-utils';
import { getCustomerSession } from '@/lib/customer-auth';

export const metadata: Metadata = {
  title: 'Sell Your Camera | Fast Camera Trade-In & Buyback',
  description: 'Sell a used digital camera, film camera, lens, accessories, or a collection to Shutterbug. Submit photos online and receive a clear preliminary offer.',
  alternates: { canonical: '/sell-your-camera' },
  openGraph: {
    title: 'Sell Your Used or Vintage Camera | Shutterbug Camera Shop',
    description: 'A clear online camera trade-in process with cash and store-credit offers.',
    url: `${site.domain}/sell-your-camera`, type: 'website',
    images: [{ url: `${site.domain}/sell-your-camera-trade-in.png`, alt: 'Vintage cameras exchanged for cash through Shutterbug Camera Shop' }]
  }
};

const steps = [
  ['1', 'Tell us about it', 'Choose the gear type, brand, model, condition, and what is included.'],
  ['2', 'Add clear photos', 'Show the front, back, serial label, wear, and included accessories.'],
  ['3', 'Choose payout', 'Compare cash with store credit before you submit.'],
  ['4', 'Review our offer', 'We send a preliminary offer based on the details you provide.'],
  ['5', 'Send or hand off', 'Ship your gear after accepting. Local handoff is offered only when arranged.'],
  ['6', 'Inspection and payment', 'We confirm the condition, finalize the value, and issue the approved payout.']
];
const gear = ['Vintage digital cameras', 'Film cameras', 'Lenses', 'Point-and-shoots', 'Batteries and chargers', 'Accessories', 'Collections and bulk lots', 'Parts or repair gear'];
const faqs = [
  ['Is the first offer final?', 'It is preliminary. The final offer follows a hands-on inspection and may change if condition, function, or included items differ from the submission.'],
  ['Do you buy broken cameras?', 'Yes, some models and lenses have parts value. Choose “For parts or repair” and describe every known issue.'],
  ['How fast will I hear back?', 'Most complete submissions are reviewed within a few business days. Large collections and hard-to-identify gear can take longer.'],
  ['Can I drop gear off?', 'Sometimes. Local handoff is available only after Shutterbug confirms a time and location. Please do not arrive without an appointment.'],
  ['When do I get paid?', 'Payment is arranged after your gear arrives, inspection is complete, and you accept any revised final offer.'],
  ['Why do I need an account?', 'Your account protects the photos and offer history, lets you resume a draft, and keeps every status update in one place.']
];

export default async function SellYourCameraPage() {
  const customer = await getCustomerSession();
  const wizardPath = '/account/trade-ins/new';
  const ctaHref = customer ? wizardPath : `/login?returnTo=${encodeURIComponent(wizardPath)}`;
  const structuredData = jsonLdGraph([
    { '@type': 'WebPage', name: 'Sell Your Camera', description: metadata.description, url: `${site.domain}/sell-your-camera`, isPartOf: { '@id': `${site.domain}/#website` }, about: { '@id': `${site.domain}/#organization` } },
    buildBreadcrumbJsonLd([{ name: 'Home', url: '/' }, { name: 'Sell Your Camera', url: '/sell-your-camera' }])
  ]);

  return <main className="pb-16">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(structuredData) }} />
    <section className="bg-cream px-4 py-8 sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto grid max-w-7xl items-center gap-9 lg:grid-cols-[1.05fr_.95fr]">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[.24em] text-moss">Camera trade-in and buyback</p>
          <h1 className="mx-auto mt-3 max-w-3xl font-serif text-4xl font-bold leading-tight text-ink sm:text-6xl">Turn unused camera gear into cash or your next camera.</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-ink/72">Tell us what you have, upload clear photos, and track the entire review in your Shutterbug account. No mystery forms and no obligation to accept.</p>
          <Link href="/shop?sort=featured" aria-label="Shop the Shutterbug fall sale" className="mt-6 block overflow-hidden rounded-lg border border-ink/10 bg-sand shadow-sm transition hover:border-moss/40 hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss focus-visible:ring-offset-2"><Image src="/shutterbug-fall-sale-banner.png" alt="Shutterbug Camera Shop fall sale with up to 30 percent off cameras and gear" width={2172} height={724} sizes="(min-width: 1024px) 52vw, 100vw" className="aspect-[3/1] w-full object-cover object-center transition duration-500 hover:scale-[1.01]" /></Link>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href={ctaHref} className="inline-flex min-h-12 items-center rounded-full bg-forest px-6 font-semibold text-white hover:bg-moss">Start your trade-in</Link>
            <a href="#how-it-works" className="inline-flex min-h-12 items-center rounded-full border border-ink/15 bg-white px-6 font-semibold text-ink hover:border-moss">See how it works</a>
          </div>
          {!customer ? <p className="mt-3 text-sm text-ink/60">You can read everything here without signing in. An account is required when you start a submission.</p> : null}
        </div>
        <Image src="/sell-your-camera-trade-in.png" alt="Vintage Yashica, Olympus, and Pentax cameras being exchanged for cash" width={640} height={640} priority sizes="(min-width:1024px) 46vw, 100vw" className="aspect-square w-full rounded-[1.5rem] border border-ink/10 object-cover shadow-soft" />
      </div>
    </section>

    <section className="border-y border-ink/10 bg-white px-4 py-5 sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-x-9 gap-y-3 text-sm font-semibold text-ink/75">
        <span>Private photo uploads</span><span>No-obligation offer</span><span>Cash or store credit</span><span>Status tracking</span><span>Human inspection</span>
      </div>
    </section>

    <section id="how-it-works" className="px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="text-center text-sm font-bold uppercase tracking-[.2em] text-moss">How it works</p>
        <h2 className="mt-2 text-center font-serif text-4xl font-bold text-ink">A clear path from quote to payout</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{steps.map(([number,title,copy])=><article key={number} className="rounded-lg border border-ink/10 bg-white p-6 shadow-sm"><span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-forest font-bold text-white">{number}</span><h3 className="mt-4 font-serif text-2xl font-bold text-ink">{title}</h3><p className="mt-2 text-sm leading-6 text-ink/68">{copy}</p></article>)}</div>
      </div>
    </section>

    <section className="bg-mint px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-2">
        <article className="rounded-lg bg-white p-7 shadow-sm"><p className="text-sm font-bold uppercase tracking-[.18em] text-moss">Cash</p><h2 className="mt-2 font-serif text-3xl font-bold text-ink">Straightforward payout</h2><p className="mt-3 leading-7 text-ink/70">Choose cash when you want the confirmed value paid after inspection. The admin team arranges the actual payment with you; this site does not store bank details.</p></article>
        <article className="rounded-lg bg-forest p-7 text-white shadow-sm"><p className="text-sm font-bold uppercase tracking-[.18em] text-sand">Store credit</p><h2 className="mt-2 font-serif text-3xl font-bold">More value for your next find</h2><p className="mt-3 leading-7 text-white/80">Choose store credit when you plan to shop with us. Any active bonus is reflected in the offer. Credit is issued by the admin team after inspection; there is no customer wallet balance.</p></article>
      </div>
    </section>

    <section className="px-4 py-14 sm:px-6 lg:px-8"><div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
      <div><p className="text-sm font-bold uppercase tracking-[.2em] text-moss">Gear we buy</p><h2 className="mt-2 font-serif text-4xl font-bold text-ink">From one pocket camera to a full collection</h2><div className="mt-6 flex flex-wrap gap-2">{gear.map(x=><span key={x} className="rounded-full border border-ink/10 bg-white px-4 py-2 text-sm font-semibold text-ink/75">{x}</span>)}</div></div>
      <div><p className="text-sm font-bold uppercase tracking-[.2em] text-moss">Get the strongest offer</p><ul className="mt-4 grid gap-3 text-sm leading-6 text-ink/70"><li>Include the exact model number from the base or label.</li><li>Photograph every side, the lens glass, screen, battery compartment, and serial label.</li><li>Test power, buttons, flash, zoom, card slot, shutter, and battery door when safe.</li><li>List chargers, batteries, straps, cases, caps, manuals, and original packaging.</li><li>Show scratches, corrosion, cracks, fungus, haze, or missing pieces clearly.</li></ul></div>
    </div></section>

    <section className="bg-sand px-4 py-14 sm:px-6 lg:px-8"><div className="mx-auto max-w-5xl text-center"><p className="text-sm font-bold uppercase tracking-[.2em] text-moss">Need help identifying it?</p><h2 className="mt-2 font-serif text-4xl font-bold text-ink">Start with the labels you can find</h2><p className="mx-auto mt-4 max-w-3xl leading-7 text-ink/70">Look on the camera front, bottom plate, battery door, lens ring, or inside the film door. If the model is still unclear, choose “I do not know” and add a sharp label photo.</p><nav className="mt-6 flex flex-wrap justify-center gap-4"><Link className="font-bold text-forest underline-offset-4 hover:underline" href="/guides/how-to-buy-a-used-camera">Camera inspection guide</Link><Link className="font-bold text-forest underline-offset-4 hover:underline" href="/categories/vintage-digital-cameras">Vintage digital cameras</Link><Link className="font-bold text-forest underline-offset-4 hover:underline" href="/categories/film-cameras">Film cameras</Link></nav></div></section>

    <section className="px-4 py-14 sm:px-6 lg:px-8"><div className="mx-auto max-w-5xl"><p className="text-center text-sm font-bold uppercase tracking-[.2em] text-moss">Questions</p><h2 className="mt-2 text-center font-serif text-4xl font-bold text-ink">Before you submit</h2><div className="mt-7 grid gap-3">{faqs.map(([q,a])=><details key={q} className="rounded-lg border border-ink/10 bg-white p-5"><summary className="cursor-pointer font-bold text-ink">{q}</summary><p className="mt-3 text-sm leading-6 text-ink/70">{a}</p></details>)}</div></div></section>

    <section className="px-4 sm:px-6 lg:px-8"><div className="mx-auto max-w-5xl rounded-[1.5rem] bg-ink p-8 text-center text-white sm:p-12"><h2 className="font-serif text-4xl font-bold">Ready to see what your gear is worth?</h2><p className="mx-auto mt-4 max-w-2xl leading-7 text-white/75">Create a private submission, save your progress, and return whenever you need.</p><Link href={ctaHref} className="mt-7 inline-flex min-h-12 items-center rounded-full bg-sand px-7 font-bold text-ink">Start your trade-in</Link><p className="mx-auto mt-5 max-w-3xl text-xs leading-5 text-white/60">Offers are preliminary until physical inspection. Values can change if condition, function, identity, or included accessories differ. Local handoff requires prior confirmation. By submitting, you confirm the gear is yours to sell and agree to our <Link href="/terms" className="underline">terms</Link>.</p></div></section>
  </main>;
}