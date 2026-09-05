import React, { useState } from 'react';
import axios from 'axios';
import { 
  Grid, 
  List, 
  Plus, 
  Search, 
  Trash2, 
  Edit, 
  Upload, 
  X,
  AlertTriangle,
  CheckCircle,
  Tag
} from 'lucide-react';
import { getFirstProductImage, getImageUrl } from '../../utils/imageUtils';

export default function Products({ productsData, onAddProduct, onDeleteProduct, onToggleProductStatus }) {
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productType, setProductType] = useState('all');
  const [editingProduct, setEditingProduct] = useState(null);

  // Add Product form state
  const [newProduct, setNewProduct] = useState({
    product_name: '',
    description: '',
    category: 'Rings',
    price: '',
    stock: '',
    image: null,
    images: [],
    product_type: 'shop',
    status: 'Active',
  });

  // const filteredProducts = productsData.filter(p => {
  //   const matchesSearch = p.product_name.toLowerCase().includes(searchTerm.toLowerCase());
  //   const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
  //   return matchesSearch && matchesCategory;
  // });






  const filteredProducts = productsData.filter((p) => {
  const matchesSearch =
    p.product_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

  const matchesCategory =
    categoryFilter === 'All' ||
    p.category === categoryFilter;

  const matchesType =
    productType === 'all' ||
    p.product_type === productType;

  return (
    matchesSearch &&
    matchesCategory &&
    matchesType
  );
});



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };


 
console.log("Product Type:", productType);
  const handleAddSubmit = async (e) => {
    e.preventDefault();

    try {
      if (
        !newProduct.product_name ||
        !newProduct.description ||
        !newProduct.price ||
        !newProduct.stock
      ) {
        alert('Please fill all fields');
        return;
      }

      const formData = new FormData();

      formData.append(
        'product_name',
        newProduct.product_name
      );

      formData.append(
        'description',
        newProduct.description
      );

      formData.append(
        'category',
        newProduct.category
      );

      formData.append(
        'price',
        newProduct.price
      );

      formData.append(
        'stock',
        newProduct.stock
      );

      if (newProduct.images && newProduct.images.length > 0) {
        Array.from(newProduct.images).forEach((imgFile) => {
          formData.append('images', imgFile);
        });
      } else if (newProduct.image) {
        formData.append('images', newProduct.image);
      }

      formData.append(
        'product_type',
        newProduct.product_type || 'shop'
      );

      let response;

      if (editingProduct) {
        response = await axios.put(
          `http://localhost:5000/api/products/${editingProduct.id}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        alert('Product updated successfully');
      } else {
        response = await axios.post(
          'http://localhost:5000/api/products/add',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        alert('Product added successfully');
      }

      setNewProduct({
        product_name: '',
        description: '',
        category: 'Rings',
        price: '',
        stock: '',
        image: null,
        images: [],
        product_type: 'shop',
        status: 'Active',
      });

      setEditingProduct(null);
      setIsModalOpen(false);

      if (onAddProduct) {
        onAddProduct();
      }

    } catch (error) {
      console.log(error);
      alert(
        error.response?.data?.message ||
        'Failed to save product'
      );
    }
  };

  const getStockBadge = (stock) => {
    if (stock <= 5) return { text: 'Critical', bg: 'var(--admin-danger-light)', color: 'var(--admin-danger)', pct: 15 };
    if (stock < 15) return { text: 'Low Stock', bg: 'var(--admin-warning-light)', color: 'var(--admin-warning)', pct: 45 };
    return { text: 'In Stock', bg: 'var(--admin-success-light)', color: 'var(--admin-success)', pct: 85 };
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setNewProduct({
      product_name: product.product_name,
      description: product.description,
      category: product.category,
      price: product.price,
      stock: product.stock,
      image: null,
      images: [],
      product_type: product.product_type || 'shop',
      status: product.status
    });
    setIsModalOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="admin-animate-fade-in">
      {/* Page Header */}
      <div className="admin-page-header">
        <div className="admin-page-title-group">
          <h1 className="admin-page-title">Jewellery Catalog</h1>
          <span className="admin-page-subtitle">Add new pieces, manage collection categories, adjust price models, and monitor stock volumes.</span>
        </div>
        <div className="admin-page-actions">
          <div style={{ display: 'flex', backgroundColor: 'var(--admin-bg)', padding: '4px', borderRadius: '8px', border: '1px solid var(--admin-border-color)', marginRight: '8px' }}>
            <button 
              className="admin-btn admin-btn-icon-only" 
              style={{ width: '36px', height: '36px', borderRadius: '6px', background: viewMode === 'grid' ? 'var(--admin-sidebar-bg)' : 'transparent', color: viewMode === 'grid' ? 'var(--admin-accent-purple)' : 'var(--admin-text-secondary)', boxShadow: viewMode === 'grid' ? 'var(--admin-shadow)' : 'none' }}
              onClick={() => setViewMode('grid')}
            >
              <Grid size={16} />
            </button>
            <button 
              className="admin-btn admin-btn-icon-only" 
              style={{ width: '36px', height: '36px', borderRadius: '6px', background: viewMode === 'table' ? 'var(--admin-sidebar-bg)' : 'transparent', color: viewMode === 'table' ? 'var(--admin-accent-purple)' : 'var(--admin-text-secondary)', boxShadow: viewMode === 'table' ? 'var(--admin-shadow)' : 'none' }}
              onClick={() => setViewMode('table')}
            >
              <List size={16} />
            </button>
          </div>
          <button className="admin-btn admin-btn-primary" 
            onClick={() => {
              if (isModalOpen && !editingProduct) {
                setIsModalOpen(false);
              } else {
                setEditingProduct(null);
                setNewProduct({
                  product_name: '',
                  description: '',
                  category: 'Rings',
                  price: '',
                  stock: '',
                  image: null,
                  images: [],
                  product_type: 'shop',
                  status: 'Active',
                });
                setIsModalOpen(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
          >
            <Plus size={16} /> Add New Jewellery
          </button>
        </div>
      </div>

      {/* Inline Add/Edit Product Form */}
      {isModalOpen && (
        <div className="admin-card admin-animate-fade-in" style={{ padding: '24px', marginBottom: '24px', border: '1px solid var(--admin-border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid var(--admin-border-color)' }}>
            <h3 style={{ margin: 0, fontFamily: 'var(--admin-font-serif)', fontSize: '1.25rem', fontWeight: '700', color: 'var(--admin-text-primary)' }}>
              {editingProduct ? 'Edit Jewellery Piece' : 'Add New Jewellery Piece'}
            </h3>
            <button 
              type="button" 
              onClick={() => {
                setIsModalOpen(false);
                setEditingProduct(null);
                setNewProduct({
                  product_name: '',
                  description: '',
                  category: 'Rings',
                  price: '',
                  stock: '',
                  image: null,
                  images: [],
                  product_type: 'shop',
                  status: 'Active',
                });
              }}
              style={{ cursor: 'pointer', border: 'none', background: 'none', color: 'var(--admin-text-secondary)' }}
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleAddSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '20px' }}>
              
              {/* Left Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Product Name */}
                <div className="admin-form-group" style={{ marginBottom: 0 }}>
                  <label className="admin-form-label">Product Name</label>
                  <input
                    type="text"
                    name="product_name"
                    value={newProduct.product_name}
                    onChange={handleInputChange}
                    className="admin-form-input"
                    placeholder="Enter product name"
                    required
                  />
                </div>

                {/* Category & Product Type */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label className="admin-form-label">Category</label>
                    <select
                      name="category"
                      value={newProduct.category}
                      onChange={handleInputChange}
                      className="admin-form-select"
                    >
                      <option value="Rings">Rings</option>
                      <option value="Necklaces">Necklaces</option>
                      <option value="Pendants">Pendants</option>
                      <option value="Earrings">Earrings</option>
                      <option value="Bracelets">Bracelets</option>
                      <option value="Handbags">Handbags</option>
                      <option value="Hand Bracelets">Hand Bracelets</option>
                      <option value="Clothing">Clothing</option>
                      <option value="Premium Gold">Premium Gold</option>
                    </select>
                  </div>

                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label className="admin-form-label">Product Type</label>
                    <select
                      name="product_type"
                      value={newProduct.product_type}
                      onChange={handleInputChange}
                      className="admin-form-select"
                    >
                      <option value="shop">Shop</option>
                      <option value="new_arrival">New Arrival</option>
                      <option value="special">Special Product</option>
                      <option value="premium">Premium Product</option>
                    </select>
                  </div>
                </div>

                {/* Price & Stock */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label className="admin-form-label">Product Price (₹)</label>
                    <input
                      type="number"
                      name="price"
                      value={newProduct.price}
                      onChange={handleInputChange}
                      className="admin-form-input"
                      placeholder="Enter price"
                      required
                    />
                  </div>

                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label className="admin-form-label">Product Stock</label>
                    <input
                      type="number"
                      name="stock"
                      value={newProduct.stock}
                      onChange={handleInputChange}
                      className="admin-form-input"
                      placeholder="Enter stock quantity"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Product Description */}
                <div className="admin-form-group" style={{ marginBottom: 0, flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <label className="admin-form-label">Product Description</label>
                  <textarea
                    name="description"
                    value={newProduct.description}
                    onChange={handleInputChange}
                    className="admin-form-input"
                    rows="3"
                    placeholder="Enter product description"
                    style={{ resize: 'none', flex: 1, minHeight: '80px' }}
                    required
                  />
                </div>

                {/* Product Images */}
                <div className="admin-form-group" style={{ marginBottom: 0 }}>
                  <label className="admin-form-label">Product Image(s) (Select 1 or multiple)</label>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            images: Array.from(e.target.files),
                            image: e.target.files[0]
                          })
                        }
                        className="admin-form-input"
                        required={!editingProduct}
                      />
                    </div>
                    {((newProduct.images && newProduct.images.length > 0) || (editingProduct && editingProduct.image)) && (
                      <div style={{ flexShrink: 0, display: 'flex', gap: '4px' }}>
                        {newProduct.images && newProduct.images.length > 0 ? (
                          newProduct.images.map((img, idx) => (
                            <img
                              key={idx}
                              src={URL.createObjectURL(img)}
                              alt="Preview"
                              style={{
                                width: '42px',
                                height: '42px',
                                objectFit: 'cover',
                                borderRadius: '8px',
                                border: '1px solid var(--admin-border-color)',
                              }}
                            />
                          ))
                        ) : (
                          <img
                            src={getImageUrl(getFirstProductImage(editingProduct.image))}
                            alt="Preview"
                            style={{
                              width: '42px',
                              height: '42px',
                              objectFit: 'cover',
                              borderRadius: '8px',
                              border: '1px solid var(--admin-border-color)',
                            }}
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid var(--admin-border-color)', paddingTop: '16px' }}>
              <button
                type="button"
                className="admin-btn admin-btn-secondary"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingProduct(null);
                  setNewProduct({
                    product_name: '',
                    description: '',
                    category: 'Rings',
                    price: '',
                    stock: '',
                    image: null,
                    images: [],
                    product_type: 'shop',
                    status: 'Active',
                  });
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="admin-btn admin-btn-primary"
              >
                {editingProduct ? 'Update Product' : 'Add Product'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Catalog Search & Filters toolbar */}
      <div className="admin-card" style={{ padding: '16px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
          
          <div style={{ display: 'flex', gap: '12px', flex: '1', minWidth: '280px' }}>
            {/* Search Input */}
            <div style={{ position: 'relative', flex: '1' }}>
              <input 
                type="text" 
                placeholder="Search collection name, item SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="admin-form-input"
                style={{ paddingLeft: '40px', height: '42px' }}
              />
              <Search size={18} style={{ position: 'absolute', left: '14px', top: '12px', color: 'var(--admin-text-secondary)' }} />
            </div>
            
            {/* Category Select */}
            <select 
              className="admin-form-select" 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{ width: '160px', height: '42px' }}
            >
              <option value="All">All Categories</option>
              <option value="Rings">Rings</option>
              <option value="Necklaces">Necklaces</option>
              <option value="Pendants">Pendants</option>
              <option value="Earrings">Earrings</option>
              <option value="Bracelets">Bracelets</option>
              <option value="Handbags">Handbags</option>
             <option value="Hand Bracelets">Hand Bracelets</option>
              <option value="Clothing">Clothing</option>
                <option value="Premium Gold">
    Premium Gold
  </option>
            </select>
          </div>

          <div style={{ fontSize: '0.85rem', color: 'var(--admin-text-secondary)', fontWeight: '500' }}>
            Found <strong>{filteredProducts.length}</strong> items in the vault
          </div>

        </div>
      </div>







      <div
        style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '20px',
          flexWrap: 'wrap'
        }}
      >
        {[
          { key: 'all', label: 'All Products' },
          { key: 'shop', label: 'Shop' },
          { key: 'special', label: 'Special' },
          { key: 'premium', label: 'Premium' },
          { key: 'new_arrival', label: 'New Arrivals' },
        ].map((tab) => (
          <button
            key={tab.key}
            className={`admin-btn ${productType === tab.key ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
            onClick={() => setProductType(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Products Grid View */}
      {viewMode === 'grid' ? (
        <div className="admin-grid-3">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((p) => {
              const stockState = getStockBadge(p.stock);
              return (
                <div key={p.id} className="admin-card admin-card-hover" style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px' }}>
                  
                  {/* Luxury jewellery thumbnail */}
                  <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', height: '220px', border: '1px solid var(--admin-border-color)' }}>
                    <img 
                      src={getImageUrl(getFirstProductImage(p.image))}
                      alt={p.product_name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                    <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
                      <span className="admin-badge" style={{ backgroundColor: stockState.bg, color: stockState.color, backdropFilter: 'blur(8px)', border: `1px solid rgba(255,255,255,0.2)` }}>
                        {p.stock === 0 ? 'Out of Stock' : `${p.stock} units`}
                      </span>
                    </div>
                    <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                      <span className="admin-badge" style={{ backgroundColor: 'rgba(255,255,255,0.95)', color: 'var(--admin-text-primary)', fontWeight: 'bold' }}>
                        ₹{Number(p.price).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Title & category */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--admin-text-secondary)', fontWeight: '600', textTransform: 'uppercase' }}>
                      <Tag size={12} style={{ color: 'var(--admin-accent-gold)' }} />
                      {p.category}
                    </div>
                    <strong style={{ fontSize: '1rem', color: 'var(--admin-text-primary)', fontFamily: 'var(--admin-font-serif)', height: '24px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.product_name}</strong>
                  </div>

                  {/* Stock progress indicators */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '6px', fontWeight: '500' }}>
                      <span style={{ color: 'var(--admin-text-secondary)' }}>Inventory Health:</span>
                      <strong style={{ color: stockState.color }}>{stockState.text}</strong>
                    </div>
                    <div className="admin-stock-bar">
                      <div className="admin-stock-bar-fill" style={{ width: `${stockState.pct}%`, backgroundColor: stockState.color }}></div>
                    </div>
                  </div>

                  {/* Actions & Status toggle */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'space-between', justifyContent: 'space-between', borderTop: '1px solid var(--admin-border-color)', paddingTop: '12px', marginTop: 'auto' }}>
                    
                    {/* Status Toggle */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <label className="admin-toggle-switch">
                        <input 
                          type="checkbox" 
                          checked={p.status === 'Active'} 
                          onChange={() => onToggleProductStatus(p.id)}
                        />
                        <span className="admin-toggle-slider"></span>
                      </label>
                      <span style={{ fontSize: '0.75rem', fontWeight: '700', color: p.status === 'Active' ? 'var(--admin-success)' : 'var(--admin-text-secondary)' }}>
                        {p.status}
                      </span>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        className="admin-btn admin-btn-secondary admin-btn-icon-only"
                        title="Edit Product"
                        onClick={() => handleEditProduct(p)}
                      >
                        <Edit size={14} />
                      </button>
                      <button className="admin-btn admin-btn-secondary admin-btn-icon-only" style={{ width: '32px', height: '32px', borderRadius: '8px', color: 'var(--admin-danger)' }} onClick={() => onDeleteProduct(p.id)} title="Delete Product">
                        <Trash2 size={14} />
                      </button>
                    </div>

                  </div>

                </div>
              );
            })
          ) : (
            <div className="admin-card" style={{ gridColumn: 'span 3', textAlign: 'center', padding: '40px', color: 'var(--admin-text-secondary)' }}>
              No jewellery pieces matched your criteria.
            </div>
          )}
        </div>
      ) : (
        /* Products Table View */
        <div className="admin-card">
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock Levels</th>
                  <th>Health Indicator</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((p) => {
                    const stockState = getStockBadge(p.stock);
                    return (
                      <tr key={p.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <img 
                              src={getImageUrl(getFirstProductImage(p.image))}
                              alt={p.product_name} 
                              style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--admin-border-color)' }} 
                            />
                            <strong style={{ fontSize: '0.9rem', color: 'var(--admin-text-primary)', fontFamily: 'var(--admin-font-serif)' }}>{p.product_name}</strong>
                          </div>
                        </td>
                        <td>{p.category}</td>
                        <td style={{ fontWeight: '700' }}>₹{Number(p.price).toFixed(2)}</td>
                        <td style={{ fontWeight: '600' }}>{p.stock} units</td>
                        <td>
                          <span className="admin-badge" style={{ backgroundColor: stockState.bg, color: stockState.color }}>
                            {stockState.text}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <label className="admin-toggle-switch">
                              <input 
                                type="checkbox" 
                                checked={p.status === 'Active'} 
                                onChange={() => onToggleProductStatus(p.id)}
                              />
                              <span className="admin-toggle-slider"></span>
                            </label>
                            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: p.status === 'Active' ? 'var(--admin-success)' : 'var(--admin-text-secondary)' }}>
                              {p.status}
                            </span>
                          </div>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                            <button 
                              className="admin-btn admin-btn-secondary admin-btn-icon-only" 
                              style={{ width: '32px', height: '32px', borderRadius: '8px' }} 
                              title="Edit Product"
                              onClick={() => handleEditProduct(p)}
                            >
                              <Edit size={14} />
                            </button>
                            <button className="admin-btn admin-btn-secondary admin-btn-icon-only" style={{ width: '32px', height: '32px', borderRadius: '8px', color: 'var(--admin-danger)' }} onClick={() => onDeleteProduct(p.id)} title="Delete Product">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--admin-text-secondary)' }}>
                      No items matched your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
