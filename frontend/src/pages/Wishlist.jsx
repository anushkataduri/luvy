import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { getFirstProductImage, getImageUrl } from '../utils/imageUtils';

const Wishlist = () => {
  const navigate = useNavigate();
  const { wishlistItems, removeFromWishlist, moveToCart } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (product) => {
    addToCart(product);
    removeFromWishlist(product.id);
  };

  const handleRemoveFromWishlist = (productId) => {
    removeFromWishlist(productId);
  };

  const getTotalWishlistValue = () => {
    // return wishlistItems.reduce((total, item) => total + item.price, 0);
    return wishlistItems.reduce(
  (total, item) => total + Number(item.price),
  0
);
  };

  return (
    <div className="wishlist-page container py-section animate-fade-in">
      <h1 className="section-title">My Wishlist</h1>
      
      {wishlistItems.length === 0 ? (
        <div className="empty-wishlist">
          <Heart size={64} className="empty-icon" />
          <h2>Your wishlist is empty</h2>
          <p>
            Start adding items you love to your wishlist!
          </p>
          <button className="btn btn-primary" onClick={() => navigate('/shop')}>
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          <div className="cart-grid">
            <div className="wishlist-items">
            {wishlistItems.map((item) => (
              <div key={item.id} className="wishlist-item">
                <img 
                  src={getImageUrl(getFirstProductImage(item.image))}
                  alt={item.product_name} 
                  className="wishlist-item-image"
                />
                
                <div className="wishlist-item-details">
                  <h3>{item.product_name}</h3>
                  <p className="wishlist-item-category">
                    {item.category}
                  </p>
                  <p className="wishlist-item-price">₹{Number(item.price).toFixed(2)}</p>
                </div>

                <div className="wishlist-item-actions">
                  <button 
                    className="btn btn-primary wishlist-add-btn"
                    onClick={() => handleAddToCart(item)}
                  >
                    <ShoppingBag size={16} />
                    <span>Add to Cart</span>
                  </button>
                  
                  <button 
                    className="btn btn-outline wishlist-remove-btn"
                    onClick={() => handleRemoveFromWishlist(item.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
            </div>

          <div className="cart-summary wishlist-summary">
            <h3>Wishlist Summary</h3>
            <div className="summary-row">
              <span>Total Items:</span>
              <span>{wishlistItems.length}</span>
            </div>
            <div className="summary-row">
              <span>Total Value:</span>
              <span className="wishlist-item-price">₹{getTotalWishlistValue().toFixed(2)}</span>
            </div>
            
            <div className="summary-buttons">
              <button 
                className="btn btn-primary" 
                onClick={() => navigate('/shop')}
              >
                Continue Shopping <ArrowRight size={18} />
              </button>
              <button 
                className="btn btn-outline" 
                onClick={() => navigate('/cart')}
              >
                View Cart
              </button>
            </div>
          </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Wishlist;
