import {
  ProductCondition as DbProductCondition,
  ProductImageRole,
  ProductStatus as DbProductStatus,
  type Prisma
} from '@/generated/prisma/client';
import { getAvailabilityLabel, getCatalogProducts, isActiveProduct } from '@/lib/products';
import { requirePrisma } from '@/lib/prisma';
import { safeProductImageUrl } from '@/lib/security';

export type CartLineInput = { id?: string; quantity?: number };

export type CartValidationItem = {
  id: string;
  sku: string;
  slug: string;
  title: string;
  image: string;
  condition: string;
  statusLabel: string;
  requestedQuantity: number;
  validatedQuantity: number;
  availableQuantity: number;
  unitPriceCents: number;
  lineTotalCents: number;
  purchasable: boolean;
  issue?: string;
};

export type CartValidationResponse = {
  items: CartValidationItem[];
  subtotalCents: number;
  hasBlockingIssue: boolean;
  warnings: string[];
};

export type NormalizedCartLine = { id: string; quantity: number };

type DatabaseCartProduct = Prisma.ProductGetPayload<{ include: { images: true } }>;
type ProductReader = Pick<Prisma.TransactionClient, 'product'>;

export class CartInputError extends Error {}

export function normalizeCartLines(items: CartLineInput[]): NormalizedCartLine[] {
  if (!Array.isArray(items) || items.length > 50) throw new CartInputError('Invalid cart lines.');

  const lines = new Map<string, number>();
  for (const item of items) {
    if (!item || typeof item !== 'object') throw new CartInputError('Invalid cart item.');
    const id = typeof item.id === 'string' ? item.id.trim() : '';
    const quantity = item.quantity;
    if (!/^[A-Za-z0-9_-]{1,64}$/.test(id)) throw new CartInputError('Invalid product identifier.');
    if (!Number.isInteger(quantity) || quantity! < 1 || quantity! > 99) {
      throw new CartInputError('Invalid product quantity.');
    }

    const combined = (lines.get(id) ?? 0) + quantity!;
    if (combined > 99) throw new CartInputError('Invalid combined product quantity.');
    lines.set(id, combined);
  }

  return Array.from(lines, ([id, quantity]) => ({ id, quantity }));
}

function issueResponse(id: string, quantity: number, issue: string): CartValidationItem {
  return {
    id,
    sku: '',
    slug: '',
    title: 'Unavailable item',
    image: '/shutterbug-product-placeholder.png',
    condition: 'Unavailable',
    statusLabel: 'Unavailable',
    requestedQuantity: quantity,
    validatedQuantity: 0,
    availableQuantity: 0,
    unitPriceCents: 0,
    lineTotalCents: 0,
    purchasable: false,
    issue
  };
}

function statusLabel(status: DbProductStatus) {
  if (status === DbProductStatus.ACTIVE) return 'Active';
  if (status === DbProductStatus.SOLD_OUT) return 'Sold out';
  if (status === DbProductStatus.ARCHIVED) return 'Archived';
  return 'Draft';
}

function conditionLabel(condition: DbProductCondition) {
  if (condition === DbProductCondition.NEW) return 'New';
  if (condition === DbProductCondition.OPEN_BOX) return 'Open Box';
  if (condition === DbProductCondition.USED_EXCELLENT) return 'Used - Excellent';
  if (condition === DbProductCondition.USED_GOOD) return 'Used - Good';
  if (condition === DbProductCondition.USED_FAIR) return 'Used - Fair';
  return 'For Parts';
}

function imageUrl(product: DatabaseCartProduct) {
  const sortedImages = [...product.images].sort((a, b) => a.sortOrder - b.sortOrder);
  const relationHero = sortedImages.find((image) => image.role === ProductImageRole.HERO)?.url ?? sortedImages[0]?.url;
  return (
    safeProductImageUrl(product.mainImageUrl) ??
    safeProductImageUrl(product.imageUrls[0]) ??
    safeProductImageUrl(relationHero) ??
    '/shutterbug-product-placeholder.png'
  );
}

function validationFromDatabaseProducts(lines: NormalizedCartLine[], products: DatabaseCartProduct[]): CartValidationResponse {
  const productsById = new Map(products.map((product) => [product.id, product]));
  const items = lines.map(({ id, quantity }) => {
    const product = productsById.get(id);
    if (!product) return issueResponse(id, quantity, 'This item is no longer available.');

    const availableQuantity = Math.max(0, product.quantity - product.reservedQuantity);
    const purchasable = product.status === DbProductStatus.ACTIVE && availableQuantity > 0 && product.priceCents >= 0;
    const validatedQuantity = purchasable ? Math.min(quantity, availableQuantity) : 0;
    const quantityIssue =
      purchasable && quantity > availableQuantity ? `Only ${availableQuantity} available for this item.` : undefined;
    const availabilityIssue = !purchasable ? `${product.title} is unavailable.` : undefined;

    return {
      id: product.id,
      sku: product.sku ?? '',
      slug: product.slug,
      title: product.title,
      image: imageUrl(product),
      condition: conditionLabel(product.condition),
      statusLabel: statusLabel(product.status),
      requestedQuantity: quantity,
      validatedQuantity,
      availableQuantity,
      unitPriceCents: product.priceCents,
      lineTotalCents: product.priceCents * validatedQuantity,
      purchasable,
      issue: availabilityIssue ?? quantityIssue
    };
  });

  const warnings = items.map((item) => item.issue).filter(Boolean) as string[];
  return {
    items,
    subtotalCents: items.reduce((sum, item) => sum + item.lineTotalCents, 0),
    hasBlockingIssue: warnings.length > 0,
    warnings
  };
}

export async function validateCartLines(
  items: CartLineInput[],
  options: { requireDatabase?: boolean; client?: ProductReader } = {}
): Promise<CartValidationResponse> {
  const lines = normalizeCartLines(items);
  if (!lines.length) return { items: [], subtotalCents: 0, hasBlockingIssue: false, warnings: [] };

  if (options.requireDatabase || options.client) {
    const prisma = options.client ?? requirePrisma();
    const products = await prisma.product.findMany({
      where: { id: { in: lines.map((line) => line.id) } },
      include: { images: true }
    });
    return validationFromDatabaseProducts(lines, products);
  }

  const catalog = await getCatalogProducts();
  const productsById = new Map(catalog.map((product) => [product.id, product]));
  const validatedItems = lines.map(({ id, quantity }) => {
    const product = productsById.get(id);
    if (!product) return issueResponse(id, quantity, 'This item is no longer available.');

    const availableQuantity = product.quantity ?? 1;
    const unitPriceCents = product.priceCents ?? Math.round(product.price * 100);
    const purchasable = isActiveProduct(product);
    const validatedQuantity = purchasable ? Math.min(quantity, availableQuantity) : 0;
    const quantityIssue =
      purchasable && quantity > availableQuantity ? `Only ${availableQuantity} available for this item.` : undefined;
    const availabilityIssue = !purchasable ? `${product.title} is ${getAvailabilityLabel(product.status).toLowerCase()}.` : undefined;

    return {
      id: product.id,
      sku: product.sku,
      slug: product.slug,
      title: product.title,
      image: safeProductImageUrl(product.heroImage) ?? '/shutterbug-product-placeholder.png',
      condition: product.condition,
      statusLabel: getAvailabilityLabel(product.status),
      requestedQuantity: quantity,
      validatedQuantity,
      availableQuantity,
      unitPriceCents,
      lineTotalCents: unitPriceCents * validatedQuantity,
      purchasable,
      issue: availabilityIssue ?? quantityIssue
    };
  });

  const warnings = validatedItems.map((item) => item.issue).filter(Boolean) as string[];
  return {
    items: validatedItems,
    subtotalCents: validatedItems.reduce((sum, item) => sum + item.lineTotalCents, 0),
    hasBlockingIssue: warnings.length > 0,
    warnings
  };
}
