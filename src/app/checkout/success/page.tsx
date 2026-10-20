import Image from 'next/image';
import { OrderConfirmationClient } from '@/components/checkout/OrderConfirmationClient';
import { getCustomerSession } from '@/lib/customer-auth';
import { lookupOrderConfirmation } from '@/lib/order-confirmation-lookup';
import { orderConfirmationSelect, toOrderConfirmation } from '@/lib/order-confirmation';
import { guestOrderAccessMatches } from '@/lib/order-access';
import { getPrisma } from '@/lib/prisma';

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export const metadata = {
  title: 'Checkout Success'
};

export const dynamic = 'force-dynamic';

function asString(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? '' : value ?? '';
}

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const params = searchParams ? await searchParams : {};
  const sessionId = asString(params.session_id);
  const accessToken = asString(params.access);
  const prisma = getPrisma();
  const result = await lookupOrderConfirmation({
    sessionId,
    access: accessToken,
    getCustomer: getCustomerSession,
    matchesGuestAccess: guestOrderAccessMatches,
    findOrder: async (normalizedSessionId) => {
      if (!prisma) throw new Error('Order confirmation storage unavailable.');
      return prisma.order.findFirst({
        where: {
          OR: [
            { stripeCheckoutSessionId: normalizedSessionId },
            { providerReference: normalizedSessionId }
          ]
        },
        select: orderConfirmationSelect
      });
    }
  });
  if (result.kind === 'unavailable') console.error('Checkout success lookup unavailable.');
  const initialConfirmation = result.kind === 'found' ? toOrderConfirmation(result.order) : null;

  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-lg border border-ink/10 bg-white shadow-sm lg:grid-cols-[20rem_1fr]">
        <Image
          src="/shutterbug-checkout-success.png"
          alt="Shutterbug order complete celebration"
          width={1448}
          height={1086}
          sizes="(min-width: 1024px) 20rem, 100vw"
          className="h-full min-h-72 w-full bg-sand object-contain object-center"
        />
        <OrderConfirmationClient
          sessionId={sessionId}
          accessToken={accessToken}
          initialConfirmation={initialConfirmation}
        />
      </div>
    </section>
  );
}
