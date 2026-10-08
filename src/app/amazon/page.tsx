import { safeJsonLd } from '@/lib/security';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { site } from '@/lib/seo';
import { buildBreadcrumbJsonLd, jsonLdGraph } from '@/lib/seo-utils';

export const metadata: Metadata = {
  title: { absolute: 'Shutterbug Camera Shop on Amazon | Used Cameras & Gear' },
  description:
    'Find the official Shutterbug Camera Shop Amazon storefront, or shop tested used cameras, vintage digital cameras, printers, and gear directly from Shutterbug.',
  alternates: { canonical: '/amazon' },
  openGraph: {
    title: 'Shutterbug Camera Shop on Amazon | Used Cameras & Gear',
    description: 'Use the verified Shutterbug Amazon store link or browse current used camera and printer inventory directly.',
    url: `${site.domain}/amazon`,
    type: 'website',
    images: [{ url: '/shutterbug-amazon-store-banner.png', width: 2048, height: 682, alt: 'Visit Shutterbug Camera Shop on Amazon' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shutterbug Camera Shop on Amazon',
    description: 'Find the verified Shutterbug Amazon storefront and browse tested used cameras and gear.',
    images: ['/shutterbug-amazon-store-banner.png']
  }
};

const popularCollections = [
  ['Vintage digital cameras', '/categories/vintage-digital-cameras'],
  ['Point-and-shoot cameras', '/categories/point-and-shoot-cameras'],
  ['Film cameras', '/categories/film-cameras'],
  ['Camera lenses', '/categories/lenses'],
  ['Used printers', '/categories/printers'],
  ['Shop all inventory', '/shop']
];

const amazonFaqs = [
  {
    question: 'Does Shutterbug Camera Shop sell on Amazon?',
    answer:
      'Yes. Shutterbug Camera Shop maintains an Amazon storefront in addition to this website. Use the verified link on this page to avoid similarly named stores.'
  },
  {
    question: 'Is the same inventory available on Amazon and ShutterbugCameraShop.com?',
    answer:
      'Not always. Used cameras and gear are often one-of-a-kind, and listings can differ between sales channels. Check both storefronts when looking for a particular model.'
  },
  {
    question: 'What does Shutterbug Camera Shop sell?',
    answer:
      'Shutterbug specializes in used and vintage digital cameras, film cameras, lenses, accessories, printers, and clearly labeled parts or repair gear.'
  }
];

export default function AmazonPage() {
  const structuredData = jsonLdGraph([
    {
      '@type': 'WebPage',
      name: 'Shutterbug Camera Shop on Amazon',
      description: metadata.description,
      url: `${site.domain}/amazon`,
      isPartOf: { '@id': `${site.domain}/#website` },
      about: { '@id': `${site.domain}/#organization` },
      sameAs: site.amazonStoreUrl,
      relatedLink: site.amazonStoreUrl
    },
    buildBreadcrumbJsonLd([
      { name: 'Home', url: '/' },
      { name: 'Shutterbug on Amazon', url: '/amazon' }
    ]),
    {
      '@type': 'FAQPage',
      mainEntity: amazonFaqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer }
      }))
    }
  ]);

  return (
    <div className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(structuredData) }} />
      <div className="mx-auto max-w-6xl">
        <header className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-moss">Another way to shop Shutterbug</p>
          <h1 className="mt-3 font-serif text-4xl font-bold text-ink sm:text-6xl">Shop Shutterbug on Amazon.</h1>
          <p className="mt-5 text-lg leading-8 text-ink/70">
            Shutterbug Camera Shop also maintains an Amazon storefront. Inventory can differ between channels, so
            check both places when you are hunting for a particular used camera or piece of gear.
          </p>
        </header>

        <Image
          src="/shutterbug-amazon-store-banner.png"
          alt="Shutterbug Camera Shop banner inviting shoppers to visit its Amazon storefront"
          width={2048}
          height={682}
          priority
          sizes="(min-width: 1280px) 72rem, 100vw"
          className="mt-8 w-full rounded-lg border border-ink/10 bg-sand object-contain shadow-sm"
        />

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <section className="rounded-lg border border-ink/10 bg-white p-6 text-center shadow-sm">
            <h2 className="font-serif text-2xl font-bold text-ink">Visit our Amazon storefront</h2>
            <p className="mt-3 text-sm leading-7 text-ink/68">
              Use the verified storefront link below to view Shutterbug listings available through Amazon.
              Shutterbug Camera Shop is an independent business and is not owned or operated by Amazon.
            </p>
            {site.amazonStoreUrl ? (
              <a href={site.amazonStoreUrl} target="_blank" rel="noopener noreferrer external" aria-label="Visit the official Shutterbug Camera Shop storefront on Amazon" className="mt-5 inline-flex min-h-12 items-center rounded-full bg-forest px-6 py-3 font-semibold text-white hover:bg-moss">
                Visit Shutterbug on Amazon
              </a>
            ) : null}
          </section>
          <section className="rounded-lg border border-ink/10 bg-mint p-6 text-center">
            <h2 className="font-serif text-2xl font-bold text-ink">Shop directly with Shutterbug</h2>
            <p className="mt-3 text-sm leading-7 text-ink/68">
              Browse current used cameras, printers, lenses, and accessories with exact-item availability and clear
              condition details on ShutterbugCameraShop.com.
            </p>
            <Link href="/shop" className="mt-5 inline-flex min-h-12 items-center rounded-full border border-forest px-6 py-3 font-semibold text-forest hover:bg-white">
              Browse Shutterbug inventory
            </Link>
          </section>
        </div>

        <section className="mt-8 rounded-lg border border-ink/10 bg-white p-6 text-center shadow-sm sm:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-moss">Browse Shutterbug directly</p>
          <h2 className="mt-3 font-serif text-3xl font-bold text-ink">Popular used camera and gear collections</h2>
          <p className="mx-auto mt-3 max-w-3xl text-sm leading-7 text-ink/68">
            These collection pages show current Shutterbug inventory with exact-item photos, testing notes, included
            accessories, and disclosed flaws whenever those details apply.
          </p>
          <nav className="mt-6 flex flex-wrap justify-center gap-2" aria-label="Popular Shutterbug collections">
            {popularCollections.map(([label, href]) => (
              <Link key={href} href={href} className="rounded-full border border-ink/15 bg-cream px-4 py-2 text-sm font-semibold text-ink transition hover:border-moss hover:text-moss">
                {label}
              </Link>
            ))}
          </nav>
        </section>

        <section className="mt-8" aria-labelledby="amazon-shopping-questions">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-moss">Shopping questions</p>
            <h2 id="amazon-shopping-questions" className="mt-3 font-serif text-3xl font-bold text-ink">
              Shutterbug and Amazon
            </h2>
          </div>
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {amazonFaqs.map((faq) => (
              <article key={faq.question} className="rounded-lg border border-ink/10 bg-cream p-6 text-center">
                <h3 className="font-serif text-xl font-bold text-ink">{faq.question}</h3>
                <p className="mt-3 text-sm leading-7 text-ink/68">{faq.answer}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
