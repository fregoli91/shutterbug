import { site } from '@/lib/seo';

export const metadata = {
  title: 'Contact',
  description: 'Contact Shutterbug Camera Shop about camera orders, trade-ins, and vintage camera inventory.'
};

export default function ContactPage() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-bold uppercase tracking-[0.28em] text-brass">Contact</p>
        <h1 className="mt-3 font-serif text-5xl font-bold text-ink">Questions, orders, and camera trade-ins</h1>
        <div className="mt-8 rounded-lg border border-ink/10 bg-white p-8 shadow-soft">
          <p className="text-lg leading-8 text-ink/72">
            Email us at <a className="font-semibold text-brass" href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a>. Replace this with your final support email, phone number, and contact form provider before launch.
          </p>
        </div>
      </div>
    </section>
  );
}