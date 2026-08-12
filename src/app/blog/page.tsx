import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { blogCategories, blogPosts, formatBlogDate } from '@/lib/blog';
import { site } from '@/lib/seo';
import { buildBreadcrumbJsonLd, jsonLdGraph } from '@/lib/seo-utils';

const journalImage = {
  src: '/blog/shutterbug-journal.webp',
  width: 1664,
  height: 936,
  alt: 'The Shutterbug Journal with cameras, photography books, film, and the Shutterbug mascot'
};

export const metadata: Metadata = {
  title: 'Shutterbug Journal',
  description:
    'Stories, camera histories, buying guides, and behind-the-scenes updates from Shutterbug Camera Shop.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Shutterbug Journal | Cameras, Stories & Shop Updates',
    description:
      'Stories about used cameras, vintage photography, the Shutterbug shop, and the people and details behind the shelves.',
    url: `${site.domain}/blog`,
    siteName: site.name,
    type: 'website',
    images: [{
      url: journalImage.src,
      width: journalImage.width,
      height: journalImage.height,
      alt: journalImage.alt
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shutterbug Journal | Cameras, Stories & Shop Updates',
    description: 'Camera stories, practical guides, and behind-the-scenes updates from Shutterbug Camera Shop.',
    images: [journalImage.src]
  }
};

export default function BlogPage() {
  const featuredPost = blogPosts.find((post) => post.featured) ?? blogPosts[0];
  const otherPosts = blogPosts.filter((post) => post.slug !== featuredPost.slug);
  const structuredData = jsonLdGraph([
    {
      '@type': 'Blog',
      '@id': `${site.domain}/blog#blog`,
      name: 'Shutterbug Journal',
      description: metadata.description,
      url: `${site.domain}/blog`,
      publisher: { '@id': `${site.domain}/#organization` },
      blogPost: blogPosts.map((post) => ({
        '@type': 'BlogPosting',
        headline: post.title,
        url: `${site.domain}/blog/${post.slug}`,
        datePublished: post.publishedAt,
        dateModified: post.updatedAt
      }))
    },
    buildBreadcrumbJsonLd([
      { name: 'Home', url: '/' },
      { name: 'Shutterbug Journal', url: '/blog' }
    ])
  ]);

  return (
    <div className="pb-16 sm:pb-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <header className="border-b border-ink/10 bg-mint/55 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-moss">The Shutterbug Journal</p>
          <h1 className="mt-3 max-w-4xl font-serif text-4xl font-bold text-ink sm:text-6xl">
            Camera stories from behind the shelves.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-ink/70 sm:text-lg sm:leading-8">
            Shop updates, camera histories, thoughtful buying guides, and a closer look at the gear and clay-art world
            that make Shutterbug feel like Shutterbug.
          </p>
          <div className="mt-7 flex flex-wrap gap-2" aria-label="Journal topics">
            {blogCategories.map((category) => (
              <span key={category} className="rounded-full border border-ink/10 bg-cream px-3 py-2 text-xs font-semibold text-ink/65">
                {category}
              </span>
            ))}
          </div>
          <Image
            src={journalImage.src}
            alt={journalImage.alt}
            width={journalImage.width}
            height={journalImage.height}
            priority
            sizes="(min-width: 1280px) 1280px, 100vw"
            className="mt-8 h-auto w-full rounded-lg border border-ink/10 bg-cream object-contain shadow-sm"
          />
        </div>
      </header>

      <section className="px-4 py-10 sm:px-6 sm:py-14 lg:px-8" aria-labelledby="featured-story">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-moss">Featured story</p>
          <h2 id="featured-story" className="mt-2 font-serif text-3xl font-bold text-ink sm:text-4xl">
            Latest from the journal
          </h2>
          <article className="mt-7 overflow-hidden rounded-lg border border-ink/10 bg-white shadow-sm">
            <Link href={`/blog/${featuredPost.slug}`} className="group grid lg:grid-cols-[1.35fr_1fr]">
              <Image
                src={featuredPost.image.src}
                alt={featuredPost.image.alt}
                width={featuredPost.image.width}
                height={featuredPost.image.height}
                priority
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="h-auto w-full bg-sand object-cover transition duration-300 group-hover:scale-[1.01] lg:h-full"
              />
              <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-bold uppercase tracking-[0.16em] text-moss">
                  <span>{featuredPost.category}</span>
                  <span aria-hidden="true">/</span>
                  <time dateTime={featuredPost.publishedAt}>{formatBlogDate(featuredPost.publishedAt)}</time>
                </div>
                <h3 className="mt-4 font-serif text-3xl font-bold leading-tight text-ink sm:text-4xl">
                  {featuredPost.title}
                </h3>
                <p className="mt-4 text-base leading-7 text-ink/70">{featuredPost.summary}</p>
                <span className="mt-6 inline-flex min-h-11 items-center font-semibold text-moss transition group-hover:text-ink">
                  Read the story <span className="ml-2" aria-hidden="true">-&gt;</span>
                </span>
              </div>
            </Link>
          </article>
        </div>
      </section>

      {otherPosts.length > 0 ? (
        <section className="px-4 pb-12 sm:px-6 sm:pb-14 lg:px-8" aria-labelledby="more-journal-stories">
          <div className="mx-auto max-w-7xl">
            <h2 id="more-journal-stories" className="font-serif text-3xl font-bold text-ink sm:text-4xl">
              More from the journal
            </h2>
            <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {otherPosts.map((post) => (
                <article key={post.slug} className="overflow-hidden rounded-lg border border-ink/10 bg-white shadow-sm">
                  <Link href={`/blog/${post.slug}`} className="group block h-full">
                    <Image
                      src={post.image.src}
                      alt={post.image.alt}
                      width={post.image.width}
                      height={post.image.height}
                      sizes="(min-width: 1024px) 30vw, (min-width: 768px) 46vw, 100vw"
                      className="aspect-[4/3] w-full bg-sand object-cover"
                    />
                    <div className="p-5 sm:p-6">
                      <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-moss">
                        <span>{post.category}</span>
                        <span aria-hidden="true">/</span>
                        <time dateTime={post.publishedAt}>{formatBlogDate(post.publishedAt)}</time>
                      </div>
                      <h3 className="mt-3 font-serif text-2xl font-bold leading-tight text-ink transition group-hover:text-moss">
                        {post.title}
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-ink/65">{post.summary}</p>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="border-y border-ink/10 bg-white/55 px-4 py-10 sm:px-6 sm:py-12 lg:px-8" aria-labelledby="explore-shutterbug">
        <div className="mx-auto max-w-7xl">
          <h2 id="explore-shutterbug" className="font-serif text-3xl font-bold text-ink">Explore Shutterbug</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'Camera Buying Guides', href: '/guides', copy: 'Practical help for choosing and understanding older gear.' },
              { label: 'Vintage Digital Cameras', href: '/categories/vintage-digital-cameras', copy: 'Browse compact digital cameras from earlier generations.' },
              { label: 'Film Cameras', href: '/categories/film-cameras', copy: 'Explore 35mm, instant, and other film-camera formats.' },
              { label: 'About Shutterbug', href: '/about', copy: 'Learn where the shop started and what matters to us.' }
            ].map((item) => (
              <Link key={item.href} href={item.href} className="rounded-lg border border-ink/10 bg-cream p-5 transition hover:border-moss/40 hover:bg-mint">
                <h3 className="font-serif text-xl font-bold text-ink">{item.label}</h3>
                <p className="mt-2 text-sm leading-6 text-ink/65">{item.copy}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
