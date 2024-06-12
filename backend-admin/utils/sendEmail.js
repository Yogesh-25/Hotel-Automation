const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: '',
        pass: '',
    },
});

const sendEmail = async (mailOptions) => {
    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        throw new Error('Email could not be sent');
    }
};

module.exports = sendEmail;
