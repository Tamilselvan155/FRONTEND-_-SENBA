import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCartAsync, syncCartAsync } from '@/lib/features/cart/cartSlice';

export const useCartSync = () => {
  const dispatch = useDispatch();
  const { email } = useSelector((state) => state.auth);
  const [hasSynced, setHasSynced] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = () => {
      if (typeof window === 'undefined') return false;
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      return !!(token && user && email);
    };

    // Only sync once when user logs in
    if (isLoggedIn() && !hasSynced) {
      const syncCart = async () => {
        try {
          // Get cart from localStorage
          const savedCart = localStorage.getItem('cart');
          const localCart = savedCart ? JSON.parse(savedCart) : { cartItems: {}, total: 0 };
          
          // If there are items in localStorage, sync them with backend
          if (localCart.cartItems && Object.keys(localCart.cartItems).length > 0) {
            await dispatch(syncCartAsync(localCart.cartItems)).unwrap();
          } else {
            // Otherwise, fetch cart from backend
            await dispatch(fetchCartAsync()).unwrap();
          }
          setHasSynced(true);
        } catch (error) {
          console.error('Cart sync error:', error);
          // Silently fail - cart will work with localStorage
          setHasSynced(true); // Mark as synced to prevent retries
        }
      };

      // Small delay to ensure auth is fully set up
      const timer = setTimeout(() => {
        syncCart();
      }, 500);

      return () => clearTimeout(timer);
    }
    
    // Reset sync flag when user logs out
    if (!isLoggedIn() && hasSynced) {
      setHasSynced(false);
    }
  }, [email, dispatch, hasSynced]); // Only run when email changes (login/logout)

  return null;
};

