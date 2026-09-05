import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { getFirstProductImage, getImageUrl } from "../utils/imageUtils";

const OrderDetails = () => {

  const { id } = useParams();

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
        console.log(err);
        setLoading(false);
      });

  }, [id]);

  if (loading) return <h2>Loading...</h2>;

  if (order.length === 0)
    return <h2>No Order Found</h2>;

  const orderInfo = order[0];

  return (
    <div
      className="container py-section"
      style={{
        maxWidth: "1100px",
        margin: "0 auto"
      }}
    >
      <h1
        style={{
          marginBottom: "30px"
        }}
      >
        Order #{orderInfo.order_id}
      </h1>

      {/* Order Info */}
<div
  style={{
    background: "#fff",
    padding: "25px",
    borderRadius: "12px",
    marginBottom: "30px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)"
  }}
>
  <h2>Delivery Details</h2>

  <p>
  <strong>Total Amount:</strong>
  {" "}
  ₹{Number(orderInfo.total_amount).toFixed(2)}
</p>

  <p>
    <strong>Name:</strong>
    {" "}
    {orderInfo.customer_name}
  </p>

  <p>
    <strong>Phone:</strong>
    {" "}
    {orderInfo.phone_number}
  </p>

  <p>
    <strong>Address:</strong>
    {" "}
    {orderInfo.address}
  </p>

  <p>
    <strong>Payment Method:</strong>
    {" "}
    {orderInfo.payment_method}
  </p>

  {/* <p>
    <strong>Order Status:</strong>
    {" "}
    {orderInfo.order_status}
  </p> */}

  <p>
  <strong>Status:</strong>
  <span
    style={{
      marginLeft: "10px",
      padding: "4px 12px",
      borderRadius: "20px",
      fontWeight: "600",
      background:
        orderInfo.order_status === "Accepted" || orderInfo.order_status === "Delivered"
          ? "#d4edda"
          : orderInfo.order_status === "Rejected"
          ? "#f8d7da"
          : "#fff3cd",
      color:
        orderInfo.order_status === "Accepted" || orderInfo.order_status === "Delivered"
          ? "#155724"
          : orderInfo.order_status === "Rejected"
          ? "#721c24"
          : "#856404"
    }}
  >
    {orderInfo.order_status}
  </span>
</p>

  <p>
    <strong>Order Date:</strong>
    {" "}
    {new Date(
      orderInfo.created_at
    ).toLocaleDateString()}
  </p>
</div>

      {/* Products */}

      <h2
        style={{
          marginBottom: "20px"
        }}
      >
        Ordered Products
      </h2>

      {order.map((item, index) => (

        <div
          key={index}
          style={{
            display: "flex",
            gap: "20px",
            background: "#fff",
            padding: "20px",
            borderRadius: "12px",
            marginBottom: "20px",
            boxShadow:
              "0 2px 10px rgba(0,0,0,0.08)"
          }}
        >
          <img
            src={getImageUrl(getFirstProductImage(item.product_image))}
            alt={item.product_name}
            style={{
              width: "140px",
              height: "140px",
              objectFit: "cover",
              borderRadius: "10px"
            }}
          />

          <div>
            <h3>{item.product_name}</h3>

            <p>
              Price:
              ₹{item.product_price}
            </p>

            <p>
              Quantity:
              {item.quantity}
            </p>

            <p>
              Subtotal:
              ₹
              {(
                Number(
                  item.product_price
                ) * item.quantity
              ).toFixed(2)}
            </p>
          </div>
        </div>

      ))}
    </div>
  );
};

export default OrderDetails;