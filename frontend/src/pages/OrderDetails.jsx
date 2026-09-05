import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { getFirstProductImage, getImageUrl } from "../utils/imageUtils";
import { 
  Package, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Truck, 
  MapPin, 
  Phone, 
  CreditCard, 
  ArrowLeft, 
  ShoppingBag,
  Sparkles,
  AlertCircle
} from "lucide-react";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/orders/${id}`)
      .then((res) => {
        setOrder(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load order:', err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="container py-section" style={{ textAlign: "center", minHeight: "50vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        <div style={{ width: "40px", height: "40px", border: "3px solid rgba(0,0,0,0.1)", borderTopColor: "var(--accent-gold, #c89d58)", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
        <p style={{ marginTop: "1rem", color: "#64748b" }}>Loading your order tracking details...</p>
      </div>
    );
  }

  if (order.length === 0) {
    return (
      <div className="container py-section" style={{ textAlign: "center", minHeight: "50vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        <Package size={48} color="#94a3b8" />
        <h2 style={{ marginTop: "1rem", color: "var(--text-dark)" }}>Order Not Found</h2>
        <p style={{ color: "#64748b", maxWidth: "400px", margin: "0.5rem auto 1.5rem" }}>
          We could not find the order details for reference #{id}. It may have been archived or removed.
        </p>
        <Link to="/shop" className="btn btn-primary">
          Explore Jewellery Collection
        </Link>
      </div>
    );
  }

  const orderInfo = order[0];
  const displayOrderId = orderInfo.luvy_order_id || `LUVY-ORD-${orderInfo.order_id}`;
  const status = orderInfo.order_status || 'Pending';
  const isRejected = status === 'Rejected';

  // Stepper helper
  const getStepStatus = (stepIndex) => {
    if (isRejected) return 'rejected';
    const statusLower = status.toLowerCase();
    
    if (statusLower === 'pending') {
      return stepIndex === 0 ? 'current' : 'upcoming';
    }
    if (statusLower === 'accepted' || statusLower === 'processing') {
      return stepIndex <= 1 ? (stepIndex === 1 ? 'current' : 'completed') : 'upcoming';
    }
    if (statusLower === 'shipped' || statusLower === 'dispatched') {
      return stepIndex <= 2 ? (stepIndex === 2 ? 'current' : 'completed') : 'upcoming';
    }
    if (statusLower === 'delivered') {
      return 'completed';
    }
    return stepIndex === 0 ? 'completed' : 'upcoming';
  };

  const steps = [
    { title: 'Order Placed', desc: 'Received & Logged' },
    { title: 'Order Confirmed', desc: 'Accepted by Admin' },
    { title: 'In Transit', desc: 'Dispatched with Vault Carrier' },
    { title: 'Delivered', desc: 'Arrived at your address' }
  ];

  return (
    <div className="container py-section animate-fade-in" style={{ maxWidth: "1050px", margin: "0 auto" }}>
      
      {/* Top Bar with Back Button */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <button 
          onClick={() => navigate(-1)} 
          style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", color: "#64748b", cursor: "pointer", fontWeight: "600", fontSize: "0.9rem" }}
        >
          <ArrowLeft size={18} /> Back
        </button>
        <div style={{ fontSize: "0.85rem", color: "#64748b" }}>
          Placed on: <strong>{new Date(orderInfo.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</strong>
        </div>
      </div>

      {/* Header Banner */}
      <div style={{ backgroundColor: "var(--bg-white)", borderRadius: "14px", padding: "1.75rem 2rem", border: "1px solid var(--border-color)", marginBottom: "2rem", boxShadow: "0 4px 15px rgba(0,0,0,0.03)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px", color: "var(--accent-gold, #c89d58)", fontWeight: "700" }}>
            Luvy Verified Order
          </span>
          <h1 style={{ margin: "4px 0 0 0", fontSize: "1.75rem", fontFamily: "var(--font-serif)", color: "var(--primary-navy)" }}>
            {displayOrderId}
          </h1>
        </div>

        <div>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 18px",
              borderRadius: "30px",
              fontWeight: "700",
              fontSize: "0.9rem",
              backgroundColor: isRejected ? "#fee2e2" : status === "Accepted" || status === "Delivered" ? "#dcfce7" : "#fef3c7",
              color: isRejected ? "#b91c1c" : status === "Accepted" || status === "Delivered" ? "#15803d" : "#b45309",
              border: `1px solid ${isRejected ? '#fca5a5' : status === "Accepted" || status === "Delivered" ? '#86efac' : '#fde68a'}`
            }}
          >
            {isRejected ? <XCircle size={16} /> : status === "Accepted" || status === "Delivered" ? <CheckCircle2 size={16} /> : <Clock size={16} />}
            Status: {status}
          </span>
        </div>
      </div>

      {/* Rejection / Special Message Alert */}
      {isRejected && (
        <div style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: "12px", padding: "1.25rem 1.5rem", marginBottom: "2rem", display: "flex", gap: "12px", alignItems: "flex-start" }}>
          <AlertCircle color="#dc2626" size={24} style={{ flexShrink: 0, marginTop: "2px" }} />
          <div>
            <h3 style={{ margin: "0 0 4px 0", color: "#991b1b", fontSize: "1.05rem" }}>Order Cancelled / Rejected</h3>
            <p style={{ margin: 0, color: "#b91c1c", fontSize: "0.9rem", lineHeight: "1.5" }}>
              This order could not be processed by our jewellery fulfillment team. Any payment holds will be released within 24-48 hours. If you have questions, please reach out to LUVY support.
            </p>
          </div>
        </div>
      )}

      {/* Order Progress Tracker */}
      {!isRejected && (
        <div style={{ backgroundColor: "var(--bg-white)", borderRadius: "14px", padding: "2rem", border: "1px solid var(--border-color)", marginBottom: "2rem", boxShadow: "0 4px 15px rgba(0,0,0,0.03)" }}>
          <h2 style={{ fontSize: "1.15rem", marginBottom: "1.5rem", color: "var(--primary-navy)", display: "flex", alignItems: "center", gap: "8px" }}>
            <Sparkles size={18} color="var(--accent-gold, #c89d58)" /> Real-Time Order Progress
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", position: "relative" }}>
            {steps.map((st, idx) => {
              const stepState = getStepStatus(idx);
              const isCompleted = stepState === 'completed';
              const isCurrent = stepState === 'current';
              
              return (
                <div key={idx} style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", position: "relative" }}>
                  <div
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: isCompleted ? "var(--accent-gold, #c89d58)" : isCurrent ? "var(--primary-navy)" : "#f1f5f9",
                      color: isCompleted || isCurrent ? "#fff" : "#94a3b8",
                      fontWeight: "700",
                      marginBottom: "0.75rem",
                      boxShadow: isCurrent ? "0 0 0 4px rgba(15, 23, 42, 0.15)" : "none",
                      transition: "all 0.3s ease"
                    }}
                  >
                    {isCompleted ? <CheckCircle2 size={22} /> : idx + 1}
                  </div>
                  <strong style={{ fontSize: "0.92rem", color: isCurrent || isCompleted ? "var(--text-dark)" : "#94a3b8", marginBottom: "2px" }}>
                    {st.title}
                  </strong>
                  <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
                    {st.desc}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Grid: Products and Shipping Details */}
      <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1.2fr", gap: "2rem", alignItems: "start" }}>
        
        {/* Left Column: Ordered Items */}
        <div>
          <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem", color: "var(--primary-navy)", display: "flex", alignItems: "center", gap: "8px" }}>
            <ShoppingBag size={20} color="var(--accent-gold, #c89d58)" />
            Purchased Items ({order.length})
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {order.map((item, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  gap: "1.25rem",
                  backgroundColor: "var(--bg-white)",
                  padding: "1.25rem",
                  borderRadius: "12px",
                  border: "1px solid var(--border-color)",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.02)"
                }}
              >
                <img
                  src={getImageUrl(getFirstProductImage(item.product_image))}
                  alt={item.product_name}
                  style={{
                    width: "90px",
                    height: "90px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    border: "1px solid var(--border-color)",
                    flexShrink: 0
                  }}
                />

                <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <h3 style={{ margin: "0 0 4px 0", fontSize: "1.05rem", color: "var(--text-dark)", fontFamily: "var(--font-serif)" }}>
                        {item.product_name}
                      </h3>
                      <span style={{ fontWeight: "700", color: "var(--text-dark)", fontSize: "1rem" }}>
                        ₹{(Number(item.product_price) * item.quantity).toFixed(2)}
                      </span>
                    </div>

                    {item.luvy_product_id && (
                      <span style={{ fontSize: "0.75rem", color: "#64748b", background: "#f8fafc", padding: "2px 6px", borderRadius: "4px", border: "1px solid #e2e8f0" }}>
                        SKU: {item.luvy_product_id}
                      </span>
                    )}
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.85rem", color: "#64748b", marginTop: "8px" }}>
                    <span>Unit Price: <strong>₹{Number(item.product_price).toFixed(2)}</strong></span>
                    <span>Qty: <strong>{item.quantity}</strong></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Customer & Delivery Info + Total */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          
          {/* Shipping Address Card */}
          <div style={{ backgroundColor: "var(--bg-white)", padding: "1.5rem", borderRadius: "12px", border: "1px solid var(--border-color)", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
            <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem", color: "var(--primary-navy)", display: "flex", alignItems: "center", gap: "8px" }}>
              <MapPin size={18} color="var(--accent-gold, #c89d58)" /> Delivery Destination
            </h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.9rem", color: "var(--text-dark)" }}>
              <div><strong>Recipient:</strong> {orderInfo.customer_name}</div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Phone size={14} color="#64748b" />
                <span>{orderInfo.phone_number}</span>
              </div>
              <div style={{ marginTop: "4px", color: "#475569", lineHeight: "1.4" }}>
                {orderInfo.address}
              </div>
            </div>
          </div>

          {/* Payment Breakdown Card */}
          <div style={{ backgroundColor: "var(--bg-white)", padding: "1.5rem", borderRadius: "12px", border: "1px solid var(--border-color)", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
            <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem", color: "var(--primary-navy)", display: "flex", alignItems: "center", gap: "8px" }}>
              <CreditCard size={18} color="var(--accent-gold, #c89d58)" /> Payment Summary
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.88rem", color: "#475569" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Payment Method:</span>
                <strong style={{ color: "var(--text-dark)" }}>{orderInfo.payment_method}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Items Subtotal:</span>
                <span>₹{Number(orderInfo.total_amount).toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Delivery:</span>
                <span style={{ color: "#16a34a", fontWeight: "600" }}>FREE</span>
              </div>

              <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "0.75rem", marginTop: "0.5rem", display: "flex", justifyContent: "space-between", fontSize: "1.15rem", fontWeight: "800", color: "var(--primary-navy)" }}>
                <span>Total Amount:</span>
                <span style={{ color: "var(--accent-gold, #c89d58)" }}>₹{Number(orderInfo.total_amount).toFixed(2)}</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default OrderDetails;