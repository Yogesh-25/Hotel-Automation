import React, { useEffect, useState } from 'react';
import '../styles/Dashboard.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import RecentTable from '../Components/RecentTable'
import MenuCard from './DashboardPage/MenuCard';
import ReviewCard from './DashboardPage/ReviewCard';

function Dashboard() {
    const [newUserCount, setNewUserCount] = useState(0);
    const [totalUserCount, setTotalUserCount] = useState(0);
    const [menuItems, setMenuItems] = useState();
    const [totalReviewCount, setTotalReviewCount] = useState(0);

    const [orders, setOrders] = useState([]);


    useEffect(() => {
        axios.get('http://localhost:5000/api/users/newcount')
            .then(response => {
                setNewUserCount(response.data.count);
            })
            .catch(error => {
                console.error('Error fetching new user count:', error);
            });

        axios.get('http://localhost:5000/api/users/totalcount')
            .then(response => {
                setTotalUserCount(response.data.totalCount);
            })
            .catch(error => {
                console.error('Error fetching total user count:', error);
            });

        axios.get('http://localhost:5000/api/products/count')
            .then(res => {
                setMenuItems(res.data.totalCount)
            })
            .catch(err => {
                console.log("Error totalcount", err);
            });

        axios.get('http://localhost:5000/api/reviews/totalcount')
            .then(response => {
                setTotalReviewCount(response.data.totalCount);
            })
            .catch(error => {
                console.error('Error fetching total review count:', error);
            });
        // Fetch orders from your API
        fetch('http://localhost:5000/api/orders')
            .then(response => response.json())
            .then(data => setOrders(data))
            .catch(error => console.error('Error fetching orders:', error));

    }, []);

    return (
        <div className='main-content'>
            <div className='row'>
                <div className='box'>
                    <h4>New User</h4>
                    <h2>{newUserCount}</h2>
                    <Link to="/userprofile">
                        <button>Click here to see</button>
                    </Link>
                </div>
                <div className='box'>
                    <h4>Total user</h4>
                    <h2>{totalUserCount}</h2>
                    <Link to="/userprofile">
                        <button>Click here to see</button>
                    </Link>
                </div>
                <div className='box'>
                    <h4>Total Product</h4>
                    <h2>{menuItems}</h2>
                    <Link to="/menu">
                        <button>Click here to see</button>
                    </Link>
                </div>
                <div className='box'>
                    <h4>Total Review</h4>
                    <h2>{totalReviewCount}</h2>
                    <Link to="/review">
                        <button>Click here to see</button>
                    </Link>
                </div>
            </div>
            <div className="recent-tab">
                {/* Render RecentTable component here */}
                {/* <RecentTable orders={orders} /> */}
                <h3>Menu</h3>
                <MenuCard />
                <h3 className='dash-review'>Reviews</h3>
                <ReviewCard />
            </div>
        </div>
    );
}

export default Dashboard;
