import Image from 'next/image';
import { OrderConfirmationClient } from '@/components/checkout/OrderConfirmationClient';
import { getCustomerSession } from '@/lib/customer-auth';
import { guestOrderAccessMatches } from '@/lib/order-access';
import { toOrderConfirmation } from '@/lib/order-confirmation';
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
  const customer = await getCustomerSession();
  const order =
    prisma && sessionId
      ? await prisma.order.findFirst({
          where: { OR: [{ stripeCheckoutSessionId: sessionId }, { providerReference: sessionId }] },
          include: { items: true }
        })
      : null;
  const isOwner = Boolean(customer && order?.customerId === customer.id);
  const hasGuestAccess = Boolean(order && guestOrderAccessMatches(order.guestAccessToken, accessToken));
  const initialConfirmation = order && (isOwner || hasGuestAccess) ? toOrderConfirmation(order) : null;

  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-lg border border-ink/10 bg-white shadow-sm lg:grid-cols-[20rem_1fr]">
        <Image
          src="/shutterbug-checkout-success.png"
          alt="Shutterbug order complete celebration"
          width={640}
          height={768}
          sizes="(min-width: 1024px) 20rem, 100vw"
          className="h-full min-h-72 w-full bg-sand object-cover object-center"
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