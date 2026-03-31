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

const getProductId = (productOrId) => {
  if (!productOrId) return null;
  if (typeof productOrId === "string") return productOrId;
  return productOrId._id || productOrId.id || null;
};

const getProductStock = (productOrId) => {
  if (!productOrId || typeof productOrId === "string") return Infinity;
  return Number.isFinite(productOrId.stock) ? productOrId.stock : Infinity;
};

const getProductPrice = (productOrId) => {
  if (!productOrId || typeof productOrId === "string") return 0;
  return Number(productOrId.price) || 0;
};

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
    const targetProductId = getProductId(product);
    if (!targetProductId) return;

    if (isAuthenticated) {
      let previousCart = [];

      setCartItems((prev) => {
        previousCart = prev;
        const existing = prev.find(
          (item) => getProductId(item.product) === targetProductId,
        );

        if (!existing) {
          if (product.stock < 1) return prev;
          return [...prev, { product, quantity: 1 }];
        }

        if (existing.quantity >= getProductStock(existing.product)) {
          return prev;
        }

        return prev.map((item) =>
          getProductId(item.product) === targetProductId
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      });

      addCartItemForUser(targetProductId)
        .then((data) => {
          setCartItems(data.cartItems || []);
        })
        .catch(() => {
          setCartItems(previousCart);
        });
      return;
    }

    setCartItems((prev) => {
      const existing = prev.find(
        (item) => getProductId(item.product) === targetProductId,
      );

      if (!existing) {
        if (product.stock < 1) return prev;
        return [...prev, { product, quantity: 1 }];
      }

      if (existing.quantity >= getProductStock(existing.product)) {
        return prev;
      }

      return prev.map((item) =>
        getProductId(item.product) === targetProductId
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      );
    });
  };

  const removeFromCart = (productId) => {
    if (isAuthenticated) {
      let previousCart = [];

      setCartItems((prev) => {
        previousCart = prev;
        return prev.filter((item) => getProductId(item.product) !== productId);
      });

      removeCartItemForUser(productId)
        .then((data) => {
          setCartItems(data.cartItems || []);
        })
        .catch(() => {
          setCartItems(previousCart);
        });
      return;
    }

    setCartItems((prev) =>
      prev.filter((item) => getProductId(item.product) !== productId),
    );
  };

  const updateQuantity = (productId, nextQuantity) => {
    if (isAuthenticated) {
      let previousCart = [];

      setCartItems((prev) => {
        previousCart = prev;

        return prev
          .map((item) => {
            if (getProductId(item.product) !== productId) return item;
            const cappedQuantity = Math.min(
              Math.max(nextQuantity, 0),
              getProductStock(item.product),
            );
            return { ...item, quantity: cappedQuantity };
          })
          .filter((item) => item.quantity > 0);
      });

      updateCartItemQuantityForUser(productId, nextQuantity)
        .then((data) => {
          setCartItems(data.cartItems || []);
        })
        .catch(() => {
          setCartItems(previousCart);
        });
      return;
    }

    setCartItems((prev) =>
      prev
        .map((item) => {
          if (getProductId(item.product) !== productId) return item;
          const cappedQuantity = Math.min(
            Math.max(nextQuantity, 0),
            getProductStock(item.product),
          );
          return { ...item, quantity: cappedQuantity };
        })
        .filter((item) => item.quantity > 0),
    );
  };

  const increaseQuantity = (productId) => {
    const item = cartItems.find(
      (cartItem) => getProductId(cartItem.product) === productId,
    );
    if (!item) return;
    updateQuantity(productId, item.quantity + 1);
  };

  const decreaseQuantity = (productId) => {
    const item = cartItems.find(
      (cartItem) => getProductId(cartItem.product) === productId,
    );
    if (!item) return;
    updateQuantity(productId, item.quantity - 1);
  };

  const totalPrice = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) => sum + getProductPrice(item.product) * item.quantity,
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
