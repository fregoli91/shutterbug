import { safeJsonLd } from '@/lib/security';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { site } from '@/lib/seo';
import { buildBreadcrumbJsonLd, jsonLdGraph } from '@/lib/seo-utils';

export const metadata: Metadata = {
  title: 'Sell Your Camera | Used & Vintage Camera Trade-In',
  description:
    'Sell a used digital camera, film camera, lens, collection, or camera accessories to Shutterbug Camera Shop. Learn what we buy and how the quote process works.',
  alternates: { canonical: '/sell-your-camera' },
  openGraph: {
    title: 'Sell Your Used or Vintage Camera | Shutterbug Camera Shop',
    description:
      'Tell Shutterbug about your digital camera, film camera, lens, accessories, or camera collection and learn how the quote process works.',
    url: `${site.domain}/sell-your-camera`,
    type: 'website',
    images: [{ url: `${site.domain}/shutterbug-trade-in.png`, alt: 'Sell a used camera to Shutterbug Camera Shop' }]
  }
};
const steps = [
  ['1. Tell us what you have', 'Share brand, model, condition, accessories, and whether it powers on.'],
  ['2. Send photos', 'Email clear photos of the front, back, lens, screen, battery door, and accessories.'],
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
  'Lenses',
  'Batteries, chargers, cards, cases, and bulk camera lots'
];

export default function SellYourCameraPage() {
  const structuredData = jsonLdGraph([
    {
      '@type': 'WebPage',
      name: 'Sell Your Camera',
      description: metadata.description,
      url: `${site.domain}/sell-your-camera`,
      isPartOf: { '@id': `${site.domain}/#website` },
      about: { '@id': `${site.domain}/#organization` }
    },
    buildBreadcrumbJsonLd([
      { name: 'Home', url: '/' },
      { name: 'Sell Your Camera', url: '/sell-your-camera' }
    ])
  ]);

  return (
    <section className="px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(structuredData) }} />
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[1fr_28rem]">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-moss">Trade-in and buyback</p>
            <h1 className="mt-3 font-serif text-3xl sm:text-5xl font-bold text-ink">Sell your vintage camera to Shutterbug</h1>
            <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-ink/70">
              We buy vintage digital cameras, film cameras, lenses, batteries, chargers, and camera gear. The best
              offers go to gear with clear photos, working batteries/chargers, and honest condition notes.
            </p>
            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {steps.map(([title, copy]) => (
                <div key={title} className="rounded-lg border border-ink/10 bg-white p-6 text-center shadow-sm">
                  <p className="font-serif text-2xl font-bold text-ink">{title}</p>
                  <p className="mt-3 text-sm leading-7 text-ink/68">{copy}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid content-start gap-5">
            <Image
              src="/shutterbug-trade-in.png"
              alt="Shutterbug trade-in counter accepting a vintage camera"
              width={640}
              height={640}
              sizes="(min-width: 1024px) 28rem, 100vw"
              className="aspect-square w-full rounded-lg border border-ink/10 bg-sand object-cover object-center shadow-sm"
            />

            <section className="border-t border-forest/15 py-6" aria-labelledby="quote-heading">
              <h2 id="quote-heading" className="text-2xl font-semibold text-ink">Start a camera quote</h2>
              <p className="mt-3 text-sm leading-6 text-ink/70">
                Email us the brand, model, condition and included accessories. Attach clear photos of your gear and any wear or damage.
              </p>
              <p className="mt-3 text-sm leading-6 text-ink/70">
                Include your name and preferred payout (cash or store credit). A phone number is optional. We will reply with questions or an offer after reviewing your details.
              </p>
              <a href={`mailto:${site.supportEmail}?subject=${encodeURIComponent('Camera trade-in quote')}&body=${encodeURIComponent('Name:\nBrand and model:\nCondition and known flaws:\nAccessories included:\nDescription:\nPreferred payout (cash or store credit):\nPhone (optional):\n\nPlease attach photos of the camera and accessories.')}`}
                className="mt-5 inline-flex min-h-11 items-center justify-center rounded-md bg-forest px-5 text-sm font-semibold text-white hover:bg-moss focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-moss">
                Email your camera details
              </a>
              <p className="mt-3 break-words text-sm text-ink/65">{site.supportEmail}</p>
              <p className="mt-2 text-xs leading-5 text-ink/60">Attach photos in your email app before sending. Prefer to talk? <a href={site.supportPhoneHref} className="underline">{site.supportPhone}</a></p>
            </section>
          </div>
        </div>

        <div className="mt-14 rounded-lg border border-ink/10 bg-mint p-8 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-moss">Brands and gear we buy</p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {wanted.map((item) => (
              <span key={item} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink/70 shadow-sm">
                {item}
              </span>
            ))}
          </div>
        </div>
        <div className="mt-8 border-t border-ink/10 pt-8 text-center">
          <p className="font-serif text-2xl font-bold text-ink">Research before you sell</p>
          <p className="mx-auto mt-3 max-w-3xl text-sm leading-7 text-ink/70">
            Not sure what kind of camera you have? These pages can help you identify the format and understand the
            details that matter when describing older gear.
          </p>
          <nav aria-label="Camera selling research" className="mt-5 flex flex-wrap justify-center gap-3">
            <Link href="/guides/how-to-buy-a-used-camera" className="font-semibold text-moss underline-offset-4 hover:underline">
              Used camera inspection guide
            </Link>
            <Link href="/categories/vintage-digital-cameras" className="font-semibold text-moss underline-offset-4 hover:underline">
              Vintage digital cameras
            </Link>
            <Link href="/categories/film-cameras" className="font-semibold text-moss underline-offset-4 hover:underline">
              Film cameras
            </Link>
          </nav>
        </div>
      </div>
    </section>
  );
}
