import React, { useEffect, useState } from 'react';
import '../../styles/DashboardPage/MenuCard.css'; // Assuming you have a CSS file for styling
import axios from 'axios';
import { Link } from 'react-router-dom';

const MenuCard = () => {
    const [menuItems, setMenuItems] = useState([]);

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

    return (
        <>
            {/* <Sidebar /> */}
            <div className="card-row">
                {menuItems.slice(0, 6).map((item, index) => (
                    index !== 5 ? (
                        <div key={index} className="card">
                            {item.image && (
                                <img
                                    src={`data:${item.image.contentType};base64,${arrayBufferToBase64(item.image.data.data)}`}
                                    alt={item.productName}
                                    className="menu-item-image"
                                />
                            )}
                            <div className="card-content">
                                {/* <span>Rs.{item.price}</span> */}
                                <h4>{item.productName} (₹{item.price})</h4>
                                
                            </div>
                        </div>
                    ) : (
                        <Link to="/menu" key={index} className="card-content1 link-card button-card">
                            <h3>more&raquo;&raquo;</h3>
                        </Link>
                    )
                ))}
            </div>
        </>
    );
};

export default MenuCard;
