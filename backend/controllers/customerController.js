const db = require('../config/db');

const getCustomers = (req, res) => {

  const query = `
    SELECT
      id,
      fullname,
      email,
      phone,
      role
    FROM users
    WHERE role = 'user'
    ORDER BY id DESC
  `;

  db.query(query, (err, result) => {

    if (err) {
      return res.status(500).json(err);
    }

    return res.status(200).json(result);
  });
};

module.exports = {
  getCustomers
};