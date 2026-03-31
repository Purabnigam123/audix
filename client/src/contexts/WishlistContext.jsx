import { createContext, useContext, useEffect, useState } from "react";
import { getUserData, toggleWishlistForUser } from "../api/api";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated, authLoading } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    const loadWishlist = async () => {
      if (authLoading) return;

      if (!isAuthenticated) {
        setWishlistItems([]);
        return;
      }

      try {
        const data = await getUserData();
        setWishlistItems(data.wishlistItems || []);
      } catch (error) {
        setWishlistItems([]);
      }
    };

    loadWishlist();
  }, [isAuthenticated, authLoading]);

  const addToWishlist = (product) => {
    if (isAuthenticated) {
      let previousItems = [];

      setWishlistItems((prev) => {
        previousItems = prev;
        const exists = prev.some((item) => item._id === product._id);
        if (exists) return prev;
        return [...prev, product];
      });

      toggleWishlistForUser(product._id)
        .then((data) => {
          setWishlistItems(data.wishlistItems || []);
        })
        .catch(() => {
          // Revert optimistic update if request fails.
          setWishlistItems(previousItems);
        });
      return;
    }

    setWishlistItems((prev) => {
      const exists = prev.some((item) => item._id === product._id);
      if (exists) return prev;
      return [...prev, product];
    });
  };

  const removeFromWishlist = (productId) => {
    if (isAuthenticated) {
      let previousItems = [];

      setWishlistItems((prev) => {
        previousItems = prev;
        return prev.filter((item) => item._id !== productId);
      });

      toggleWishlistForUser(productId)
        .then((data) => {
          setWishlistItems(data.wishlistItems || []);
        })
        .catch(() => {
          // Revert optimistic update if request fails.
          setWishlistItems(previousItems);
        });
      return;
    }

    setWishlistItems((prev) => prev.filter((item) => item._id !== productId));
  };

  const isInWishlist = (productId) =>
    wishlistItems.some((item) => item._id === productId);

  return (
    <WishlistContext.Provider
      value={{ wishlistItems, addToWishlist, removeFromWishlist, isInWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used inside WishlistProvider");
  }
  return context;
};
