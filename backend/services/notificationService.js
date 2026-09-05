const db = require('../config/db');
const { broadcast } = require('./websocket');

/**
 * Creates a notification, stores it in the database, and broadcasts it in real-time.
 * @param {string} title
 * @param {string} description
 * @param {string} type - 'order', 'contact', 'review'
 * @param {number|null} referenceId
 */
function createAndBroadcastNotification(title, description, type, referenceId = null) {
  const query = `
    INSERT INTO notifications (title, description, type, reference_id, is_read)
    VALUES (?, ?, ?, ?, 0)
  `;

  db.query(query, [title, description, type, referenceId], (err, result) => {
    if (err) {
      console.error('Failed to save notification in database:', err);
      return;
    }

    const newNotification = {
      id: result.insertId,
      title,
      description,
      type,
      reference_id: referenceId,
      is_read: 0,
      created_at: new Date().toISOString(),
    };

    console.log('Saved notification to database:', newNotification);

    // Broadcast to WebSocket clients
    broadcast({
      event: 'new_notification',
      data: newNotification,
    });
  });
}

function createUserNotification(userId, title, description, type, referenceId = null) {
  const query = `
    INSERT INTO notifications (user_id, title, description, type, reference_id, is_read)
    VALUES (?, ?, ?, ?, ?, 0)
  `;

  db.query(query, [userId, title, description, type, referenceId], (err, result) => {
    if (err) {
      console.error('Failed to save user notification in database:', err);
      return;
    }

    const newNotification = {
      id: result.insertId,
      user_id: userId,
      title,
      description,
      type,
      reference_id: referenceId,
      is_read: 0,
      created_at: new Date().toISOString(),
    };

    console.log('Saved user notification to database:', newNotification);

    // Broadcast to WebSocket clients
    broadcast({
      event: 'new_notification',
      data: newNotification,
    });
  });
}

module.exports = {
  createAndBroadcastNotification,
  createUserNotification,
};
