import React from 'react';
import { CreditCard, CheckCircle, Shield, Calendar, DollarSign } from 'lucide-react';

export default function Payments() {
  const transactions = [
    { id: 'TXN-90234', customer: 'Sarah Connor', method: 'Visa ending in 4242', amount: '$1,250.00', status: 'Succeeded', date: 'May 23, 2026' },
    { id: 'TXN-90235', customer: 'John Doe', method: 'Mastercard ending in 1984', amount: '$450.00', status: 'Succeeded', date: 'May 23, 2026' },
    { id: 'TXN-90236', customer: 'Thomas Anderson', method: 'Apple Pay - Amex', amount: '$2,400.00', status: 'Succeeded', date: 'May 22, 2026' },
    { id: 'TXN-90237', customer: 'Bruce Wayne', method: 'Stripe Direct - Visa VIP', amount: '$18,400.00', status: 'Succeeded', date: 'May 22, 2026' }
  ];

  return (
    <div className="admin-animate-fade-in">
      <div className="admin-page-header">
        <div className="admin-page-title-group">
          <h1 className="admin-page-title">Merchant Transactions</h1>
          <span className="admin-page-subtitle">Track Stripe gateway settlements, review automated payout logs, and configure currency models.</span>
        </div>
      </div>

      <div className="admin-grid-sidebar">
        
        {/* Payments ledger table list */}
        <div className="admin-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <CreditCard size={18} style={{ color: 'var(--admin-accent-purple)' }} />
            <h3 style={{ fontSize: '1.05rem', fontWeight: '700', fontFamily: 'var(--admin-font-serif)' }}>Settle Transaction Logs</h3>
          </div>

          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Customer Name</th>
                  <th>Payment Type</th>
                  <th>Intake Amount</th>
                  <th>Gateway Status</th>
                  <th>Settlement Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: '700', color: 'var(--admin-accent-purple)' }}>{t.id}</td>
                    <td>{t.customer}</td>
                    <td>{t.method}</td>
                    <td style={{ fontWeight: '700' }}>{t.amount}</td>
                    <td>
                      <span className="admin-badge admin-badge-success" style={{ gap: '4px' }}>
                        <CheckCircle size={10} /> {t.status}
                      </span>
                    </td>
                    <td>{t.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Gateways Config */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="admin-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Shield size={18} style={{ color: 'var(--admin-accent-gold)' }} />
              <h4 style={{ fontWeight: '700', fontSize: '0.95rem' }}>Integrated Gateways</h4>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--admin-bg)', padding: '10px 14px', borderRadius: '12px', border: '1px solid var(--admin-border-color)' }}>
                <div>
                  <strong style={{ fontSize: '0.85rem' }}>Stripe Checkout</strong>
                  <span style={{ fontSize: '0.7rem', color: 'var(--admin-success)', display: 'block', fontWeight: '600' }}>Operational (Active)</span>
                </div>
                <label className="admin-toggle-switch">
                  <input type="checkbox" defaultChecked />
                  <span className="admin-toggle-slider"></span>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--admin-bg)', padding: '10px 14px', borderRadius: '12px', border: '1px solid var(--admin-border-color)' }}>
                <div>
                  <strong style={{ fontSize: '0.85rem' }}>PayPal Business</strong>
                  <span style={{ fontSize: '0.7rem', color: 'var(--admin-success)', display: 'block', fontWeight: '600' }}>Operational (Active)</span>
                </div>
                <label className="admin-toggle-switch">
                  <input type="checkbox" defaultChecked />
                  <span className="admin-toggle-slider"></span>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--admin-bg)', padding: '10px 14px', borderRadius: '12px', border: '1px solid var(--admin-border-color)' }}>
                <div>
                  <strong style={{ fontSize: '0.85rem' }}>Apple Pay (Wallet)</strong>
                  <span style={{ fontSize: '0.7rem', color: 'var(--admin-text-secondary)', display: 'block' }}>Awaiting merchant keys</span>
                </div>
                <label className="admin-toggle-switch">
                  <input type="checkbox" />
                  <span className="admin-toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>

          <div className="admin-card">
            <h4 style={{ fontWeight: '700', fontSize: '0.95rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={18} style={{ color: 'var(--admin-accent-purple)' }} />
              Settlement Cycles
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--admin-text-secondary)' }}>Daily Rolling Payouts:</span>
                <strong>Enabled (T+2)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--admin-text-secondary)' }}>Estimated Next Deposit:</span>
                <strong style={{ color: 'var(--admin-accent-gold)' }}>May 25, 2026 ($24,250.00)</strong>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
