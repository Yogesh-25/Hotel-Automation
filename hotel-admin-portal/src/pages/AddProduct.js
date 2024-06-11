import React, { useState } from 'react';
import '../styles/AddProduct.css';
import axios from 'axios';
import CategoryDropdown from '../Components/CategoryDropdown';
import backgroundImage from '../Images/food.jpg';

function AddMenuForm() {
  const [formData, setFormData] = useState({
    productName: '',
    productId: '',
    rating: '',
    price: '',
    category: '',  
    description: '',
    image: null
  });

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = value => {
    setFormData({ ...formData, category: value });
  };

  const handleImageChange = e => {
    setFormData({ ...formData, image: e.target.files[0] });
  };
  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }
      await axios.post('http://localhost:5000/api/products/menu', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Menu item added successfully!');
      // Clear the form after submission
      setFormData({
        productName: '',
        productId: '',
        rating: '',
        price: '',
        category: '',
        description: '',
        image: null
      });
    } catch (error) {
      console.error('Error adding menu item:', error.response?.data?.message || error.message);
      alert(`Failed to add menu item. ${error.response?.data?.message || 'Please try again.'}`);
    }
  };

  return (
    <div className='add-menu-container'>
      <img src={backgroundImage} alt="Background" className="background-image" />
      <div className="add-menu-form-container">
        <h2>Add Menu Item</h2>
        <form onSubmit={handleSubmit} className="add-menu-form">
          <CategoryDropdown selectedValue={formData.category} handleChangeCategory={handleCategoryChange} />
          <input type="text" name="productName" value={formData.productName} onChange={handleChange} placeholder="Product Name" className="form-input" />
          <input type="number" name="productId" value={formData.productId} onChange={handleChange} placeholder="Product ID" className="form-input" />
          <input type="number" name="rating" value={formData.rating} onChange={handleChange} placeholder="Rating" className="form-input" />
          <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Price" className="form-input" />
          <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="form-textarea" />
          <input type="file" name="image" onChange={handleImageChange} className="form-file-input" />
          <button type="submit" className="submit-button">Add Menu Item</button>
        </form>
      </div>
    </div>
  );
}

export default AddMenuForm;