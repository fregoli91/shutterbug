import type { Product } from './products';

// Catalog facts only: no model-name guesses about specifications or compatibility.
export function isPrinter(product: Product) {
  return [product.categorySlug, ...product.categorySlugs].includes('printers') ||
    /\bprinters?\b/i.test(product.productType ?? '');
}

export function hasRealProductImage(product: Product) {
  return product.actualPhotos && Boolean(product.heroImage) &&
    !/placeholder|\.svg(?:\?|$)/i.test(product.heroImage);
}

export function isIndexableProduct(product: Product) {
  if (product.status === 'active' && (product.quantity ?? 1) > 0) return true;
  if (product.status !== 'sold_out' && product.status !== 'active') return false;
  return hasRealProductImage(product) && Boolean(product.model.trim()) &&
    Boolean(product.shortDescription.trim()) && Boolean(product.conditionSummary.trim()) &&
    product.tested.length + product.functionalNotes.length + product.flaws.length > 0;
}

export function availableRelatedProducts(product: Product, catalog: Product[], limit = 3) {
  return catalog.filter((candidate) => candidate.id !== product.id &&
    candidate.status === 'active' && (candidate.quantity ?? 1) > 0 &&
    isPrinter(candidate) === isPrinter(product) &&
    (candidate.brand === product.brand || candidate.categorySlug === product.categorySlug ||
      candidate.categorySlugs.some((slug) => product.categorySlugs.includes(slug))))
    .sort((a, b) => Number(b.brand === product.brand) - Number(a.brand === product.brand))
    .slice(0, limit);
}
