'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '@/types';

interface CartStore {
    items: CartItem[];
    addItem: (product: Product, size: string, color: string, quantity?: number) => void;
    removeItem: (productId: string, size: string) => void;
    updateQuantity: (productId: string, size: string, quantity: number) => void;
    clearCart: () => void;
    getTotal: () => number;
    getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],

            addItem: (product, size, color, quantity = 1) => {
                const items = get().items;
                const existing = items.find(
                    (item) => item.product.id === product.id && item.size === size
                );

                if (existing) {
                    set({
                        items: items.map((item) =>
                            item.product.id === product.id && item.size === size
                                ? { ...item, quantity: item.quantity + quantity }
                                : item
                        ),
                    });
                } else {
                    set({ items: [...items, { product, quantity, size, color }] });
                }
            },

            removeItem: (productId, size) => {
                set({
                    items: get().items.filter(
                        (item) => !(item.product.id === productId && item.size === size)
                    ),
                });
            },

            updateQuantity: (productId, size, quantity) => {
                if (quantity <= 0) {
                    get().removeItem(productId, size);
                    return;
                }
                set({
                    items: get().items.map((item) =>
                        item.product.id === productId && item.size === size
                            ? { ...item, quantity }
                            : item
                    ),
                });
            },

            clearCart: () => set({ items: [] }),

            getTotal: () => {
                return get().items.reduce(
                    (total, item) => total + item.product.price * item.quantity,
                    0
                );
            },

            getItemCount: () => {
                return get().items.reduce((count, item) => count + item.quantity, 0);
            },
        }),
        {
            name: 'biharithread-cart',
        }
    )
);
