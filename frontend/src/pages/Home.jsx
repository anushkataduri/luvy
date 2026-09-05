import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { createPortal } from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { products, categories } from '../data/products';
import ProductCard from '../components/ProductCard';
import NewArrivals from '../components/NewArrivals';
import ProductGrid from '../components/ProductGrid';
import bgImage from '../assets/background.png';
import heroFashionImage from '../assets/hero_fashion.png';
import { useCart } from '../context/CartContext';

const Home = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [specialProducts, setSpecialProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const bestSellers = products.filter(p => p.isBestSeller).slice(0, 4);
  const [premiumProducts,
setPremiumProducts] = useState([]);




  useEffect(() => {
  fetchSpecialProducts();
  fetchNewArrivals();
    fetchPremiumProducts();

}, []);

const fetchSpecialProducts = async () => {
  try {
    const response = await axios.get(
      'http://localhost:5000/api/products/special'
    );
      console.log("SPECIAL API DATA:", response.data);


    setSpecialProducts(response.data);

  } catch (error) {
    console.log(error);
  }
};



const fetchNewArrivals = async () => {
  try {
    const response = await axios.get(
      'http://localhost:5000/api/products/new-arrivals'
    );

    setNewArrivals(response.data);

  } catch (error) {
    console.log(error);
  }
};


const fetchPremiumProducts = async () => {
  try {

    const response = await axios.get(
      "http://localhost:5000/api/products/premium"
    );

    setPremiumProducts(response.data);

  } catch (error) {
    console.log(error);
  }
};

console.log("specialProducts state:", specialProducts);
  
  return (
    <div className="home-page animate-fade-in">
      {/* Modern Hero Section */}
      <section className="modern-hero">
        <div className="hero-overlay"></div>
        <div className="hero-shape hero-shape-1"></div>
        <div className="hero-shape hero-shape-2"></div>
        <div className="container modern-hero-container">
          <div className="modern-hero-content animate-slide-right">
            <h1 className="hero-title">
              Elegant Accessories for <br />
              <span className="highlight">Every Girl</span>
            </h1>
            <p className="hero-description">
              Discover elegant jewellery and stylish handbags crafted for modern women.
            </p>
            <div className="hero-buttons">
              <button className="hero-btn btn-primary-gradient" onClick={() => navigate('/shop')}>
                Shop Now
              </button>
              <button className="hero-btn btn-secondary-outline" onClick={() => navigate('/shop')}>
                Explore Collection
              </button>
            </div>
          </div>
          <div className="modern-hero-image animate-fade-in-delayed">
            <img src={heroFashionImage} alt="Fashion Model with Accessories" />
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-section container">
        <h2 className="section-title">Explore Shop by Category</h2>
        <div className="category-grid">
          {categories.map((cat, idx) => {
            const count = products.filter(p => p.category === cat.name).length;
            return (
              <div
                key={idx}
                className="category-box"
                onClick={() => navigate(`/shop?category=${cat.name}`)}
              >
                <div className="category-img-wrapper">
                  <img src={cat.image} alt={cat.name} className="category-img" />
                </div>
                <div className="category-info">
                  <h3 className="category-title">{cat.name}</h3>
                  <span className="category-count">{}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-section" style={{ backgroundColor: 'var(--bg-white)', overflow: 'hidden' }}>
        <div className="container">
          <h2 className="section-title">Best Sellers</h2>
          <div className="marquee-wrapper">
            {[0, 1, 2, 3].map(copyIndex => (
              <div key={copyIndex} className="marquee-content" aria-hidden={copyIndex !== 0}>
                {bestSellers.map(product => (
                  <motion.div
                    layoutId={`product-card-${product.id}-${copyIndex}`}
                    key={`${product.id}-${copyIndex}`}
                    className="bs-card"
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedProduct({ ...product, instanceId: copyIndex });
                      setFeedbackMessage('');
                    }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <motion.div className="bs-img-wrapper" layoutId={`product-image-container-${product.id}-${copyIndex}`}>
                      <motion.img 
                        src={product.image} 
                        alt={product.name} 
                        className="bs-img" 
                        layoutId={`product-image-${product.id}-${copyIndex}`} 
                        initial={{ scale: 1 }}
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.4 }}
                      />
                      <span className="bs-badge">Best Seller</span>
                    </motion.div>
                    <div className="bs-info">
                      <motion.h3 layoutId={`product-title-${product.id}-${copyIndex}`} className="bs-title">{product.name}</motion.h3>
                      <motion.p layoutId={`product-price-${product.id}-${copyIndex}`} className="bs-price">₹{product.price.toFixed(2)}</motion.p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      {/* <NewArrivals /> */}

      <ProductGrid
  title="New Arrivals"
  products={newArrivals}
/>
      

 






<ProductGrid
  title="Special Products"
  products={specialProducts}
  showAll={true}
/>

<ProductGrid
  title="Premium Products"
  products={premiumProducts}
/>


      <AnimatePresence>
        {selectedProduct && createPortal(
          <div className="product-overlay-portal">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="product-overlay-bg"
              onClick={() => setSelectedProduct(null)}
            />
            <div className="product-overlay-wrapper" onClick={() => setSelectedProduct(null)}>
              <motion.div
                layoutId={`product-card-${selectedProduct.id}-${selectedProduct.instanceId ?? 0}`}
                className="product-detail-card"
                onClick={(e) => e.stopPropagation()}
              >
                <button className="close-btn" onClick={() => setSelectedProduct(null)}>✕</button>
                
                <motion.div className="detail-img-wrapper" layoutId={`product-image-container-${selectedProduct.id}-${selectedProduct.instanceId ?? 0}`}>
                  <motion.img 
                    src={selectedProduct.image} 
                    alt={selectedProduct.name} 
                    className="detail-img"
                    layoutId={`product-image-${selectedProduct.id}-${selectedProduct.instanceId ?? 0}`}
                  />
                </motion.div>
                
                <div className="detail-info">
                  <motion.h2 layoutId={`product-title-${selectedProduct.id}-${selectedProduct.instanceId ?? 0}`} className="detail-title">
                    {selectedProduct.name}
                  </motion.h2>
                  <motion.p layoutId={`product-price-${selectedProduct.id}-${selectedProduct.instanceId ?? 0}`} className="detail-price">
                    ₹{selectedProduct.price.toFixed(2)}
                  </motion.p>
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ delay: 0.1 }}
                    className="detail-desc"
                  >
                    {selectedProduct.description}
                  </motion.p>
                  <motion.button 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ delay: 0.2 }}
                    className="btn btn-primary detail-add-btn" 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      addToCart(selectedProduct);
                      setFeedbackMessage('Item added to cart');
                      setTimeout(() => setFeedbackMessage(''), 3000);
                    }}
                  >
                    Add to Cart
                  </motion.button>
                  <AnimatePresence>
                    {feedbackMessage && (
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        style={{ color: 'var(--accent-turquoise)', marginTop: '1rem', fontWeight: 'bold' }}
                      >
                        ✓ {feedbackMessage}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          </div>,
          document.body
        )}
      </AnimatePresence>

      
      {/* Testimonials */}
      <section className="py-section" style={{ backgroundColor: 'var(--primary-navy)', color: 'var(--bg-white)' }}>
        <div className="container">
          <h2 className="section-title" style={{ color: 'var(--bg-white)' }}>What Our Clients Say</h2>
          <div className="grid grid-cols-3 testimonials-grid">
            {[
              { name: "Sarah J.", text: "The diamond earrings I purchased are absolutely stunning. The quality is unmatched and packaging was beautiful." },
              { name: "Emily R.", text: "I am in love with my new navy leather handbag. It's spacious, elegant, and perfect for work and evenings out." },
              { name: "Jessica T.", text: "Incredible customer service. The emerald necklace is exactly as pictured. Will definitely shop here again." }
            ].map((review, idx) => (
              <div key={idx} style={{ backgroundColor: 'var(--secondary-navy)', padding: '2rem', borderRadius: '8px' }}>
                <div style={{ color: 'var(--accent-turquoise)', marginBottom: '1rem' }}>★★★★★</div>
                <p style={{ fontStyle: 'italic', marginBottom: '1.5rem', color: 'var(--text-light)' }}>"{review.text}"</p>
                <div style={{ fontWeight: 'bold' }}>- {review.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
