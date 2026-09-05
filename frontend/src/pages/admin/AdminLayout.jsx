import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Tag, 
  Star, 
  Bell, 
  Settings as SettingsIcon, 
  LogOut,
  Search,
  Menu,
  Sun,
  Moon,
  Plus,
  X
} from 'lucide-react';

// Modular Page Imports
import Dashboard from './Dashboard';
import Orders from './Orders';
import Products from './Products';
import Reviews from './Reviews';
import Notifications from './Notifications';
import Settings from './Settings';
import { Users } from 'lucide-react';
import Customers from './Customers';
import AdminOrderDetails from './AdminOrderDetails';
import Messages from "./Messages";

export default function AdminLayout() {
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('adminActiveTab') || 'dashboard';
  });

  const handleSetActiveTab = (tab) => {
    setActiveTab(tab);
    localStorage.setItem('adminActiveTab', tab);
  };
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = () => {
    axios.get('http://localhost:5000/api/notifications')
      .then(res => {
        setNotifications(res.data);
        const unread = res.data.filter(n => !n.is_read).length;
        setUnreadCount(unread);
      })
      .catch(err => console.error('Error fetching notifications:', err));
  };

  const playChime = () => {
    try {
      if (!window.chimeAudioCtx) {
        window.chimeAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = window.chimeAudioCtx;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.type = 'sine';
      
      const now = ctx.currentTime;
      oscillator.frequency.setValueAtTime(587.33, now); // D5
      gainNode.gain.setValueAtTime(0.15, now);
      oscillator.start(now);
      
      oscillator.frequency.setValueAtTime(880.00, now + 0.12); // A5
      gainNode.gain.setValueAtTime(0.15, now + 0.12);
      
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      oscillator.stop(now + 0.5);
    } catch (err) {
      console.error('Web Audio chime play failed:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();

    const unlockAudio = () => {
      try {
        if (!window.chimeAudioCtx) {
          window.chimeAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (window.chimeAudioCtx && window.chimeAudioCtx.state === 'suspended') {
          window.chimeAudioCtx.resume();
        }
      } catch (e) {
        console.error('Failed to unlock audio context', e);
      }
    };
    window.addEventListener('click', unlockAudio);

    const ws = new WebSocket('ws://localhost:5000');

    ws.onopen = () => {
      console.log('Connected to notification WebSocket');
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.event === 'new_notification') {
          const newNotif = message.data;
          setNotifications((prev) => [newNotif, ...prev]);
          setUnreadCount((prev) => prev + 1);
          playChime();
        }
      } catch (err) {
        console.error('Failed to parse WebSocket message', err);
      }
    };

    ws.onclose = () => {
      console.log('Disconnected from notification WebSocket');
    };

    return () => {
      window.removeEventListener('click', unlockAudio);
      ws.close();
    };
  }, []);

  const handleMarkAllAsRead = () => {
    axios.post('http://localhost:5000/api/notifications/read-all')
      .then(() => {
        setNotifications(prev => prev.map(n => ({ ...n, is_read: 1 })));
        setUnreadCount(0);
      })
      .catch(err => console.error('Failed to mark all as read:', err));
  };

  const handleMarkAsRead = (id) => {
    axios.put(`http://localhost:5000/api/notifications/${id}/read`)
      .then(() => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: 1 } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
      })
      .catch(err => console.error('Failed to mark notification as read:', err));
  };

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const [products, setProducts] = useState([]);

  // Global State sets (makes the UI functional!)
 

 

  const [reviews, setReviews] = useState([
    { id: 1, customer: 'Sarah Connor', product: 'Luvy Gold Eternity Ring', rating: 5, comment: 'The gold metal bands feel absolutely premium. Fast delivery!', status: 'Approved' },
    { id: 2, customer: 'Gabriella K.', product: 'Lavender Amethyst Ring', rating: 5, comment: 'Incredible sparkles! I get compliments everywhere I go.', status: 'Pending' },
    { id: 3, customer: 'Clark Kent', product: 'Blossom Cut Diamond Studs', rating: 4, comment: 'Very elegant, but safe vault carrier took an extra day.', status: 'Approved' },
    { id: 4, customer: 'Spammer User', product: 'Golden Link Tennis Bracelet', rating: 1, comment: 'Fake review details and ads here.', status: 'Reported' }
  ]);



useEffect(() => {
  axios
    .get('http://localhost:5000/api/orders')
    .then((res) => {
      setOrders(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
}, []);

  useEffect(() => {
  fetchProducts();
}, []);

const fetchProducts = async () => {

  try {

    const response = await axios.get(
      'http://localhost:5000/api/products'
    );

    setProducts(response.data);
    console.log(response.data);

  } catch (error) {

    console.log(error);
  }
};

  // Core Actions functions
  const handleAddProduct = () => {
    fetchProducts();
  };

  // const handleDeleteProduct = (id) => {
  //   setProducts(products.filter(p => p.id !== id));
  // };


  const handleDeleteProduct = async (id) => {

  try {

    await axios.delete(
      `http://localhost:5000/api/products/${id}`
    );

    fetchProducts(); // important

  } catch (error) {

    console.log(error);
  }
};

  const handleToggleProductStatus = (id) => {
    setProducts(products.map(p => 
      p.id === id ? { ...p, status: p.status === 'Active' ? 'Inactive' : 'Active' } : p
    ));
  };

  // const handleDeleteOrder = (id) => {
  //   setOrders(orders.filter(o => o.id !== id));
  // };





  const handleDeleteOrder = async (id) => {

  const confirmDelete = window.confirm(
    "Are you sure you want to delete this order?"
  );

  if (!confirmDelete) return;

  try {

    await axios.delete(
      `http://localhost:5000/api/orders/${id}`
    );

    setOrders(
      orders.filter(
        order => order.id !== id
      )
    );

  } catch (error) {

    console.log(error);

    alert("Failed to delete order");
  }
};

  const handleUpdateOrderStatus = (id, newStatus) => {
    setOrders(orders.map(o => 
      o.id === id ? { ...o, status: newStatus } : o
    ));
  };

  const handleApproveReview = (id) => {
    setReviews(reviews.map(r => 
      r.id === id ? { ...r, status: 'Approved' } : r
    ));
  };

  const handleRejectReview = (id) => {
    setReviews(reviews.filter(r => r.id !== id));
  };

  const handleReplenishStock = (id, amt) => {
    if (id) {
      setProducts(products.map(p => 
        p.id === id ? { ...p, stock: p.stock + amt } : p
      ));
    } else {
      // Replenish all low stock
      setProducts(products.map(p => 
        p.stock < 15 ? { ...p, stock: p.stock + amt } : p
      ));
    }
  };



  const handleLogout = () => {
    setShowLogoutModal(false);
    window.location.href = '/'; // Redirects out of admin panel
  };

  // Render dynamic page content based on tab state
  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            onViewOrders={() => handleSetActiveTab('orders')}
            onViewProducts={() => handleSetActiveTab('products')}
              onViewCustomers={() => handleSetActiveTab('customers')}

            ordersData={orders}
            productsData={products}
          />
        );
      case 'orders':
        return (
          <Orders 
            ordersData={orders} 
            onDeleteOrder={handleDeleteOrder} 
              onViewOrder={(id) => {
    setSelectedOrderId(id);
    setActiveTab('orderDetails');
  }}

  
          />

          
        );


    

        case 'orderDetails':
  return (
    <AdminOrderDetails
      orderId={selectedOrderId}
    />
  );

      case 'products':
        return (
          <Products 
            productsData={products} 
            onAddProduct={handleAddProduct} 
            onDeleteProduct={handleDeleteProduct} 
            onToggleProductStatus={handleToggleProductStatus}
          />
        );

  //       case 'customers':
  // return (
  //   <Customers />
  // );
  //     case 'reviews':
  //       return (
  //         <Reviews 
  //           reviewsData={reviews} 
  //           onApproveReview={handleApproveReview} 
  //           onRejectReview={handleRejectReview} 
  //         />
  //       );



  case 'customers':
  return (
    <Customers />
  );

case 'messages':
  return (
    <Messages />
  );

case 'reviews':
  return (
    <Reviews
      reviewsData={reviews}
      onApproveReview={handleApproveReview}
      onRejectReview={handleRejectReview}
    />
  );







      case 'notifications':
        return (
          <Notifications 
            notifications={notifications}
            fetchNotifications={fetchNotifications}
            onMarkAsRead={handleMarkAsRead}
          />
        );
      case 'settings':
        return <Settings />;
      default:
        return (
          <Dashboard 
            onViewOrders={() => setActiveTab('orders')} 
            onViewProducts={() => setActiveTab('products')}
              onViewCustomers={() => setActiveTab('customers')}

            ordersData={orders} 
            productsData={products} 
          />
        );
    }
  };

  // Nav items details
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'products', label: 'Products', icon: Tag },
    { id: 'reviews', label: 'Reviews', icon: Star },
      { id: 'customers', label: 'Customers', icon: Users },
        { id: 'messages', label: 'Messages', icon: Bell }, // Add this line

    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <div className="admin-panel-container">
      {/* Mobile Menu Drawer Overlay */}
      <div 
        className={`admin-mobile-overlay ${mobileMenuOpen ? 'visible' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
      ></div>

      {/* Left Sidebar Layout */}
      <aside className={`admin-sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="admin-sidebar-header">
          <div className="admin-logo-circle">L</div>
          <span className="admin-brand-name">Luvy Vault</span>
          {/* Mobile drawer closer */}
          <button 
            style={{ marginLeft: 'auto', display: 'none', cursor: 'pointer', color: 'var(--admin-text-primary)' }} 
            className="admin-mobile-close-btn"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="admin-sidebar-menu">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <a 
                key={item.id} 
                href={`#${item.id}`}
                className={`admin-menu-item ${activeTab === item.id ? 'active' : ''}`}
                onClick={(e) => { 
                  e.preventDefault(); 
                  handleSetActiveTab(item.id); 
                  setMobileMenuOpen(false); 
                }}
                title={sidebarCollapsed ? item.label : ''}
              >
                <Icon size={18} className="admin-menu-icon" />
                <span className="admin-menu-text">{item.label}</span>
              </a>
            );
          })}
        </nav>

        <div className="admin-sidebar-footer">
          <button 
            className="admin-menu-item" 
            style={{ width: '100%', border: 'none', background: 'transparent', textAlign: 'left', color: 'var(--admin-danger)' }}
            onClick={() => setShowLogoutModal(true)}
          >
            <LogOut size={18} className="admin-menu-icon" />
            <span className="admin-menu-text">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Area View */}
      <main className="admin-main">
        {/* Top Navbar */}
        <header className="admin-navbar">
          <div className="admin-nav-left">
            <button 
              className="admin-sidebar-toggle"
              onClick={() => {
                setSidebarCollapsed(!sidebarCollapsed);
                // Also acts as hamburger menu on small devices
                if (window.innerWidth < 1024) {
                  setMobileMenuOpen(true);
                }
              }}
            >
              <Menu size={18} />
            </button>

            {/* Breadcrumb navigation */}
            <div className="admin-breadcrumb">
              <span>Luvy</span>
              <span className="admin-breadcrumb-separator">/</span>
              <span>Admin</span>
              <span className="admin-breadcrumb-separator">/</span>
              <span className="admin-breadcrumb-active">
                {activeTab.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
              </span>
            </div>
          </div>

          <div className="admin-nav-right">
            {/* Global Search Bar */}
            <div className="admin-search-wrapper">
              <input 
                type="text" 
                placeholder="Search vaults..." 
                className="admin-search-input"
              />
              <Search size={16} className="admin-search-icon" />
            </div>

            {/* Custom Notifications Bell & Dropdown */}
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <button 
                className="admin-nav-action-btn"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                title="Notifications Panel"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="admin-nav-badge" style={{ backgroundColor: 'var(--admin-danger)', right: '-4px', top: '-4px' }}>
                    {unreadCount}
                  </span>
                )}
              </button>
              
              <AnimatePresence>
                {notificationsOpen && (
                  <motion.div 
                    onClick={(e) => e.stopPropagation()}
                    initial={{ opacity: 0, y: 12, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 12, scale: 0.96 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      right: 0,
                      width: '320px',
                      background: '#fff',
                      borderRadius: '12px',
                      boxShadow: '0 10px 30px rgba(124, 58, 237, 0.12)',
                      border: '1px solid var(--admin-border-color)',
                      zIndex: 1000,
                      padding: '12px 0',
                      textAlign: 'left'
                    }}
                  >
                    <div 
                      style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        padding: '0 16px 12px 16px',
                        borderBottom: '1px solid var(--admin-border-color)' 
                      }}
                    >
                      <span style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--admin-text-primary)' }}>
                        Notifications
                      </span>
                      <button 
                        onClick={handleMarkAllAsRead}
                        style={{ 
                          background: 'none', 
                          border: 'none', 
                          color: 'var(--admin-accent-purple)', 
                          fontSize: '0.75rem', 
                          cursor: 'pointer',
                          fontWeight: '600'
                        }}
                      >
                        Mark All as Read
                      </button>
                    </div>
                    
                    <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
                      {notifications.length > 0 ? (
                        notifications.slice(0, 5).map((n) => (
                          <div 
                            key={n.id} 
                            style={{ 
                              display: 'flex', 
                              padding: '12px 16px', 
                              borderBottom: '1px solid var(--admin-border-color)',
                              backgroundColor: n.is_read ? 'transparent' : 'rgba(124, 58, 237, 0.04)',
                              gap: '12px',
                              alignItems: 'flex-start'
                            }}
                          >
                            <div 
                              style={{ 
                                width: '8px', 
                                height: '8px', 
                                borderRadius: '50%', 
                                backgroundColor: n.is_read ? 'transparent' : 'var(--admin-accent-purple)',
                                marginTop: '6px',
                                flexShrink: 0
                              }}
                            />
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                              <span style={{ fontWeight: '600', fontSize: '0.8rem', color: 'var(--admin-text-primary)' }}>
                                {n.title}
                              </span>
                              <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-secondary)', lineHeight: '1.3' }}>
                                {n.description}
                              </span>
                              <span style={{ fontSize: '0.65rem', color: '#9e9e9e', marginTop: '4px' }}>
                                {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--admin-text-secondary)', fontSize: '0.8rem' }}>
                          No notifications received
                        </div>
                      )}
                    </div>
                    
                    <div 
                      style={{ 
                        padding: '10px 16px 0 16px', 
                        textAlign: 'center',
                        borderTop: '1px solid var(--admin-border-color)',
                        marginTop: '8px'
                      }}
                    >
                      <span 
                        style={{ fontSize: '0.8rem', color: 'var(--admin-accent-purple)', fontWeight: '600', cursor: 'pointer' }}
                        onClick={() => { setNotificationsOpen(false); setActiveTab('notifications'); }}
                      >
                        View All Notifications
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Dynamic Page Scaffolding Content */}
        <div className="admin-page-content">
          {renderActiveView()}
        </div>
      </main>

      {/* Floating Quick Action Button */}
      <div className={`admin-floating-actions ${quickActionsOpen ? 'open' : ''}`}>
        <button 
          className="admin-floating-btn"
          onClick={() => setQuickActionsOpen(!quickActionsOpen)}
          title="Quick Actions Menu"
        >
          <Plus size={24} />
        </button>
        <div className="admin-floating-menu">
          <div className="admin-floating-action-item" onClick={() => { setQuickActionsOpen(false); setActiveTab('products'); }}>
            <Plus size={14} /> Create New Product
          </div>

        </div>
      </div>

      {/* Logout Confirmation Modal Overlay */}
      {showLogoutModal && (
        <div className="admin-modal-overlay" onClick={() => setShowLogoutModal(false)}>
          <div className="admin-modal animate-fade-in" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
            <div className="admin-modal-body" style={{ textAlign: 'center', padding: '32px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'var(--admin-danger-light)', color: 'var(--admin-danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <LogOut size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', fontFamily: 'var(--admin-font-serif)', marginBottom: '8px' }}>Log Out of Vault?</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--admin-text-secondary)', lineHeight: '1.5', marginBottom: '24px' }}>
                Are you sure you want to log out from "Luvy's" secure executive panel? You will need active admin keys to re-authenticate.
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button className="admin-btn admin-btn-secondary" onClick={() => setShowLogoutModal(false)}>Cancel</button>
                <button className="admin-btn admin-btn-primary" style={{ backgroundColor: 'var(--admin-danger)', background: 'var(--admin-danger)' }} onClick={handleLogout}>Log Out</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
