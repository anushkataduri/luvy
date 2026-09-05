import React from 'react';
import { Heart, Award, Users, Gem, ShoppingBag, Clock } from 'lucide-react';
import heroFashionImage from '../assets/hero_fashion.png';

const About = () => {
  return (
    <>
      {/* Hero Banner Section */}
      <section className="modern-hero">
        <div className="hero-overlay"></div>
        <div className="hero-shape hero-shape-1"></div>
        <div className="hero-shape hero-shape-2"></div>
        <div className="container modern-hero-container">
          <div className="modern-hero-content animate-slide-right">
            <h1 className="hero-title">
              Where Elegance <br />
              <span className="highlight">Meets You</span>
            </h1>
            <p className="hero-description">
              At Ladies Emporium, we believe every woman deserves to feel confident, beautiful, and empowered. Our curated collection of timeless handbags, jewelry, and accessories is designed to complement your unique style and celebrate every moment of you.
            </p>
            <div className="hero-buttons">
              <button className="hero-btn btn-primary-gradient" onClick={() => window.location.href = '/shop'}>
                Shop Now
              </button>
              <button className="hero-btn btn-secondary-outline" onClick={() => window.location.href = '/shop'}>
                Explore Collection
              </button>
            </div>
          </div>
          <div className="modern-hero-image animate-fade-in-delayed">
            <img src={heroFashionImage} alt="Fashion Accessories" />
          </div>
        </div>
      </section>

      <div className="contact-page container py-section animate-fade-in">
        {/* Our Story Section */}
        <div className="section-title" style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1>Our Story</h1>
          <p style={{ color: 'var(--text-dark)', marginTop: '1rem', maxWidth: '800px', margin: '1rem auto 0', fontSize: '0.95rem' }}>
            Founded with a passion for elegance and craftsmanship, LUVY has been dedicated to providing women with exquisite jewellery and handbags that celebrate individuality and timeless beauty. Our journey began with a simple vision: to create accessories that make every woman feel special, confident, and beautifully adorned.
          </p>
        </div>

        {/* Mission & Values */}
        <div className="grid grid-cols-2 about-mission-grid">
          <div className="about-mission about-mission-card">
            <h2>Our Mission</h2>
            <p>
              To empower women through beautifully crafted accessories that blend contemporary design with timeless elegance. We strive to create pieces that not only enhance personal style but also become cherished companions in life's most precious moments.
            </p>
          </div>

          <div className="about-values about-values-card">
            <h2>Our Values</h2>
            <div className="values-list">
              <div className="value-item">
                <Heart size={24} className="value-icon" />
                <div className="value-content">
                  <h3>Passion for Craftsmanship</h3>
                  <p>Every piece is meticulously crafted with attention to detail and love for the art.</p>
                </div>
              </div>
              
              <div className="value-item">
                <Award size={24} className="value-icon" />
                <div className="value-content">
                  <h3>Quality Excellence</h3>
                  <p>We use only the finest materials and maintain the highest quality standards.</p>
                </div>
              </div>

              <div className="value-item">
                <Users size={24} className="value-icon" />
                <div className="value-content">
                  <h3>Customer-Centric</h3>
                  <p>Our customers are at the heart of everything we do and create.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* What We Offer */}
        <div className="section-title text-center">
          <h2>What We Offer</h2>
        </div>

        <div className="grid grid-cols-3 offer-grid">
          <div className="offer-card">
            <div className="offer-icon-wrapper">
              <Gem size={48} className="offer-icon" />
            </div>
            <h3>Exquisite Jewellery</h3>
            <p>
              Handcrafted jewellery pieces featuring ethically sourced gemstones and precious metals, designed to last a lifetime.
            </p>
          </div>

          <div className="offer-card">
            <div className="offer-icon-wrapper">
              <ShoppingBag size={48} className="offer-icon" />
            </div>
            <h3>Premium Handbags</h3>
            <p>
              Luxurious handbags crafted from the finest imported leathers, combining functionality with elegant design.
            </p>
          </div>

          <div className="offer-card">
            <div className="offer-icon-wrapper">
              <Clock size={48} className="offer-icon" />
            </div>
            <h3>Timeless Design</h3>
            <p>
              Classic designs that transcend trends, ensuring your accessories remain stylish for years to come.
            </p>
          </div>
        </div>

        {/* Our Commitment */}
        <div className="commitment-section">
          <h2>Our Commitment</h2>
          <p>
            At LUVY, we are committed to sustainability, ethical sourcing, and creating beautiful pieces that you can feel good about wearing. 
            We work closely with artisans and suppliers who share our values, ensuring that every product tells a story of craftsmanship, 
            responsibility, and love for beauty.
          </p>
        </div>

        
        {/* Call to Action */}
        <div className="join-journey-section">
          <h2>Join Our Journey</h2>
          <p>
            Discover our collection and find the perfect pieces that speak to your unique style and personality.
          </p>
          <button className="btn btn-primary join-btn" onClick={() => window.location.href = '/shop'}>Explore Collection</button>
        </div>
      </div>
    </>
  );
};

export default About;
