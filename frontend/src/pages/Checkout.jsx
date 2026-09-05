import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CreditCard, Truck, ShieldCheck, AlertCircle, Check } from 'lucide-react';
import phonepeLogo from '../assets/phonepe_logo.png';
import gpayLogo from '../assets/gpay_logo.png';
import paytmLogo from '../assets/paytm_logo.png';

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('PhonePe');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Auto-populate user info from logged-in session/profile if available
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        setFormData(prev => ({
          ...prev,
          name: prev.name || user.fullname || user.name || '',
          phone: prev.phone || user.phone || '',
          address: prev.address || user.address || ''
        }));
      }
    } catch (e) {
      console.error('Error reading user profile for checkout:', e);
    }
  }, []);

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Full name is required';
        if (!/^[a-zA-Z\s]+$/.test(value)) return 'Only alphabets and spaces are allowed';
        if (value.trim().length < 3) return 'Name must be at least 3 characters';
        return '';
      case 'phone':
        if (!value.trim()) return 'Phone number is required';
        if (!/^\d+$/.test(value.trim())) return 'Only numeric digits allowed';
        if (value.trim().length !== 10) return 'Must be exactly 10 digits';
        return '';
      case 'address':
        if (!value.trim()) return 'Delivery address is required';
        if (value.trim().length < 10) return 'Please enter complete address (min 10 characters)';
        return '';
      default:
        return '';
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // For phone: restrict to digits and max 10 chars
    if (name === 'phone' && value && (!/^\d*$/.test(value) || value.length > 10)) {
      return;
    }

    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);

    // Live real-time validation
    if (touched[name]) {
      const errorMsg = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: errorMsg }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const errorMsg = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: errorMsg }));
  };

  const totalAmount = cartItems.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0
  );

  const isFormValid = () => {
    return (
      formData.name.trim() &&
      !validateField('name', formData.name) &&
      formData.phone.trim() &&
      !validateField('phone', formData.phone) &&
      formData.address.trim() &&
      !validateField('address', formData.address) &&
      paymentMethod
    );
  };

  const handlePlaceOrder = async () => {
    // Touch all fields to trigger validation errors if empty
    const nameErr = validateField('name', formData.name);
    const phoneErr = validateField('phone', formData.phone);
    const addressErr = validateField('address', formData.address);

    setTouched({ name: true, phone: true, address: true });
    setErrors({ name: nameErr, phone: phoneErr, address: addressErr });

    if (nameErr || phoneErr || addressErr) {
      return;
    }

    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }

    setIsSubmitting(true);

    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      const response = await axios.post(
        'http://localhost:5000/api/orders/place',
        {
          user_id: user?.id || null,
          customer_name: formData.name.trim(),
          phone_number: formData.phone.trim(),
          address: formData.address.trim(),
          total_amount: totalAmount,
          payment_method: paymentMethod,
          cartItems
        }
      );

      // 1. Clear cart immediately to reset cart badge and empty state
      clearCart();

      // 2. Redirect to success page with order details
      navigate('/success', { 
        state: { 
          orderId: response.data?.orderId, 
          luvyOrderId: response.data?.luvy_order_id 
        } 
      });

    } catch (error) {
      console.error('Order placement error:', error);
      alert(error.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const paymentOptions = [
    {
      id: 'PhonePe',
      label: 'PhonePe UPI',
      subtitle: 'Instant & Secure via PhonePe App',
      icon: (
        <img
          src={phonepeLogo}
          alt="PhonePe"
          style={{ width: '32px', height: '32px', objectFit: 'contain', borderRadius: '50%' }}
        />
      )
    },
    {
      id: 'Google Pay',
      label: 'Google Pay',
      subtitle: 'Fast UPI payment with GPay',
      icon: (
        <img
          src={gpayLogo}
          alt="Google Pay"
          style={{ width: '32px', height: '32px', objectFit: 'contain' }}
        />
      )
    },
    {
      id: 'Paytm / UPI',
      label: 'Paytm / UPI',
      subtitle: 'Paytm Wallet, Postpaid, UPI & Net Banking',
      icon: (
        <img
          src={paytmLogo}
          alt="Paytm"
          style={{ width: '54px', height: '24px', objectFit: 'contain' }}
        />
      )
    },
    {
      id: 'Credit / Debit Card',
      label: 'Credit / Debit Card',
      subtitle: 'Visa, Mastercard, RuPay',
      icon: <CreditCard size={24} color="#1E293B" />
    },
    {
      id: 'Cash on Delivery',
      label: 'Cash on Delivery',
      subtitle: 'Pay when your jewellery arrives',
      icon: <Truck size={24} color="#059669" />
    }
  ];

  return (
    <div className="checkout-page container py-section animate-fade-in">
      <h1 className="section-title">Checkout & Payment</h1>
      
      <div className="grid grid-cols-2" style={{ gap: '3.5rem', alignItems: 'start' }}>
        <div className="checkout-form">
          <h2 style={{ marginBottom: '1.25rem', fontSize: '1.35rem', color: 'var(--primary-navy)' }}>
            1. Shipping Information
          </h2>
          
          <form
            id="checkout-form"
            onSubmit={(e) => {
              e.preventDefault();
              handlePlaceOrder();
            }}
            noValidate
          >
            {/* Full Name */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-dark)' }}>
                  Full Name *
                </label>
                {touched.name && !errors.name && formData.name && (
                  <span style={{ fontSize: '0.78rem', color: '#16a34a', display: 'flex', alignItems: 'center', gap: '3px', fontWeight: '600' }}>
                    <Check size={14} /> Valid Name
                  </span>
                )}
              </div>
              
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  name="name" 
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  style={{ 
                    width: '100%', 
                    padding: '0.85rem 1rem', 
                    borderRadius: '8px', 
                    border: `1.5px solid ${touched.name && errors.name ? '#ef4444' : touched.name && formData.name ? '#16a34a' : 'var(--border-color)'}`, 
                    outline: 'none',
                    backgroundColor: touched.name && errors.name ? '#fef2f2' : 'var(--bg-white)',
                    transition: 'border-color 0.2s ease, background-color 0.2s ease'
                  }}
                />
              </div>
              {touched.name && errors.name && (
                <div style={{ color: '#dc2626', fontSize: '0.78rem', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <AlertCircle size={13} /> {errors.name}
                </div>
              )}
            </div>
            
            {/* Phone Number */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-dark)' }}>
                  Phone Number *
                </label>
                {touched.phone && !errors.phone && formData.phone && (
                  <span style={{ fontSize: '0.78rem', color: '#16a34a', display: 'flex', alignItems: 'center', gap: '3px', fontWeight: '600' }}>
                    <Check size={14} /> 10-Digit Mobile
                  </span>
                )}
              </div>
              
              <div style={{ position: 'relative' }}>
                <input 
                  type="tel" 
                  name="phone" 
                  placeholder="Enter 10-digit mobile number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  style={{ 
                    width: '100%', 
                    padding: '0.85rem 1rem', 
                    borderRadius: '8px', 
                    border: `1.5px solid ${touched.phone && errors.phone ? '#ef4444' : touched.phone && formData.phone ? '#16a34a' : 'var(--border-color)'}`, 
                    outline: 'none',
                    backgroundColor: touched.phone && errors.phone ? '#fef2f2' : 'var(--bg-white)',
                    transition: 'border-color 0.2s ease, background-color 0.2s ease'
                  }}
                />
              </div>
              {touched.phone && errors.phone && (
                <div style={{ color: '#dc2626', fontSize: '0.78rem', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <AlertCircle size={13} /> {errors.phone}
                </div>
              )}
            </div>

            {/* Delivery Address */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-dark)' }}>
                  Delivery Address *
                </label>
                {touched.address && !errors.address && formData.address && (
                  <span style={{ fontSize: '0.78rem', color: '#16a34a', display: 'flex', alignItems: 'center', gap: '3px', fontWeight: '600' }}>
                    <Check size={14} /> Complete Address
                  </span>
                )}
              </div>
              
              <textarea 
                name="address" 
                rows="3"
                placeholder="House / Flat No., Street, Landmark, City, State, Pincode"
                value={formData.address}
                onChange={handleInputChange}
                onBlur={handleBlur}
                style={{ 
                  width: '100%', 
                  padding: '0.85rem 1rem', 
                  borderRadius: '8px', 
                  border: `1.5px solid ${touched.address && errors.address ? '#ef4444' : touched.address && formData.address ? '#16a34a' : 'var(--border-color)'}`, 
                  outline: 'none', 
                  resize: 'vertical',
                  backgroundColor: touched.address && errors.address ? '#fef2f2' : 'var(--bg-white)',
                  transition: 'border-color 0.2s ease, background-color 0.2s ease'
                }}
              />
              {touched.address && errors.address && (
                <div style={{ color: '#dc2626', fontSize: '0.78rem', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <AlertCircle size={13} /> {errors.address}
                </div>
              )}
            </div>

            <h2 style={{ marginBottom: '1.25rem', fontSize: '1.35rem', color: 'var(--primary-navy)' }}>
              2. Payment Method
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2rem' }}>
              {paymentOptions.map((opt) => {
                const isSelected = paymentMethod === opt.id;
                return (
                  <label 
                    key={opt.id} 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      padding: '1rem 1.25rem', 
                      border: `2px solid ${isSelected ? 'var(--accent-gold, #c89d58)' : 'var(--border-color)'}`,
                      borderRadius: '10px', 
                      cursor: 'pointer',
                      backgroundColor: isSelected ? 'rgba(200, 157, 88, 0.06)' : 'var(--bg-white)',
                      transition: 'all 0.2s ease',
                      boxShadow: isSelected ? '0 2px 8px rgba(200, 157, 88, 0.15)' : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <input 
                        type="radio" 
                        name="payment" 
                        value={opt.id}
                        required
                        checked={isSelected}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        style={{ accentColor: 'var(--accent-gold, #c89d58)', width: '18px', height: '18px', cursor: 'pointer' }}
                      />
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--text-dark)' }}>
                          {opt.label}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted, #64748b)' }}>
                          {opt.subtitle}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      {opt.icon}
                    </div>
                  </label>
                );
              })}
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div className="order-summary" style={{ backgroundColor: 'var(--bg-white)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: '0 4px 15px rgba(0,0,0,0.04)' }}>
          <h2 style={{ marginBottom: '1.25rem', fontSize: '1.35rem', paddingBottom: '0.8rem', borderBottom: '1px solid var(--border-color)', color: 'var(--primary-navy)' }}>
            Order Summary
          </h2>
          
          <div style={{ marginBottom: '1.5rem', maxHeight: '280px', overflowY: 'auto' }}>
            {cartItems.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem', color: 'var(--text-dark)', fontSize: '0.9rem' }}>
                <span style={{ fontWeight: '500' }}>
                  {item.quantity}x {item.product_name || item.name}
                </span>
                <span style={{ fontWeight: '600' }}>
                  ₹{(Number(item.price) * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.88rem', color: 'var(--text-muted, #64748b)' }}>
              <span>Subtotal</span>
              <span>₹{Number(totalAmount).toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.88rem', color: 'var(--text-muted, #64748b)' }}>
              <span>Delivery Charges</span>
              <span style={{ color: '#059669', fontWeight: '600' }}>FREE</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '800', fontSize: '1.25rem', paddingTop: '0.8rem', borderTop: '1px dashed var(--border-color)', color: 'var(--primary-navy)' }}>
              <span>Total Payable</span>
              <span className="product-price" style={{ color: 'var(--accent-gold, #c89d58)' }}>
                ₹{Number(totalAmount).toFixed(2)}
              </span>
            </div>
          </div>

          <button 
            type="submit" 
            form="checkout-form"
            className="btn btn-primary" 
            style={{ width: '100%', padding: '1rem', fontSize: '1rem', fontWeight: '700', borderRadius: '8px' }}
            disabled={cartItems.length === 0 || isSubmitting}
          >
            {isSubmitting ? 'Placing Order...' : `Confirm & Pay with ${paymentMethod}`}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '1rem', fontSize: '0.75rem', color: '#64748b' }}>
            <ShieldCheck size={16} color="#059669" />
            <span>100% Safe & Encrypted Payment</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
