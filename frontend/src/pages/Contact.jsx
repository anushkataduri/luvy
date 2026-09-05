import React, { useState } from 'react';
import axios from 'axios';
import { Mail, Phone, MapPin, CheckCircle2, AlertCircle, Send } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    phone: false,
    subject: false,
    message: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null

  // Auto-populate user profile data if logged in
  React.useEffect(() => {
    try {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        setFormData(prev => ({
          ...prev,
          name: prev.name || user.fullname || user.name || '',
          email: prev.email || user.email || '',
          phone: prev.phone || user.phone || ''
        }));
      }
    } catch (e) {
      console.error('Error auto-filling contact profile data:', e);
    }
  }, []);

  // Real-time Field Validator
  const validateField = (name, value) => {
    let error = '';
    const trimmed = (value || '').trim();

    switch (name) {
      case 'name':
        if (!trimmed) {
          error = 'Full name is required';
        } else if (!/^[A-Za-z\s]+$/.test(trimmed)) {
          error = 'Only alphabetic letters and spaces are allowed';
        } else if (trimmed.length < 3) {
          error = 'Name must be at least 3 characters';
        }
        break;

      case 'email':
        if (!trimmed) {
          error = 'Email address is required';
        } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(trimmed)) {
          error = 'Enter a valid email address (e.g. name@example.com)';
        }
        break;

      case 'phone':
        if (!trimmed) {
          error = 'Phone number is required';
        } else if (!/^[6-9]\d{9}$/.test(trimmed)) {
          error = 'Phone number must start with 6, 7, 8, or 9 and be exactly 10 digits';
        }
        break;

      case 'subject':
        if (!trimmed) {
          error = 'Subject is required';
        } else if (trimmed.length < 3) {
          error = 'Subject must be at least 3 characters';
        }
        break;

      case 'message':
        if (!trimmed) {
          error = 'Message is required';
        } else if (trimmed.length < 10) {
          error = `Message must be at least 10 characters (currently ${trimmed.length}/10)`;
        }
        break;

      default:
        break;
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Smart formatting
    if (name === 'name') {
      formattedValue = value.replace(/[^A-Za-z\s]/g, '');
    } else if (name === 'phone') {
      formattedValue = value.replace(/\D/g, '').slice(0, 10);
    } else if (name === 'email') {
      formattedValue = value.replace(/\s/g, '');
    }

    setFormData(prev => ({ ...prev, [name]: formattedValue }));

    // Run real-time validation for this field
    const error = validateField(name, formattedValue);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field]);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const validateAll = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    setTouched({
      name: true,
      email: true,
      phone: true,
      subject: true,
      message: true
    });

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      await axios.post('http://localhost:5000/api/contact', formData);
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      setTouched({
        name: false,
        email: false,
        phone: false,
        subject: false,
        message: false
      });
      setErrors({});
    } catch (error) {
      console.error('Contact submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFieldValid = (field) => touched[field] && !errors[field] && formData[field].trim().length > 0;
  const isFieldInvalid = (field) => touched[field] && !!errors[field];

  return (
    <div style={{
      backgroundColor: '#F8F9FA',
      minHeight: '100vh',
      padding: '60px 20px',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header (Matching Image 3) */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <p style={{
            fontSize: '12px',
            letterSpacing: '3px',
            color: '#c9a96e',
            marginBottom: '14px',
            textTransform: 'uppercase',
            fontWeight: '600'
          }}>
            WE'D LOVE TO HEAR FROM YOU
          </p>
          
          <h1 style={{
            fontSize: '44px',
            color: '#0f172a',
            marginBottom: '16px',
            fontWeight: '800',
            letterSpacing: '-0.5px'
          }}>
            Contact Us
          </h1>
          
          <p style={{
            fontSize: '16px',
            color: '#64748b',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Have questions about our jewelry, orders, or services? Our dedicated team is here to assist you.
          </p>
        </div>

        {/* Two Column Layout (Matching Image 4) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '35px',
          maxWidth: '1050px',
          margin: '0 auto',
          alignItems: 'start'
        }}>
          
          {/* Left Column: Contact Form with Real-time Validations */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '36px',
            boxShadow: '0 12px 35px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e2e8f0'
          }}>
            <h2 style={{
              fontSize: '22px',
              color: '#2BB7A6',
              marginBottom: '26px',
              fontWeight: '700',
              textAlign: 'center'
            }}>
              Send Us a Message
            </h2>

            {submitStatus === 'success' && (
              <div style={{
                backgroundColor: '#ecfdf5',
                border: '1px solid #10b981',
                borderRadius: '10px',
                padding: '14px 18px',
                marginBottom: '22px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                color: '#065f46',
                fontSize: '14px'
              }}>
                <CheckCircle2 size={20} color="#10b981" />
                <span>Thank you! Your message has been sent successfully. We will get back to you shortly.</span>
              </div>
            )}

            {submitStatus === 'error' && (
              <div style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #ef4444',
                borderRadius: '10px',
                padding: '14px 18px',
                marginBottom: '22px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                color: '#991b1b',
                fontSize: '14px'
              }}>
                <AlertCircle size={20} color="#ef4444" />
                <span>Failed to send message. Please check your connection and try again.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              
              {/* Your Name */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '13.5px', fontWeight: '600', color: '#1e293b' }}>
                    Your Name <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  {isFieldValid('name') && (
                    <span style={{ fontSize: '12px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
                      <CheckCircle2 size={14} /> Valid
                    </span>
                  )}
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={() => handleBlur('name')}
                    placeholder="Enter your name"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      border: isFieldInvalid('name')
                        ? '1.5px solid #ef4444'
                        : isFieldValid('name')
                        ? '1.5px solid #10b981'
                        : '1.5px solid #e2e8f0',
                      backgroundColor: isFieldInvalid('name') ? '#fef2f2' : '#f8fafc',
                      fontSize: '14.5px',
                      outline: 'none',
                      boxSizing: 'border-box',
                      transition: 'all 0.2s ease',
                      color: '#0f172a'
                    }}
                  />
                </div>
                {isFieldInvalid('name') && (
                  <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '500' }}>
                    <AlertCircle size={13} /> {errors.name}
                  </p>
                )}
              </div>

              {/* Email Address */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '13.5px', fontWeight: '600', color: '#1e293b' }}>
                    Email Address <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  {isFieldValid('email') && (
                    <span style={{ fontSize: '12px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
                      <CheckCircle2 size={14} /> Valid
                    </span>
                  )}
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={() => handleBlur('email')}
                    placeholder="your.email@example.com"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      border: isFieldInvalid('email')
                        ? '1.5px solid #ef4444'
                        : isFieldValid('email')
                        ? '1.5px solid #10b981'
                        : '1.5px solid #e2e8f0',
                      backgroundColor: isFieldInvalid('email') ? '#fef2f2' : '#f8fafc',
                      fontSize: '14.5px',
                      outline: 'none',
                      boxSizing: 'border-box',
                      transition: 'all 0.2s ease',
                      color: '#0f172a'
                    }}
                  />
                </div>
                {isFieldInvalid('email') && (
                  <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '500' }}>
                    <AlertCircle size={13} /> {errors.email}
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '13.5px', fontWeight: '600', color: '#1e293b' }}>
                    Phone Number <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  {isFieldValid('phone') && (
                    <span style={{ fontSize: '12px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
                      <CheckCircle2 size={14} /> Valid
                    </span>
                  )}
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={() => handleBlur('phone')}
                    placeholder="9876543210"
                    maxLength={10}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      border: isFieldInvalid('phone')
                        ? '1.5px solid #ef4444'
                        : isFieldValid('phone')
                        ? '1.5px solid #10b981'
                        : '1.5px solid #e2e8f0',
                      backgroundColor: isFieldInvalid('phone') ? '#fef2f2' : '#f8fafc',
                      fontSize: '14.5px',
                      outline: 'none',
                      boxSizing: 'border-box',
                      transition: 'all 0.2s ease',
                      color: '#0f172a'
                    }}
                  />
                </div>
                {isFieldInvalid('phone') ? (
                  <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '500' }}>
                    <AlertCircle size={13} /> {errors.phone}
                  </p>
                ) : (
                  <p style={{ color: '#94a3b8', fontSize: '11.5px', marginTop: '4px' }}>
                    Must be a 10-digit number starting with 6, 7, 8, or 9
                  </p>
                )}
              </div>

              {/* Subject */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '13.5px', fontWeight: '600', color: '#1e293b' }}>
                    Subject <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  {isFieldValid('subject') && (
                    <span style={{ fontSize: '12px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
                      <CheckCircle2 size={14} /> Valid
                    </span>
                  )}
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    onBlur={() => handleBlur('subject')}
                    placeholder="How can we help?"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      border: isFieldInvalid('subject')
                        ? '1.5px solid #ef4444'
                        : isFieldValid('subject')
                        ? '1.5px solid #10b981'
                        : '1.5px solid #e2e8f0',
                      backgroundColor: isFieldInvalid('subject') ? '#fef2f2' : '#f8fafc',
                      fontSize: '14.5px',
                      outline: 'none',
                      boxSizing: 'border-box',
                      transition: 'all 0.2s ease',
                      color: '#0f172a'
                    }}
                  />
                </div>
                {isFieldInvalid('subject') && (
                  <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '500' }}>
                    <AlertCircle size={13} /> {errors.subject}
                  </p>
                )}
              </div>

              {/* Message */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '13.5px', fontWeight: '600', color: '#1e293b' }}>
                    Message <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <span style={{ fontSize: '12px', color: formData.message.length >= 10 ? '#10b981' : '#94a3b8', fontWeight: '500' }}>
                    {formData.message.length} chars (min 10)
                  </span>
                </div>
                <div style={{ position: 'relative' }}>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    onBlur={() => handleBlur('message')}
                    placeholder="Tell us more about your inquiry..."
                    rows={4}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      border: isFieldInvalid('message')
                        ? '1.5px solid #ef4444'
                        : isFieldValid('message')
                        ? '1.5px solid #10b981'
                        : '1.5px solid #e2e8f0',
                      backgroundColor: isFieldInvalid('message') ? '#fef2f2' : '#f8fafc',
                      fontSize: '14.5px',
                      outline: 'none',
                      resize: 'vertical',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box',
                      transition: 'all 0.2s ease',
                      color: '#0f172a'
                    }}
                  />
                </div>
                {isFieldInvalid('message') && (
                  <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '500' }}>
                    <AlertCircle size={13} /> {errors.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div style={{ textAlign: 'center' }}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: '700',
                    padding: '0.95rem 2.5rem',
                    borderRadius: '50px',
                    fontSize: '1rem',
                    background: 'linear-gradient(135deg, #1c3d6e 0%, #2bb6a8 100%)',
                    color: '#ffffff',
                    border: 'none',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    letterSpacing: '0.8px',
                    boxShadow: '0 8px 20px rgba(43, 182, 168, 0.3)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    opacity: isSubmitting ? 0.75 : 1
                  }}
                  onMouseOver={(e) => {
                    if (!isSubmitting) {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 12px 25px rgba(43, 182, 168, 0.45)';
                    }
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(43, 182, 168, 0.3)';
                  }}
                >
                  <Send size={18} />
                  {isSubmitting ? 'SENDING...' : 'SEND MESSAGE'}
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: GET IN TOUCH Info Card & Map (Matching Image 4) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: '36px',
              boxShadow: '0 12px 35px rgba(0, 0, 0, 0.05)',
              border: '1px solid #e2e8f0'
            }}>
              <h2 style={{
                fontSize: '22px',
                color: '#2BB7A6',
                marginBottom: '26px',
                fontWeight: '700',
                textAlign: 'center',
                letterSpacing: '0.5px'
              }}>
                GET IN TOUCH
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                
                {/* Email Us */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '16px 20px',
                  backgroundColor: '#F8F9FA',
                  borderRadius: '12px',
                  border: '1px solid #f1f5f9',
                  transition: 'all 0.25s ease'
                }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    backgroundColor: '#2BB7A6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    color: '#ffffff'
                  }}>
                    <Mail size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '13.5px', color: '#0f172a', fontWeight: '700', marginBottom: '2px' }}>
                      Email Us
                    </div>
                    <div style={{ fontSize: '14px', color: '#64748b' }}>
                      support@luxejewels.com
                    </div>
                  </div>
                </div>

                {/* Call Us */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '16px 20px',
                  backgroundColor: '#F8F9FA',
                  borderRadius: '12px',
                  border: '1px solid #f1f5f9',
                  transition: 'all 0.25s ease'
                }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    backgroundColor: '#2BB7A6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    color: '#ffffff'
                  }}>
                    <Phone size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '13.5px', color: '#0f172a', fontWeight: '700', marginBottom: '2px' }}>
                      Call Us
                    </div>
                    <div style={{ fontSize: '14px', color: '#64748b' }}>
                      +91 98765 43210
                    </div>
                  </div>
                </div>

                {/* Visit Us */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '16px 20px',
                  backgroundColor: '#F8F9FA',
                  borderRadius: '12px',
                  border: '1px solid #f1f5f9',
                  transition: 'all 0.25s ease'
                }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    backgroundColor: '#2BB7A6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    color: '#ffffff'
                  }}>
                    <MapPin size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '13.5px', color: '#0f172a', fontWeight: '700', marginBottom: '2px' }}>
                      Visit Us
                    </div>
                    <div style={{ fontSize: '14px', color: '#64748b' }}>
                      123, Luxury Avenue, Hyderabad, Telangana
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Embedded Google Map */}
            <div style={{
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 12px 35px rgba(0, 0, 0, 0.05)',
              height: '240px',
              border: '1px solid #e2e8f0'
            }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d121825.8672535798!2d78.3670678!3d17.4121531!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb99daeaebd2f5%3A0xae93b78392bafbc2!2sHyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1715705354964!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, display: 'block' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Hyderabad Location Map"
              />
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Contact;