

const db = require('../config/db');

const placeOrder = (req, res) => {

  console.log(req.body);

  try {

    const {
      user_id,
      customer_name,
      phone_number,
      address,
      total_amount,
      payment_method,
      cartItems
    } = req.body;

    const orderQuery = `
      INSERT INTO orders
      (
        user_id,
        customer_name,
        phone_number,
        address,
        total_amount,
        payment_method,
        order_status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      orderQuery,
      [
        user_id || null,
        customer_name,
        phone_number,
        address,
        total_amount,
        payment_method,
        'Pending'
      ],
      (err, orderResult) => {

        if (err) {
          console.log('ORDER ERROR:', err);
          return res.status(500).json(err);
        }

        const orderId = orderResult.insertId;

        if (cartItems && cartItems.length > 0) {

          cartItems.forEach((item) => {

            const itemQuery = `
              INSERT INTO order_items
              (
                order_id,
                product_id,
                product_name,
                product_price,
                quantity,
                product_image
              )
              VALUES (?, ?, ?, ?, ?, ?)
            `;

            db.query(
              itemQuery,
              [
                orderId,
                item.id,
                item.product_name,
                item.price,
                item.quantity,
                item.image
              ],
              (itemErr) => {

                if (itemErr) {
                  console.log(
                    'ORDER ITEM ERROR:',
                    itemErr
                  );
                }
              }
            );

          });
        }

        try {
          const { createAndBroadcastNotification } = require('../services/notificationService');
          createAndBroadcastNotification(
            'New Order Received',
            `Order #${orderId} placed by ${customer_name}`,
            'order',
            orderId
          );
        } catch (notifErr) {
          console.error('Failed to trigger order notification:', notifErr);
        }

        return res.status(201).json({
          message: 'Order placed successfully',
          orderId
        });
      }
    );

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      message: 'Server Error',
      error
    });
  }
};

const getOrders = (req, res) => {

  const query = `
    SELECT *
    FROM orders
    ORDER BY created_at DESC
  `;

  db.query(query, (err, result) => {

    if (err) {
      console.log('GET ORDERS ERROR:', err);

      return res.status(500).json(err);
    }

    return res.status(200).json(result);
  });
};

const getUserOrders = (req, res) => {

  const userId = req.params.id;

  const query = `
    SELECT *
    FROM orders
    WHERE user_id = ?
    ORDER BY created_at DESC
  `;

  db.query(query, [userId], (err, result) => {

    if (err) {
      return res.status(500).json(err);
    }

    return res.status(200).json(result);
  });
};



const getOrderDetails = (req, res) => {

  const orderId = req.params.id;

  const query = `
    SELECT
      o.id AS order_id,
      o.customer_name,
      o.phone_number,
      o.address,
      o.total_amount,
      o.payment_method,
      o.order_status,
      o.created_at,

      oi.id AS order_item_id,
      oi.product_id,
      oi.product_name,
      oi.product_price,
      oi.quantity,
      oi.product_image,

      p.description,
      p.category,
      p.product_type

    FROM orders o

    LEFT JOIN order_items oi
      ON o.id = oi.order_id

    LEFT JOIN products p
      ON oi.product_id = p.id

    WHERE o.id = ?
  `;

  db.query(
    query,
    [orderId],
    (err, result) => {

      if (err) {

        console.log(
          'GET ORDER DETAILS ERROR:',
          err
        );

        return res.status(500).json(err);
      }

      return res.status(200).json(result);
    }
  );
};


const getRecentOrders = (req, res) => {

  const query = `
    SELECT
      o.id,
      o.customer_name,
      o.total_amount,
      o.order_status,
      oi.product_name

    FROM orders o

    LEFT JOIN order_items oi
      ON o.id = oi.order_id

    ORDER BY o.created_at DESC

    LIMIT 6
  `;

  db.query(query, (err, result) => {

    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }

    return res.status(200).json(result);
  });

};


const deleteOrder = (req, res) => {

  const orderId = req.params.id;

  db.query(
    "DELETE FROM order_items WHERE order_id = ?",
    [orderId],
    (err) => {

      if (err) {
        return res.status(500).json(err);
      }

      db.query(
        "DELETE FROM orders WHERE id = ?",
        [orderId],
        (err2) => {

          if (err2) {
            return res.status(500).json(err2);
          }

          return res.json({
            message: "Order deleted successfully"
          });
        }
      );
    }
  );
};



const updateOrderStatus = (req, res) => {
  const orderId = req.params.id;
  const { status } = req.body;

  if (!status || !['Accepted', 'Rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status. Status must be Accepted or Rejected.' });
  }

  // 1. Fetch order user_id and customer name
  const getOrderQuery = 'SELECT user_id, customer_name FROM orders WHERE id = ?';
  db.query(getOrderQuery, [orderId], (err, orderResults) => {
    if (err) {
      console.error('Error fetching order:', err);
      return res.status(500).json({ error: 'Database Error' });
    }
    if (orderResults.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const order = orderResults[0];
    const userId = order.user_id;

    // 2. Update order status
    const updateQuery = 'UPDATE orders SET order_status = ? WHERE id = ?';
    db.query(updateQuery, [status, orderId], (updateErr) => {
      if (updateErr) {
        console.error('Error updating order status:', updateErr);
        return res.status(500).json({ error: 'Database Error' });
      }

      // 3. Create user notification if user_id exists
      if (userId) {
        let title = '';
        let description = '';
        if (status === 'Accepted') {
          title = 'Order Accepted';
          description = `Your order #${orderId} has been accepted and is being processed.`;
        } else if (status === 'Rejected') {
          title = 'Order Rejected';
          description = `Unfortunately your order #${orderId} was rejected. Please contact support for more information.`;
        }

        try {
          const { createUserNotification } = require('../services/notificationService');
          createUserNotification(userId, title, description, 'order', orderId);
        } catch (notifErr) {
          console.error('Failed to create user notification:', notifErr);
        }
      }

      return res.status(200).json({ message: `Order status updated to ${status}` });
    });
  });
};

module.exports = {
  placeOrder,
  getOrders,
  getUserOrders,
  getOrderDetails,
  getRecentOrders,
  deleteOrder,
  updateOrderStatus
};