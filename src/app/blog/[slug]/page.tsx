import { safeJsonLd } from '@/lib/security';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { blogPosts, formatBlogDate, getBlogPost, type BlogTextSegment } from '@/lib/blog';
import { site } from '@/lib/seo';
import { buildBreadcrumbJsonLd, imageUrl, jsonLdGraph } from '@/lib/seo-utils';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};

  return {
    title: { absolute: post.seoTitle },
    description: post.description,
    authors: [{ name: post.author }],
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.seoTitle,
      description: post.description,
      url: `${site.domain}/blog/${post.slug}`,
      siteName: site.name,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author],
      tags: post.tags,
      images: [{ url: post.image.src, width: post.image.width, height: post.image.height, alt: post.image.alt }]
    },
    twitter: {
      card: 'summary_large_image',
      title: post.seoTitle,
      description: post.description,
      images: [post.image.src]
    }
  };
}

function RichText({ segments }: { segments: BlogTextSegment[] }) {
  return (
    <>
      {segments.map((segment, index) =>
        segment.href ? (
          <Link
            key={`${segment.text}-${index}`}
            href={segment.href}
            className="font-semibold text-moss underline decoration-moss/25 underline-offset-4 hover:text-ink"
          >
            {segment.text}
          </Link>
        ) : (
          <span key={`${segment.text}-${index}`}>{segment.text}</span>
        )
      )}
    </>
  );
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const articleUrl = `${site.domain}/blog/${post.slug}`;
  const structuredData = jsonLdGraph([
    {
      '@type': 'BlogPosting',
      '@id': `${articleUrl}#article`,
      headline: post.title,
      description: post.description,
      image: {
        '@type': 'ImageObject',
        url: imageUrl(post.image.src),
        width: post.image.width,
        height: post.image.height
      },
      datePublished: post.publishedAt,
      dateModified: post.updatedAt,
      articleSection: post.category,
      keywords: post.tags.join(', '),
      author: { '@id': `${site.domain}/#organization`, name: post.author },
      publisher: { '@id': `${site.domain}/#organization` },
      mainEntityOfPage: articleUrl,
      isPartOf: { '@id': `${site.domain}/blog#blog` }
    },
    buildBreadcrumbJsonLd([
      { name: 'Home', url: '/' },
      { name: 'Shutterbug Journal', url: '/blog' },
      { name: post.title, url: `/blog/${post.slug}` }
    ])
  ]);

  return (
    <article className="pb-16 sm:pb-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(structuredData) }} />
      <header className="px-4 pb-8 pt-9 sm:px-6 sm:pb-10 sm:pt-12 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <nav className="flex flex-wrap items-center gap-2 text-sm text-ink/60" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-moss">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/blog" className="hover:text-moss">Shutterbug Journal</Link>
          </nav>
          <div className="mt-8 max-w-4xl">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-bold uppercase tracking-[0.18em] text-moss">
              <span>{post.category}</span>
              {post.tags.map((tag) => <span key={tag} className="text-ink/48">{tag}</span>)}
            </div>
            <h1 className="mt-4 font-serif text-4xl font-bold leading-tight text-ink sm:text-6xl">{post.title}</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-ink/70">{post.summary}</p>
            <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink/55">
              <span>By {post.author}</span>
              <span aria-hidden="true">/</span>
              <time dateTime={post.publishedAt}>{formatBlogDate(post.publishedAt)}</time>
              <span aria-hidden="true">/</span>
              <span>{post.readingTime}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="px-4 sm:px-6 lg:px-8">
        <Image
          src={post.image.src}
          alt={post.image.alt}
          width={post.image.width}
          height={post.image.height}
          priority
          sizes="(min-width: 1280px) 72rem, 100vw"
          className="mx-auto h-auto w-full max-w-6xl rounded-lg border border-ink/10 bg-sand shadow-sm"
        />
      </div>

      <div className="mx-auto mt-10 max-w-3xl px-4 sm:mt-14 sm:px-6">
        <div className="grid gap-5 text-[1.05rem] leading-8 text-ink/76">
          {post.introduction.map((paragraph, index) => (
            <p key={index}><RichText segments={paragraph} /></p>
          ))}
        </div>

        {post.sections.map((section) => (
          <section key={section.heading} className="border-t border-ink/10 py-9 first:mt-10 sm:py-11">
            <h2 className="font-serif text-3xl font-bold leading-tight text-ink sm:text-4xl">{section.heading}</h2>
            {section.callout ? (
              <p className="mt-6 rounded-lg border-l-4 border-moss bg-mint px-5 py-5 font-serif text-xl font-bold leading-8 text-ink sm:px-6 sm:text-2xl">
                {section.callout}
              </p>
            ) : null}
            <div className="mt-5 grid gap-5 text-[1.05rem] leading-8 text-ink/76">
              {section.paragraphs.map((paragraph, index) => (
                <p key={index}><RichText segments={paragraph} /></p>
              ))}
            </div>
            {section.items?.length ? (
              <ul className="mt-6 grid gap-3 text-[1.02rem] leading-7 text-ink/76 sm:grid-cols-2">
                {section.items.map((item) => (
                  <li key={item} className="flex gap-3 rounded-lg bg-mint/60 px-4 py-3">
                    <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-moss" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : null}
            {section.closingParagraphs?.length ? (
              <div className="mt-5 grid gap-5 text-[1.05rem] leading-8 text-ink/76">
                {section.closingParagraphs.map((paragraph, index) => (
                  <p key={index}><RichText segments={paragraph} /></p>
                ))}
              </div>
            ) : null}
          </section>
        ))}

        <nav className="mt-2 rounded-lg border border-ink/10 bg-mint p-6 sm:p-7" aria-label="Continue exploring Shutterbug">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-moss">Keep exploring</p>
          <h2 className="mt-2 font-serif text-2xl font-bold text-ink">The next shelf is ready.</h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {post.relatedLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex min-h-11 items-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink/72 transition hover:text-moss"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </article>
  );
}
