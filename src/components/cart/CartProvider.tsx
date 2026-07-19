'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type CartLine = {
  id: string;
  quantity: number;
};

type CartContextValue = {
  items: CartLine[];
  hydrated: boolean;
  count: number;
  addItem: (id: string, quantity?: number) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = 'shutterbug-cart-v1';

function normalizeItems(value: unknown): CartLine[] {
  if (!Array.isArray(value)) return [];

  const lines = new Map<string, number>();
  for (const item of value) {
    if (!item || typeof item !== 'object') continue;
    const candidate = item as { id?: unknown; quantity?: unknown };
    const id = String(candidate.id ?? '').trim();
    if (!id) continue;
    const quantity = Math.max(1, Math.min(99, Math.floor(Number(candidate.quantity ?? 1) || 1)));
    lines.set(id, Math.min((lines.get(id) ?? 0) + quantity, 99));
  }

  return Array.from(lines, ([id, quantity]) => ({ id, quantity }));
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let canceled = false;

    queueMicrotask(() => {
      if (canceled) return;
      try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        setItems(saved ? normalizeItems(JSON.parse(saved)) : []);
      } catch {
        setItems([]);
      } finally {
        setHydrated(true);
      }
    });

    return () => {
      canceled = true;
    };
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [hydrated, items]);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((sum, item) => sum + item.quantity, 0);

    return {
      items,
      hydrated,
      count,
      addItem(id, quantity = 1) {
        setItems((current) => {
          const existing = current.find((candidate) => candidate.id === id);
          const amount = Math.max(1, Math.floor(Number(quantity) || 1));
          if (!existing) return [...current, { id, quantity: Math.min(amount, 99) }];
          return current.map((candidate) =>
            candidate.id === id ? { ...candidate, quantity: Math.min(candidate.quantity + amount, 99) } : candidate
          );
        });
      },
      updateQuantity(id, quantity) {
        setItems((current) =>
          current.map((item) =>
            item.id === id ? { ...item, quantity: Math.max(1, Math.min(99, Math.floor(Number(quantity) || 1))) } : item
          )
        );
      },
      removeItem(id) {
        setItems((current) => current.filter((item) => item.id !== id));
      },
      clearCart() {
        setItems((current) => (current.length ? [] : current));
      }
    };
  }, [hydrated, items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside CartProvider');
  return context;
}
