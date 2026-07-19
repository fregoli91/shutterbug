import {
  ProductCondition as DbProductCondition,
  ProductImageRole,
  ProductStatus as DbProductStatus,
  type Prisma
} from '@/generated/prisma/client';
import { getAvailabilityLabel, getCatalogProducts, isActiveProduct } from '@/lib/products';
import { requirePrisma } from '@/lib/prisma';

export type CartLineInput = {
  id?: string;
  quantity?: number;
};

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

type NormalizedCartLine = {
  id: string;
  quantity: number;
};

type DatabaseCartProduct = Prisma.ProductGetPayload<{ include: { images: true } }>;

function normalizeCartLines(items: CartLineInput[]) {
  const lines = new Map<string, number>();

  for (const item of items) {
    const id = String(item.id ?? '').trim();
    if (!id) continue;
    const quantity = Math.max(1, Math.min(99, Math.floor(Number(item.quantity ?? 1) || 1)));
    lines.set(id, (lines.get(id) ?? 0) + quantity);
  }

  return Array.from(lines, ([id, quantity]) => ({ id, quantity: Math.min(quantity, 99) }));
}

function issueResponse(id: string, quantity: number, issue: string): CartValidationItem {
  return {
    id,
    sku: '',
    slug: '',
    title: 'Unavailable item',
    image: '/placeholder-camera.svg',
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
  return product.mainImageUrl || product.imageUrls[0] || relationHero || '/placeholder-camera.svg';
}

function validationFromDatabaseProducts(
  lines: NormalizedCartLine[],
  products: DatabaseCartProduct[]
): CartValidationResponse {
  const productsById = new Map(products.map((product) => [product.id, product]));
  const items = lines.map(({ id, quantity }) => {
    const product = productsById.get(id);
    if (!product) return issueResponse(id, quantity, 'This item is no longer available.');

    const availableQuantity = product.quantity;
    const purchasable = product.status === DbProductStatus.ACTIVE && availableQuantity > 0;
    const validatedQuantity = purchasable ? Math.min(quantity, availableQuantity) : 0;
    const quantityIssue =
      purchasable && quantity > availableQuantity ? `Only ${availableQuantity} available for this item.` : undefined;
    const availabilityIssue = !purchasable ? `${product.title} is ${statusLabel(product.status).toLowerCase()}.` : undefined;

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
  options: { requireDatabase?: boolean } = {}
): Promise<CartValidationResponse> {
  const lines = normalizeCartLines(items);
  if (!lines.length) return { items: [], subtotalCents: 0, hasBlockingIssue: false, warnings: [] };

  if (options.requireDatabase) {
    const prisma = requirePrisma();
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

    if (!product) {
      return issueResponse(id, quantity, 'This item is no longer available.');
    }

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
      image: product.heroImage,
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
