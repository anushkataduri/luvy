import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Edit, LogOut, Package, ChevronRight } from 'lucide-react';
import axios from 'axios';


const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
  fullname: '',
  email: '',
  phone: ''
});
const [orders, setOrders] = useState([]);
const [activeTab, setActiveTab] =
useState("orders");

const [showReviewForm,
setShowReviewForm] = useState(false);

const [rating,
setRating] = useState(5);

const [reviewText,
setReviewText] = useState("");
const [product, setProduct] =
useState("");
const [reviews, setReviews] = useState([]);

 useEffect(() => {

  const isLoggedIn =
    localStorage.getItem('isLoggedIn') === 'true';

  if (!isLoggedIn) {
    navigate('/auth?mode=login');
    return;
  }

  const savedProfile =
    localStorage.getItem('user');

  if (savedProfile) {

    const currentUser =
      JSON.parse(savedProfile);

    setUser(currentUser);



    axios
  .get("http://localhost:5000/api/reviews")
  .then((res) => {

    const userReviews =
      res.data.filter(
        (review) =>
          review.user_id === currentUser.id
      );

    setReviews(userReviews);

  })
  .catch((err) => {
    console.log(err);
  });

    axios
      .get(
        `http://localhost:5000/api/orders/user/${currentUser.id}`
      )
      .then((res) => {
        setOrders(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

}, [navigate]);


const submitReview = async () => {

  if (!product) {
    alert("Please select a product");
    return;
  }

  if (!reviewText.trim()) {
    alert("Please write a review");
    return;
  }

  try {

    await axios.post(
      "http://localhost:5000/api/reviews",
      {
        user_id: user.id,
        customer: user.fullname,
        product,
        rating,
        review: reviewText
      }
    );

    alert("Review submitted successfully");

    setProduct("");
    setRating(5);
    setReviewText("");
    setShowReviewForm(false);

  } catch (error) {
    console.log(error);
  }
};


  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    window.dispatchEvent(new Event('authChange'));
    navigate('/');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

 

  return (
  <div className="profile-page animate-fade-in">
    <div
      className="container"
      style={{
        maxWidth: "800px",
        margin: "4rem auto",
        minHeight: "60vh",
      }}
    >
      <h1
        className="section-title"
        style={{
          textAlign: "left",
          marginBottom: "2rem",
        }}
      >
        My Account
      </h1>

      <div className="profile-layout">

        {/* Profile Card */}
        <div className="profile-card">

          <div className="profile-header">

            <div className="profile-avatar">
              {getInitials(user.fullname)}
            </div>

            <div className="profile-title-area">
              <h2>{user.fullname}</h2>
              <p>Premium Member</p>
            </div>

            <div
              style={{
                marginTop: "10px",
                textAlign: "center",
              }}
            >
              <h3>{orders.length}</h3>
              <p>Total Orders</p>
            </div>

            <button
              className="edit-btn"
              title="Edit Profile"
            >
              <Edit size={18} />
            </button>

          </div>

          <div className="profile-details">

            <div className="detail-item">
              <div className="detail-icon">
                <User size={18} />
              </div>

              <div className="detail-text">
                <span className="detail-label">
                  Full Name
                </span>

                <span className="detail-value">
                  {user.fullname}
                </span>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-icon">
                <Mail size={18} />
              </div>

              <div className="detail-text">
                <span className="detail-label">
                  Email Address
                </span>

                <span className="detail-value">
                  {user.email}
                </span>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-icon">
                <Phone size={18} />
              </div>

              <div className="detail-text">
                <span className="detail-label">
                  Phone Number
                </span>

                <span className="detail-value">
                  {user.phone}
                </span>
              </div>
            </div>

          </div>

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            Logout
          </button>

        </div>

        {/* Right Section */}
        <div className="orders-section">

          {/* Tabs */}
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginBottom: "20px",
            }}
          >
            <button
              onClick={() =>
                setActiveTab("orders")
              }
              className="btn"
              style={{
                background:
                  activeTab === "orders"
                    ? "#0B1F4D"
                    : "#f5f5f5",
                color:
                  activeTab === "orders"
                    ? "#fff"
                    : "#333",
              }}
            >
              My Orders
            </button>

            <button
              onClick={() =>
                setActiveTab("reviews")
              }
              className="btn"
              style={{
                background:
                  activeTab === "reviews"
                    ? "#0B1F4D"
                    : "#f5f5f5",
                color:
                  activeTab === "reviews"
                    ? "#fff"
                    : "#333",
              }}
            >
              My Reviews
            </button>
          </div>

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <>
              <div className="orders-header">
                <h3>
                  <Package
                    size={20}
                    style={{
                      marginRight: "8px",
                    }}
                  />
                  My Orders
                </h3>
              </div>

              <div className="orders-list">

                {orders.length === 0 ? (

                  <div
                    style={{
                      textAlign: "center",
                      padding: "20px",
                    }}
                  >
                    No Orders Found
                  </div>

                ) : (

                  orders.map((order) => (

                    <div
                      className="order-card"
                      key={order.id}
                      onClick={() =>
                        navigate(
                          `/order/${order.id}`
                        )
                      }
                      style={{
                        cursor: "pointer",
                      }}
                    >
                      <div className="order-info">

                        <span className="order-id">
                          ORD-{order.id}
                        </span>

                        <span className="order-date">
                          {new Date(
                            order.created_at
                          ).toLocaleDateString()}
                        </span>

                      </div>

                      <div className="order-status-total">

                        <span
                          className={`order-status ${order.order_status?.toLowerCase()}`}
                        >
                          {order.order_status}
                        </span>

                        <span className="order-total">
                          ₹
                          {Number(
                            order.total_amount
                          ).toFixed(2)}
                        </span>

                        <ChevronRight
                          size={18}
                        />

                      </div>
                    </div>

                  ))

                )}

              </div>
            </>
          )}

          {/* Reviews Tab */}
          {activeTab === "reviews" && (

            <div
              style={{
                background: "#fff",
                padding: "20px",
                borderRadius: "12px",
                boxShadow:
                  "0 2px 10px rgba(0,0,0,0.08)",
              }}
            >
              <h3>
                My Reviews
              </h3>

              {/* <p
                style={{
                  marginTop: "10px",
                  color: "#666",
                }}
              >
                You haven't written
                any reviews yet.
              </p> */}

            

               {reviews.length === 0 ? (

  <p
    style={{
      marginTop: "10px",
      color: "#666",
    }}
  >
    You haven't written any reviews yet.
  </p>

) : (

  reviews.map((review) => (

    <div
      key={review.id}
      style={{
        border: "1px solid #ddd",
        padding: "10px",
        marginTop: "10px",
        borderRadius: "8px"
      }}
    >
      <h4>
        {review.product}
      </h4>

      <p>
        Rating: {review.rating} ⭐
      </p>

      <p>
        {review.review}
      </p>

    </div>

  ))

)}

 



<button
  className="btn"
  onClick={() =>
    setShowReviewForm(
      !showReviewForm
    )
  }
>
  Write Review
</button>

 {showReviewForm &&  
(

<div
  style={{
    marginTop: "20px"
  }}
>

 



<h4>Product Name</h4>

<input
  type="text"
  placeholder="Enter Product Name"
  value={product}
  onChange={(e) => setProduct(e.target.value)}
  style={{
    width: "100%",
    padding: "10px",
    marginBottom: "15px"
  }}
/>

  <h4>Rating</h4>

<select
  value={rating}
  onChange={(e) =>
    setRating(e.target.value)
  }
  style={{
    width: "100%",
    padding: "10px",
    marginBottom: "15px"
  }}
>
  <option value="5">⭐⭐⭐⭐⭐</option>
  <option value="4">⭐⭐⭐⭐</option>
  <option value="3">⭐⭐⭐</option>
  <option value="2">⭐⭐</option>
  <option value="1">⭐</option>
</select>

<textarea
  placeholder="Write your review..."
  value={reviewText}
  onChange={(e) =>
    setReviewText(e.target.value)
  }
  style={{
    width: "100%",
    height: "120px",
    marginTop: "15px"
  }}
/>

<button
  className="btn"
  style={{
    marginTop: "15px"
  }}
  onClick={submitReview}
>
  Submit Review
</button>

{/* </div>
)} */}
</div>
)}
</div>

)} 

</div>   

</div>   

</div>   

</div>   

);
};

export default Profile;