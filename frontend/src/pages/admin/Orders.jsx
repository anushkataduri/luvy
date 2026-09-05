import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Search, 
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Orders({ onDeleteOrder, onViewOrder }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const itemsPerPage = 8;

  // Filter orders
  const filteredOrders = orders.filter(order => {
    return (
      order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      String(order.total_amount).includes(searchTerm)|| 
      order.id.toString().includes(searchTerm)
    );
  });




  useEffect(() => {

  fetchOrders();

}, []);

const fetchOrders = async () => {

  try {

    const response = await axios.get(
      'http://localhost:5000/api/orders'
    );

    setOrders(response.data);

  } catch (error) {

    console.log(error);
  }
};

const handleUpdateStatus = async (orderId, newStatus) => {
  try {
    await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, { status: newStatus });
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, order_status: newStatus } : o));
  } catch (err) {
    console.error(err);
    alert('Failed to update order status');
  }
};

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };



  return (
    <div className="admin-animate-fade-in">
      {/* Page Header */}
      <div className="admin-page-header">
        <div className="admin-page-title-group">
          <h1 className="admin-page-title">Order Ledger</h1>
          <span className="admin-page-subtitle">Track, filter, verify payments, and process customer orders globally.</span>
        </div>
      </div>

      {/* Search box */}
      <div className="admin-card" style={{ padding: '16px', marginBottom: '24px' }}>
        <div style={{ position: 'relative' }}>
          <input 
            type="text" 
            placeholder="Search by ID, customer name, or item description..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="admin-form-input"
            style={{ paddingLeft: '40px', height: '42px' }}
          />
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '12px', color: 'var(--admin-text-secondary)' }} />
        </div>
      </div>

      {/* Orders Table Card */}
      <div className="admin-card">
        <div className="admin-table-container">
          <table className="admin-table">
           <thead>
  <tr>
    <th>Order ID</th>
    <th>Customer Name</th>
    <th>Phone Number</th>
    <th>Address</th>
    <th>Total Amount</th>
    <th>Payment Method</th>
    <th>Order Status</th>
    <th>Decision</th>
    <th>Date</th>
    <th>VIEW</th>
    <th>Actions</th>
  </tr>
</thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((order) => (
                  <tr key={order.id} style={{ transition: 'all 0.2s' }}>
                    <td style={{ fontWeight: '700', color: 'var(--admin-accent-purple)' }}>#{order.id}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ 
                          width: '32px', 
                          height: '32px', 
                          borderRadius: '50%', 
                          background: 'linear-gradient(135deg, var(--admin-accent-purple) 0%, var(--admin-accent-lavender) 100%)', 
                          color: '#FFFFFF',
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          fontSize: '0.85rem',
                          fontWeight: '700'
                        }}>
                          {order.customer_name?.[0]}
                        </div>
                        <span style={{ fontWeight: '500' }}>{order.customer_name}</span>
                      </div>
                    </td>
                   


<td>{order.phone_number}</td>

<td
  style={{
    maxWidth: '220px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  }}
>
  {order.address}
</td>

<td style={{ fontWeight: '700' }}>
  ₹{Number(order.total_amount).toFixed(2)}
</td>

<td>{order.payment_method}</td>

<td>
  <span
    className={`admin-badge ${
      order.order_status === 'Delivered' || order.order_status === 'Accepted'
        ? 'admin-badge-success'
        : order.order_status === 'Processing' ||
          order.order_status === 'Shipped' ||
          order.order_status === 'Pending'
        ? 'admin-badge-warning'
        : 'admin-badge-danger'
    }`}
  >
    {order.order_status}
  </span>
</td>

<td>
  {order.order_status === 'Pending' ? (
    <div style={{ display: 'flex', gap: '6px' }}>
      <button 
        className="admin-btn admin-btn-primary" 
        onClick={() => handleUpdateStatus(order.id, 'Accepted')} 
        style={{ padding: '4px 10px', fontSize: '0.75rem', borderRadius: '6px', minHeight: 'unset' }}
      >
        Accept
      </button>
      <button 
        className="admin-btn admin-btn-secondary" 
        onClick={() => handleUpdateStatus(order.id, 'Rejected')} 
        style={{ padding: '4px 10px', fontSize: '0.75rem', borderRadius: '6px', minHeight: 'unset', color: 'var(--admin-danger)', borderColor: 'var(--admin-danger)' }}
      >
        Reject
      </button>
    </div>
  ) : (
    <span style={{ fontSize: '0.85rem', color: 'var(--admin-text-secondary)', fontWeight: '500' }}>
      -
    </span>
  )}
</td>

<td>
  {new Date(order.created_at).toLocaleDateString()}
</td>



                    <td>
  <button
    className="admin-btn admin-btn-secondary admin-btn-icon-only"
    title="View Order"
    onClick={() => onViewOrder(order.id)}
    style={{
      width: '32px',
      height: '32px',
      borderRadius: '8px',
      color: '#7C3AED'
    }}
  >
    <Eye size={16} />
  </button>
</td>

<td>
  <button
    className="admin-btn admin-btn-secondary admin-btn-icon-only"
    title="Delete Order"
    onClick={() => onDeleteOrder(order.id)}
    style={{
      width: '32px',
      height: '32px',
      borderRadius: '8px',
      color: 'var(--admin-danger)'
    }}
  >
    <Trash2 size={14} />
  </button>
</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="11" style={{ textAlign: 'center', padding: '40px', color: 'var(--admin-text-secondary)' }}>
                    No orders matched your search or status criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', borderTop: '1px solid var(--admin-border-color)', paddingTop: '20px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-secondary)' }}>
              Showing page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> ({filteredOrders.length} items)
            </span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button 
                className="admin-btn admin-btn-secondary" 
                style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem' }}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={14} /> Prev
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button 
                  key={i} 
                  className={`admin-btn`}
                  style={{ 
                    padding: '6px 12px', 
                    borderRadius: '8px', 
                    fontSize: '0.8rem',
                    minWidth: '32px',
                    background: currentPage === i + 1 ? 'var(--admin-accent-purple)' : 'transparent',
                    color: currentPage === i + 1 ? '#FFFFFF' : 'var(--admin-text-primary)',
                    border: '1px solid transparent',
                    borderColor: currentPage === i + 1 ? 'transparent' : 'var(--admin-border-color)',
                    fontWeight: '600'
                  }}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button 
                className="admin-btn admin-btn-secondary" 
                style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem' }}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
