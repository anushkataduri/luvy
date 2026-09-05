



import React, { useState } from 'react';
import axios from "axios";
const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState({});



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

 



  const validateForm = () => {
  let newErrors = {};

  // Name Validation
if (!/^[A-Za-z\s]+$/.test(formData.name.trim())) {
  newErrors.name =
    "Only A-Z and a-z letters are allowed";
}

  // Email Validation
  // if (
  //   !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
  //     formData.email
  //   )
  // ) 

//   if (
//   !/^[a-z0-9]+@[a-z]+\.[a-z]{2,}$/i.test(
//     formData.email
//   )
// ) {
//   newErrors.email =
//     "Enter email like abc@gmail.com";
// }
//   {
//     newErrors.email =
//       "Please enter a valid email";
//   }



if (
  !/^[a-z0-9]+@[a-z]+\.[a-z]{2,}$/i.test(
    formData.email
  )
) {
  newErrors.email =
    "Enter email like abc@gmail.com";
}

  if (!/^[6-9][0-9]{9}$/.test(formData.phone)) {
  newErrors.phone =
    "Phone number must start with 6,7,8,9 and contain 10 digits";
}
  

  // Subject Validation
  if (formData.subject.trim().length < 3) {
    newErrors.subject =
      "Subject must be at least 3 characters";
  }

  // Message Validation
  if (formData.message.trim().length < 10) {
    newErrors.message =
      "Message must be at least 10 characters";
  }

  setErrors(newErrors);

  return Object.keys(newErrors).length === 0;
};


// const handleSubmit = async (e) => {
//   e.preventDefault();

//   try {
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) {
    return;
  }

  try {
    await axios.post(
      "http://localhost:5000/api/contact",
      formData
    );

    alert("Message Sent Successfully");

    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: ""
    });

  } catch (error) {
    console.error(error);
    alert("Failed to send message");
  }
};

  return (
    <div style={{ 
      backgroundColor: '#F8F9FA',
      minHeight: '100vh',
      padding: '60px 20px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <p style={{
            fontSize: '12px',
            letterSpacing: '3px',
            color: '#c9a96e',
            marginBottom: '16px',
            textTransform: 'uppercase'
          }}>
            WE'D LOVE TO HEAR FROM YOU
          </p>
          
          <h1 style={{ 
            fontSize: '48px',
            color: '#1a1a1a',
            marginBottom: '20px',
            fontWeight: '700'
          }}>
            Contact Us
          </h1>
          
          <p style={{
            fontSize: '16px',
            color: '#777',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Have questions about our jewelry, orders, or services? Our dedicated team is here to assist you.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="contact-container" style={{
          display: 'flex',
          gap: '30px',
          alignItems: 'stretch',
          maxWidth: '1100px',
          margin: '0 auto'
        }}>
          
          {/* Left Side - Contact Form */}
          <div className="contact-form-container" style={{ flex: '1' }}>
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: '40px',
              boxShadow: '0 15px 40px rgba(0, 0, 0, 0.1)',
              maxWidth: '550px'
            }}>
              <h2 style={{
                fontSize: '24px',
                color: '#2BB7A6',
                marginBottom: '30px',
                fontWeight: '600',
                textAlign: 'center'
              }}>
                Send Us a Message
              </h2>
              
              <form onSubmit={handleSubmit}>
                {/* Name */}
            <div style={{ marginBottom: '20px' }}>
  <label
    style={{
      display: 'block',
      marginBottom: '8px',
      fontSize: '14px',
      fontWeight: '500',
      color: '#1a1a1a'
    }}
  >
    Your Name
  </label>

  <input
    type="text"
    name="name"
    value={formData.name}
    // onChange={handleInputChange}
    onChange={(e) => {
  const value = e.target.value.replace(
    /[^A-Za-z\s]/g,
    ""
  );

  setFormData({
    ...formData,
    name: value,
  });
}}
    placeholder="Enter your name"
    required
    style={{
      width: '100%',
      padding: '12px 16px',
      borderRadius: '8px',
      border: errors.name
        ? '1px solid red'
        : '1px solid #eee',
      backgroundColor: '#fafafa',
      fontSize: '14px',
      outline: 'none',
      boxSizing: 'border-box',
      transition: 'all 0.3s ease'
    }}
    onFocus={(e) => {
      e.target.style.borderColor = '#c9a96e';
      e.target.style.backgroundColor = '#ffffff';
    }}
    onBlur={(e) => {
      e.target.style.borderColor = errors.name
        ? 'red'
        : '#eee';
      e.target.style.backgroundColor = '#fafafa';
    }}
  />

  {errors.name && (
    <p
      style={{
        color: 'red',
        fontSize: '12px',
        marginTop: '5px',
        marginBottom: '0'
      }}
    >
      {errors.name}
    </p>
  )}
</div>

                {/* Email */}
            <div style={{ marginBottom: '20px' }}>
  <label
    style={{
      display: 'block',
      marginBottom: '8px',
      fontSize: '14px',
      fontWeight: '500',
      color: '#1a1a1a'
    }}
  >
    Email Address
  </label>

  <input
    type="email"
    name="email"
    value={formData.email}
    // onChange={handleInputChange}
onChange={(e) => {
  let value = e.target.value;

  // No spaces
  if (value.includes(" ")) {
    return;
  }

  // Allow only valid email characters
  if (!/^[a-zA-Z0-9@._-]*$/.test(value)) {
    return;
  }

  // Stop typing after .com
  if (
    value.toLowerCase().includes(".com") &&
    value.length >
      value.toLowerCase().indexOf(".com") + 4
  ) {
    return;
  }

  setFormData({
    ...formData,
    email: value,
  });
}}
    placeholder="your.email@example.com"
    required
    style={{
      width: '100%',
      padding: '12px 16px',
      borderRadius: '8px',
      border: errors.email
        ? '1px solid red'
        : '1px solid #eee',
      backgroundColor: '#fafafa',
      fontSize: '14px',
      outline: 'none',
      boxSizing: 'border-box',
      transition: 'all 0.3s ease'
    }}
    onFocus={(e) => {
      e.target.style.borderColor = '#c9a96e';
      e.target.style.backgroundColor = '#ffffff';
    }}
    onBlur={(e) => {
      e.target.style.borderColor = errors.email
        ? 'red'
        : '#eee';
      e.target.style.backgroundColor = '#fafafa';
    }}
  />

  {errors.email && (
    <p
      style={{
        color: 'red',
        fontSize: '12px',
        marginTop: '5px',
        marginBottom: '0'
      }}
    >
      {errors.email}
    </p>
  )}
</div>

                {/* Phone */}
               <div style={{ marginBottom: '20px' }}>
  <label
    style={{
      display: 'block',
      marginBottom: '8px',
      fontSize: '14px',
      fontWeight: '500',
      color: '#1a1a1a'
    }}
  >
    Phone Number
  </label>

  <input
    type="tel"
    name="phone"
    value={formData.phone}
  onChange={(e) => {
  let value = e.target.value.replace(/\D/g, "");

  // First digit must be 6,7,8,9
  if (value.length > 0 && !/^[6-9]/.test(value)) {
    return;
  }

  setFormData({
    ...formData,
    phone: value,
  });
}}
    placeholder="9876543210"
    maxLength="10"
    required
    style={{
      width: '100%',
      padding: '12px 16px',
      borderRadius: '8px',
      border: errors.phone
        ? '1px solid red'
        : '1px solid #eee',
      backgroundColor: '#fafafa',
      fontSize: '14px',
      outline: 'none',
      boxSizing: 'border-box',
      transition: 'all 0.3s ease'
    }}
    onFocus={(e) => {
      e.target.style.borderColor = '#c9a96e';
      e.target.style.backgroundColor = '#ffffff';
    }}
    onBlur={(e) => {
      e.target.style.borderColor = errors.phone
        ? 'red'
        : '#eee';
      e.target.style.backgroundColor = '#fafafa';
    }}
  />

  {errors.phone && (
    <p
      style={{
        color: 'red',
        fontSize: '12px',
        marginTop: '5px',
        marginBottom: '0'
      }}
    >
      {errors.phone}
    </p>
  )}
</div>

                {/* Subject */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#1a1a1a'
                  }}>
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}

                    placeholder="How can we help?"
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid #eee',
                      backgroundColor: '#fafafa',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#c9a96e';
                      e.target.style.backgroundColor = '#ffffff';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#eee';
                      e.target.style.backgroundColor = '#fafafa';
                    }}
                  />
                </div>

                {/* Message */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#1a1a1a'
                  }}>
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell us more about your inquiry..."
                    required
                    rows="5"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid #eee',
                      backgroundColor: '#fafafa',
                      fontSize: '14px',
                      outline: 'none',
                      resize: 'vertical',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#c9a96e';
                      e.target.style.backgroundColor = '#ffffff';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#eee';
                      e.target.style.backgroundColor = '#fafafa';
                    }}
                  />
                </div>

                {/* Submit Button */}
                <div style={{ textAlign: 'center' }}>
                  <button
                    type="submit"
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: '500',
                      padding: '1rem 2.5rem',
                      borderRadius: '30px',
                      fontSize: '1.1rem',
                      background: 'linear-gradient(90deg, #1c3d6e 0%, #2bb6a8 100%)',
                      color: '#ffffff',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.4s ease',
                      letterSpacing: '1px',
                      boxShadow: '0 8px 20px rgba(43, 182, 168, 0.3)'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.transform = 'translateY(-3px)';
                      e.target.style.boxShadow = '0 12px 25px rgba(43, 182, 168, 0.5)';
                      e.target.style.background = 'linear-gradient(90deg, #2bb6a8 0%, #1c3d6e 100%)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 8px 20px rgba(43, 182, 168, 0.3)';
                      e.target.style.background = 'linear-gradient(90deg, #1c3d6e 0%, #2bb6a8 100%)';
                    }}
                  >
                    SEND MESSAGE
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Side - Get in Touch */}
          <div className="contact-info-container" style={{ flex: '0.8' }}>
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: '40px',
              boxShadow: '0 15px 40px rgba(0, 0, 0, 0.1)',
              maxWidth: '420px'
            }}>
              <h2 style={{
                fontSize: '24px',
                color: '#2BB7A6',
                marginBottom: '30px',
                fontWeight: '600',
                textAlign: 'center'
              }}>
                GET IN TOUCH
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                {/* Email */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  padding: '20px',
                  backgroundColor: '#F8F9FA',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease'
                }} onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
                }} onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#2BB7A6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <span style={{ color: 'white', fontSize: '18px' }}>✉️</span>
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: '600', marginBottom: '4px' }}>Email Us</div>
                    <div style={{ fontSize: '14px', color: '#777' }}>support@luxejewels.com</div>
                  </div>
                </div>
                
                {/* Phone */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  padding: '20px',
                  backgroundColor: '#F8F9FA',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease'
                }} onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
                }} onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#2BB7A6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <span style={{ color: 'white', fontSize: '18px' }}>📞</span>
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: '600', marginBottom: '4px' }}>Call Us</div>
                    <div style={{ fontSize: '14px', color: '#777' }}>+91 98765 43210</div>
                  </div>
                </div>
                
                {/* Address */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  padding: '20px',
                  backgroundColor: '#F8F9FA',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease'
                }} onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
                }} onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#2BB7A6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <span style={{ color: 'white', fontSize: '18px' }}>📍</span>
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: '600', marginBottom: '4px' }}>Visit Us</div>
                    <div style={{ fontSize: '14px', color: '#777' }}>123, Luxury Avenue, Hyderabad, Telangana</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div style={{
              marginTop: '30px',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 15px 40px rgba(0, 0, 0, 0.1)',
              maxWidth: '420px',
              height: '320px',
              border: '1px solid #eee'
            }}>
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d121825.8672535798!2d78.3670678!3d17.4121531!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb99daeaebd2f5%3A0xae93b78392bafbc2!2sHyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1715705354964!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0, display: 'block' }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Luxe Jewels Location"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;