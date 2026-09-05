import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { ShoppingBag, Heart, ArrowRight, Tag } from 'lucide-react';
import { getProductImages, getImageUrl } from '../utils/imageUtils';
import './ProductCard.css';

const ProductCard = ({ product, isSelected, onSelect }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [feedback, setFeedback] = useState('');

  const images = getProductImages(product.image);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [product.image]);

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [images.length]);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setFeedback('Added to bag');
    setTimeout(() => setFeedback(''), 2500);
  };

  const handleCardClick = (e) => {
    if (onSelect) {
      onSelect(product);
    }
  };

  return (
    <div 
      className={`product-card ${isSelected ? 'active-selected' : ''}`}
      onClick={handleCardClick}
      style={{ cursor: 'pointer' }}
    >
      <div className="product-card-inner-flex">
        <div className="product-card-primary">
          <div className="product-img-wrapper" style={{ position: 'relative' }}>
            <img
              src={getImageUrl(images[currentImageIndex])}
              alt={product.product_name}
              className="product-img"
              style={{ transition: 'opacity 0.5s ease-in-out' }}
            />
            {images.length > 1 && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  gap: '6px',
                  zIndex: 2
                }}
              >
                {images.map((_, idx) => (
                  <span
                    key={idx}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setCurrentImageIndex(idx);
                    }}
                    style={{
                      width: '7px',
                      height: '7px',
                      borderRadius: '50%',
                      backgroundColor: idx === currentImageIndex ? '#00b4d8' : 'rgba(255,255,255,0.7)',
                      cursor: 'pointer',
                      transition: 'background-color 0.3s ease'
                    }}
                  />
                ))}
              </div>
            )}
            {product.isBestSeller && <span className="product-badge">Best Seller</span>}
            <button 
              className={`wishlist-btn ${isInWishlist(product.id) ? 'in-wishlist' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleWishlist(product);
              }}
              title={isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
            >
              <Heart size={18} fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
            </button>
          </div>

          <div className="product-info">
            <div className="product-card-category-badge">
              <Tag size={12} /> {product.category}
            </div>
            <h3 className="product-title">
              {product.product_name}
            </h3>
            <p className="product-price">
              ₹{Number(product.price).toFixed(2)}
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '0.4rem' }}>
              <button 
                className="product-card-learn-more"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCardClick(e);
                }}
              >
                Learn More <ArrowRight size={14} />
              </button>
              <button 
                className="product-card-add-btn" 
                onClick={handleAddToCart}
              >
                Add
              </button>
            </div>

            {feedback && (
              <p style={{ color: '#0077b6', fontSize: '0.75rem', marginTop: '0.4rem', fontWeight: 'bold', textAlign: 'center' }}>
                ✓ {feedback}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
