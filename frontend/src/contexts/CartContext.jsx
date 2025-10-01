import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

const initialState = {
  items: [],
  isLoading: false,
  total: 0,
  itemCount: 0,
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_CART':
      const items = action.payload || [];
      // Calculate total with safe price handling
      const total = items.reduce((sum, item) => {
        const itemPrice = item.product?.price || 0;
        return sum + (itemPrice * item.quantity);
      }, 0);
      const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
      return {
        ...state,
        items,
        total,
        itemCount,
        isLoading: false,
      };
    case 'ADD_TO_CART':
      const existingItemIndex = state.items.findIndex(
        item => item.productId === action.payload.productId
      );
      
      let updatedItems;
      if (existingItemIndex >= 0) {
        updatedItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      } else {
        updatedItems = [...state.items, action.payload];
      }
      
      const newTotal = updatedItems.reduce((sum, item) => {
        const itemPrice = item.product?.price || 0;
        return sum + (itemPrice * item.quantity);
      }, 0);
      const newItemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      
      return {
        ...state,
        items: updatedItems,
        total: newTotal,
        itemCount: newItemCount,
      };
    case 'REMOVE_FROM_CART':
      const filteredItems = state.items.filter(item => item.product?._id !== action.payload);
      const removedTotal = filteredItems.reduce((sum, item) => {
        const itemPrice = item.product?.price || 0;
        return sum + (itemPrice * item.quantity);
      }, 0);
      const removedItemCount = filteredItems.reduce((sum, item) => sum + item.quantity, 0);
      
      return {
        ...state,
        items: filteredItems,
        total: removedTotal,
        itemCount: removedItemCount,
      };
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        total: 0,
        itemCount: 0,
      };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      dispatch({ type: 'CLEAR_CART' });
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await cartAPI.get();
      dispatch({ type: 'SET_CART', payload: response.data.items });
    } catch (error) {
      console.error('Error fetching cart:', error);
      dispatch({ type: 'SET_CART', payload: [] });
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      await cartAPI.add(productId, quantity);
      await fetchCart(); // Refresh cart from server
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to add to cart',
      };
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await cartAPI.remove(productId);
      dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to remove from cart',
      };
    }
  };

  const clearCart = async () => {
    try {
      await cartAPI.clear();
      dispatch({ type: 'CLEAR_CART' });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to clear cart',
      };
    }
  };

  const value = {
    ...state,
    addToCart,
    removeFromCart,
    clearCart,
    refreshCart: fetchCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};