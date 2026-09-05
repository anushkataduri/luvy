const db = require('./db');

function setupDatabase() {
  return new Promise((resolve, reject) => {
    // 1. Check if profile_photo column exists in users
    const checkColumnQuery = "SHOW COLUMNS FROM users LIKE 'profile_photo'";
    db.query(checkColumnQuery, (err, results) => {
      if (err) {
        console.error('Error checking users table columns:', err);
        return reject(err);
      }

      if (results.length === 0) {
        // Add profile_photo column
        const addColumnQuery = "ALTER TABLE users ADD COLUMN profile_photo VARCHAR(255) DEFAULT NULL";
        db.query(addColumnQuery, (alterErr) => {
          if (alterErr) {
            console.error('Error adding profile_photo to users:', alterErr);
            return reject(alterErr);
          }
          console.log('Added profile_photo column to users table successfully.');
          createNotificationsTable();
        });
      } else {
        createNotificationsTable();
      }
    });

    function createNotificationsTable() {
      // 2. Create notifications table
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS notifications (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT DEFAULT NULL,
          title VARCHAR(255) NOT NULL,
          description TEXT NOT NULL,
          type VARCHAR(50) NOT NULL,
          reference_id INT DEFAULT NULL,
          is_read TINYINT(1) DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;
      db.query(createTableQuery, (err) => {
        if (err) {
          console.error('Error creating notifications table:', err);
          return reject(err);
        }
        
        // Ensure user_id column exists in notifications table
        const checkUserColumnQuery = "SHOW COLUMNS FROM notifications LIKE 'user_id'";
        db.query(checkUserColumnQuery, (colErr, colResults) => {
          if (colErr) {
            console.error('Error checking notifications table columns:', colErr);
            return reject(colErr);
          }
          if (colResults.length === 0) {
            const addUserColumnQuery = "ALTER TABLE notifications ADD COLUMN user_id INT DEFAULT NULL";
            db.query(addUserColumnQuery, (alterErr) => {
              if (alterErr) {
                console.error('Error adding user_id to notifications:', alterErr);
                return reject(alterErr);
              }
              console.log('Added user_id column to notifications table successfully.');
              resolve();
            });
          } else {
            console.log('Notifications table checked/created successfully.');
            resolve();
          }
        });
      });
    }
  });
}

module.exports = setupDatabase;
