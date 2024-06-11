import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// import '../styles/ForgotPassword.css';

function ForgotPassword() {
    const [mobile, setMobile] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [step, setStep] = useState(1);
    const navigate = useNavigate();

    const handleSendOtp = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5000/api/send-otp', {
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ mobile }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('OTP sent to your mobile number');
                setStep(2);
            } else {
                alert(data.message || 'Error sending OTP');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error sending OTP');
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5000/api/verify-otp', {
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ mobile, otp, newPassword }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Password reset successful');
                navigate('/login');
            } else {
                alert(data.message || 'Error verifying OTP');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error verifying OTP');
        }
    };

    return (
        <div className="forgot-password-container">
            {step === 1 ? (
                <form onSubmit={handleSendOtp}>
                    <h2>Forgot Password</h2>
                    <div>
                        <label>Mobile Number: </label>
                        <input
                            type="text"
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value)}
                        />
                    </div>
                    <button type="submit">Send OTP</button>
                </form>
            ) : (
                <form onSubmit={handleVerifyOtp}>
                    <h2>Verify OTP</h2>
                    <div>
                        <label>OTP: </label>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>New Password: </label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit">Verify OTP and Reset Password</button>
                </form>
            )}
        </div>
    );
}

export default ForgotPassword;