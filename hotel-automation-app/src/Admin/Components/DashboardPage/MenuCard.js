import React, { useEffect, useState } from 'react';
import '../../styles/DashboardPage/MenuCard.css'; // Assuming you have a CSS file for styling
import axios from 'axios';
import Sidebar from '../Sidebar';

const MenuCard = () => {
    const [menuItems, setMenuItems] = useState([]);

    // Hardcoded admin status
    const isAdmin = true; // Change this to `false` to simulate a non-admin user

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

    // Function to convert binary data to base64
    const arrayBufferToBase64 = buffer => {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        for (let i = 0; i < bytes.length; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    };

    // Function to determine the rating color
    const getRatingColor = rating => {
        if (rating >= 4.5) return 'high-rating';
        if (rating >= 3) return 'medium-rating';
        return 'low-rating';
    };

    const handleCardClick = (index) => {
        if (index === 5) {
            window.location.href = isAdmin ? '/menu' : '/adminlogin';
        }
    };

    return (
        <>
            {/* <Sidebar /> */}
            <div className="card-row">
                {menuItems.slice(0, 6).map((item, index) => (
                    <div key={index} className="card" onClick={() => handleCardClick(index)}>
                        {index !== 5 ? (
                            <>
                                {item.image && (
                                    <img
                                        src={`data:${item.image.contentType};base64,${arrayBufferToBase64(item.image.data.data)}`}
                                        alt={item.productName}
                                        className="menu-item-image"
                                    />
                                )}
                                <div className="card-content">
                                    <h3>{item.productName}</h3>
                                    <p>${item.price}</p>
                                    <span className={`rating-badge ${getRatingColor(item.averageRating)}`}>
                                        {item.averageRating.toFixed(1)} ★
                                    </span>
                                </div>
                            </>
                        ) : (
                            <div className="card-content">
                                <h3>Go to /ap</h3>
                            </div>
                        )}
                    </div>
                ))}
            </div></>
    );
};

export default MenuCard;
