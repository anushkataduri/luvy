import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Heart, ShoppingBag, Tag, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { getProductImages, getImageUrl } from '../utils/imageUtils';
import './ProductDetailModal.css';

const ProductDetailModal = ({ product, onClose }) => {
  if (!product) return null;

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });
  const [feedback, setFeedback] = useState('');
  const imgWrapperRef = useRef(null);

  const images = getProductImages(product.image);

  useEffect(() => {
    setSelectedImageIndex(0);
    setIsZoomed(false);
    setFeedback('');
  }, [product.id]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && images.length > 1) handlePrevImage();
      if (e.key === 'ArrowRight' && images.length > 1) handleNextImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageIndex, images.length]);

  const activeImage = images[selectedImageIndex] || images[0] || product.image;

  const handleNextImage = (e) => {
    if (e) e.stopPropagation();
    setIsZoomed(false);
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = (e) => {
    if (e) e.stopPropagation();
    setIsZoomed(false);
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleMouseMove = (e) => {
    if (!imgWrapperRef.current || !isZoomed) return;
    const rect = imgWrapperRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomOrigin({ x, y });
  };

  const handleToggleZoom = (e) => {
    e.stopPropagation();
    if (!isZoomed && imgWrapperRef.current) {
      const rect = imgWrapperRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setZoomOrigin({ x, y });
    }
    setIsZoomed((prev) => !prev);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
    setFeedback('Item added to cart');
    setTimeout(() => setFeedback(''), 2800);
  };

  const getStockStatus = (stock) => {
    const stockNum = Number(stock ?? 10);
    if (stockNum === 0) {
      return { label: 'Out of Stock', class: 'out-of-stock' };
    }
    if (stockNum < 5) {
      return { label: `Only ${stockNum} left in stock`, class: 'low-stock' };
    }
    return { label: 'In Stock & Ready to Ship', class: 'in-stock' };
  };

  const stockInfo = getStockStatus(product.stock);

  return createPortal(
    <div className="product-modal-backdrop" onClick={onClose}>
      <div 
        className="product-modal-container" 
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className="product-modal-close-btn" 
          onClick={onClose}
          aria-label="Close modal (Esc)"
        >
          <X size={20} />
        </button>

        <div className="product-modal-grid">
          {/* Left Column: Full Product Image, Zoom Viewer & Thumbnails */}
          <div className="product-modal-left">
            <div 
              ref={imgWrapperRef}
              className={`product-modal-image-wrapper ${isZoomed ? 'zoomed' : ''}`}
              onClick={handleToggleZoom}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => isZoomed && setIsZoomed(false)}
              title={isZoomed ? 'Click to zoom out' : 'Click to zoom in'}
            >
              <img 
                src={getImageUrl(activeImage)} 
                alt={product.product_name} 
                className="product-modal-main-img" 
                style={{
                  transformOrigin: isZoomed ? `${zoomOrigin.x}% ${zoomOrigin.y}%` : 'center center'
                }}
              />

              <div className="product-modal-zoom-badge">
                {isZoomed ? <><ZoomOut size={13} /> Zoom Out</> : <><ZoomIn size={13} /> Click to Zoom</>}
              </div>

              {images.length > 1 && (
                <>
                  <button 
                    className="modal-nav-arrow modal-nav-prev"
                    onClick={handlePrevImage}
                    title="Previous image"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button 
                    className="modal-nav-arrow modal-nav-next"
                    onClick={handleNextImage}
                    title="Next image"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}
            </div>

            {images.length > 1 && (
              <div className="product-modal-thumbnails">
                {images.map((img, idx) => (
                  <img
                    key={idx}
                    src={getImageUrl(img)}
                    alt={`${product.product_name} angle ${idx + 1}`}
                    className={`product-modal-thumb ${idx === selectedImageIndex ? 'active' : ''}`}
                    onClick={() => {
                      setIsZoomed(false);
                      setSelectedImageIndex(idx);
                    }}
                  />
                ))}
              </div>
            )}

            <div className="product-modal-badge-group">
              <span className="product-modal-category-tag">
                <Tag size={13} /> {product.category || 'Jewellery'}
              </span>
              <span className={`product-modal-stock-badge ${stockInfo.class}`}>
                {stockInfo.label}
              </span>
            </div>
          </div>

          {/* Right Column: Title, Specs & Benefits (Matching Image 3) */}
          <div className="product-modal-right">
            <div>
              <h2 className="product-modal-title">
                {product.product_name}
              </h2>

              <div className="product-modal-price">
                ₹{Number(product.price).toFixed(2)}
              </div>

              <p className="product-modal-desc">
                {product.description || 'Exquisite fine jewellery crafted with precision, designed to complement your timeless personal style for both celebrations and daily elegance.'}
              </p>

              {/* Specifications / Highlights (Image 3 layout) */}
              <div className="product-modal-section-title">
                SPECIFICATIONS & HIGHLIGHTS
              </div>
              <ul className="product-modal-list">
                <li className="product-modal-list-item">
                  <span className="product-modal-check">✓</span>
                  <span>100% Certified Authentic LUVY Jewellery</span>
                </li>
                <li className="product-modal-list-item">
                  <span className="product-modal-check">✓</span>
                  <span>Premium Long-Lasting Polish & Anti-Tarnish Finish</span>
                </li>
                <li className="product-modal-list-item">
                  <span className="product-modal-check">✓</span>
                  <span>Category: <strong>{product.category || 'Jewellery'}</strong></span>
                </li>
              </ul>

              {/* Service Benefits (Image 3 layout) */}
              <div className="product-modal-section-title">
                SERVICE BENEFITS
              </div>
              <ul className="product-modal-list">
                <li className="product-modal-list-item">
                  <span className="product-modal-check">✓</span>
                  <span>Free insured delivery within 5 to 7 working days</span>
                </li>
                <li className="product-modal-list-item">
                  <span className="product-modal-check">✓</span>
                  <span>7-Day Hassle-Free Replacement Guarantee</span>
                </li>
                <li className="product-modal-list-item">
                  <span className="product-modal-check">✓</span>
                  <span>Delivered in luxury signature gift-ready packaging</span>
                </li>
              </ul>
            </div>

            {/* Actions */}
            <div>
              <div className="product-modal-actions">
                <button 
                  className="product-modal-cta-btn" 
                  onClick={handleAddToCart}
                >
                  <ShoppingBag size={18} />
                  Add to Cart - ₹{Number(product.price).toFixed(2)}
                </button>
                <button 
                  className={`product-modal-wishlist-btn ${isInWishlist(product.id) ? 'active' : ''}`}
                  onClick={() => toggleWishlist(product)}
                  title={isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                >
                  <Heart size={20} fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
                </button>
              </div>

              {feedback && (
                <div className="product-modal-feedback">
                  ✓ {feedback}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ProductDetailModal;
