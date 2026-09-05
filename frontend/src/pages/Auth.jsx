import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Mail, Lock, User as UserIcon, Phone, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (searchParams.get('mode') === 'signup') {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }
  }, [searchParams]);

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
    setErrors({});
    setTouched({});
    navigate(`/auth?mode=${!isLogin ? 'login' : 'signup'}`, { replace: true });
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (name, value, allValues = formData) => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        if (!/^[a-zA-Z\s]+$/.test(value)) return 'Only alphabets are allowed';
        if (value.trim().length < 3) return 'Minimum 3 characters required';
        return '';
      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email format (e.g. user@gmail.com)';
        return '';
      case 'phone':
        if (!value.trim()) return 'Phone number is required';
        if (value.trim().length !== 10) return 'Must be exactly 10 digits';
        return '';
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 6) return 'Minimum 6 characters required';
        return '';
      case 'confirmPassword':
        if (!value) return 'Please confirm your password';
        if (value !== allValues.password) return 'Passwords do not match';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'phone' && value && !/^\d*$/.test(value)) {
      return;
    }
    
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);
    
    if (touched[name]) {
      const errorMsg = validateField(name, value, newFormData);
      setErrors((prev) => ({ ...prev, [name]: errorMsg }));
    }
    
    if (name === 'password' && touched.confirmPassword) {
      const confirmError = validateField('confirmPassword', newFormData.confirmPassword, newFormData);
      setErrors(prev => ({ ...prev, confirmPassword: confirmError }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    const errorMsg = validateField(name, value, formData);
    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const isFormValid = () => {
    if (isLogin) {
      return (
        formData.email && !validateField('email', formData.email) &&
        formData.password && !validateField('password', formData.password)
      );
    } else {
      return (
        formData.name && !validateField('name', formData.name) &&
        formData.email && !validateField('email', formData.email) &&
        formData.phone && !validateField('phone', formData.phone) &&
        formData.password && !validateField('password', formData.password) &&
        formData.confirmPassword && !validateField('confirmPassword', formData.confirmPassword)
      );
    }
  };

 




  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!isFormValid()) return;

  try {

    // SIGNUP
    if (!isLogin) {

      const response = await axios.post(
        'http://localhost:5000/api/auth/signup',
        {
          fullname: formData.name,
          phone: formData.phone,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }
      );

      alert(response.data.message);

      setIsLogin(true);

      return;
    }

    // LOGIN
    const response = await axios.post(
      'http://localhost:5000/api/auth/login',
      {
        email: formData.email,
        password: formData.password,
      }
    );

    // Store token
    // localStorage.setItem(
    //   'token',
    //   response.data.token
    // );

    // // Store user
    localStorage.setItem(
      'user',
      JSON.stringify(response.data.user)
    );

    localStorage.setItem('isLoggedIn', 'true');




//     sessionStorage.setItem(
//   'token',
//   response.data.token
// );

// sessionStorage.setItem(
//   'user',
//   JSON.stringify(response.data.user)
// );

// sessionStorage.setItem('isLoggedIn', 'true');

    alert(response.data.message);

    window.dispatchEvent(new Event('authChange'));


    if (response.data.user.role === 'admin') {
  navigate('/admin');
} else {
  navigate('/');
}
  } catch (error) {

    console.log(error);

    alert(
      error.response?.data?.message ||
      'Something went wrong'
    );
  }
};


  const getInputClass = (fieldName) => {
    if (errors[fieldName]) return 'has-error';
    if (touched[fieldName] && !errors[fieldName] && formData[fieldName]) return 'has-success';
    return '';
  };

  return (
    <div className="auth-page animate-fade-in">
      <div className="auth-container">
        <div className="auth-card">
          <h2 className="auth-title">{isLogin ? 'Welcome Back' : 'Create an Account'}</h2>
          <p className="auth-subtitle">
            {isLogin 
              ? 'Enter your credentials to access your account' 
              : 'Join us to discover handcrafted luxury'}
          </p>

          <form onSubmit={handleSubmit} className="auth-form">
            {!isLogin && (
              <>
                <div className="form-group">
                  <div className={`input-with-icon ${getInputClass('name')}`}>
                    <UserIcon size={20} className="input-icon" />
                    <input 
                      type="text" 
                      name="name" 
                      placeholder="Full Name" 
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </div>
                  {errors.name && <span className="error-text">{errors.name}</span>}
                </div>
                
                <div className="form-group">
                  <div className={`input-with-icon ${getInputClass('phone')}`}>
                    <Phone size={20} className="input-icon" />
                    <input 
                      type="tel" 
                      name="phone" 
                      placeholder="Phone Number (10 digits)" 
                      value={formData.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </div>
                  {errors.phone && <span className="error-text">{errors.phone}</span>}
                </div>
              </>
            )}

            <div className="form-group">
              <div className={`input-with-icon ${getInputClass('email')}`}>
                <Mail size={20} className="input-icon" />
                <input 
                  type="email" 
                  name="email" 
                  placeholder="Email Address" 
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="form-group">
              <div className={`input-with-icon ${getInputClass('password')}`}>
                <Lock size={20} className="input-icon" />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  name="password" 
                  placeholder="Password" 
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <button 
                  type="button" 
                  className="password-toggle" 
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            {!isLogin && (
              <div className="form-group">
                <div className={`input-with-icon ${getInputClass('confirmPassword')}`}>
                  <Lock size={20} className="input-icon" />
                  <input 
                    type={showConfirmPassword ? 'text' : 'password'} 
                    name="confirmPassword" 
                    placeholder="Confirm Password" 
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <button 
                    type="button" 
                    className="password-toggle" 
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
              </div>
            )}

            <button type="submit" className="btn premium-btn auth-submit-btn" disabled={!isFormValid()}>
              {isLogin ? 'Sign In' : 'Sign Up'}
            </button>
          </form>

          <div className="auth-footer">
            {isLogin ? (
              <p>Don't have an account? <button type="button" onClick={toggleMode} className="auth-link">Sign up</button></p>
            ) : (
              <p>Already have an account? <button type="button" onClick={toggleMode} className="auth-link">Sign in</button></p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
