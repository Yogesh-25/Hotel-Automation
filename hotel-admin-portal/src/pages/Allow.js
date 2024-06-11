import React, { useEffect, useState } from 'react';
import { useUser } from './UserContext';
import axios from 'axios';
import '../styles/Allow.css';

const Allow = () => {
  const { updateUser } = useUser();
  const [loading, setLoading] = useState(true);
  const [userD, setUserD] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userReviews, setUserReviews] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {

    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users');
        const userData = response.data;
        updateUser(userData);
        setUserD(userData);
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

    fetchReviews();

    fetchUsers();
  }, [updateUser]);

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
      console.log(selectedUser)
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

  // Function to determine the rating color
  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'high-rating';
    if (rating >= 3) return 'medium-rating';
    return 'low-rating';
  };

  const formatDate = (dateTimeString) => {
    if (!dateTimeString) return "";
    const dateObj = new Date(dateTimeString);
    if (isNaN(dateObj.getTime())) return ""; 
    const formattedDate = dateObj.toISOString().slice(0, 19).replace('T', ' ');
    return formattedDate;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <h2>All Users</h2>
      <div className='profile-card-container'>
        {userD.map(user => (
          <div key={user._id} className="card1" >
            <p>Username: {user.username}</p>
            <p>Email: {user.email}</p>
            <p>Time: {formatDate(user.createdAt)}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button className="delete-btn" onClick={() => handleDeleteProfile(user._id)}>Delete Profile</button>
              <button className="review-btn" onClick={() => handleCardClick(user._id)}>{user.username} review</button>
            </div>
          </div>
        ))}
      </div>
      {selectedUser && (
        <div className="review-modal">
          <div className="review-modal-content">
            <div className="header-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>Reviews for {selectedUser.username}</h3>
              <button className="close-btn" onClick={closeReviews}>X</button>
            </div>
            {userReviews.length > 0 ? (
              <ul>
                {reviews.map(review => (
                  review.username === selectedUser.username && (
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
              <p>No reviews found for this user.</p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Allow;
