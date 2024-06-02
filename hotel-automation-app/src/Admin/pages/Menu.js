import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Menu.css';

function Menu() {
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

  // Function to determine the rating color
  const getRatingColor = rating => {
    if (rating >= 4.5) return 'high-rating';
    if (rating >= 3) return 'medium-rating';
    return 'low-rating';
  };

  // Function to handle menu item deletion
  const handleDeleteMenuItem = async itemId => {
    try {
      await axios.delete(`http://localhost:5000/api/products/delete/${itemId}`);
      // Remove the deleted item from the menuItems state
      setMenuItems(menuItems.filter(item => item._id !== itemId));
      console.log('Menu item deleted successfully.');
    } catch (error) {
      console.error('Error deleting menu item:', error);
    }
  };

  return (
    <div className="menu-list-container">
      <div className="menu-list">
        {menuItems.map(item => (
          <div key={item._id} className="menu-item">
            <div className="menu-item-image">
              {item.image && (
                <img src={`data:${item.image.contentType};base64,${arrayBufferToBase64(item.image.data.data)}`} alt={item.productName} />
              )}
            </div>
            <div className="menu-item-details">
              <h3 className="menu-item-title">
                {item.productName}
                <span className={`rating-badge ${getRatingColor(item.averageRating)}`}>
                  {item.averageRating.toFixed(1)} <span className="star">★</span>
                </span>
              </h3>
              <p className="menu-item-description">{item.description}</p>
              <p className="menu-item-info">Price: ${item.price}</p>
              {/* Delete button */}
              <button className="but-delete-menu" onClick={() => handleDeleteMenuItem(item._id)} >Delete Item</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Menu;
