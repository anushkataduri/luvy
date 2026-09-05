import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Contact from './pages/Contact';
import About from './pages/About';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import ScrollToTop from './components/ScrollToTop';
import Success from './pages/Success'
// import GlobalNotifications from './components/GlobalNotifications';
// import GlobalNotifications from "./pages/admin/GlobalNotifications";
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import OrderDetails from './pages/OrderDetails';
import AdminOrderDetails from './pages/admin/AdminOrderDetails';

// Admin Imports
import AdminLayout from './pages/admin/AdminLayout';
import './admin.css';

function AppContent() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth';
  const isAdminRoute = location.pathname.startsWith('/admin');
  const user = JSON.parse(localStorage.getItem('user'));

  // if (isAdminRoute) {
  //   return (
  //     <div className="admin-root-container">
  //       <Routes>
  //         <Route path="/admin/*" element={<AdminLayout />} />
  //       </Routes>
  //     </div>
  //   );
  // }



  if (isAdminRoute) {


  // Not logged in or not admin
  if (!user || user.role !== 'admin') {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="admin-root-container">
      <Routes>
        <Route path="/admin/*" element={<AdminLayout />} />
      </Routes>
    </div>
  );
}

  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/success" element={<Success />} />
          <Route
  path="/order/:id"
  element={<OrderDetails />}
/>
        </Routes>
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <CartProvider>
        <WishlistProvider>
          <ScrollToTop />
          <AppContent />
          {/* <GlobalNotifications /> */}
        </WishlistProvider>
      </CartProvider>
    </Router>
  );
}

export default App;
