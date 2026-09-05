import React from 'react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, Heart } from 'lucide-react';
import { getFirstProductImage, getImageUrl } from '../utils/imageUtils';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const { addToWishlist } = useWishlist();
  const navigate = useNavigate();


  const handleCheckout = () => {

  const isLoggedIn =
    localStorage.getItem("isLoggedIn");

  if (isLoggedIn !== "true") {

    alert(
      "Please Sign In to continue checkout"
    );

    navigate("/auth?mode=login");
    return;
  }

  navigate("/checkout");
};

  return (
    <div className="cart-page container py-section animate-fade-in">
      <h1 className="section-title">Your Cart</h1>
      
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <ShoppingBagBigIcon />
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything to your cart yet.</p>
          <button className="btn btn-primary" onClick={() => navigate('/shop')}>
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="cart-grid">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <img 
                  src={getImageUrl(getFirstProductImage(item.image))}
                  alt={item.product_name} 
                  className="cart-item-img" 
                />
                
                <div className="cart-item-info">
                  <h3>{item.product_name}</h3>
                  <p className="cart-item-category">{item.category}</p>
                  <p className="product-price">
                    ₹{Number(item.price).toFixed(2)}
                  </p>
                </div>

                <div className="cart-item-actions">
                  <div className="cart-item-top-actions">
                    <button 
                      onClick={() => {
                        addToWishlist(item);
                        removeFromCart(item.id);
                      }} 
                      className="wishlist-action-btn"
                      title="Move to Wishlist"
                    >
                      <Heart size={20} />
                    </button>
                    <button onClick={() => removeFromCart(item.id)} className="remove-action-btn">
                      <Trash2 size={20} />
                    </button>
                  </div>
                  
                  <div className="quantity-controls">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}><Minus size={16}/></button>
                    <span className="quantity-value">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus size={16}/></button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3>Order Summary</h3>
            
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{getCartTotal().toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            
            <div className="summary-total">
              <span>Total</span>
              <span className="product-price">₹{getCartTotal().toFixed(2)}</span>
            </div>

            <div className="delivery-info">
              <p>
                🚚 Delivered within 5 to 7 working days
              </p>
            </div>

            {/* <button 
              className="btn btn-primary checkout-btn" 
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout <ArrowRight size={18} />
            
            
            </button> */}

<button
  className="btn btn-primary checkout-btn"
  onClick={handleCheckout}
>
  Proceed to Checkout
  <ArrowRight size={18} />
</button>
            <button 
              className="btn btn-outline continue-btn" 
              onClick={() => navigate('/shop')}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}

      {cartItems.length > 0 && (
        <div className="mobile-checkout-bar">
          <div className="mobile-checkout-total">
            <span>Total Amount</span>
            <span className="total-amount">₹{getCartTotal().toFixed(2)}</span>
          </div>
          {/* <button className="mobile-checkout-btn" onClick={() => navigate('/checkout')}>
            Checkout <ArrowRight size={18} />
          </button> */}


<button
  className="mobile-checkout-btn"
  onClick={handleCheckout}
>
  Checkout
  <ArrowRight size={18} />
</button>

        </div>
      )}
    </div>
  );
};

const ShoppingBagBigIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--text-dark)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 1.5rem' }}>
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <path d="M16 10a4 4 0 0 1-8 0"></path>
    </svg>
)

export default Cart;
