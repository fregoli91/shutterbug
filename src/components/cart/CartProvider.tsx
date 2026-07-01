'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type CartItem = {
  id: string;
  slug: string;
  title: string;
  image: string;
  condition: string;
  priceCents: number;
  quantity: number;
  maxQuantity: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotalCents: number;
  addItem: (item: CartItem) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = 'shutterbug-cart-v1';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) setItems(JSON.parse(saved) as CartItem[]);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [hydrated, items]);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotalCents = items.reduce((sum, item) => sum + item.quantity * item.priceCents, 0);

    return {
      items,
      count,
      subtotalCents,
      addItem(item) {
        setItems((current) => {
          const existing = current.find((candidate) => candidate.id === item.id);
          if (!existing) return [...current, { ...item, quantity: Math.min(item.quantity || 1, item.maxQuantity) }];
          return current.map((candidate) =>
            candidate.id === item.id
              ? { ...candidate, quantity: Math.min(candidate.quantity + (item.quantity || 1), candidate.maxQuantity) }
              : candidate
          );
        });
      },
      updateQuantity(id, quantity) {
        setItems((current) =>
          current.map((item) =>
            item.id === id ? { ...item, quantity: Math.max(1, Math.min(quantity, item.maxQuantity)) } : item
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
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside CartProvider');
  return context;
}
