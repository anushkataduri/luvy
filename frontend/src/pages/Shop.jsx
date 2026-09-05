import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import ProductDetailModal from '../components/ProductDetailModal';

const Shop = () => {
  const [filter, setFilter] = useState('All');
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const categories = [
    { name: 'Rings' },
    { name: 'Necklaces' },
    { name: 'Pendants' },
    { name: 'Earrings' },
    { name: 'Bracelets' },
    { name: 'Handbags' },
    { name: 'Hand Bracelets' },
    { name: 'Clothing' },
  ];

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');

    if (categoryParam) {
      setFilter(categoryParam);
    } else {
      setFilter('All');
    }

    setSelectedProduct(null);
    fetchProducts();
  }, [location.search]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        'http://localhost:5000/api/products'
      );
      setProducts(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCategorySelect = (catName) => {
    setFilter(catName);
    setSelectedProduct(null);
    if (catName === 'All') {
      navigate('/shop');
    } else {
      navigate(`/shop?category=${encodeURIComponent(catName)}`);
    }
  };

  const filteredProducts = filter === 'All' 
    ? products 
    : products.filter(p => p.category?.trim().toLowerCase() === filter.trim().toLowerCase());

  return (
    <div className="shop-page container py-section animate-fade-in">
      <h1 className="section-title">Shop Our Collection</h1>
      
      <div className="filter-bar" style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', justifyContent: 'center', flexWrap: 'wrap', padding: '0 1rem' }}>
        <button 
          className={`btn ${filter === 'All' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => handleCategorySelect('All')}
          style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
        >
          All
        </button>
        {categories.map(cat => (
          <button 
            key={cat.name}
            className={`btn ${filter.toLowerCase() === cat.name.toLowerCase() ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => handleCategorySelect(cat.name)}
            style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-4" style={{ padding: '0 1rem', alignItems: 'stretch' }}>
        {filteredProducts.map(product => (
          <ProductCard 
            key={product.id} 
            product={product} 
            isSelected={selectedProduct?.id === product.id}
            onSelect={(p) => setSelectedProduct(p)}
          />
        ))}
        {filteredProducts.length === 0 && (
          <div style={{ gridColumn: 'span 4', textAlign: 'center', padding: '3rem' }}>
            <p>No products found in this category.</p>
          </div>
        )}
      </div>

      {selectedProduct && (
        <ProductDetailModal 
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};

export default Shop;
