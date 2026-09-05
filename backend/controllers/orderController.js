

const db = require('../config/db');

const placeOrder = (req, res) => {
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

    if (!customer_name || !phone_number || !address || !total_amount) {
      return res.status(400).json({ message: 'Missing required order details' });
    }

    const generatedLuvyOrderId = `LUVY-ORD-${Date.now().toString().slice(-6)}`;

    const orderQuery = `
      INSERT INTO orders
      (
        luvy_order_id,
        user_id,
        customer_name,
        phone_number,
        address,
        total_amount,
        payment_method,
        order_status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      orderQuery,
      [
        generatedLuvyOrderId,
        user_id || null,
        customer_name,
        phone_number,
        address,
        total_amount,
        payment_method || 'Online',
        'Pending'
      ],
      (err, orderResult) => {
        if (err) {
          console.error('ORDER ERROR:', err);
          return res.status(500).json({ message: 'Failed to place order', error: err });
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

            const imageVal = typeof item.image === 'object' ? JSON.stringify(item.image) : (item.image || null);

            db.query(
              itemQuery,
              [
                orderId,
                item.id || item.product_id || null,
                item.product_name || item.name || 'Product',
                item.price || 0,
                item.quantity || 1,
                imageVal
              ],
              (itemErr) => {
                if (itemErr) {
                  console.error('ORDER ITEM INSERT ERROR:', itemErr);
                }
              }
            );

            // Deduct product stock
            if (item.id || item.product_id) {
              const productId = item.id || item.product_id;
              const qty = item.quantity || 1;
              db.query(
                'UPDATE products SET stock = GREATEST(0, stock - ?) WHERE id = ?',
                [qty, productId],
                (stockErr) => {
                  if (stockErr) console.error('STOCK DEDUCTION ERROR:', stockErr);
                }
              );
            }
          });
        }

        try {
          const { createAndBroadcastNotification } = require('../services/notificationService');
          createAndBroadcastNotification(
            'New Order Received',
            `Order #${generatedLuvyOrderId} placed by ${customer_name}`,
            'order',
            orderId
          );
        } catch (notifErr) {
          console.error('Failed to trigger order notification:', notifErr);
        }

        return res.status(201).json({
          message: 'Order placed successfully',
          orderId,
          luvy_order_id: generatedLuvyOrderId
        });
      }
    );
  } catch (error) {
    console.error('PLACE ORDER CATCH ERROR:', error);
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
      console.error('GET ORDERS ERROR:', err);
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
      o.luvy_order_id,
      o.user_id,
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

      p.luvy_product_id,
      p.description,
      p.category,
      p.product_type

    FROM orders o

    LEFT JOIN order_items oi
      ON o.id = oi.order_id

    LEFT JOIN products p
      ON oi.product_id = p.id

    WHERE o.id = ? OR o.luvy_order_id = ?
  `;

  db.query(query, [orderId, orderId], (err, result) => {
    if (err) {
      console.error('GET ORDER DETAILS ERROR:', err);
      return res.status(500).json(err);
    }
    return res.status(200).json(result);
  });
};

const getRecentOrders = (req, res) => {
  const query = `
    SELECT
      o.id,
      o.luvy_order_id,
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
      console.error('GET RECENT ORDERS ERROR:', err);
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

  if (!status || !['Accepted', 'Rejected', 'Pending', 'Delivered', 'Processing'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value.' });
  }

  const getOrderQuery = 'SELECT id, luvy_order_id, user_id, customer_name FROM orders WHERE id = ?';
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
    const luvyOrderId = order.luvy_order_id || `#${orderId}`;

    const updateQuery = 'UPDATE orders SET order_status = ? WHERE id = ?';
    db.query(updateQuery, [status, orderId], (updateErr) => {
      if (updateErr) {
        console.error('Error updating order status:', updateErr);
        return res.status(500).json({ error: 'Database Error' });
      }

      if (userId) {
        let title = '';
        let description = '';
        if (status === 'Accepted') {
          title = 'Order Accepted';
          description = `Your order ${luvyOrderId} has been accepted and is being processed.`;
        } else if (status === 'Rejected') {
          title = 'Order Rejected';
          description = `Unfortunately your order ${luvyOrderId} was rejected. Please contact support.`;
        } else {
          title = `Order Status: ${status}`;
          description = `Your order ${luvyOrderId} is now ${status}.`;
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