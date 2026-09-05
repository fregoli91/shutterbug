export type SearchParams = Record<string, string | string[] | undefined>;

function toUrlSearchParams(params: SearchParams) {
  const next = new URLSearchParams();
  Object.entries(params).forEach(([name, value]) => {
    if (!value) return;
    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item) next.append(name, item);
      });
      return;
    }
    next.set(name, value);
  });
  return next;
}

export function shopHref(
  params: SearchParams,
  {
    set,
    remove
  }: {
    set?: Record<string, string | string[] | undefined>;
    remove?: { name: string; value?: string };
  }
) {
  const next = toUrlSearchParams(params);
  if (remove) {
    const values = next.getAll(remove.name).filter((value) => remove.value !== undefined && value !== remove.value);
    next.delete(remove.name);
    values.forEach((value) => next.append(remove.name, value));
  }
  Object.entries(set ?? {}).forEach(([name, value]) => {
    next.delete(name);
    if (!value) return;
    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item) next.append(name, item);
      });
      return;
    }
    next.set(name, value);
  });
  const query = next.toString();
  return query ? `/shop?${query}` : '/shop';
}
