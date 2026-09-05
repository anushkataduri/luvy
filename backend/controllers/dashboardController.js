const db = require('../config/db');

const getDashboardStats = (req, res) => {

  const query = `
    SELECT
      (SELECT COUNT(*) FROM orders) AS totalOrders,
      (SELECT COUNT(*) FROM products) AS totalProducts,
      (SELECT COUNT(*) FROM users WHERE role = 'user') AS totalCustomers
  `;

  db.query(query, (err, result) => {

    if (err) {
      return res.status(500).json(err);
    }

    return res.status(200).json(result[0]);
  });
};

module.exports = {
  getDashboardStats
};