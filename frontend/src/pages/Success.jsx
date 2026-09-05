import React from 'react';
import { useNavigate } from 'react-router-dom';

const Success = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: '70vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px',
      }}
    >
      <div
        style={{
          background: '#fff',
          padding: '40px',
          borderRadius: '20px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          textAlign: 'center',
          maxWidth: '500px',
          width: '100%',
        }}
      >
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: '#e8fff0',
            margin: '0 auto 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '40px',
            color: 'green',
          }}
        >
          ✓
        </div>

        <h1
          style={{
            color: '#0A2342',
            marginBottom: '15px',
          }}
        >
          Order Confirmed!
        </h1>

        <p
          style={{
            color: '#666',
            marginBottom: '25px',
          }}
        >
          Thank you for shopping with LUVY.
          Your order has been placed successfully.
        </p>

        <div
          style={{
            background: '#f8f8f8',
            padding: '15px',
            borderRadius: '10px',
            marginBottom: '25px',
          }}
        >
          <p><strong>Payment:</strong> COD</p>
          <p><strong>Status:</strong> Pending</p>
        </div>

        <button
          onClick={() => navigate('/shop')}
          style={{
            background: '#6C3BFF',
            color: '#fff',
            border: 'none',
            padding: '12px 25px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default Success;