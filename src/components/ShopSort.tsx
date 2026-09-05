'use client';
import { type ReactNode } from 'react';

export function ShopSort({ value, children }: { value: string; children: ReactNode }) {
  return (
    <form action="/shop" className="flex min-w-0 items-center gap-2" onChange={(event) => event.currentTarget.requestSubmit()}>
      {children}
      <label htmlFor="shop-sort" className="sr-only">Sort inventory</label>
      <select id="shop-sort" name="sort" defaultValue={value}
        className="min-h-11 w-full max-w-48 rounded-md border border-forest/20 bg-white px-2 text-sm text-ink focus:outline-moss">
        <option value="newest">Newest</option>
        <option value="featured">Featured</option>
        <option value="stock">In stock first</option>
        <option value="price-asc">Price: low to high</option>
        <option value="price-desc">Price: high to low</option>
        <option value="condition">Best condition</option>
        <option value="brand">Brand A-Z</option>
      </select>
      <noscript><button type="submit">Apply sort</button></noscript>
    </form>
  );
}