import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Calendar, 
  CreditCard, 
  DollarSign, 
  User, 
  Phone, 
  MapPin, 
  ShoppingBag, 
  Check, 
  X, 
  AlertTriangle 
} from 'lucide-react';
import { getFirstProductImage, getImageUrl } from '../../utils/imageUtils';

export default function AdminOrderDetails({ orderId }) {
  const [order, setOrder] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;

    axios
      .get(`http://localhost:5000/api/orders/${orderId}`)
      .then((res) => {
        setOrder(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [orderId]);

  const handleUpdateStatus = async (newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, { status: newStatus });
      setOrder(prev => prev.map(item => ({ ...item, order_status: newStatus })));
    } catch (err) {
      console.error(err);
      alert('Failed to update order status');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px', color: 'var(--admin-text-secondary)' }}>
        <h2>Loading Order Details...</h2>
      </div>
    );
  }

  if (order.length === 0) {
    return (
      <div className="admin-card" style={{ textAlign: 'center', padding: '40px', color: 'var(--admin-text-secondary)' }}>
        <h2>No Order Found</h2>
      </div>
    );
  }

  const orderInfo = order[0];

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'Accepted':
      case 'Delivered':
        return { bg: 'var(--admin-success-light)', color: 'var(--admin-success)', border: '1px solid rgba(16, 185, 129, 0.2)' };
      case 'Rejected':
        return { bg: 'var(--admin-danger-light)', color: 'var(--admin-danger)', border: '1px solid rgba(239, 68, 68, 0.2)' };
      case 'Pending':
      default:
        return { bg: 'var(--admin-warning-light)', color: 'var(--admin-warning)', border: '1px solid rgba(245, 158, 11, 0.2)' };
    }
  };

  const badgeStyle = getStatusBadgeStyle(orderInfo.order_status);

  return (
    <div className="admin-animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Title Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="admin-page-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingBag size={28} style={{ color: 'var(--admin-accent-purple)' }} />
            Order Details
          </h1>
          <span className="admin-page-subtitle">Detailed customer metadata, order items, and decision logs.</span>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        
        {/* Left Column: Summary and Customer */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Order Summary Card */}
          <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--admin-border-color)', paddingBottom: '12px' }}>
              <h3 style={{ margin: 0, fontFamily: 'var(--admin-font-serif)', fontSize: '1.2rem', color: 'var(--admin-text-primary)' }}>
                Order Summary
              </h3>
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--admin-accent-purple)' }}>
                {orderInfo.luvy_order_id || `#${orderInfo.order_id}`}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Calendar size={18} style={{ color: 'var(--admin-text-secondary)', flexShrink: 0 }} />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-secondary)' }}>Order Date</span>
                  <strong style={{ fontSize: '0.85rem' }}>{new Date(orderInfo.created_at).toLocaleDateString()}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CreditCard size={18} style={{ color: 'var(--admin-text-secondary)', flexShrink: 0 }} />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-secondary)' }}>Payment Method</span>
                  <strong style={{ fontSize: '0.85rem' }}>{orderInfo.payment_method}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <DollarSign size={18} style={{ color: 'var(--admin-text-secondary)', flexShrink: 0 }} />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-secondary)' }}>Total Amount</span>
                  <strong style={{ fontSize: '0.85rem', color: 'var(--admin-accent-purple)' }}>
                    ₹{Number(orderInfo.total_amount).toFixed(2)}
                  </strong>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <AlertTriangle size={18} style={{ color: 'var(--admin-text-secondary)', flexShrink: 0 }} />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-secondary)' }}>Current Status</span>
                  <span className="admin-badge" style={{ ...badgeStyle, marginTop: '2px', padding: '3px 8px', alignSelf: 'flex-start' }}>
                    {orderInfo.order_status}
                  </span>
                </div>
              </div>
            </div>

            {/* Decision/Action Section */}
            <div style={{ marginTop: '8px', borderTop: '1px solid var(--admin-border-color)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--admin-text-secondary)', textTransform: 'uppercase' }}>
                Decision Log
              </span>
              {orderInfo.order_status === 'Pending' ? (
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button 
                    className="admin-btn admin-btn-primary" 
                    onClick={() => handleUpdateStatus('Accepted')} 
                    style={{ flex: 1, padding: '8px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    <Check size={16} /> Accept Order
                  </button>
                  <button 
                    className="admin-btn admin-btn-secondary" 
                    onClick={() => handleUpdateStatus('Rejected')} 
                    style={{ flex: 1, padding: '8px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: 'var(--admin-danger)', borderColor: 'var(--admin-danger)' }}
                  >
                    <X size={16} /> Reject Order
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', borderRadius: '8px', backgroundColor: badgeStyle.bg, border: badgeStyle.border, color: badgeStyle.color }}>
                  <Check size={16} />
                  <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>
                    Order has been marked as <strong>{orderInfo.order_status}</strong>
                  </span>
                </div>
              )}
            </div>

          </div>

          {/* Customer Information Card */}
          <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ borderBottom: '1px solid var(--admin-border-color)', paddingBottom: '12px' }}>
              <h3 style={{ margin: 0, fontFamily: 'var(--admin-font-serif)', fontSize: '1.2rem', color: 'var(--admin-text-primary)' }}>
                Customer Information
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'var(--admin-accent-gold-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <User size={16} style={{ color: 'var(--admin-accent-gold)' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-secondary)' }}>Full Name</span>
                  <strong style={{ fontSize: '0.9rem', color: 'var(--admin-text-primary)' }}>{orderInfo.customer_name}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'var(--admin-accent-gold-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Phone size={16} style={{ color: 'var(--admin-accent-gold)' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-secondary)' }}>Phone Number</span>
                  <strong style={{ fontSize: '0.9rem', color: 'var(--admin-text-primary)' }}>{orderInfo.phone_number}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'var(--admin-accent-gold-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <MapPin size={16} style={{ color: 'var(--admin-accent-gold)' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-secondary)' }}>Delivery Address</span>
                  <strong style={{ fontSize: '0.85rem', color: 'var(--admin-text-primary)', lineHeight: '1.4' }}>{orderInfo.address}</strong>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Ordered Products */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
            <div style={{ borderBottom: '1px solid var(--admin-border-color)', paddingBottom: '12px' }}>
              <h3 style={{ margin: 0, fontFamily: 'var(--admin-font-serif)', fontSize: '1.2rem', color: 'var(--admin-text-primary)' }}>
                Ordered Products
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', overflowY: 'auto', maxHeight: '550px', paddingRight: '4px' }}>
              {order.map((item) => (
                <div 
                  key={item.order_item_id} 
                  className="admin-card-hover"
                  style={{ 
                    display: 'flex', 
                    gap: '16px', 
                    padding: '16px', 
                    borderRadius: '12px', 
                    border: '1px solid var(--admin-border-color)',
                    background: 'var(--admin-sidebar-bg)',
                    transition: 'transform 0.2s, box-shadow 0.2s'
                  }}
                >
                  <img 
                    src={getImageUrl(getFirstProductImage(item.product_image))} 
                    alt={item.product_name} 
                    style={{ 
                      width: '90px', 
                      height: '90px', 
                      objectFit: 'cover', 
                      borderRadius: '8px', 
                      border: '1px solid var(--admin-border-color)',
                      flexShrink: 0
                    }} 
                  />
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--admin-text-primary)', fontFamily: 'var(--admin-font-serif)' }}>
                      {item.product_name}
                    </strong>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--admin-text-secondary)' }}>Price</span>
                        <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>₹{Number(item.product_price).toFixed(2)}</span>
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--admin-text-secondary)' }}>Quantity</span>
                        <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>{item.quantity} units</span>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--admin-text-secondary)' }}>Subtotal</span>
                        <strong style={{ fontSize: '0.85rem', color: 'var(--admin-accent-purple)' }}>
                          ₹{(Number(item.product_price) * item.quantity).toFixed(2)}
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}