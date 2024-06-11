import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import '../styles/Menu.css';
import Cart from './Cart';
import SignInModal from './SignInModal';
import ReviewModal from './ReviewModel';
import { AuthContext } from '../context/AuthContext';
import FoodCategoryRow from './FoodCategoryRow';

function Menu() {

    const { username } = useContext(AuthContext);
    const [menuItems, setMenuItems] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [showCart, setShowCart] = useState(true);
    const [isSignInModalOpen, setSignInModalOpen] = useState(false);
    const [isReviewModalOpen, setReviewModalOpen] = useState(false);
    const [selectedMenuItem, setSelectedMenuItem] = useState(null);
    const [usersId, setUserId] = useState(null);

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

    // const toggleCart = () => {
    //     setShowCart((prevShowCart) => !prevShowCart);
    // };

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
            setUserId(userId);
            // Submit the review with userId
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
        <>
            <div className="menu-list-container">
                <div className='food-category-row'>
                    <FoodCategoryRow categories={groupedMenuItems} />
                </div>
                {Object.entries(groupedMenuItems).map(([category, items]) => (
                    <>
                        <div key={category} className="category" id={category}>
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
                        </div></>
                ))}
                <div className="cart-buttons">
                    {/* <button className="show-cart-button"> show cart
                        {/* {showCart ? 'Hide Cart' : 'Show Cart'} }
                    </button> */}
                    <h2 className="category-name">🛒 Cart Item 🛒 </h2>
                </div>
                <div id="cart">
                    {showCart && (
                        <div className="cart-list">
                            {/* <h2>Cart Items</h2> */}
                            {Object.keys(cartItems).length > 0 ? (
                                <>
                                    <ul className="cart-item-ul">
                                        {Object.entries(cartItems).map(([itemId, count]) => (
                                            <Cart
                                                key={itemId}
                                                // userId={userId}
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
                </div>

                <SignInModal isOpen={isSignInModalOpen} onClose={closeModal} />
                <ReviewModal isOpen={isReviewModalOpen} onClose={closeModal} onReviewSubmit={handleReviewSubmit} />
            </div>
        </>
    );
}
export default Menu;