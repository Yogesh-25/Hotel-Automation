import React from 'react';
import '../styles/Navbar.css';

function Navbar({ user, logout }) {
    return (
        <nav className="navbar">
            <div className="navbar-left">
                <h1 className="website-name">Hotel Name</h1>
            </div>
            <div className="navbar-right">
                {/* <input type="text" placeholder="Search" className="search-bar" /> */}
                {user && (
                    <div className="user-info">
                        {/* <span className="username">{user}</span> */}
                        <button className="signin-button" title={user}>
                            <i className="fas fa-user-circle"></i>
                            {/* <span className='username'>{user}</span> */}
                        </button>
                        <button onClick={logout} className="signout-button">
                            Sign Out
                        </button>
                    </div>
                )}
                {!user && (
                    <button className="signin-button">
                        <i className="fas fa-user-circle"></i>
                    </button>
                )}
            </div>
        </nav>
    );
}

export default Navbar;