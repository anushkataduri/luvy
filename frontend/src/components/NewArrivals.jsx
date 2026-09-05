import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { newArrivals } from '../data/products';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Heart } from 'lucide-react';
import './NewArrivals.css';

const NewArrivals = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const handleAddToCart = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCart(product);
    setFeedbackMessage('Item added to cart');
    
    // Clear feedback message after 2 seconds
    setTimeout(() => {
      setFeedbackMessage('');
    }, 2000);
  };

  return (
    <section className="new-arrivals-section py-section" style={{ backgroundColor: 'var(--bg-light)' }}>
      <div className="container">
        <h2 className="section-title">New Arrivals</h2>
        <div className="new-arrivals-grid">
          {newArrivals.map((product, index) => (
            <div 
              key={product.id} 
              className={`new-arrival-card pyramid-item-${index + 1}`}
            >
              <div className="new-arrival-img-wrapper">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="new-arrival-img"
                />
                <span className="new-arrival-badge">New</span>
                <button 
                  className={`wishlist-btn ${isInWishlist(product.id) ? 'in-wishlist' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleWishlist(product);
                  }}
                >
                  <Heart size={20} fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
                </button>
              </div>
              <div className="new-arrival-info">
                <h3 className="new-arrival-title">{product.name}</h3>
                <p className="new-arrival-category">{product.category}</p>
                <p className="new-arrival-price">
                  {/* ₹{product.price.toFixed(2)} */}
                  ₹{Number(product.price).toFixed(2)}
                  </p>
                <button 
                  className="btn btn-primary new-arrival-btn"
                  onClick={(e) => handleAddToCart(product, e)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <button 
            className="btn btn-secondary-outline shop-collection-btn"
            onClick={() => navigate('/shop')}
          >
            Shop Our Collection
          </button>
        </div>
        
        {feedbackMessage && (
          <div className="feedback-message">
            ✓ {feedbackMessage}
          </div>
        )}
      </div>
    </section>
  );
};

export default NewArrivals;
