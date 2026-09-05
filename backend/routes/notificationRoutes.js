const express = require('express');
const router = express.Router();
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  getUserNotifications,
  markUserAllAsRead,
} = require('../controllers/notificationController');

router.get('/', getNotifications);
router.get('/user/:userId', getUserNotifications);
router.put('/:id/read', markAsRead);
router.post('/read-all', markAllAsRead);
router.post('/user/:userId/read-all', markUserAllAsRead);

module.exports = router;
