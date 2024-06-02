import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/UserReview.css'; // Import the CSS file

const UserReview = () => {
    const [loading, setLoading] = useState(true);
    const [userD, setUserD] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userReviews, setUserReviews] = useState([]);
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/users');
                setUserD(response.data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        const fetchReviews = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/reviews');
                const reviewsData = response.data;

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

        fetchUsers();
        fetchReviews();
    }, []);

    const handleDeleteProfile = async (userId) => {
        try {
            await axios.delete(`http://localhost:5000/api/users/${userId}`);
            const updatedUsers = userD.filter(user => user._id !== userId);
            setUserD(updatedUsers);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCardClick = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:5000/user/${userId}`);
            setUserReviews(response.data);

            const selectedUser = userD.find(user => user._id === userId);
            setSelectedUser(selectedUser);
        } catch (error) {
            console.error('Error fetching user reviews:', error);
        }
    };

    const closeReviews = () => {
        setSelectedUser(null);
        setUserReviews([]);
    };

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

    const formatDate = (dateTimeString) => {
        if (!dateTimeString) return "";
        const dateObj = new Date(dateTimeString);
        if (isNaN(dateObj.getTime())) return "";
        return dateObj.toISOString().slice(0, 19).replace('T', ' ');
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="review-modal">
            <div className="review-modal-content">
                <div className="header-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3>Reviews {selectedUser && `for ${selectedUser.username}`}</h3>
                    <button className="close-btn" onClick={closeReviews}>X</button>
                </div>

                {userReviews.length > 0 ? (
                    <ul>
                        {reviews.map(review => (
                            review.username === (selectedUser && selectedUser.username) && (
                                <div key={review._id} className="review-item">
                                    {review.product?.image && (
                                        <img
                                            src={`data:${review.product.image.contentType};base64,${arrayBufferToBase64(review.product.image.data.data)}`}
                                            alt={review.product.productName}
                                            className="review-product-image"
                                        />
                                    )}
                                    <p className="menu-item-title1">
                                        <b>{review.product?.productName}</b>
                                        <p>(Rs-{review.product?.price})</p>
                                        <span className={`rating-badge ${getRatingColor(review.rating)}`}>
                                            {review.rating.toFixed(1)} <span className="star">★</span>
                                        </span>
                                    </p>
                                    <p>UserName: {review.username}</p>
                                    <p className="review-feedback">Feedback: {review.feedback}</p>
                                </div>
                            )
                        ))}
                    </ul>
                ) : (
                    <p>No reviews found {selectedUser && `for ${selectedUser.username}`}</p>
                )}
            </div>
        </div>
    );
};

export default UserReview;
