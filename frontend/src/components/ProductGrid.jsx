
import React, { useState } from 'react';
import ProductCard from './ProductCard';
import ProductDetailModal from './ProductDetailModal';
import './ProductGrid.css';

const ProductGrid = ({ title, products, showAll = false }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const displayProducts = showAll
    ? products
    : products.slice(0, 3);

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
  };

  return (
    <section className="product-grid-section py-section">
      <div className="container">
        <h2 className="section-title">{title}</h2>

        <div className="product-grid" style={{ alignItems: 'stretch' }}>
          {displayProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isSelected={selectedProduct?.id === product.id}
              onSelect={handleSelectProduct}
            />
          ))}
        </div>

        {selectedProduct && (
          <ProductDetailModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </div>
    </section>
  );
};

export default ProductGrid;
