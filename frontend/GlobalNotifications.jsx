import React from 'react';
import { useWishlist } from './src/context/WishlistContext';

const GlobalNotifications = () => {
  const { notification } = useWishlist();

  if (!notification) return null;

  return (
    <div className="global-notification">
      ✓ {notification}
    </div>
  );
};

export default GlobalNotifications;
