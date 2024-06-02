const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const jwt = require('jsonwebtoken');
const randomstring = require('randomstring');

const secretKey = 'dfad07d0558a3a33cf9cc0960280cd540316a456745e8458ab9c879f9331f71a';

exports.verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (user.resetPasswordOTP !== otp) {
            return res.status(400).json({ success: false, message: 'Invalid OTP' });
        }

        // Check if OTP has expired
        const otpExpiration = user.resetPasswordOTPExpiration;
        if (otpExpiration && otpExpiration < Date.now()) {
            return res.status(400).json({ success: false, message: 'OTP has expired' });
        }

        // OTP verified successfully
        user.resetPasswordOTP = ''; // Clear the OTP after verification
        user.resetPasswordOTPExpiration = null; // Clear the expiration time
        await user.save();

        res.status(200).json({ success: true, message: 'OTP verified successfully' });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ success: false, message: 'Error verifying OTP' });
    }
};

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Generate random 5-digit OTP
    const otp = randomstring.generate({ length: 5, charset: 'numeric' });

    // Set OTP expiration time (5 minutes)
    const otpExpiration = Date.now() + 5 * 60 * 1000;

    // Email template with OTP
    const message = `Your OTP for password reset is: ${otp}`;

    try {
        await sendEmail({
            to: user.email,
            subject: 'Password Reset OTP',
            text: message,
        });

        // Store OTP and its expiration time in user document (for verification later)
        user.resetPasswordOTP = otp;
        user.resetPasswordOTPExpiration = otpExpiration;
        await user.save();

        res.status(200).json({ success: true, message: 'OTP sent to email' });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ message: 'Error sending OTP' });
    }
};

exports.resetPassword = async (req, res) => {
    const { password } = req.body;
    const { email } = req.params;

    try {
        // Find user by email
        const user = await User.findOne({ email });

        // Update user's password
        user.password = password;
        await user.save();

        res.status(200).json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ message: 'Error resetting password' });
    }
};
