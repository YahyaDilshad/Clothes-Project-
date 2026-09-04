import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      FREE_DELIVERY_THRESHOLD: 8000,
      SHIPPING_FEE: 250,

      addToCart: (product, selectedColor, qty = 1) => {
        const { items } = get();
        const existingItem = items.find(
          (item) => item.id === (product._id || product.id) && item.color === selectedColor
        );

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.id === (product._id || product.id) && item.color === selectedColor
                ? { ...item, qty: item.qty + qty }
                : item
            ),
          });
        } else {
          set({
            items: [
              ...items,
              {
                id: product._id || product.id,
                name: product.name,
                price: product.salePrice || product.price,
                image: product.images[0],
                fabric: product.fabric,
                color: selectedColor,
                qty,
              },
            ],
          });
        }
      },

      removeFromCart: (id, color) => {
        set({ items: get().items.filter((i) => !(i.id === id && i.color === color)) });
      },

      updateQty: (id, color, qty) => {
        if (qty < 1) return;
        set({
          items: get().items.map((i) =>
            i.id === id && i.color === color ? { ...i, qty } : i
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      // Helpers for calculations
      getTotals: () => {
        const { items, FREE_DELIVERY_THRESHOLD, SHIPPING_FEE } = get();
        const subtotal = items.reduce((acc, item) => acc + item.price * item.qty, 0);
        const shipping = subtotal >= FREE_DELIVERY_THRESHOLD || items.length === 0 ? 0 : SHIPPING_FEE;
        const total = subtotal + shipping;
        const amountToFreeDelivery = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);
        
        return { subtotal, shipping, total, amountToFreeDelivery };
      },
    }),
    { name: 'fk-cart-storage' } // LocalStorage mein save rahega
  )
);