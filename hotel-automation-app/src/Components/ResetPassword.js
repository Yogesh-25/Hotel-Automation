// frontend/src/components/ResetPassword.js
import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function ResetPassword() {
    const { token } = useParams();
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:5000/api/reset-password/${token}`, { otp, password });
            setMessage(response.data.message);
        } catch (error) {
            setError(error.response.data.message || 'An error occurred');
        }
    };

    return (
        <div>
            <h1>Reset Password</h1>
            {message && <p>{message}</p>}
            {error && <p>{error}</p>}
            <form onSubmit={handleSubmit}>
                <label>
                    OTP:
                    <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} />
                </label>
                <label>
                    New Password:
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </label>
                <button type="submit">Reset Password</button>
            </form>
        </div>
    );
}

export default ResetPassword;
