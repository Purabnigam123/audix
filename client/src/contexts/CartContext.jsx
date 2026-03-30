import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  addCartItemForUser,
  getUserData,
  placeOrderForUser,
  removeCartItemForUser,
  updateCartItemQuantityForUser,
} from "../api/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated, authLoading } = useAuth();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const loadCart = async () => {
      if (authLoading) return;

      if (!isAuthenticated) {
        setCartItems([]);
        return;
      }

      try {
        const data = await getUserData();
        setCartItems(data.cartItems || []);
      } catch (error) {
        setCartItems([]);
      }
    };

    loadCart();
  }, [isAuthenticated, authLoading]);

  const addToCart = (product) => {
    if (isAuthenticated) {
      addCartItemForUser(product._id)
        .then((data) => {
          setCartItems(data.cartItems || []);
        })
        .catch(() => {
          // Keep existing state unchanged on API errors.
        });
      return;
    }

    setCartItems((prev) => {
      const existing = prev.find((item) => item.product._id === product._id);

      if (!existing) {
        if (product.stock < 1) return prev;
        return [...prev, { product, quantity: 1 }];
      }

      if (existing.quantity >= existing.product.stock) {
        return prev;
      }

      return prev.map((item) =>
        item.product._id === product._id
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      );
    });
  };

  const removeFromCart = (productId) => {
    if (isAuthenticated) {
      removeCartItemForUser(productId)
        .then((data) => {
          setCartItems(data.cartItems || []);
        })
        .catch(() => {
          // Keep existing state unchanged on API errors.
        });
      return;
    }

    setCartItems((prev) =>
      prev.filter((item) => item.product._id !== productId),
    );
  };

  const updateQuantity = (productId, nextQuantity) => {
    if (isAuthenticated) {
      updateCartItemQuantityForUser(productId, nextQuantity)
        .then((data) => {
          setCartItems(data.cartItems || []);
        })
        .catch(() => {
          // Keep existing state unchanged on API errors.
        });
      return;
    }

    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.product._id !== productId) return item;
          const cappedQuantity = Math.min(
            Math.max(nextQuantity, 0),
            item.product.stock,
          );
          return { ...item, quantity: cappedQuantity };
        })
        .filter((item) => item.quantity > 0),
    );
  };

  const increaseQuantity = (productId) => {
    const item = cartItems.find(
      (cartItem) => cartItem.product._id === productId,
    );
    if (!item) return;
    updateQuantity(productId, item.quantity + 1);
  };

  const decreaseQuantity = (productId) => {
    const item = cartItems.find(
      (cartItem) => cartItem.product._id === productId,
    );
    if (!item) return;
    updateQuantity(productId, item.quantity - 1);
  };

  const totalPrice = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0,
      ),
    [cartItems],
  );

  const placeOrder = async (paymentMode) => {
    if (!isAuthenticated) {
      throw new Error("Please login to place an order");
    }

    const response = await placeOrderForUser(paymentMode);
    setCartItems(response.cartItems || []);
    return response.order;
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    increaseQuantity,
    decreaseQuantity,
    totalPrice,
    placeOrder,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
};
