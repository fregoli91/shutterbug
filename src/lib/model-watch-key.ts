export type ModelWatchTarget = {
  key: string;
  brand: string;
  model: string;
  categorySlug: string;
};

function normalizeWatchPart(value: string, maxLength: number) {
  return value.normalize('NFKC').trim().replace(/\s+/g, ' ').slice(0, maxLength);
}

function keyPart(value: string) {
  return value.toLocaleLowerCase('en-US').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export function buildModelWatchTarget({
  brand,
  model,
  categorySlug
}: {
  brand: string;
  model: string;
  categorySlug?: string;
}): ModelWatchTarget | null {
  const normalizedBrand = normalizeWatchPart(brand, 120);
  const normalizedModel = normalizeWatchPart(model, 180);
  const normalizedCategory = normalizeWatchPart(categorySlug ?? '', 120).toLowerCase();
  if (!normalizedBrand || !normalizedModel) return null;
  const brandKey = keyPart(normalizedBrand);
  const modelKey = keyPart(normalizedModel);
  const categoryKey = keyPart(normalizedCategory);
  if (!brandKey || !modelKey) return null;
  return {
    key: [brandKey, modelKey, categoryKey].filter(Boolean).join('::').slice(0, 420),
    brand: normalizedBrand,
    model: normalizedModel,
    categorySlug: normalizedCategory
  };
}