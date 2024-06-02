import React from 'react'
import '../styles/Sidebar.css'
import { Link } from 'react-router-dom'


function Sidebar() {
    return (
        <>
            <div className='sidebar1'>
                <div className='content'>
                    <Link to="/" className='dashboard-but'>
                        <h3 style={{ margin: '0' }}><i className="fas fa-user-circle"></i>  Dashboard</h3>
                    </Link>
                    <Link to="/add-product" className='dashboard-but'>
                        <h3 style={{ margin: '0' }}><i className="fas fa-cart-plus"></i>  Adding Product</h3>
                    </Link>
                    <Link to="/review" className='dashboard-but'>
                        <h3 style={{ margin: '0' }}><i className="fa fa-star-o" ></i>  Review</h3>
                    </Link>
                    <Link to="/menu" className='dashboard-but'>
                        <h3 style={{ margin: '0' }}><i class="fa fa-bars" aria-hidden="true"></i>  Menu</h3>
                    </Link>
                    <Link to="/userProfile" className='dashboard-but'>
                        <h3 style={{ margin: '0' }}><i className="fas fa-user-cog"></i>  UserProfile</h3>
                    </Link>
                    <Link to="/manage-user" className='dashboard-but'>
                        <h3 style={{ margin: '0' }}><i className="fas fa-user-edit"></i>  Manage People</h3>
                    </Link>

                </div>

            </div>


        </>
    )
}

export default Sidebar
