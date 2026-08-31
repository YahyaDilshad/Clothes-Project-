import { createContext, useContext } from 'react';
import useLocalStorage from '../hooks/useLocalStorage.js';
import { useToast } from './ToastContext.jsx';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useLocalStorage('fk_wishlist', []);
  const { showToast } = useToast();

  const isWishlisted = (id) => wishlist.includes(id);

  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      if (prev.includes(product.id)) {
        showToast?.(`Removed from wishlist`, 'info');
        return prev.filter((id) => id !== product.id);
      }
      showToast?.(`Added to wishlist`);
      return [...prev, product.id];
    });
  };

  return (
    <WishlistContext.Provider value={{ wishlist, isWishlisted, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
