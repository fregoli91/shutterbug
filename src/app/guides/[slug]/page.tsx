import { safeJsonLd } from '@/lib/security';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getGuide, guides } from '@/lib/guides';
import { site } from '@/lib/seo';
import { buildBreadcrumbJsonLd, imageUrl, jsonLdGraph } from '@/lib/seo-utils';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};

  return {
    title: guide.seoTitle,
    description: guide.description,
    alternates: { canonical: `/guides/${guide.slug}` },
    openGraph: {
      title: `${guide.seoTitle} | Shutterbug Camera Shop`,
      description: guide.description,
      url: `${site.domain}/guides/${guide.slug}`,
      type: 'article',
      publishedTime: guide.publishedAt,
      modifiedTime: guide.updatedAt,
      images: [{ url: guide.image.src, width: guide.image.width, height: guide.image.height, alt: guide.image.alt }]
    }
  };
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const structuredData = jsonLdGraph([
    {
      '@type': 'Article',
      '@id': `${site.domain}/guides/${guide.slug}#article`,
      headline: guide.title,
      description: guide.description,
      image: imageUrl(guide.image.src),
      datePublished: guide.publishedAt,
      dateModified: guide.updatedAt,
      author: { '@id': `${site.domain}/#organization` },
      publisher: { '@id': `${site.domain}/#organization` },
      mainEntityOfPage: `${site.domain}/guides/${guide.slug}`,
      isPartOf: { '@id': `${site.domain}/#website` }
    },
    buildBreadcrumbJsonLd([
      { name: 'Home', url: '/' },
      { name: 'Camera Guides', url: '/guides' },
      { name: guide.title, url: `/guides/${guide.slug}` }
    ])
  ]);

  return (
    <article className="px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(structuredData) }} />
      <div className="mx-auto max-w-5xl">
        <nav className="flex flex-wrap items-center gap-2 text-sm text-ink/60" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-moss">Home</Link>
          <span aria-hidden="true">/</span>
          <Link href="/guides" className="hover:text-moss">Camera guides</Link>
        </nav>

        <header className="mt-7 max-w-4xl">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-moss">Shutterbug camera guide</p>
          <h1 className="mt-3 font-serif text-4xl font-bold text-ink sm:text-6xl">{guide.title}</h1>
          <p className="mt-5 text-lg leading-8 text-ink/70">{guide.summary}</p>
        </header>

        <Image
          src={guide.image.src}
          alt={guide.image.alt}
          width={guide.image.width}
          height={guide.image.height}
          priority
          sizes="(min-width: 1024px) 64rem, 100vw"
          className="mt-8 aspect-[16/9] w-full rounded-lg border border-ink/10 bg-sand object-cover shadow-sm"
        />

        <div className="mx-auto mt-10 max-w-3xl">
          {guide.sections.map((section) => (
            <section key={section.heading} className="border-t border-ink/10 py-8 first:border-t-0 first:pt-0">
              <h2 className="font-serif text-3xl font-bold text-ink">{section.heading}</h2>
              <div className="mt-4 grid gap-4 text-base leading-8 text-ink/72">
                {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
              {section.bullets?.length ? (
                <ul className="mt-5 grid list-disc gap-3 pl-5 text-base leading-7 text-ink/72">
                  {section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
                </ul>
              ) : null}
            </section>
          ))}
        </div>

        <nav className="mx-auto mt-8 max-w-3xl rounded-lg border border-ink/10 bg-mint p-6" aria-label="Related camera shopping links">
          <p className="font-serif text-2xl font-bold text-ink">Keep exploring</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {guide.relatedLinks.map((link) => (
              <Link key={link.href} href={link.href} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink/72 hover:text-moss">
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </article>
  );
}
