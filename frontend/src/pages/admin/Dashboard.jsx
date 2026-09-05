import React from 'react';
import { 
  ShoppingBag, 
  Tag, 
  Users,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function Dashboard({ onViewOrders, onViewProducts,  onViewCustomers, ordersData, productsData }) {
  // Dummy statistics
  const [stats, setStats] = useState({
  totalOrders: 0,
  totalProducts: 0,
  totalCustomers: 0
});


useEffect(() => {

  axios
    .get('http://localhost:5000/api/dashboard/stats')
    .then((res) => {
      setStats(res.data);
    })
    .catch((err) => {
      console.log(err);
    });

}, []);

  // const metrics = [
  //   {
  //   value: stats.totalOrders,
  //   }
  // ];


  const metrics = [
  {
    title: 'Total Orders',
    value: stats.totalOrders,
    trend: '+12.4%',
    isPositive: true,
    icon: ShoppingBag,
    gradient:
      'linear-gradient(135deg, #DDD6FE 0%, #C7D2FE 100%)',
    iconBg: '#7C3AED',
    sparkline: [30, 45, 35, 50, 40, 60, 55],
  },

  {
    title: 'Products',
    value: stats.totalProducts,
    trend: '+4.1%',
    isPositive: true,
    icon: Tag,
    gradient:
      'linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%)',
    iconBg: '#0284C7',
    sparkline: [10, 12, 12, 15, 15, 17, 18],
  },

  {
    title: 'Customers',
    value: stats.totalCustomers,
    trend: '+8.2%',
    isPositive: true,
    icon: Users,
    gradient:
      'linear-gradient(135deg, #FCE7F3 0%, #FBCFE8 100%)',
    iconBg: '#DB2777',
    sparkline: [12, 18, 20, 24, 28, 30, 35],
  }
];
  return (
    <div className="admin-animate-fade-in">
      {/* Page Header */}
      <div className="admin-page-header">
        <div className="admin-page-title-group">
          <h1 className="admin-page-title">Executive Dashboard</h1>
          <span className="admin-page-subtitle">Welcome back, Admin. Here is "Luvy's" luxury performance matrix today.</span>
        </div>
        <div className="admin-page-actions">
          <button className="admin-btn admin-btn-primary" onClick={() => onViewProducts()}>
            <Tag size={16} /> Manage Inventory
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="admin-metrics-grid">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            // <div key={idx} className="admin-card admin-card-hover admin-metric-card" style={{ borderLeft: `4px solid ${m.iconBg}` }}>
              <div
  key={idx}
  className="admin-card admin-card-hover admin-metric-card"
  style={{
    borderLeft: `4px solid ${m.iconBg}`,
    cursor: 'pointer'
  }}
  onClick={() => {

    if (m.title === 'Total Orders') {
      onViewOrders();
    }

    if (m.title === 'Products') {
      onViewProducts();
    }

    if (m.title === 'Customers') {
      // future customers page
onViewCustomers();
    }

  }}
>
              <div className="admin-metric-header">
                <span className="admin-metric-title">{m.title}</span>
                <div className="admin-metric-icon-box" style={{ backgroundColor: m.gradient, color: m.iconBg }}>
                  <Icon size={16} />
                </div>
              </div>
              <div className="admin-metric-val-trend">
                <span className="admin-metric-value">{m.value}</span>
                <span className={`admin-metric-trend ${m.isPositive ? 'admin-trend-up' : m.isWarning ? 'admin-trend-down' : 'admin-trend-down'}`}>
                  {m.isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {m.trend}
                </span>
              </div>
              
              {/* Custom SVG sparkline graph */}
              <div className="admin-metric-chart-spark">
                <svg viewBox="0 0 100 40" width="100%" height="100%" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id={`grad-${idx}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={m.iconBg} stopOpacity="0.4" />
                      <stop offset="100%" stopColor={m.iconBg} stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  {/* Area fill */}
                  <path 
                    d={`M 0 40 ${m.sparkline.map((val, i) => `L ${i * (100 / (m.sparkline.length - 1))} ${40 - val * 0.35}`).join(' ')} L 100 40 Z`} 
                    fill={`url(#grad-${idx})`} 
                  />
                  {/* Line path */}
                  <path 
                    d={m.sparkline.map((val, i) => `${i === 0 ? 'M' : 'L'} ${i * (100 / (m.sparkline.length - 1))} ${40 - val * 0.35}`).join(' ')} 
                    fill="none" 
                    stroke={m.iconBg} 
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders Preview */}
      <div className="admin-card" style={{ marginTop: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', fontFamily: 'var(--admin-font-serif)' }}>Recent Orders</h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--admin-accent-purple)', cursor: 'pointer', fontWeight: '600' }} onClick={() => onViewOrders()}>View All Orders →</span>
        </div>
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {ordersData.slice(0, 4).map((order) => (
                <tr key={order.id}>
                  <td style={{ fontWeight: '600', color: 'var(--admin-accent-purple)' }}>#{order.id}</td>
                  <td>{order.customer_name}</td>
                  <td>Order #{order.id}</td>
                  <td style={{ fontWeight: '700' }}>₹{Number(order.total_amount).toFixed(2)}</td>
                  <td>
                    <span className={`admin-badge ${
                      order.status === 'Delivered' ? 'admin-badge-success' : 
                      order.status === 'Processing' ? 'admin-badge-warning' : 'admin-badge-danger'
                    }`}>
                      {order.order_status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>



      </div>

  );
}
