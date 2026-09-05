



const db = require("../config/db");





// const addReview = (req, res) => {

//   const {
//     user_id,
//     customer,
//     product,
//     rating,
//     review
//   } = req.body;

//   const query = `
//     INSERT INTO reviews
//     (
//       user_id,
//       customer,
//       product,
//       rating,
//       review
//     )
//     VALUES (?, ?, ?, ?, ?)
//   `;

//   db.query(
//     query,
//     [
//       user_id,
//       customer,
//       product,
//       rating,
//       review
//     ],
//     (err, result) => {

//       if (err) {
//         console.log("Review Insert Error:", err);
//         return res.status(500).json(err);
//       }

//       res.json({
//         message: "Review added successfully"
//       });
//     }
//   );
// };



const addReview = (req, res) => {

  const {
    user_id,
    customer,
    product,
    rating,
    review
  } = req.body;

  const query = `
    INSERT INTO reviews
    (
      user_id,
      customer,
      product,
      rating,
      review
    )
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [
      user_id,
      customer,
      product,
      rating,
      review
    ],
    (err, result) => {

      if (err) {
        console.log("Review Insert Error:", err);
        return res.status(500).json(err);
      }

      const reviewId = result.insertId;
      try {
        const { createAndBroadcastNotification } = require('../services/notificationService');
        createAndBroadcastNotification(
          'New Product Review Submitted',
          `New Product Review Submitted by ${customer} for product ${product}`,
          'review',
          reviewId
        );
      } catch (notifErr) {
        console.error('Failed to trigger review notification:', notifErr);
      }

      res.json({
        message: "Review added successfully"
      });
    }
  );
};

const getReviews = (req, res) => {

  db.query(
    "SELECT * FROM reviews ORDER BY id DESC",
    (err, result) => {

      if (err) {
        return res.status(500).json(err);
      }

      res.json(result);
    }
  );
};

module.exports = {
  addReview,
  getReviews
};