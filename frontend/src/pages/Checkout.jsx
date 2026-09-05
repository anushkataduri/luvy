import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isOrdered, setIsOrdered] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // const handleCheckout = (e) => {
  //   e.preventDefault();
  //   if (cartItems.length === 0) return;
    
  //   // Format order details for WhatsApp
  //   const orderDetails = cartItems.map(item => `${item.quantity}x ${item.name} (₹${(item.price * item.quantity).toFixed(2)})`).join('%0A');
  //   const totalAmount = getCartTotal().toFixed(2);
    
  //   const message = `*New Order Required*%0A%0A*Customer Info:*%0AName: ${formData.name}%0APhone: ${formData.phone}%0AAddress: ${formData.address}%0A%0A*Order Details:*%0A${orderDetails}%0A%0A*Total:* ₹${totalAmount}%0A*Payment Method:* ${paymentMethod}%0A*Payment Status:* Pending Confirmation`;
    
  //   // Send to admin via WhatsApp
  //   window.open(`https://wa.me/919381956301?text=${message}`, '_blank');
    
  //   setIsOrdered(true);
  //   clearCart();
  // };


  const totalAmount = cartItems.reduce(
  (total, item) =>
    total + Number(item.price) * item.quantity,
  0
);



  const handlePlaceOrder = async () => {

  try {

    const user = JSON.parse(
      localStorage.getItem('user')
    );

await axios.post(
  'http://localhost:5000/api/orders/place',
  {
     user_id: user.id,
    customer_name: formData.name,
    phone_number: formData.phone,
    address: formData.address,
    total_amount: totalAmount,
    payment_method: paymentMethod,
    cartItems
  }
);




    

    navigate('/success');

  } catch (error) {

    console.log(error);
  }
};

  if (isOrdered) {
    return (
      <div className="container py-section animate-fade-in" style={{ textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '3rem', backgroundColor: 'var(--bg-white)', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
          <div style={{ color: 'var(--accent-turquoise)', fontSize: '4rem', marginBottom: '1rem' }}>✓</div>
          <h1 className="section-title" style={{ marginBottom: '1rem' }}>Order Confirmed!</h1>
          <p style={{ color: 'var(--text-dark)', marginBottom: '2rem' }}>
            Thank you for shopping with AURA. We have received your order and payment details. We will process it shortly.
          </p>
          <button className="btn btn-primary"  onClick={() => navigate('/')}>
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page container py-section animate-fade-in">
      <h1 className="section-title">Checkout</h1>
      
      <div className="grid grid-cols-2" style={{ gap: '4rem' }}>
        <div className="checkout-form">
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Shipping Information</h2>
          {/* <form id="checkout-form" onSubmit={handleCheckout}> */}
          <form
  id="checkout-form"
  onSubmit={(e) => {
    e.preventDefault();
    handlePlaceOrder();
  }}
>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Full Name</label>
              <input 
                type="text" 
                name="name" 
                required 
                value={formData.name}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}
              />
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Phone Number</label>
              <input 
                type="tel" 
                name="phone" 
                required 
                value={formData.phone}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}
              />
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Full Address</label>
              <textarea 
                name="address" 
                required 
                rows="3"
                value={formData.address}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}
              />
            </div>

            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Payment Method</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
              {['PhonePe', 'Google Pay', 'Credit Card', 'Debit Card'].map(method => (
                <label 
                  key={method} 
                  style={{ 
                    display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem', 
                    border: `1px solid ${paymentMethod === method ? 'var(--primary-navy)' : 'var(--border-color)'}`,
                    borderRadius: '4px', cursor: 'pointer',
                    backgroundColor: paymentMethod === method ? 'var(--bg-light)' : 'transparent'
                  }}
                >
                  <input 
                    type="radio" 
                    name="payment" 
                    value={method}
                    required
                    checked={paymentMethod === method}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  /> {method}
                </label>
              ))}
            </div>
          </form>
        </div>

        <div className="order-summary" style={{ backgroundColor: 'var(--bg-white)', padding: '2rem', borderRadius: '8px', border: '1px solid var(--border-color)', height: 'fit-content' }}>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>Order Total</h2>
          
          <div style={{ marginBottom: '1.5rem' }}>
            {cartItems.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--text-dark)' }}>
                <span>{item.quantity}x {item.product_name}</span>
                <span>₹{(
  Number(item.price) * item.quantity
).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', marginBottom: '2rem' }}>
            <span>Total Payable</span>
            <span className="product-price">₹{Number(getCartTotal()).toFixed(2)}</span>
          </div>

          <button 
            type="submit" 
            form="checkout-form"
            className="btn btn-primary" 
            style={{ width: '100%' }}
            disabled={cartItems.length === 0}
          >
            Confirm & Pay
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
