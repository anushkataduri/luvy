import React, { useState } from 'react';
import { Bell, ShoppingBag, AlertTriangle, Star, Shield, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Notifications({ notifications = [], fetchNotifications, onMarkAsRead }) {
  const [activeFilter, setActiveFilter] = useState('All');

  const getIconAndColor = (type) => {
    switch (type ? type.toLowerCase() : '') {
      case 'order':
        return { icon: ShoppingBag, color: 'var(--admin-success)' };
      case 'contact':
        return { icon: Bell, color: 'var(--admin-accent-purple)' };
      case 'review':
        return { icon: Star, color: 'var(--admin-accent-gold)' };
      default:
        return { icon: AlertTriangle, color: 'var(--admin-warning)' };
    }
  };

  const filteredNotifs = notifications.filter(n => {
    if (activeFilter === 'All') return true;
    return n.type && n.type.toLowerCase() === activeFilter.toLowerCase();
  });

  return (
    <div className="admin-animate-fade-in">
      <div className="admin-page-header">
        <div className="admin-page-title-group">
          <h1 className="admin-page-title">Notification Console</h1>
          <span className="admin-page-subtitle">Track immediate customer orders, contact queries, and review submissions.</span>
        </div>
      </div>

      <div className="admin-card" style={{ padding: '16px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
          {['All', 'Order', 'Contact', 'Review'].map(filter => (
            <button
              key={filter}
              className="admin-btn"
              style={{
                padding: '8px 16px',
                fontSize: '0.8rem',
                borderRadius: '10px',
                background: activeFilter === filter ? 'var(--admin-accent-purple)' : 'var(--admin-bg)',
                color: activeFilter === filter ? '#FFFFFF' : 'var(--admin-text-secondary)',
                border: '1px solid transparent',
                borderColor: activeFilter === filter ? 'transparent' : 'var(--admin-border-color)',
                fontWeight: '600',
                transition: 'all 0.2s ease'
              }}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <motion.div 
        layout 
        className="admin-card" 
        style={{ display: 'flex', flexDirection: 'column', gap: '16px', minHeight: '100px' }}
      >
        <AnimatePresence mode="popLayout">
          {filteredNotifs.length > 0 ? (
            filteredNotifs.map((n) => {
              const { icon: Icon, color } = getIconAndColor(n.type);
              const isUnread = !n.is_read;
              return (
                <motion.div 
                  key={n.id} 
                  layout
                  initial={{ opacity: 0, y: 12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                  style={{ 
                    display: 'flex', 
                    gap: '16px', 
                    alignItems: 'center', 
                    backgroundColor: isUnread ? 'rgba(124, 58, 237, 0.03)' : 'transparent', 
                    padding: '16px', 
                    borderRadius: '14px', 
                    border: '1px solid', 
                    borderColor: isUnread ? 'rgba(124, 58, 237, 0.1)' : 'var(--admin-border-color)', 
                    transition: 'background-color 0.2s, border-color 0.2s' 
                  }}
                >
                  <div style={{ backgroundColor: color + '1D', color: color, padding: '10px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={18} />
                  </div>
                  <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--admin-text-primary)' }}>{n.title}</strong>
                    <span style={{ fontSize: '0.85rem', color: 'var(--admin-text-secondary)' }}>{n.description}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-secondary)' }}>
                      {new Date(n.created_at).toLocaleString()} | Category: <strong style={{ textTransform: 'capitalize' }}>{n.type}</strong>
                    </span>
                  </div>
                  
                  {isUnread ? (
                    <button 
                      onClick={() => onMarkAsRead(n.id)}
                      className="admin-btn admin-btn-secondary" 
                      style={{ padding: '6px 12px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <CheckCircle size={12} /> Mark Read
                    </button>
                  ) : (
                    <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-secondary)', fontWeight: '600' }}>Read</span>
                  )}
                </motion.div>
              );
            })
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ padding: '40px', textAlign: 'center', color: 'var(--admin-text-secondary)' }}
            >
              No logs recorded under this filter path.
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
