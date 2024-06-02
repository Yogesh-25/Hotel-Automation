import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import '../styles/Menu.css';
import Cart from './Cart';
import SignInModal from './SignInModal';
import ReviewModal from './ReviewModel'; // Correct the import path
import { AuthContext } from '../context/AuthContext';

function Menu() {
    const { username } = useContext(AuthContext);
    const [menuItems, setMenuItems] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [showCart, setShowCart] = useState(false);
    const [isSignInModalOpen, setSignInModalOpen] = useState(false);
    const [isReviewModalOpen, setReviewModalOpen] = useState(false);
    const [selectedMenuItem, setSelectedMenuItem] = useState(null);

    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/products/showmenu');
                const items = response.data;

                // Fetch average ratings for each item
                const itemsWithRatings = await Promise.all(items.map(async item => {
                    const ratingResponse = await axios.get(`http://localhost:5000/api/reviews/average/${item._id}`);
                    return {
                        ...item,
                        averageRating: ratingResponse.data.averageRating
                    };
                }));

                setMenuItems(itemsWithRatings);
            } catch (error) {
                console.error('Error fetching menu items:', error);
            }
        };

        fetchMenuItems();
    }, []);

    const arrayBufferToBase64 = (buffer) => {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        for (let i = 0; i < bytes.length; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    };

    const addToCart = (itemId) => {
        setCartItems((prevCartItems) => ({
            ...prevCartItems,
            [itemId]: (prevCartItems[itemId] || 0) + 1
        }));
    };

    const removeFromCart = (itemId) => {
        setCartItems((prevCartItems) => {
            const newCartItems = { ...prevCartItems };
            if (newCartItems[itemId] > 0) {
                newCartItems[itemId] -= 1;
                if (newCartItems[itemId] === 0) {
                    delete newCartItems[itemId];
                }
            }
            return newCartItems;
        });
    };

    const toggleCart = () => {
        setShowCart((prevShowCart) => !prevShowCart);
    };

    const handleReviewClick = (item) => {
        if (!username) {
            setSignInModalOpen(true);
        } else {
            setSelectedMenuItem(item);
            setReviewModalOpen(true);
        }
    };

    const closeModal = () => {
        setSignInModalOpen(false);
        setReviewModalOpen(false);
    };

    const calculateTotalAmount = () => {
        return Object.entries(cartItems).reduce((total, [itemId, count]) => {
            const item = menuItems.find(item => item._id === itemId);
            return total + (item ? item.price * count : 0);
        }, 0);
    };

    const handleReviewSubmit = async (reviewData) => {
        try {
            // Fetch the user details by username
            const userResponse = await axios.get(`http://localhost:5000/by-username/${username}`);
            const userId = userResponse.data._id;

            // Submit the review with userId
            await axios.post('http://localhost:5000/api/reviews', {
                menuItemId: selectedMenuItem._id,
                userId: userId, // Add userId to the payload
                username: username,
                rating: reviewData.rating,
                feedback: reviewData.feedback
            });

            console.log('Review submitted successfully');
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    };

    // Function to determine the rating color
    const getRatingColor = (rating) => {
        if (rating >= 4.5) return 'high-rating';
        if (rating >= 3) return 'medium-rating';
        return 'low-rating';
    };

    // Group menu items by category
    const groupedMenuItems = menuItems.reduce((groups, item) => {
        const category = item.category;
        if (!groups[category]) {
            groups[category] = [];
        }
        groups[category].push(item);
        return groups;
    }, {});

    return (
        <div className="menu-list-container">
            {Object.entries(groupedMenuItems).map(([category, items]) => (
                <div key={category} className="category">
                    <h2 className="category-name">{category}</h2>
                    <div className="menu-list">
                        {items.map((item) => (
                            <div key={item._id} className="menu-item">
                                <div className="menu-item-image">
                                    {item.image && (
                                        <img src={`data:${item.image.contentType};base64,${arrayBufferToBase64(item.image.data.data)}`} alt={item.productName} />
                                    )}
                                </div>
                                <div className="menu-item-details">
                                    <div className="menu-item-title">
                                        <h3 className='prodName'>{item.productName}</h3>
                                        <div className={`rating-badge ${getRatingColor(item.averageRating)}`}>
                                            {item.averageRating.toFixed(1)} <span className="star">★</span>
                                        </div>
                                    </div>
                                    <p className="menu-item-info">Price:&nbsp; ₹<span>{item.price}</span></p>

                                    <p className="menu-item-description">{item.description}</p>
                                    <div className="cart-controls">
                                        {cartItems[item._id] > 0 ? (
                                            <div className="item-count">
                                                <button onClick={() => removeFromCart(item._id)} className="remove-from-cart-button">-</button>
                                                <span className="count">{cartItems[item._id]}</span>
                                                <button onClick={() => addToCart(item._id)} className="add-to-cart-button">+</button>
                                            </div>
                                        ) : (
                                            <button onClick={() => addToCart(item._id)} className="add-btn">Add to Cart</button>
                                        )}
                                        <button onClick={() => handleReviewClick(item)} className="remove-btn">Give Review</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            <div className="cart-buttons">
                <button onClick={toggleCart} className="show-cart-button">
                    {showCart ? 'Hide Cart' : 'Show Cart'}
                </button>
            </div>

            {showCart && (
                <div className="cart-list">
                    <h2>Cart Items</h2>
                    {Object.keys(cartItems).length > 0 ? (
                        <>
                            <ul className="cart-item-ul">
                                {Object.entries(cartItems).map(([itemId, count]) => (
                                    <Cart
                                        key={itemId}
                                        item={menuItems.find((item) => item._id === itemId)}
                                        count={count}
                                        addToCart={addToCart}
                                        removeFromCart={removeFromCart}
                                    />
                                ))}
                            </ul>
                            <div className="total-amount">
                                <h3>Total Amount: ₹{calculateTotalAmount().toFixed(2)}</h3>
                            </div>
                        </>
                    ) : (
                        <p>Your cart is empty.</p>
                    )}
                </div>
            )}

            <SignInModal isOpen={isSignInModalOpen} onClose={closeModal} />
            <ReviewModal isOpen={isReviewModalOpen} onClose={closeModal} onReviewSubmit={handleReviewSubmit} />
        </div>
    );
}
export default Menu;
/*

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import '../styles/Menu.css';
import Cart from './Cart';
import SignInModal from './SignInModal';
import ReviewModal from './ReviewModel';
import { AuthContext } from '../context/AuthContext';

function Menu() {
    const { username } = useContext(AuthContext);
    const [menuItems, setMenuItems] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [showCart, setShowCart] = useState(false);
    const [isSignInModalOpen, setSignInModalOpen] = useState(false);
    const [isReviewModalOpen, setReviewModalOpen] = useState(false);
    const [selectedMenuItem, setSelectedMenuItem] = useState(null);

    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/products/showmenu');
                const items = response.data;

                const itemsWithRatings = await Promise.all(items.map(async item => {
                    const ratingResponse = await axios.get(`http://localhost:5000/api/reviews/average/${item._id}`);
                    return {
                        ...item,
                        averageRating: ratingResponse.data.averageRating
                    };
                }));

                setMenuItems(itemsWithRatings);
            } catch (error) {
                console.error('Error fetching menu items:', error);
            }
        };

        fetchMenuItems();
    }, []);

    const arrayBufferToBase64 = (buffer) => {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        for (let i = 0; i < bytes.length; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    };

    const addToCart = (itemId) => {
        setCartItems((prevCartItems) => ({
            ...prevCartItems,
            [itemId]: (prevCartItems[itemId] || 0) + 1
        }));
    };

    const removeFromCart = (itemId) => {
        setCartItems((prevCartItems) => {
            const newCartItems = { ...prevCartItems };
            if (newCartItems[itemId] > 0) {
                newCartItems[itemId] -= 1;
                if (newCartItems[itemId] === 0) {
                    delete newCartItems[itemId];
                }
            }
            return newCartItems;
        });
    };

    const toggleCart = () => {
        setShowCart((prevShowCart) => !prevShowCart);
    };

    const handleReviewClick = (item) => {
        if (!username) {
            setSignInModalOpen(true);
        } else {
            setSelectedMenuItem(item);
            setReviewModalOpen(true);
        }
    };

    const closeModal = () => {
        setSignInModalOpen(false);
        setReviewModalOpen(false);
    };

    const calculateTotalAmount = () => {
        return Object.entries(cartItems).reduce((total, [itemId, count]) => {
            const item = menuItems.find(item => item._id === itemId);
            return total + (item ? item.price * count : 0);
        }, 0);
    };

    const handleReviewSubmit = async (reviewData) => {
        try {
            const userResponse = await axios.get(`http://localhost:5000/by-username/${username}`);
            const userId = userResponse.data._id;

            await axios.post('http://localhost:5000/api/reviews', {
                menuItemId: selectedMenuItem._id,
                userId: userId,
                username: username,
                rating: reviewData.rating,
                feedback: reviewData.feedback
            });

            console.log('Review submitted successfully');
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    };

    const getRatingColor = (rating) => {
        if (rating >= 4.5) return 'high-rating';
        if (rating >= 3) return 'medium-rating';
        return 'low-rating';
    };

    const groupedMenuItems = menuItems.reduce((groups, item) => {
        const category = item.category;
        if (!groups[category]) {
            groups[category] = [];
        }
        groups[category].push(item);
        return groups;
    }, {});

    const sortedCategories = Object.keys(groupedMenuItems).sort();

    return (
        <div className="menu-list-container">
            {sortedCategories.map((category) => (
                <div key={category} className="category">
                    <h2 className="category-name">{category}</h2>
                    <div className="menu-list">
                        {groupedMenuItems[category].map((item) => (
                            <div key={item._id} className="menu-item">
                                <div className="menu-item-image">
                                    {item.image && (
                                        <img src={`data:${item.image.contentType};base64,${arrayBufferToBase64(item.image.data.data)}`} alt={item.productName} />
                                    )}
                                </div>
                                <div className="menu-item-details">
                                    <h3>{item.productName}</h3>
                                    <p>{item.description}</p>
                                    <p>Price: ${item.price}</p>
                                    <p className={getRatingColor(item.averageRating)}>Rating: {item.averageRating}</p>
                                    <button onClick={() => addToCart(item._id)}>Add to Cart</button>
                                    <button onClick={() => handleReviewClick(item)}>Leave a Review</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
            <div className="cart-container">
                <button className="cart-button" onClick={toggleCart}>Cart</button>
                {showCart && <Cart cartItems={cartItems} menuItems={menuItems} removeFromCart={removeFromCart} calculateTotalAmount={calculateTotalAmount} />}
            </div>
            {isSignInModalOpen && <SignInModal closeModal={closeModal} />}
            {isReviewModalOpen && <ReviewModal closeModal={closeModal} handleReviewSubmit={handleReviewSubmit} />}
        </div>
    );
}

export default Menu;
*/