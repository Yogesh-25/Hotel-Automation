import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import '../styles/SignInModal.css';
import backgroundImageUser from '../Images/login4.jpeg';

const SignInModal = ({ isOpen, onClose }) => {
    const [isRegistering, setIsRegistering] = useState(false);

    const { signIn } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [isOtpVerified, setIsOtpVerified] = useState(false);
    const [otpExpiration, setOtpExpiration] = useState(null);
    const [isSendOtp, setIsSendOtp] = useState(false);

    const validateInput = () => {
        if (!email || (!password && !isForgotPassword)) {
            setError('Email and Password are required.');
            return false;
        }
        setError('');
        return true;
    };

    const handleRegister = async () => {
        setError('');
        if (!validateInput()) return;
        setError('');
        try {
            const response = await axios.post('http://localhost:5000/register', {
                username,
                email,
                password
            });
            if (response.data.success) {
                setError('');
                signIn(response.data.username, email);
                setMessage('Register successful');
                onClose();
                window.location.href = '/'; // Redirect to home page
            } else {
                setError('');
                setMessage(`Error registering user: ${response.data.message}`);
            }
        } catch (error) {
            setMessage(`Error registering user: ${error.response?.data?.message || error.message}`);
        }
    };

    const handleLogin = async () => {
        setError('');
        if (!validateInput()) return;
        setError('');
        try {
            const response = await axios.post('http://localhost:5000/login', {
                email,
                password
            });
            if (response.data.success) {
                setError('');

                setMessage('Login successful');
                signIn(response.data.username, email);
                onClose();
                window.location.href = '/'; // Redirect to home page
            } else {
                setMessage(`Error logging in: ${response.data.message}`);
            }
        } catch (error) {
            setMessage(`Error logging in: ${error.response?.data?.message || error.message}`);
        }
    };

    const handleLoginAdmin = () => {
        window.location.href = 'http://localhost:3000/login';
    }

    const handleForgotPassword = async () => {
        setError('');
        if (!email) {
            setError('Email is required.');
            return;
        }
        // setError('');
        try {
            const response = await axios.post('http://localhost:5000/api/send-otp', {
                email,
            });
            if (response.data.success) {
                setError('');

                setMessage('OTP sent to email.');
                setIsSendOtp(true);
                setOtpExpiration(5 * 60); // Set expiration time to 5 minutes from now in seconds
            } else {
                setError('');
                setError(`Error: ${response.data.message}`);
            }
        } catch (error) {
            setError(`Error sending OTP: ${error.response?.data?.message || error.message}`);
        }
    };

    const handleVerifyOTP = async () => {
        try {
            setError('');
            const response = await axios.post('http://localhost:5000/api/verify-otp', { email, otp });
            if (response.data.success) {
                setError('');

                setMessage('OTP verified successfully.');
                setIsOtpVerified(true);
            } else {
                setError(response.data.message);
            }
        } catch (error) {
            setError(`Error verifying OTP: ${error.response?.data?.message || error.message}`);
        }
    };

    const handleResetPassword = async () => {
        try {
            setError('');
            const response = await axios.put(`http://localhost:5000/api/reset-password/${email}`, { password: newPassword });
            if (response.data.success) {

                setError('');
                setMessage('Password reset successfully.');
                setIsOtpVerified(false);
                setIsForgotPassword(false);
                setIsSendOtp(false);
                setError('');
            } else {
                setError('');
                setError(response.data.message);
            }
        } catch (error) {
            setError(`Error resetting password: ${error.response?.data?.message || error.message}`);
        }
    };

    // Timer function to update OTP expiration time every second
    useEffect(() => {
        let interval;
        if (otpExpiration > 0) {
            interval = setInterval(() => {
                setOtpExpiration(prevExpiration => prevExpiration - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [otpExpiration]);

    // Function to format remaining time as "MM:SS"
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    const handleToggleForm = () => {
        setIsRegistering(!isRegistering);

        setIsForgotPassword(false); // Ensure isForgotPassword is reset
    };

    return (
        <div className='model-container'>

            <div className={`modal ${isOpen ? 'open' : ''}`}>
                {/* <img src={backgroundImageUser} alt="Background" className="background-image-userlogin" /> */}
                <div className="modal-content">

                    <span className="close-button" onClick={onClose}>&times;</span>
                    <span className="modal-close" onClick={onClose}>X</span>
                    <h2>{isForgotPassword ? 'Forgot Password' : isRegistering ? 'Register' : 'Sign In'}</h2>
                    <form className="sign-in-form">
                        {!isForgotPassword && isRegistering && (
                            <div className="form-group">
                                <label htmlFor="username">Username:</label>
                                <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                            </div>
                        )}
                        <div className="form-group">
                            <label htmlFor="email">Email : </label>
                            <input className='inp-email' type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        {!isForgotPassword && (
                            <div className="form-group">
                                <label htmlFor="password">Password:</label>
                                <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            </div>
                        )}
                        {isForgotPassword && (
                            <>
                                <div className="form-group">
                                    <button className='but-send-otp' type="button" onClick={handleForgotPassword}>Send OTP</button>
                                    <br />

                                </div>
                                {isSendOtp && (
                                    <><div className="form-group">
                                        <label htmlFor="otp">OTP :</label>
                                        <input type="text" id="otp" value={otp} onChange={(e) => setOtp(e.target.value)} />
                                        <br />
                                        <button className='but-verify-otp' type="button" onClick={handleVerifyOTP}>Verify OTP</button>
                                        {!isOtpVerified && otpExpiration && (
                                            <p>OTP will expire in: {formatTime(otpExpiration)}</p>
                                        )}
                                        <br />
                                    </div>
                                    </>
                                )

                                }

                                {isOtpVerified && (
                                    <div className="form-group">
                                        <label htmlFor="newPassword">New Password:</label>
                                        <input type="password" id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                                        <button className='but-reset-password' type="button" onClick={handleResetPassword}>Reset Password</button>
                                    </div>
                                )}
                            </>
                        )}
                        <div className="form-group">
                            {!isForgotPassword && (isRegistering ? (
                                <>
                                    <button className='but-register' type="button" onClick={handleRegister}>Register</button>
                                    <button className='but-sign' type="button" onClick={handleToggleForm}>Sign In</button>
                                    <button className='but-adminsign' type="button" onClick={handleLoginAdmin}>Admin Login</button>

                                </>
                            ) : (
                                <>
                                    <button className='but-sign' type="button" onClick={handleLogin}>Sign In</button>
                                    <button className='but-register' type="button" onClick={handleToggleForm}>Register</button>
                                    <button className='but-adminsign' type="button" onClick={handleLoginAdmin}>Admin Login</button>
                                </>
                            ))}

                            {/* <button className='but-adminsign' type="button" onClick={handleLoginAdmin}>Admin Login</button> */}

                        </div>
                        {!isForgotPassword && (
                            <>
                                <a href='#' onClick={() => setIsForgotPassword(true)}> Forgot password?</a>
                                {/* <button type="button" onClick={() => setIsForgotPassword(true)}>Forgot Password?</button> */}
                            </>

                        )}
                        {message && <p className="message">{message}</p>}
                        {error && <p className="error">{error}</p>}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignInModal;
