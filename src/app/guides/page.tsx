import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { guides } from '@/lib/guides';
import { site } from '@/lib/seo';
import { buildBreadcrumbJsonLd, jsonLdGraph } from '@/lib/seo-utils';

export const metadata: Metadata = {
  title: 'Camera Buying Guides',
  description:
    'Practical Shutterbug guides to buying used cameras, understanding vintage digital cameras, and choosing 35mm film gear.',
  alternates: { canonical: '/guides' },
  openGraph: {
    title: 'Camera Buying Guides | Shutterbug Camera Shop',
    description:
      'Used-camera checklists and clear explanations for vintage digital, CCD, and 35mm film camera shoppers.',
    url: `${site.domain}/guides`,
    type: 'website',
    images: [{ url: '/shutterbug-how-we-test-used.png', width: 1672, height: 941, alt: 'Shutterbug testing a used camera' }]
  }
};

export default function GuidesPage() {
  const structuredData = jsonLdGraph([
    {
      '@type': 'CollectionPage',
      name: 'Camera Buying Guides',
      description: metadata.description,
      url: `${site.domain}/guides`,
      isPartOf: { '@id': `${site.domain}/#website` },
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: guides.map((guide, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: guide.title,
          url: `${site.domain}/guides/${guide.slug}`
        }))
      }
    },
    buildBreadcrumbJsonLd([
      { name: 'Home', url: '/' },
      { name: 'Camera Guides', url: '/guides' }
    ])
  ]);

  return (
    <main className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <div className="mx-auto max-w-7xl">
        <header className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-moss">Shutterbug camera guides</p>
          <h1 className="mt-3 font-serif text-4xl font-bold text-ink sm:text-6xl">Buy older cameras with clarity.</h1>
          <p className="mt-5 text-base leading-7 text-ink/70 sm:text-lg sm:leading-8">
            Practical checklists and plain-language explanations for choosing used digital and film cameras, reading
            condition notes, and understanding the accessories an older camera needs.
          </p>
        </header>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {guides.map((guide) => (
            <article key={guide.slug} className="overflow-hidden rounded-lg border border-ink/10 bg-white shadow-sm">
              <Link href={`/guides/${guide.slug}`} className="group block">
                <Image
                  src={guide.image.src}
                  alt={guide.image.alt}
                  width={guide.image.width}
                  height={guide.image.height}
                  sizes="(min-width: 1024px) 33vw, 100vw"
                  className="aspect-[16/10] w-full bg-sand object-cover transition duration-300 group-hover:scale-[1.02]"
                />
                <div className="p-5 sm:p-6">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-moss">Camera guide</p>
                  <h2 className="mt-3 font-serif text-2xl font-bold text-ink">{guide.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-ink/68">{guide.summary}</p>
                  <span className="mt-5 inline-flex min-h-11 items-center font-semibold text-moss group-hover:text-ink">
                    Read {guide.title.toLowerCase()}
                  </span>
                </div>
              </Link>
            </article>
          ))}
        </div>

        <nav className="mt-12 rounded-lg border border-ink/10 bg-mint p-6" aria-label="Shop from camera guides">
          <p className="font-serif text-2xl font-bold text-ink">Ready to browse?</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/categories/vintage-digital-cameras" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink/72 hover:text-moss">
              Vintage digital cameras
            </Link>
            <Link href="/categories/film-cameras" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink/72 hover:text-moss">
              Film cameras
            </Link>
            <Link href="/categories/lenses" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink/72 hover:text-moss">
              Used camera lenses
            </Link>
            <Link href="/shop" className="rounded-full bg-forest px-4 py-2 text-sm font-semibold text-white hover:bg-moss">
              Shop all used gear
            </Link>
          </div>
        </nav>
      </div>
    </main>
  );
}
