import Image from 'next/image';
import { site } from '@/lib/seo';

export const metadata = {
  title: 'Contact Customer Service',
  description: 'Contact Shutterbug Camera Shop about camera orders, trade-ins, condition notes, and vintage camera inventory.'
};

export default function ContactPage() {
  return (
    <section className="px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[1fr_28rem] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-moss">Customer service</p>
            <h1 className="mt-3 font-serif text-5xl font-bold text-ink">Questions before you buy? Ask Shutterbug.</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-ink/70">
              Reach out about orders, tested functions, included accessories, restock requests, or camera trade-ins.
            </p>
          </div>
          <Image
            src="/shutterbug-customer-service-desk.png"
            alt="Shutterbug customer care desk helping a camera shopper"
            width={640}
            height={640}
            sizes="(min-width: 1024px) 28rem, 100vw"
            className="aspect-square w-full rounded-lg border border-ink/10 bg-sand object-cover object-center shadow-sm"
          />
        </div>
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

        <div className="mt-8 grid gap-6 rounded-lg border border-ink/10 bg-cream p-6 shadow-soft lg:grid-cols-[1fr_1fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-moss">Support topics</p>
            <h2 className="mt-3 font-serif text-3xl font-bold text-ink">We can help before and after checkout.</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {['Order status', 'Condition questions', 'Included accessories', 'Returns', 'Shipping', 'Trade-ins'].map((topic) => (
                <p key={topic} className="rounded-lg border border-ink/10 bg-white px-4 py-3 text-sm font-semibold text-ink">
                  {topic}
                </p>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-ink/10 bg-white p-5">
            <p className="font-serif text-2xl font-bold text-ink">For fastest help</p>
            <ul className="mt-4 grid list-disc gap-2 pl-5 text-sm leading-6 text-ink/68">
              <li>For orders, include your order number and the email used at checkout.</li>
              <li>For product questions, include the product title, brand, model, or listing URL.</li>
              <li>For returns, include photos of the item, packaging, accessories, and the issue.</li>
              <li>For trade-ins, include clear photos, model names, included accessories, and known issues.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
