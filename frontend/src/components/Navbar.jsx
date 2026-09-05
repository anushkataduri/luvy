import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { ShoppingCart, Search, User, Menu, X, LogIn, UserPlus, Package, Heart, Bell } from 'lucide-react';
import axios from 'axios';

const Navbar = () => {
  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);
  
  const [userNotifications, setUserNotifications] = useState([]);
  const [unreadNotifCount, setUnreadNotifCount] = useState(0);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);
  const notifDropdownRef = useRef(null);

  const userProfile = JSON.parse(
    localStorage.getItem('user') || '{}'
  );
  
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const fetchUserNotifications = (userId) => {
    axios.get(`http://localhost:5000/api/notifications/user/${userId}`)
      .then(res => {
        setUserNotifications(res.data);
        const unread = res.data.filter(n => !n.is_read).length;
        setUnreadNotifCount(unread);
      })
      .catch(err => console.error('Error fetching notifications:', err));
  };

  const handleMarkUserAllRead = () => {
    if (!userProfile?.id) return;
    axios.post(`http://localhost:5000/api/notifications/user/${userProfile.id}/read-all`)
      .then(() => {
        setUserNotifications(prev => prev.map(n => ({ ...n, is_read: 1 })));
        setUnreadNotifCount(0);
      })
      .catch(err => console.error('Failed to mark all as read:', err));
  };

  const handleMarkUserRead = (id) => {
    axios.put(`http://localhost:5000/api/notifications/${id}/read`)
      .then(() => {
        setUserNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: 1 } : n));
        setUnreadNotifCount(prev => Math.max(0, prev - 1));
      })
      .catch(err => console.error('Failed to mark notification as read:', err));
  };

  useEffect(() => {
    const handleAuthChange = () => {
      setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
    };
    window.addEventListener('authChange', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);
    
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(event.target)) {
        setIsNotifDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('authChange', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isLoggedIn && userProfile?.id) {
      fetchUserNotifications(userProfile.id);

      const ws = new WebSocket('ws://localhost:5000');

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          if (message.event === 'new_notification') {
            const newNotif = message.data;
            if (newNotif.user_id === userProfile.id) {
              setUserNotifications((prev) => [newNotif, ...prev]);
              setUnreadNotifCount((prev) => prev + 1);
            }
          }
        } catch (err) {
          console.error('Failed to parse WebSocket message', err);
        }
      };

      return () => {
        ws.close();
      };
    } else {
      setUserNotifications([]);
      setUnreadNotifCount(0);
    }
  }, [isLoggedIn, userProfile?.id]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setIsProfileDropdownOpen(false);
    window.dispatchEvent(new Event('authChange'));
    navigate('/');
  };
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${searchQuery}`);
      setSearchQuery('');
    }
  };

  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="navbar">
      <div className="container">
        <div className="nav-left">
          <Link to="/" className="nav-brand">
            <img src={logo} alt="Luvy Logo" className="navbar-logo" />
            <span>LUVY</span>
          </Link>

          <form className="search-bar" onSubmit={handleSearch}>
            <Search size={18} color="var(--text-dark)" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>

        <div className={`mobile-overlay ${isMenuOpen ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}></div>

        <div className={`nav-links-container ${isMenuOpen ? 'mobile-open' : ''}`}>
          <div className="drawer-header">
            <div className="drawer-brand">
              <img src={logo} alt="Luvy Logo" className="navbar-logo" />
              <span>LUVY</span>
            </div>
            <button className="drawer-close-btn" onClick={() => setIsMenuOpen(false)}>
              <X size={24} color="#fff" />
            </button>
          </div>
          
          <ul className="nav-links">
            <li><Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
            <li><Link to="/shop" className="nav-link" onClick={() => setIsMenuOpen(false)}>Shop</Link></li>
            <li><Link to="/about" className="nav-link" onClick={() => setIsMenuOpen(false)}>About</Link></li>
            <li><Link to="/contact" className="nav-link" onClick={() => setIsMenuOpen(false)}>Contact</Link></li>
          </ul>
        </div>

        <div className="nav-actions">
          <div className="profile-menu-container" style={{ position: 'relative' }} ref={dropdownRef}>
       




            <button
  className="profile-avatar-btn"
  onClick={() =>
    setIsProfileDropdownOpen(
      !isProfileDropdownOpen
    )
  }
>
  {isLoggedIn &&
   userProfile?.name
    ? getInitials(userProfile.name)
    : <User size={20} />
  }
</button>
            
            {isProfileDropdownOpen && (
              <div className="profile-dropdown animate-fade-in">
                {isLoggedIn ? (
                  <>
                    <div className="dropdown-header">
                      <strong>{userProfile.name || 'User'}</strong>
                      <span>Premium Member</span>
                    </div>
                    <ul className="dropdown-links">
                      <li>
                        <button onClick={() => { navigate('/profile'); setIsProfileDropdownOpen(false); }}>
                          <User size={16} /> My Profile
                        </button>
                      </li>
                      <li>
                        <button onClick={() => { navigate('/profile?tab=orders'); setIsProfileDropdownOpen(false); }}>
                          <Package size={16} /> My Orders
                        </button>
                      </li>
                      <li>
                        <button onClick={handleLogout} className="logout-text">
                          <LogIn size={16} /> Logout
                        </button>
                      </li>
                    </ul>
                  </>
                ) : (
                  <>
                    <div className="dropdown-header">
                      <strong>Welcome</strong>
                      <span>Sign in to your account</span>
                    </div>
                    <ul className="dropdown-links">
                      <li>
                        <button onClick={() => { navigate('/auth?mode=login'); setIsProfileDropdownOpen(false); }}>
                          <LogIn size={16} /> Sign In
                        </button>
                      </li>
                      <li>
                        <button onClick={() => { navigate('/auth?mode=signup'); setIsProfileDropdownOpen(false); }}>
                          <UserPlus size={16} /> Sign Up
                        </button>
                      </li>
                    </ul>
                  </>
                )}
              </div>
            )}
          </div>

          {isLoggedIn && (
            <div className="notification-menu-container" ref={notifDropdownRef}>
              <button
                className="notification-bell-btn"
                onClick={() => setIsNotifDropdownOpen(!isNotifDropdownOpen)}
              >
                <Bell size={24} />
                {unreadNotifCount > 0 && (
                  <span className="notification-count-badge">
                    {unreadNotifCount}
                  </span>
                )}
              </button>

              {isNotifDropdownOpen && (
                <div className="notification-dropdown animate-fade-in">
                  <div className="notification-dropdown-header">
                    <strong>Notifications</strong>
                    {unreadNotifCount > 0 && (
                      <button className="notification-mark-all-btn" onClick={handleMarkUserAllRead}>
                        Mark all as read
                      </button>
                    )}
                  </div>
                  {userNotifications.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {userNotifications.map(n => (
                        <div
                          key={n.id}
                          onClick={() => {
                            handleMarkUserRead(n.id);
                            setIsNotifDropdownOpen(false);
                            if (n.type === 'order' && n.reference_id) {
                              navigate(`/order/${n.reference_id}`);
                            } else if (n.reference_id) {
                              navigate(`/order/${n.reference_id}`);
                            }
                          }}
                          className={`notification-item ${n.is_read ? '' : 'unread'}`}
                          style={{ cursor: 'pointer' }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <span className="notification-item-title">{n.title}</span>
                            {!n.is_read && <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#2bb6a8', marginTop: '4px' }} />}
                          </div>
                          <span className="notification-item-desc">{n.description}</span>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                            <span className="notification-item-time">{new Date(n.created_at).toLocaleString()}</span>
                            {n.reference_id && (
                              <span style={{ fontSize: '0.72rem', color: '#2bb6a8', fontWeight: '600' }}>
                                View Details &rarr;
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '20px 0', color: '#94a3b8', fontSize: '0.85rem' }}>
                      No notifications yet
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <Link to="/wishlist" className="wishlist-icon-wrapper">
            <Heart size={24} />
            {wishlistItems.length > 0 && <span className="wishlist-count">{wishlistItems.length}</span>}
          </Link>

          <Link to="/cart" className="cart-icon-wrapper">
            <ShoppingCart size={24} />
            {cartItemCount > 0 && <span className="cart-count">{cartItemCount}</span>}
          </Link>

          <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(true)}>
            <Menu size={24} color="#fff" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
