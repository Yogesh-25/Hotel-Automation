import React from 'react';
const CartItem = ({ item, count, addToCart, removeFromCart }) => {
    return (
        <div className="cart-item">
            <div className="cart-item-details">
                <div className="cart-item-title">
                    <h3>{item.productName}</h3>
                </div>
                <p className="cart-item-info">Price: ₹{item.price}</p>
                <p className="cart-item-description">{item.description}</p>
                <div className="cart-controls">
                    <div className="item-count">
                        <button onClick={() => removeFromCart(item._id)} className="remove-from-cart-button">-</button>
                        <span className="count">{count}</span>
                        <button onClick={() => addToCart(item._id)} className="add-to-cart-button">+</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartItem;
