import React from 'react';
import '../styles/RecentOrder.css';

const RecentTable = ({ orders }) => {
    return (
        <>
            <h2>Recent Order Table</h2>
            <div className="recent-order-table">
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Image</th>
                            <th>Product Name</th>
                            <th>Product ID</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Order Time</th>
                            <th>Customer</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>
                                    {order.image ? (
                                        <img src={`http://localhost:5000/api/products/image/${order.productName}`} alt={order.productName} />
                                    ) : (
                                        <span>No Image</span>
                                    )}
                                </td>
                                <td>{order.productName}</td>
                                <td>{order.productId}</td>
                                <td>{order.quantity}</td>
                                <td>${order.price}</td>
                                <td>{new Date(order.orderTime).toLocaleString()}</td>
                                <td>{order.customer}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default RecentTable;
