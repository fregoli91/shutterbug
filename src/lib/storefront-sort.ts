type SortableProduct = {
  price: number;
  createdAt?: string;
  newArrival?: boolean;
};

export function compareNewest(a: SortableProduct, b: SortableProduct) {
  const time = (value?: string) => {
    const parsed = value ? Date.parse(value) : 0;
    return Number.isFinite(parsed) ? parsed : 0;
  };
  return time(b.createdAt) - time(a.createdAt) || Number(Boolean(b.newArrival)) - Number(Boolean(a.newArrival));
}