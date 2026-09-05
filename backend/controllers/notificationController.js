const db = require('../config/db');

// Get all notifications
const getNotifications = (req, res) => {
  const query = 'SELECT * FROM notifications ORDER BY created_at DESC';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching notifications:', err);
      return res.status(500).json({ error: 'Database Error' });
    }
    return res.status(200).json(results);
  });
};

// Mark single notification as read
const markAsRead = (req, res) => {
  const { id } = req.params;
  const query = 'UPDATE notifications SET is_read = 1 WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error marking notification as read:', err);
      return res.status(500).json({ error: 'Database Error' });
    }
    return res.status(200).json({ success: true, message: 'Notification marked as read' });
  });
};

// Mark all notifications as read
const markAllAsRead = (req, res) => {
  const query = 'UPDATE notifications SET is_read = 1';
  db.query(query, (err, result) => {
    if (err) {
      console.error('Error marking all notifications as read:', err);
      return res.status(500).json({ error: 'Database Error' });
    }
    return res.status(200).json({ success: true, message: 'All notifications marked as read' });
  });
};

// Get notifications for a specific user
const getUserNotifications = (req, res) => {
  const { userId } = req.params;
  const query = 'SELECT * FROM notifications WHERE user_id = ? OR user_id IS NULL ORDER BY created_at DESC';
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching user notifications:', err);
      return res.status(500).json({ error: 'Database Error' });
    }
    return res.status(200).json(results);
  });
};

// Mark all notifications as read for a specific user
const markUserAllAsRead = (req, res) => {
  const { userId } = req.params;
  const query = 'UPDATE notifications SET is_read = 1 WHERE user_id = ?';
  db.query(query, [userId], (err, result) => {
    if (err) {
      console.error('Error marking user notifications as read:', err);
      return res.status(500).json({ error: 'Database Error' });
    }
    return res.status(200).json({ success: true, message: 'All user notifications marked as read' });
  });
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  getUserNotifications,
  markUserAllAsRead,
};
