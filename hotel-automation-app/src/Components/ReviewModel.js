import React, { useState } from 'react';
import '../styles/ReviewModal.css';

const ReviewModal = ({ isOpen, onClose, onReviewSubmit }) => {
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');

    const handleRatingChange = (value) => {
        setRating(value);
    };

    const handleSubmit = () => {
        if (rating === 0) {
            alert('Please select a rating.');
            return;
        }
        if (feedback.trim() === '') {
            alert('Please provide feedback.');
            return;
        }
        // Send review data to parent component
        onReviewSubmit({ rating, feedback });
        onClose();
    };

    return (
        <div className={`modal ${isOpen ? 'open' : ''}`}>
            <div className="modal-content-review1">
                <span className="close-button" onClick={onClose}>&times;</span>
                <span className="modal-close" onClick={onClose}>X</span>
                <h2>Give Review</h2>
                <div className="rating">
                    {[1, 2, 3, 4, 5].map((value) => (
                        <span
                            key={value}
                            className={value <= rating ? 'star active' : 'star'}
                            onClick={() => handleRatingChange(value)}
                        >
                            &#9733;
                        </span>
                    ))}
                </div>
                <textarea
                    placeholder="Enter your feedback..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                />
                <button onClick={handleSubmit}>Submit</button>
            </div>
        </div>
    );
};

export default ReviewModal;
