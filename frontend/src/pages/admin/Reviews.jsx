import React, { useState, useEffect  } from 'react';
import axios from "axios";
import {
  Search,
  Star,
  Check,
  X
} from 'lucide-react';

export default function Reviews({
  reviewsData,
  onApproveReview,
  onRejectReview
}) {

  const [searchTerm, setSearchTerm] =
    useState('');
    const [reviews, setReviews] =
  useState([]);

  useEffect(() => {

  axios
    .get(
      "http://localhost:5000/api/reviews"
    )
    .then((res) => {

      setReviews(res.data);

    })
    .catch((err) => {

      console.log(err);

    });

}, []);

  const filteredReviews =
    reviews.filter((review) => {

//       useEffect(() => {

//   axios
//     .get(
//       "http://localhost:5000/api/reviews"
//     )
//     .then((res) => {

//       setReviews(
//         res.data
//       );

//     });

// }, []);

      return (
        review.customer
          .toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          ) ||

        review.product
          .toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          ) ||

        review.review
          .toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          )
      );
    });

  const renderStars = (rating) => {

    return (
      <div
        style={{
          display: 'flex',
          gap: '2px'
        }}
      >
        {[1, 2, 3, 4, 5].map(
          (star) => (
            <Star
              key={star}
              size={14}
              fill={
                star <= rating
                  ? '#facc15'
                  : 'transparent'
              }
              color="#facc15"
            />
          )
        )}
      </div>
    );
  };

  return (
    <div className="admin-animate-fade-in">

      {/* Header */}

      <div className="admin-page-header">

        <div className="admin-page-title-group">

          <h1 className="admin-page-title">
            Reviews
          </h1>

          <span className="admin-page-subtitle">
            Manage customer reviews
          </span>

        </div>

      </div>

      {/* Search */}

      <div
        className="admin-card"
        style={{
          padding: '16px',
          marginBottom: '20px'
        }}
      >

        <div
          style={{
            position: 'relative'
          }}
        >

          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '12px',
              top: '12px',
              color: '#888'
            }}
          />

          <input
            type="text"
            placeholder="Search reviews..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(
                e.target.value
              )
            }
            className="admin-form-input"
            style={{
              paddingLeft: '40px'
            }}
          />

        </div>

      </div>

      {/* Reviews Table */}

      <div className="admin-card">

        <div className="admin-table-container">

          <table className="admin-table">

            <thead>

              <tr>
                <th>Customer</th>
                <th>Product</th>
                <th>Rating</th>
                <th>Review</th>
                {/* <th>Status</th> */}
                {/* <th>Actions</th> */}
              </tr>

            </thead>

            <tbody>

              {filteredReviews.length > 0 ? (

                filteredReviews.map(
                  (review) => (

                    <tr
                      key={review.id}
                    >

                      <td>
                        {
                          review.customer
                        }
                      </td>

                      <td>
                        {
                          review.product
                        }
                      </td>

                      <td>
                        {
                          renderStars(
                            review.rating
                          )
                        }
                      </td>

                      <td
                        style={{
                          maxWidth:
                            '350px'
                        }}
                      >
                        {
                          review.review
                        }
                      </td>

                      <td>

                        {/* <span
                          className={`admin-badge ${
                            review.status ===
                            'Approved'
                              ? 'admin-badge-success'
                              : review.status ===
                                'Rejected'
                              ? 'admin-badge-danger'
                              : 'admin-badge-warning'
                          }`}
                        >
                          {
                            review.status
                          }
                        </span> */}

                      </td>

                      {/* <td>

                        <div
                          style={{
                            display:
                              'flex',
                            gap: '8px'
                          }}
                        >

                          <button
                            className="admin-btn admin-btn-secondary admin-btn-icon-only"
                            title="Approve"
                            onClick={() =>
                              onApproveReview(
                                review.id
                              )
                            }
                            style={{
                              width:
                                '32px',
                              height:
                                '32px',
                              color:
                                'green'
                            }}
                          >
                            <Check
                              size={14}
                            />
                          </button>

                          <button
                            className="admin-btn admin-btn-secondary admin-btn-icon-only"
                            title="Reject"
                            onClick={() =>
                              onRejectReview(
                                review.id
                              )
                            }
                            style={{
                              width:
                                '32px',
                              height:
                                '32px',
                              color:
                                'red'
                            }}
                          >
                            <X
                              size={14}
                            />
                          </button>

                        </div>

                      </td> */}

                    </tr>

                  )
                )

              ) : (

                <tr>

                  <td
                    colSpan="6"
                    style={{
                      textAlign:
                        'center',
                      padding:
                        '30px'
                    }}
                  >
                    No Reviews Found
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}