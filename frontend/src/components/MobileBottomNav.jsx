import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, Heart, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const MobileBottomNav = () => {
  const location = useLocation();
  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist();
  
  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  const isActive = (path) => location.pathname === path;

  return (
    <div className="mobile-bottom-nav">
      <Link to="/wishlist" className={`bottom-nav-item ${isActive('/wishlist') ? 'active' : ''}`}>
        <div className="icon-badge-wrapper">
          <Heart size={24} />
          {wishlistCount > 0 && <span className="badge">{wishlistCount}</span>}
        </div>
        <span>Wishlist</span>
      </Link>
      <Link to="/cart" className={`bottom-nav-item ${isActive('/cart') ? 'active' : ''}`}>
        <div className="icon-badge-wrapper">
          <ShoppingCart size={24} />
          {cartItemCount > 0 && <span className="badge">{cartItemCount}</span>}
        </div>
        <span>Cart</span>
      </Link>
    </div>
  );
};

export default MobileBottomNav;
