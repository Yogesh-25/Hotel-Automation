import React from 'react';
import '../styles/Cart.css';

function Cart({ item, count, addToCart, removeFromCart }) {
    const arrayBufferToBase64 = buffer => {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        for (let i = 0; i < bytes.length; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    };

    return (
        <li className="cart-item-container">
            <div className="cart-item">
                <div className="cart-item-image">
                    <img src={`data:${item.image.contentType};base64,${arrayBufferToBase64(item.image.data.data)}`} alt={item.productName} />
                </div>
                <div className="cart-item-details">
                    <h3 className="cart-item-title">{item.productName}</h3>
                    <p className="cart-item-info">Price: ₹{item.price}</p>
                    <p className="cart-item-info">Quantity: {count}</p>
                    <div className="cart-controls">
                        <button onClick={() => removeFromCart(item._id)} className="remove-from-cart-button">-</button>
                        <button onClick={() => addToCart(item._id)} className="add-to-cart-button">+</button>
                    </div>
                </div>
            </div>
        </li>
    );
}

export default Cart;
