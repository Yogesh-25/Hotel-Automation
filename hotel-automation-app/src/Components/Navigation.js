import React, { useContext, useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import axios from 'axios';
import SignInModal from './SignInModal';
import { AuthContext } from '../context/AuthContext';
import '../styles/Navigation.css';

const Navigation = () => {
    const { username, useremail, signOut } = useContext(AuthContext);
    const [isMenuOpen, setMenuOpen] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);
    const [isUserInfoVisible, setUserInfoVisible] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [isReviewsModalOpen, setReviewsModalOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        if (username) {
            fetchUserReviews(username);
        }
        // Close menu on route change
        setMenuOpen(false);
    }, [username, location.pathname]);

    const toggleMenu = () => {
        setMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setMenuOpen(false);
    };

    const openModal = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const toggleUserInfo = () => {
        setUserInfoVisible(!isUserInfoVisible);
    };

    const fetchUserReviews = async (username) => {
        try {
            const userResponse = await axios.get(`http://localhost:5000/by-username/${username}`);
            const userId = userResponse.data._id;
            const reviewsResponse = await axios.get(`http://localhost:5000/user/${userId}`);

            const reviewsWithMenuDetails = await Promise.all(reviewsResponse.data.map(async (review) => {
                try {
                    const menuItemResponse = await axios.get(`http://localhost:5000/api/menu/${review.menuItemId}`);
                    return {
                        ...review,
                        menuItem: menuItemResponse.data
                    };
                } catch (error) {
                    console.error('Error fetching menu item details:', error);
                    return review;
                }
            }));

            setReviews(reviewsWithMenuDetails);
        } catch (error) {
            console.error('Error fetching user reviews:', error);
        }
    };

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

    const getRatingColor = (rating) => {
        if (rating >= 4.5) return 'high-rating';
        if (rating >= 3) return 'medium-rating';
        return 'low-rating';
    };

    return (
        <>
            <nav className="navigation">
                <div className="left-section">
                    <h1>
                        <NavLink
                            to="/"
                            exact
                            onClick={closeMenu}
                            activeClassName="active-link"
                        >
                            Hotel-Automation
                        </NavLink>
                    </h1>
                </div>
                <div className={`right-section ${isMenuOpen ? 'open' : ''}`}>
                    <div className="menu-icon" onClick={toggleMenu}>
                        <div className="menu-bar"></div>
                        <div className="menu-bar"></div>
                        <div className="menu-bar"></div>
                        <div className="menu-bar"></div>
                    </div>
                    {isMenuOpen && (
                        <div className="close-button" onClick={toggleMenu}>
                            <span>&times;</span>
                        </div>
                    )}
                    <ul className={`menu-links ${isMenuOpen ? 'open' : ''}`}>
                        <li>
                            <NavLink
                                to="/"
                                exact
                                onClick={closeMenu}
                                className={({ isActive }) => (isActive ? 'active-link' : '')}
                            >
                                Home
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/about"
                                onClick={closeMenu}
                                className={({ isActive }) => (isActive ? 'active-link' : '')}
                            >
                                About
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/contact"
                                onClick={closeMenu}
                                className={({ isActive }) => (isActive ? 'active-link' : '')}
                            >
                                Contact
                            </NavLink>
                        </li>
                        {username ? (
                            <>
                                <li>
                                    <span className="user-name" onClick={toggleUserInfo} style={{ cursor: 'pointer' }}>
                                        {username}
                                    </span>
                                    {isUserInfoVisible && (
                                        <div className="user-info-dropdown">
                                            <div className="user-info-item">
                                                <div className='user-info-drop'>
                                                    <span>Email: </span>
                                                    <span>{useremail || 'Email not available'}</span>
                                                </div>
                                                <button className='but-my-review' onClick={() => setReviewsModalOpen(true)}>My Reviews</button>
                                            </div>
                                        </div>
                                    )}
                                </li>
                                <li>
                                    <button onClick={signOut}>Sign Out</button>
                                </li>
                            </>
                        ) : (
                            <li>
                                <button onClick={openModal}>Sign In</button>
                            </li>
                        )}
                    </ul>
                </div>
            </nav>
            <SignInModal isOpen={isModalOpen} onClose={closeModal} />
            {isReviewsModalOpen && (
                <div className='main-page-model'>
                    <div className="modal open">
                        <div className="modal-content-login-review card">
                            <div className="main-review-header">
                                <h2>My Reviews</h2>
                                <div className="close-buttons">
                                    <span className="close-button" onClick={() => setReviewsModalOpen(false)}>&times;</span>
                                    <span className="modal-close" onClick={() => setReviewsModalOpen(false)}>X</span>
                                </div>
                            </div>
                            {reviews.length > 0 ? (
                                <ul>
                                    {reviews.map((review, index) => (
                                        <div className='main-page-review-item card-item' key={index}>
                                            {review.menuItem.image && (
                                                <img
                                                    src={`data:${review.menuItem.image.contentType};base64,${arrayBufferToBase64(review.menuItem.image.data.data)}`}
                                                    alt={review.menuItem.productName}
                                                    className="review-product-image"
                                                />
                                            )}
                                            <p className='main-page-item-title'>Menu Item: {review.menuItem.productName} (${review.menuItem.price})</p>
                                            <p>My Rating : <span className={`rating-badge ${getRatingColor(review.rating)}`}>
                                                {review.rating.toFixed(1)} <span className="star">★</span>
                                            </span></p>
                                            <p className="main-page-review-feedback">Feedback: {review.feedback}</p>
                                            <button className="remove-review-button" onClick={() => handleRemoveReview(review._id)}>Remove</button>
                                        </div>
                                    ))}
                                </ul>
                            ) : (
                                <p>No reviews found.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navigation;
