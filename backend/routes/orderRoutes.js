const express = require('express');

const router = express.Router();

const {
  placeOrder,
  getOrders,
  getUserOrders,
  getOrderDetails,
  getRecentOrders,
  deleteOrder,
  updateOrderStatus
} = require('../controllers/orderController');

router.post('/place', placeOrder);

router.get('/', getOrders);
router.get('/recent', getRecentOrders);
router.get('/user/:id', getUserOrders);
router.get('/:id', getOrderDetails);
router.put('/:id/status', updateOrderStatus);
router.delete('/:id', deleteOrder);
module.exports = router;