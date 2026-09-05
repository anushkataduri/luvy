import React, { createContext, useState, useContext, useEffect } from 'react';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [notification, setNotification] = useState('');

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      try {
        setWishlistItems(JSON.parse(savedWishlist));
      } catch (error) {
        console.error('Error loading wishlist from localStorage:', error);
      }
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  // Show notification
  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  // Add item to wishlist
  const addToWishlist = (product) => {
    setWishlistItems(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        showNotification(`${product.name} already in wishlist`);
        return prev;
      }
      showNotification(`${product.name} added to wishlist`);
      return [...prev, { ...product, addedAt: new Date().toISOString() }];
    });
  };

  // Remove item from wishlist
  const removeFromWishlist = (id) => {
    setWishlistItems(prev => {
      const item = prev.find(item => item.id === id);
      if (item) {
        showNotification(`${item.name} removed from wishlist`);
      }
      return prev.filter(item => item.id !== id);
    });
  };

  // Check if item is in wishlist
  const isInWishlist = (id) => {
    return wishlistItems.some(item => item.id === id);
  };

  // Toggle item in wishlist
  const toggleWishlist = (product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  // Clear wishlist
  const clearWishlist = () => {
    setWishlistItems([]);
    showNotification('Wishlist cleared');
  };

  // Move item from wishlist to cart (will be used with CartContext)
  const moveToCart = (product, addToCart) => {
    removeFromWishlist(product.id);
    addToCart(product);
    showNotification(`${product.name} moved to cart`);
  };

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      toggleWishlist,
      clearWishlist,
      moveToCart,
      notification,
      showNotification
    }}>
      {children}
    </WishlistContext.Provider>
  );
};
