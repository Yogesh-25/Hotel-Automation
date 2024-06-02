import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Reviews.css'; // Import CSS file for Reviews component

function Review() {
  const [reviews, setReviews] = useState([]);
  const [sortCriteria, setSortCriteria] = useState({ field: 'date', order: 'desc' });

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/reviews');
        const reviewsData = response.data;

        // Fetch corresponding product details for each review
        const productPromises = reviewsData.map(review =>
          axios.get(`http://localhost:5000/api/menu/${review.menuItemId}`)
        );

        const productResponses = await Promise.all(productPromises);
        const reviewsWithProducts = reviewsData.map((review, index) => ({
          ...review,
          product: productResponses[index].data
        }));

        setReviews(reviewsWithProducts);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, []);

  const handleRemoveReview = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/reviews/${id}`);
      setReviews(prevReviews => prevReviews.filter(review => review._id !== id));
    } catch (error) {
      console.error('Error removing review:', error);
    }
  };

  const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };
  // Function to determine the rating color
  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'high-rating';
    if (rating >= 3) return 'medium-rating';
    return 'low-rating';
  };

  const handleSort = (field, order) => {
    setSortCriteria({ field, order });
    const sortedReviews = [...reviews].sort((a, b) => {
      if (field === 'rating') {
        return order === 'asc' ? a.rating - b.rating : b.rating - a.rating;
      } else if (field === 'date') {
        return order === 'asc' ? new Date(a.createdAt) - new Date(b.createdAt) : new Date(b.createdAt) - new Date(a.createdAt);
      }
      return 0;
    });
    setReviews(sortedReviews);
  };

  return (
    <div className="reviews-container">
      <h1 className="reviews-title">Reviews</h1>
      <div className="sort-options">
        <button onClick={() => handleSort('rating', 'asc')}>Sort by Rating Asc</button>
        <button onClick={() => handleSort('rating', 'desc')}>Sort by Rating Desc</button>
        <button onClick={() => handleSort('date', 'asc')}>Sort by Rating Date Asc</button>
        <button onClick={() => handleSort('date', 'desc')}>Sort by Rating Date Desc</button>
      </div>
      <div className="reviews-list">
        {reviews.map(review => (
          <div key={review._id} className="review-item">
            {review.product?.image && (
              <img
                src={`data:${review.product.image.contentType};base64,${arrayBufferToBase64(review.product.image.data.data)}`}
                alt={review.product.productName}
                className="review-product-image"
              />
            )}
            {/* <p className="review-product-name">{review.product?.productName} (RS-{review.product?.price})</p> */}
            <p className="menu-item-title1">
              <b>{review.product?.productName}</b>
              <p>(Rs-{review.product?.price})</p>
              <span className={`rating-badge ${getRatingColor(review.rating)}`}>
                {review.rating.toFixed(1)} <span className="star">★</span>
              </span>
            </p>
            <p>UserName: {review.username}</p>
            {/* <p className="review-rating">Rating: {review.rating}</p> */}
            <p className="review-feedback">Feedback: {review.feedback}</p>
            <button className="remove-review-button" onClick={() => handleRemoveReview(review._id)}>Remove</button>
            {/* <hr className="review-divider" /> */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Review;
