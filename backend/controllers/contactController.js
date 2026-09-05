const db = require("../config/db"); // your mysql connection file

const sendMessage = (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  const query = `
    INSERT INTO contact_messages
    (name, email, phone, subject, message)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [name, email, phone, subject, message],
    (err, result) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          success: false,
          message: "Database Error",
        });
      }

      const messageId = result.insertId;
      try {
        const { createAndBroadcastNotification } = require('../services/notificationService');
        createAndBroadcastNotification(
          'New Contact Message Received',
          `New Contact Message Received from ${name}`,
          'contact',
          messageId
        );
      } catch (notifErr) {
        console.error('Failed to trigger contact notification:', notifErr);
      }

      res.status(200).json({
        success: true,
        message: "Message sent successfully",
      });
    }
  );
};

const getMessages = (req, res) => {
  db.query(
    "SELECT * FROM contact_messages ORDER BY created_at DESC",
    (err, rows) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          success: false,
          message: "Database Error",
        });
      }

      res.status(200).json(rows);
    }
  );
};

module.exports = {
  sendMessage,
  getMessages,
};