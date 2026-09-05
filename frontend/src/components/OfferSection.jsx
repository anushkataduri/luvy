import React from 'react';
import { useNavigate } from 'react-router-dom';
import './OfferSection.css';

const OfferSection = () => {
  const navigate = useNavigate();

  const handleClaimOffer = () => {
    navigate('/shop');
  };

  return (
    <section className="offer-section py-section">
      <div className="container">
        <div className="offer-content">
          <div className="offer-text">
            <h2 className="offer-subtitle">Limited Time</h2>
            <h1 className="offer-title">
              Flat <span className="offer-highlight">20% Off</span> on Your First Order
            </h1>
            <p className="offer-code">Use code <span className="code-text">LUVY20</span> at checkout</p>
          </div>
          <button 
            className="offer-btn"
            onClick={handleClaimOffer}
          >
            Claim Offer
          </button>
        </div>
      </div>
    </section>
  );
};

export default OfferSection;
