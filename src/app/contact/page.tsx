import { site } from '@/lib/seo';

export const metadata = {
  title: 'Contact Customer Service',
  description: 'Contact Shutterbug Camera Shop about camera orders, trade-ins, condition notes, and vintage camera inventory.'
};

export default function ContactPage() {
  return (
    <section className="px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-bold uppercase tracking-[0.28em] text-moss">Customer service</p>
        <h1 className="mt-3 font-serif text-5xl font-bold text-ink">Questions before you buy? Ask Shutterbug.</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-ink/70">
          Reach out about orders, tested functions, included accessories, restock requests, or camera trade-ins.
        </p>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-lg border border-ink/10 bg-white p-8 shadow-soft">
            <p className="font-serif text-3xl font-bold text-ink">Email support</p>
            <p className="mt-4 text-lg leading-8 text-ink/72">
              Email us at{' '}
              <a className="font-semibold text-moss" href={`mailto:${site.supportEmail}`}>
                {site.supportEmail}
              </a>
              .
            </p>
          </div>
          <div className="rounded-lg border border-ink/10 bg-white p-8 shadow-sm">
            <p className="font-serif text-3xl font-bold text-ink">Call customer service</p>
            <p className="mt-4 text-lg leading-8 text-ink/72">
              Call{' '}
              <a className="font-semibold text-moss" href={site.supportPhoneHref}>
                {site.supportPhone}
              </a>
              .
            </p>
          </div>
          <div className="rounded-lg border border-ink/10 bg-white p-8 shadow-sm">
            <p className="font-serif text-3xl font-bold text-ink">Helpful details</p>
            <ul className="mt-4 grid list-disc gap-2 pl-5 text-sm leading-6 text-ink/70">
              <li>Camera model or SKU if you are asking about a listing.</li>
              <li>Photos and accessory notes if you want to sell gear.</li>
              <li>Any condition, testing, shipping, or return questions.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
