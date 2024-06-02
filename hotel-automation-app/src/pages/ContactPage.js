
import React, { useState } from 'react';
import '../styles/Contact.css';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [formStatus, setFormStatus] = useState({ submitted: false, error: false });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('https://formspree.io/f/mleyykoa', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setFormData({ name: '', email: '', message: '' });
                setFormStatus({ submitted: true, error: false });
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            setFormStatus({ submitted: false, error: true });
        }
    };



    return (
        <section className="contact-section">
            <div className="layout-wrap">
                <div className="layout">
                    <div className="layout-row">
                        <div className="layout-cell contact-form-cell">
                            <div className="container-layout">
                                <h6 className="section-title">Contact Us</h6>
                                <form className="contact-form" onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <label htmlFor="name">Name</label>
                                        <br />                                        <br />
                                        <input
                                            type="text"
                                            placeholder="Enter your Name"
                                            id="name"
                                            name="name"
                                            className="input-fie"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="email">Email</label>
                                        <input
                                            type="email"
                                            placeholder="Enter a valid email address"
                                            id="email"
                                            name="email"
                                            className="input-field"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="message">Message</label>
                                        <textarea
                                            placeholder="Enter your message"
                                            rows="4"
                                            id="message"
                                            name="message"
                                            className="input-field"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                        ></textarea>
                                    </div>
                                    <div className="form-submit">
                                        <button type="submit" className="submit-button">
                                            Submit
                                        </button>
                                    </div>
                                </form>
                                {formStatus.submitted && (
                                    <div className="form-send-message success">Thank you! Your message has been sent.</div>
                                )}
                                {formStatus.error && (
                                    <div className="form-send-message error">Unable to send your message. Please fix errors then try again.</div>
                                )}
                            </div>
                        </div>
                        <div className="layout-cell contact-info-cell">
                            <div className="container-layout">
                                <h6 className="info-title">Call Us</h6>
                                <p className="info-text">+91 9874123450<br />+91 9874563210</p>
                                <h6 className="info-title">Location</h6>
                                <p className="info-text">Latur, Maharastra,<br />India, IND 9876543210</p>
                                <h6 className="info-title">Our Top Services</h6>
                                <p className="info-text">Local transfers<br />Airport Transfers<br />Excursions and Tours</p>
                            </div>
                        </div>
                        <div className="layout-cell map-cell">
                            <div className="container-layout">
                                <div className="map">

                                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30271.36221990822!2d76.2873449!3d18.487270000000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc57ab15c7a4803%3A0xf01de0604d01f0c9!2sBhise%20Wagholi%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1716048260008!5m2!1sen!2sin"  ></iframe>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactPage;
