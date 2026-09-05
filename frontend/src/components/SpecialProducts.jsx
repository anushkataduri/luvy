import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Heart } from 'lucide-react';
import './SpecialProducts.css';

const SpecialProducts = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const specialProducts = products.filter(p => p.isSpecial).slice(0, 3);

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
    <section className="special-products-section py-section">
      <div className="container">
        <h2 className="section-title">Our Special Products</h2>
        <p style={{ textAlign: 'center', marginBottom: '3rem', color: 'var(--text-dark)' }}>Handmade jewellery, premium leather handbags, and elegant dresses.</p>
        <div className="special-products-grid">
          {specialProducts.map((product, index) => (
            <div 
              key={product.id} 
              className={`special-product-card pyramid-item-${index + 1}`}
            >
              <div className="special-product-img-wrapper">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="special-product-img"
                />
                <span className="special-product-badge">Special</span>
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
              <div className="special-product-info">
                <h3 className="special-product-title">{product.name}</h3>
                <p className="special-product-category">{product.category}</p>
                <p className="special-product-price">₹{product.price.toFixed(2)}</p>
              </div>
            </div>
          ))}
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

export default SpecialProducts;
