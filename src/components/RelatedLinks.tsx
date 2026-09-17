import Link from 'next/link';

export function RelatedLinks({ title, links }: { title: string; links: Array<{ label: string; href: string }> }) {
  if (!links.length) return null;
  return <nav aria-label={title} className="rounded-lg border border-ink/10 bg-mint p-6">
    <h2 className="font-serif text-2xl font-bold text-ink">{title}</h2>
    <div className="mt-4 flex flex-wrap gap-2">
      {links.map((link) => <Link key={link.href} href={link.href} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink/72 hover:text-moss">{link.label}</Link>)}
    </div>
  </nav>;
}
