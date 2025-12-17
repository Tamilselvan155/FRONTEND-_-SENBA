import { useDispatch, useSelector } from 'react-redux';
import { 
  addToCart, 
  removeFromCart, 
  deleteItemFromCart, 
  clearCart,
  addToCartAsync,
  removeFromCartAsync,
  deleteCartItemAsync,
  clearCartAsync
} from '@/lib/features/cart/cartSlice';

export const useCart = () => {
  const dispatch = useDispatch();
  const { email } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  // Check if user is logged in
  const isLoggedIn = () => {
    if (typeof window === 'undefined') return false;
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!(token && user && email);
  };

  const handleAddToCart = async (payload) => {
    if (isLoggedIn()) {
      try {
        await dispatch(addToCartAsync(payload)).unwrap();
      } catch (error) {
        // Fallback to local storage if backend fails
        dispatch(addToCart(payload));
      }
    } else {
      // Guest user - use local storage only
      dispatch(addToCart(payload));
    }
  };

  const handleRemoveFromCart = async (productId) => {
    if (isLoggedIn()) {
      try {
        await dispatch(removeFromCartAsync(productId)).unwrap();
      } catch (error) {
        // Fallback to local storage if backend fails
        dispatch(removeFromCart({ productId }));
      }
    } else {
      // Guest user - use local storage only
      dispatch(removeFromCart({ productId }));
    }
  };

  const handleDeleteFromCart = async (productId) => {
    if (isLoggedIn()) {
      try {
        await dispatch(deleteCartItemAsync(productId)).unwrap();
      } catch (error) {
        // Fallback to local storage if backend fails
        dispatch(deleteItemFromCart({ productId }));
      }
    } else {
      // Guest user - use local storage only
      dispatch(deleteItemFromCart({ productId }));
    }
  };

  const handleClearCart = async () => {
    if (isLoggedIn()) {
      try {
        await dispatch(clearCartAsync()).unwrap();
      } catch (error) {
        // Fallback to local storage if backend fails
        dispatch(clearCart());
      }
    } else {
      // Guest user - use local storage only
      dispatch(clearCart());
    }
  };

  return {
    cartItems,
    addToCart: handleAddToCart,
    removeFromCart: handleRemoveFromCart,
    deleteFromCart: handleDeleteFromCart,
    clearCart: handleClearCart,
    isLoggedIn: isLoggedIn(),
  };
};

