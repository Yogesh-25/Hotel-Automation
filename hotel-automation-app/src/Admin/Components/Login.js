import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import backgroundImage from '../Images/login5.jpg';

function Login({ login }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you should add real authentication logic
        if (username === 'admin' && password === 'admin') {
            login(username); // Pass username to login function
            navigate('/dash');
        } else {
            alert('Invalid credentials');
        }
    };

    return (
        <>
            <img src={backgroundImage} alt="Background" className="background-image-login" />

            <div className="login-container">

                <h2>Admin Login</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Username:  </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Password :  </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit">Login</button>
                </form>
            </div></>
    );
}

export default Login;

/*
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

function Login({ login }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/api/authenticate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                login(username); // Pass username to login function
                navigate('/dash');
            } else {
                alert(data.message || 'Invalid credentials');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error logging in');
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username: </label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label>Password: </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit">Login</button>
            </form>
            <button onClick={() => navigate('/forgot-password')}>Forgot Password</button>
        </div>
    );
}

export default Login;
*/