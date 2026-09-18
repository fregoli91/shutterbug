import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { requireCustomer } from '@/lib/customer-auth';
import { requirePrisma } from '@/lib/prisma';
import { TradeInWizard } from '@/components/trade-ins/TradeInWizard';

export const metadata: Metadata = { title: 'Start a Trade-In', robots: { index: false, follow: false } };
type Props = { searchParams?: Promise<{ draft?: string }> };

export default async function NewTradeInPage({ searchParams }: Props) {
  const customer = await requireCustomer('/account/trade-ins/new');
  const draftId = (await searchParams)?.draft;
  const draft = draftId ? await requirePrisma().tradeInSubmission.findFirst({
    where: { id: draftId, customerId: customer.id, status: 'DRAFT' },
    include: { images: { orderBy: { sortOrder: 'asc' } } }
  }) : null;
  if (draftId && !draft) notFound();

  return <section className="px-4 py-8 sm:px-6 lg:px-8"><div className="mx-auto max-w-5xl">
    <p className="text-sm font-bold uppercase tracking-[.2em] text-moss">Private trade-in workspace</p>
    <h1 className="mt-2 font-serif text-4xl font-bold text-ink sm:text-5xl">Tell us about your gear</h1>
    <p className="mt-3 max-w-3xl leading-7 text-ink/70">Your draft saves after the first step. Add honest details and at least two clear photos for a useful preliminary offer.</p>
    <TradeInWizard initial={draft ? {
      id: draft.id, reference: draft.reference, itemType: draft.itemType || '', brand: draft.brand, model: draft.model,
      modelUnknown: draft.modelUnknown, quantity: draft.quantity, condition: draft.condition || '', powersOn: draft.powersOn,
      functionalNotes: draft.functionalNotes, cosmeticNotes: draft.cosmeticNotes, includedItems: draft.includedItems,
      additionalNotes: draft.additionalNotes, payoutPreference: draft.payoutPreference || '', phone: draft.phone,
      localHandoffRequested: draft.localHandoffRequested,
      images: draft.images.map(image => ({ id: image.id, url: `/api/trade-ins/images/${image.id}` }))
    } : null} />
  </div></section>;
}