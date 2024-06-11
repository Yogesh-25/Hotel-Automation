import React, { useEffect, useState } from 'react';
import '../../styles/DashboardPage/ReviewCard.css';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ReviewCard = () => {
    const [reviews, setReviews] = useState([]);

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

    const arrayBufferToBase64 = (buffer) => {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        for (let i = 0; i < bytes.length; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    };

    const getRatingColor = (rating) => {
        if (rating >= 4.5) return 'high-rating';
        if (rating >= 3) return 'medium-rating';
        return 'low-rating';
    };

    // Keep track of unique product names
    const uniqueProductNames = new Set();

    return (
        <>
            <div className="review-card-row">
                {reviews
                    .slice(-5) // Get the last 5 reviews
                    .map((review, index) => (
                        <div key={review._id} className="review-card">
                            {review.product?.image && (
                                <img
                                    src={`data:${review.product.image.contentType};base64,${arrayBufferToBase64(review.product.image.data.data)}`}
                                    alt={review.product.productName}
                                    className="menu-item-image"
                                />
                            )}
                            <div className="review-card-content">
                                <h4>{review.product?.productName} (₹{review.product?.price})</h4>
                                <span className={`review-rating-badge ${getRatingColor(review.rating)}`}>
                                    {review.rating.toFixed(1)} <span className="star">★</span>
                                </span>
                            </div>
                        </div>
                    ))}
                <Link to="/review" className="review-link-card review-button-card">
                    <h3>more&raquo;&raquo;</h3>
                </Link>
            </div>
        </>
    );
};

export default ReviewCard;
