import { createContext, useContext, useMemo, useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage.js';
import { useToast } from './ToastContext.jsx';

const CartContext = createContext(null);

const FREE_DELIVERY_THRESHOLD = 8000;
const SHIPPING_FLAT = 250;

export function CartProvider({ children }) {
  const [items, setItems] = useLocalStorage('fk_cart', []);
  const [isCartOpen, setCartOpen] = useState(false);
  const { showToast } = useToast();

  const lineKey = (productId, color) => `${productId}::${color}`;

  const addToCart = (product, { color, qty = 1 } = {}) => {
    const selectedColor = color || product.color;
    setItems((prev) => {
      const key = lineKey(product.id, selectedColor);
      const existing = prev.find((i) => lineKey(i.id, i.color) === key);
      if (existing) {
        return prev.map((i) =>
          lineKey(i.id, i.color) === key ? { ...i, qty: i.qty + qty } : i
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          image: product.images ? product.images[0] : product.img,
          fabric: product.fabric,
          color: selectedColor,
          price: product.salePrice || product.price,
          qty,
        },
      ];
    });
    showToast?.(`${product.name} added to cart`);
    setCartOpen(true);
  };

  const removeFromCart = (id, color) => {
    setItems((prev) => prev.filter((i) => lineKey(i.id, i.color) !== lineKey(id, color)));
  };

  const updateQty = (id, color, qty) => {
    if (qty < 1) return;
    setItems((prev) =>
      prev.map((i) => (lineKey(i.id, i.color) === lineKey(id, color) ? { ...i, qty } : i))
    );
  };

  const clearCart = () => setItems([]);

  const subtotal = useMemo(() => items.reduce((sum, i) => sum + i.price * i.qty, 0), [items]);
  const itemCount = useMemo(() => items.reduce((sum, i) => sum + i.qty, 0), [items]);
  const shipping = subtotal === 0 ? 0 : subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : SHIPPING_FLAT;
  const total = subtotal + shipping;
  const amountToFreeDelivery = Math.max(FREE_DELIVERY_THRESHOLD - subtotal, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        subtotal,
        shipping,
        total,
        itemCount,
        isCartOpen,
        setCartOpen,
        amountToFreeDelivery,
        FREE_DELIVERY_THRESHOLD,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
