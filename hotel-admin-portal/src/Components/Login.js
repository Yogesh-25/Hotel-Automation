import React, { useState, useEffect } from 'react';
import { FaUser, FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import '../styles/Login.css';

function Login({ login }) {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [showOtpInput, setShowOtpInput] = useState(false);
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [dotCount, setDotCount] = useState(0);

    useEffect(() => {
        let interval;
        if (message.startsWith('Otp sending')) {
            interval = setInterval(() => {
                setDotCount(prevDotCount => (prevDotCount + 1) % 6);
            }, 400);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [message]);

    useEffect(() => {
        if (message.startsWith('Otp sending')) {
            const dots = '.'.repeat(dotCount);
            setMessage(`Otp sending${dots}`);
        }
    }, [dotCount]);

    const handleSubmit = async () => {
        try {
            setError("");
            setMessage("Otp sending.");
            const response = await axios.post('http://localhost:5000/api/admin/login', { email });
            if (response.data.success) {
                setShowOtpInput(true);
                setError("");
                setMessage("Otp sent successfully✅");
            } else {
                setMessage("");
                setError(response.data.message`⚠️` || 'Invalid email⚠️');
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage("");
            setError('Error logging in❗');
        }
    };

    const handleVerifyOTP = async () => {
        try {
            setMessage("Otp sending.");
            const response = await axios.post('http://localhost:5000/api/admin/verify-otp', { email, otp });
            if (response.data.success) {
                login(email);
                navigate('/dash');
            } else {
                setError("");
                setMessage("");
                setError(response.data.message`⚠️` || 'Invalid OTP❗');
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage("");
            setError('Error verifying OTP❗');
        }
    };

    return (
        <div className='login-container1'>
            <div className="login-container">
                <h2>Login</h2>
                {!showOtpInput ? (
                    <form onSubmit={handleSubmit}>
                        <div className='input-group'>
                            <FaUser className="icon" />
                            <input
                                type="email"
                                value={email}
                                placeholder='Email'
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <button type="submit">Send OTP</button>
                        {message && <p className="message">{message}</p>}
                        {error && <p className="error">{error}</p>}
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOTP}>
                        <div className='input-group'>
                            <FaLock className="icon" />
                            <input
                                type="text"
                                value={otp}
                                placeholder='Enter OTP'
                                onChange={(e) => setOtp(e.target.value)}
                            />
                        </div>
                        <button type="submit">Submit OTP</button>
                        {message && <p className="message">{message}</p>}
                        {error && <p className="error">{error}</p>}
                    </form>
                )}
            </div>
        </div>
    );
}

export default Login;
