import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, ShoppingBag } from 'lucide-react';

const Success = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId, luvyOrderId } = location.state || {};

  return (
    <div
      style={{
        minHeight: '75vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px 20px',
      }}
    >
      <div
        style={{
          background: '#fff',
          padding: '40px 30px',
          borderRadius: '20px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.06)',
          border: '1px solid var(--border-color)',
          textAlign: 'center',
          maxWidth: '520px',
          width: '100%',
        }}
      >
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'rgba(34, 197, 94, 0.1)',
            margin: '0 auto 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#16a34a',
          }}
        >
          <CheckCircle size={44} />
        </div>

        <h1
          style={{
            color: 'var(--primary-navy)',
            marginBottom: '10px',
            fontFamily: 'var(--font-serif)',
            fontSize: '1.85rem'
          }}
        >
          Order Confirmed!
        </h1>

        <p
          style={{
            color: '#64748b',
            marginBottom: '20px',
            fontSize: '0.95rem',
            lineHeight: '1.5'
          }}
        >
          Thank you for choosing LUVY Fine Jewellery. We have received your order and our master craftsmen are preparing it.
        </p>

        {luvyOrderId && (
          <div
            style={{
              background: '#f8fafc',
              padding: '16px',
              borderRadius: '12px',
              marginBottom: '25px',
              border: '1px solid #e2e8f0',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}
          >
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b', fontWeight: '600' }}>
              Tracking Identifier
            </span>
            <strong style={{ fontSize: '1.2rem', color: 'var(--primary-navy)', letterSpacing: '0.5px' }}>
              {luvyOrderId}
            </strong>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {orderId && (
            <button
              onClick={() => navigate(`/order/${orderId}`)}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontWeight: '700'
              }}
            >
              <Package size={18} /> Track Your Order Details
            </button>
          )}

          <button
            onClick={() => navigate('/shop')}
            style={{
              background: 'transparent',
              color: 'var(--primary-navy)',
              border: '1px solid var(--border-color)',
              padding: '12px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '0.95rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <ShoppingBag size={18} /> Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default Success;