import { getAvailabilityLabel, getCatalogProducts, isActiveProduct } from '@/lib/products';

export type CartLineInput = {
  id?: string;
  quantity?: number;
};

export type CartValidationItem = {
  id: string;
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

export async function validateCartLines(items: CartLineInput[]): Promise<CartValidationResponse> {
  const lines = normalizeCartLines(items);
  if (!lines.length) return { items: [], subtotalCents: 0, hasBlockingIssue: false, warnings: [] };

  const catalog = await getCatalogProducts();
  const productsById = new Map(catalog.map((product) => [product.id, product]));

  const validatedItems = lines.map(({ id, quantity }) => {
    const product = productsById.get(id);

    if (!product) {
      return {
        id,
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
        issue: 'This item is no longer available.'
      };
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
