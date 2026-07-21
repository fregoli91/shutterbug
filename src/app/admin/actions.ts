'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {
  CameraFormat,
  CameraType,
  FulfillmentStatus,
  OrderStatus,
  PaymentStatus,
  ProductCondition,
  ProductImageRole,
  ProductStatus
} from '@/generated/prisma/client';
import { clearAdminSession, requireAdmin } from '@/lib/admin-auth';
import { sendShippingConfirmationEmail } from '@/lib/order-emails';
import { requirePrisma } from '@/lib/prisma';

function field(formData: FormData, name: string) {
  return String(formData.get(name) ?? '').trim();
}

function optionalField(formData: FormData, name: string) {
  return field(formData, name) || null;
}

function lines(formData: FormData, name: string) {
  return field(formData, name)
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function bool(formData: FormData, name: string) {
  return formData.get(name) === 'on';
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .slice(0, 90);
}

function parseProductForm(formData: FormData) {
  const title = field(formData, 'title');
  const model = field(formData, 'model');
  const price = Number(field(formData, 'price') || '0');
  const quantity = Number(field(formData, 'quantity') || '0');
  const heroImage = field(formData, 'heroImage');
  const galleryImages = lines(formData, 'galleryImages');
  const testedStatus = field(formData, 'testedStatus') || 'Tested';
  const conditionNotes = field(formData, 'conditionNotes');
  const selectedBrand = field(formData, 'brand');
  const customBrand = field(formData, 'customBrand');
  const brand = selectedBrand === 'Other / Unlisted Brand' && customBrand ? customBrand : selectedBrand;
  const categorySlug = field(formData, 'categorySlug');
  const subcategorySlug = field(formData, 'subcategorySlug');
  const categorySlugs = Array.from(new Set([...lines(formData, 'categorySlugs'), subcategorySlug].filter(Boolean)));
  const slug = field(formData, 'slug') || slugify(`${brand} ${model || title}`);
  const partsRepair = bool(formData, 'partsRepair') || field(formData, 'condition') === ProductCondition.FOR_PARTS;

  return {
    data: {
      sku: field(formData, 'sku') || null,
      slug,
      title,
      brand,
      manufacturer: field(formData, 'manufacturer') || brand,
      model,
      categorySlug,
      categorySlugs,
      subcategorySlug,
      productType: field(formData, 'productType'),
      cameraType: field(formData, 'cameraType') as CameraType,
      format: field(formData, 'format') as CameraFormat,
      condition: field(formData, 'condition') as ProductCondition,
      functionalStatus: testedStatus,
      testedStatus,
      conditionSummary: conditionNotes,
      conditionNotes,
      priceCents: Math.round(price * 100),
      quantity: Number.isFinite(quantity) ? quantity : 0,
      status: field(formData, 'status') as ProductStatus,
      description: field(formData, 'description'),
      shortDescription: field(formData, 'shortDescription'),
      seoTitle: field(formData, 'seoTitle') || null,
      seoDescription: field(formData, 'seoDescription'),
      tags: lines(formData, 'tags'),
      lensMount: field(formData, 'lensMount'),
      filmFormat: field(formData, 'filmFormat'),
      storageType: field(formData, 'storageType'),
      includesBattery: bool(formData, 'includesBattery'),
      includesCharger: bool(formData, 'includesCharger'),
      includesMemoryCard: bool(formData, 'includesMemoryCard'),
      includesCase: bool(formData, 'includesCase'),
      includesStrap: bool(formData, 'includesStrap'),
      includesManual: bool(formData, 'includesManual'),
      includesOriginalBox: bool(formData, 'includesOriginalBox'),
      actualPhotos: bool(formData, 'actualPhotos'),
      samplePhotos: bool(formData, 'samplePhotos'),
      partsRepair,
      forPartsOrRepair: partsRepair,
      featured: bool(formData, 'featured'),
      newArrival: bool(formData, 'newArrival'),
      badges: lines(formData, 'badges'),
      included: lines(formData, 'included'),
      doesNotInclude: lines(formData, 'doesNotInclude'),
      tested: lines(formData, 'tested'),
      goodFor: lines(formData, 'goodFor'),
      cosmeticNotes: lines(formData, 'cosmeticNotes'),
      functionalNotes: lines(formData, 'functionalNotes'),
      flaws: lines(formData, 'flaws'),
      notes: lines(formData, 'notes'),
      shippingNote: field(formData, 'shippingNote'),
      returnsNote: field(formData, 'returnsNote'),
      mainImageUrl: heroImage,
      imageUrls: galleryImages
    },
    images: Array.from(new Set([heroImage, ...galleryImages].filter(Boolean))).map((url, index) => ({
      url,
      alt: title,
      role: index === 0 ? ProductImageRole.HERO : ProductImageRole.GALLERY,
      sortOrder: index
    }))
  };
}

export async function logoutAction() {
  await clearAdminSession();
  redirect('/admin/login');
}

export async function createProductAction(formData: FormData) {
  await requireAdmin();
  const prisma = requirePrisma();
  const parsed = parseProductForm(formData);

  const product = await prisma.product.create({
    data: {
      ...parsed.data,
      images: {
        create: parsed.images
      }
    }
  });

  revalidatePath('/');
  revalidatePath('/shop');
  revalidatePath('/sitemap.xml');
  revalidatePath('/google-merchant-feed.xml');
  redirect(`/admin/products/${product.id}/edit?created=1`);
}

export async function updateProductAction(formData: FormData) {
  await requireAdmin();
  const prisma = requirePrisma();
  const id = field(formData, 'id');
  const parsed = parseProductForm(formData);

  await prisma.product.update({
    where: { id },
    data: {
      ...parsed.data,
      images: {
        deleteMany: {},
        create: parsed.images
      }
    }
  });

  revalidatePath('/');
  revalidatePath('/shop');
  revalidatePath(`/shop/${parsed.data.slug}`);
  revalidatePath('/sitemap.xml');
  revalidatePath('/google-merchant-feed.xml');
  redirect(`/admin/products/${id}/edit?saved=1`);
}

export async function archiveProductAction(formData: FormData) {
  await requireAdmin();
  const prisma = requirePrisma();
  const id = field(formData, 'id');
  const product = await prisma.product.update({
    where: { id },
    data: { status: ProductStatus.ARCHIVED }
  });

  revalidatePath('/');
  revalidatePath('/shop');
  revalidatePath(`/shop/${product.slug}`);
  revalidatePath('/sitemap.xml');
  revalidatePath('/google-merchant-feed.xml');
  redirect('/admin/products?archived=1');
}

export async function deleteProductAction(formData: FormData) {
  await requireAdmin();
  const prisma = requirePrisma();
  const id = field(formData, 'id');
  await prisma.product.delete({ where: { id } });

  revalidatePath('/');
  revalidatePath('/shop');
  revalidatePath('/sitemap.xml');
  revalidatePath('/google-merchant-feed.xml');
  redirect('/admin/products?deleted=1');
}

function adminOrderRedirect(id: string, params: Record<string, string>): never {
  const query = new URLSearchParams(params);
  redirect(`/admin/orders/${id}?${query.toString()}`);
}

function revalidateOrderPaths(id: string) {
  revalidatePath('/admin/orders');
  revalidatePath(`/admin/orders/${id}`);
  revalidatePath(`/orders/${id}`);
  revalidatePath('/account/orders');
  revalidatePath(`/account/orders/${id}`);
}

function fulfillmentFields(formData: FormData) {
  return {
    carrier: optionalField(formData, 'carrier'),
    trackingNumber: optionalField(formData, 'trackingNumber'),
    trackingUrl: optionalField(formData, 'trackingUrl'),
    adminNotes: optionalField(formData, 'adminNotes')
  };
}

function isPaidFulfillable(order: { paymentStatus: PaymentStatus; status: OrderStatus }) {
  const unavailableStatuses: OrderStatus[] = [OrderStatus.PENDING_PAYMENT, OrderStatus.CANCELLED, OrderStatus.REFUNDED];
  return order.paymentStatus === PaymentStatus.PAID && !unavailableStatuses.includes(order.status);
}

export async function updateOrderFulfillmentDetailsAction(formData: FormData) {
  await requireAdmin();
  const prisma = requirePrisma();
  const id = field(formData, 'id');
  const details = fulfillmentFields(formData);

  await prisma.order.update({
    where: { id },
    data: {
      ...details,
      history: {
        create: { message: 'Fulfillment details updated.' }
      }
    }
  });

  revalidateOrderPaths(id);
  adminOrderRedirect(id, { saved: '1' });
}

export async function markOrderProcessingAction(formData: FormData) {
  await requireAdmin();
  const prisma = requirePrisma();
  const id = field(formData, 'id');
  const order = await prisma.order.findUnique({
    where: { id },
    select: { paymentStatus: true, status: true, processingAt: true }
  });

  const alreadyFulfilledStatuses: OrderStatus[] = [OrderStatus.SHIPPED, OrderStatus.DELIVERED];
  if (!order || !isPaidFulfillable(order) || alreadyFulfilledStatuses.includes(order.status)) {
    adminOrderRedirect(id, { error: 'invalid-transition' });
  }

  await prisma.order.update({
    where: { id },
    data: {
      status: OrderStatus.PROCESSING,
      fulfillmentStatus: FulfillmentStatus.PROCESSING,
      processingAt: order.processingAt ?? new Date(),
      history: {
        create: { message: 'Marked processing.' }
      }
    }
  });

  revalidateOrderPaths(id);
  adminOrderRedirect(id, { processing: '1' });
}

export async function markOrderShippedAction(formData: FormData) {
  await requireAdmin();
  const prisma = requirePrisma();
  const id = field(formData, 'id');
  const details = fulfillmentFields(formData);
  if (!details.trackingNumber) {
    adminOrderRedirect(id, { error: 'tracking-required' });
  }

  const order = await prisma.order.findUnique({
    where: { id },
    select: { paymentStatus: true, status: true, processingAt: true, shippedAt: true }
  });

  if (!order || !isPaidFulfillable(order) || order.status === OrderStatus.DELIVERED) {
    adminOrderRedirect(id, { error: 'invalid-transition' });
  }

  await prisma.order.update({
    where: { id },
    data: {
      ...details,
      status: OrderStatus.SHIPPED,
      fulfillmentStatus: FulfillmentStatus.SHIPPED,
      processingAt: order.processingAt ?? new Date(),
      shippedAt: order.shippedAt ?? new Date(),
      history: {
        create: {
          message: details.carrier
            ? `Marked shipped with ${details.carrier}: ${details.trackingNumber}`
            : `Marked shipped: ${details.trackingNumber}`
        }
      }
    }
  });

  await sendShippingConfirmationEmail(id);
  revalidateOrderPaths(id);
  redirect(`/admin/orders/${id}?shipped=1`);
}

export async function markOrderDeliveredAction(formData: FormData) {
  await requireAdmin();
  const prisma = requirePrisma();
  const id = field(formData, 'id');
  const order = await prisma.order.findUnique({
    where: { id },
    select: { paymentStatus: true, status: true, shippedAt: true, deliveredAt: true }
  });

  const deliverableStatuses: OrderStatus[] = [OrderStatus.SHIPPED, OrderStatus.DELIVERED];
  if (!order || order.paymentStatus !== PaymentStatus.PAID || !deliverableStatuses.includes(order.status)) {
    adminOrderRedirect(id, { error: 'invalid-transition' });
  }

  await prisma.order.update({
    where: { id },
    data: {
      status: OrderStatus.DELIVERED,
      fulfillmentStatus: FulfillmentStatus.DELIVERED,
      shippedAt: order.shippedAt ?? new Date(),
      deliveredAt: order.deliveredAt ?? new Date(),
      history: {
        create: { message: 'Marked delivered.' }
      }
    }
  });

  revalidateOrderPaths(id);
  adminOrderRedirect(id, { delivered: '1' });
}

export async function markOrderCancelledAction(formData: FormData) {
  await requireAdmin();
  const prisma = requirePrisma();
  const id = field(formData, 'id');
  const order = await prisma.order.findUnique({
    where: { id },
    select: { paymentStatus: true, status: true, cancelledAt: true }
  });

  const uncancellableStatuses: OrderStatus[] = [
    OrderStatus.SHIPPED,
    OrderStatus.DELIVERED,
    OrderStatus.REFUNDED,
    OrderStatus.CANCELLED
  ];
  if (!order || order.paymentStatus === PaymentStatus.PAID || uncancellableStatuses.includes(order.status)) {
    adminOrderRedirect(id, { error: 'cancel-paid-order' });
  }

  await prisma.order.update({
    where: { id },
    data: {
      status: OrderStatus.CANCELLED,
      paymentStatus: PaymentStatus.CANCELED,
      fulfillmentStatus: FulfillmentStatus.CANCELED,
      cancelledAt: order.cancelledAt ?? new Date(),
      history: {
        create: { message: 'Marked cancelled.' }
      }
    }
  });

  revalidateOrderPaths(id);
  adminOrderRedirect(id, { cancelled: '1' });
}

export async function markOrderRefundedAction(formData: FormData) {
  await requireAdmin();
  const prisma = requirePrisma();
  const id = field(formData, 'id');
  const order = await prisma.order.findUnique({
    where: { id },
    select: { paymentStatus: true, status: true, refundedAt: true }
  });

  if (!order || order.paymentStatus !== PaymentStatus.PAID || order.status === OrderStatus.PENDING_PAYMENT) {
    adminOrderRedirect(id, { error: 'invalid-transition' });
  }

  await prisma.order.update({
    where: { id },
    data: {
      status: OrderStatus.REFUNDED,
      paymentStatus: PaymentStatus.REFUNDED,
      fulfillmentStatus: FulfillmentStatus.CANCELED,
      refundedAt: order.refundedAt ?? new Date(),
      history: {
        create: { message: 'Marked refunded in Shutterbug admin. Process any money movement in Stripe separately if needed.' }
      }
    }
  });

  revalidateOrderPaths(id);
  adminOrderRedirect(id, { refunded: '1' });
}
