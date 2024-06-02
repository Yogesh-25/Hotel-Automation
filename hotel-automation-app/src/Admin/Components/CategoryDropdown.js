// import React, { useState } from 'react';
// import '../styles/CategoryDropdown.css'; 


// const CategoryDropdown = () => {
//     const [selectedValue, setSelectedValue] = useState('');
//     const [options, setOptions] = useState([
//         { value: 'option1', label: 'Veg Starter' },
//         { value: 'option2', label: 'Non-Veg Starter' },
//         { value: 'option3', label: 'Paneer Starter' },
//         { value: 'option4', label: 'Chinese' },
//         { value: 'option5', label: 'Roti' },
//         { value: 'option6', label: 'Rice' },
//         { value: 'option7', label: 'Main Course' },
//         { value: 'option8', label: 'Paneer' },
//         { value: 'option9', label: 'Non-Veg' },
//         { value: 'option10', label: 'Dessert & Drinks' },
//         { value: 'option11', label: 'Ice-Cream' }
//     ]);

//     const handleChangeCategory = (e) => {
//         const value = e.target.value;
//         if (value === 'add-new') {
//             const newOptionLabel = prompt('Enter the label for the new option:');
//             if (newOptionLabel) {
//                 const newOptionValue = `option${options.length + 1}`;
//                 setOptions([...options, { value: newOptionValue, label: newOptionLabel }]);
//                 setSelectedValue(newOptionValue); // Set the newly added option as selected
//             }
//         } else {
//             setSelectedValue(value);
//         }
//     };

//     return (
//         <div className="dropdown-container">
//             <label htmlFor="my-dropdown" className="dropdown-label">Choose Category:</label>
//             <select
//                 id="my-dropdown1"
//                 className="dropdown-select"
//                 value={selectedValue}
//                 onChange={handleChangeCategory}
//                 required
//             >
//                 <option value="">Select...</option>
//                 {options.map((option) => (
//                     <option key={option.value} value={option.value}>
//                         {option.label}
//                     </option>
//                 ))}
//                 <option id='add-category' value="add-new">Add Option...</option>
//             </select>
//         </div>
//     );
// };

// export default CategoryDropdown;

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import '../styles/CategoryDropdown.css';

// const CategoryDropdown = () => {
//     const [selectedValue, setSelectedValue] = useState('');
//     const [options, setOptions] = useState([
//         { value: 'Veg Starter', label: 'Veg Starter' },
//         { value: 'Non-Veg Starter', label: 'Non-Veg Starter' },
//         { value: 'Paneer Starter', label: 'Paneer Starter' },
//         { value: 'Chinese', label: 'Chinese' },
//         { value: 'Roti', label: 'Roti' },
//         { value: 'Rice', label: 'Rice' },
//         { value: 'Main Course', label: 'Main Course' },
//         { value: 'Paneer', label: 'Paneer' },
//         { value: 'Non-Veg', label: 'Non-Veg' },
//         { value: 'Dessert & Drinks', label: 'Dessert & Drinks' },
//         { value: 'Ice-Cream', label: 'Ice-Cream' }
//     ]);

//     useEffect(() => {
//         // Fetch options from the backend
//         axios.get('http://localhost:5000/api/categories')
//             .then(response => {
//                 setOptions(response.data);
//             })
//             .catch(error => {
//                 console.error('There was an error fetching the categories!', error);
//             });
//     }, []);

//     const handleChangeCategory = async (e) => {
//         const value = e.target.value;
//         if (value === 'add-new') {
//             const newOptionLabel = prompt('Enter the label for the new option:');
//             if (newOptionLabel) {
//                 const newOptionValue = `option${options.length + 1}`;
//                 try {
//                     // Save the new option to the backend
//                     const response = await axios.post('http://localhost:5000/api/categories', {
//                         value: newOptionValue,
//                         label: newOptionLabel
//                     });

//                     setOptions([...options, { value: newOptionValue, label: newOptionLabel }]);
//                     setSelectedValue(newOptionValue); // Set the newly added option as selected

//                 } catch (error) {
//                     console.error('There was an error adding the new category!', error);
//                 }
//             }
//         } else {
//             setSelectedValue(value);
//         }
//     };

//     return (
//         <div className="dropdown-container">
//             <label htmlFor="my-dropdown" className="dropdown-label">Choose Category:</label>
//             <select
//                 id="my-dropdown1"
//                 className="dropdown-select"
//                 value={selectedValue}
//                 onChange={handleChangeCategory}
//                 required
//             >
//                 <option value="">Select...</option>
//                 {options.map((option) => (
//                     <option key={option.value} value={option.value}>
//                         {option.label}
//                     </option>
//                 ))}
//                 <option id='add-category' value="add-new">Add Option...</option>
//             </select>
//         </div>
//     );
// };

// export default CategoryDropdown;



import React, { useState } from 'react';
import '../styles/CategoryDropdown.css';

const CategoryDropdown = ({ selectedValue, handleChangeCategory }) => {
    const [options, setOptions] = useState([
        { value: 'Veg Starter', label: 'Veg Starter' },
        { value: 'Non-Veg Starter', label: 'Non-Veg Starter' },
        { value: 'Paneer Starter', label: 'Paneer Starter' },
        { value: 'Chinese', label: 'Chinese' },
        { value: 'Roti', label: 'Roti' },
        { value: 'Rice', label: 'Rice' },
        { value: 'Main Course', label: 'Main Course' },
        { value: 'Paneer', label: 'Paneer' },
        { value: 'Non-Veg', label: 'Non-Veg' },
        { value: 'Dessert & Drinks', label: 'Dessert & Drinks' },
        { value: 'Ice-Cream', label: 'Ice-Cream' }
    ]);

    const handleChange = (e) => {
        const value = e.target.value;
        if (value === 'add-new') {
            const newOptionLabel = window.prompt('Enter the label for the new option:');
            if (newOptionLabel) {
                const newOptionValue = newOptionLabel;
                setOptions([...options, { value: newOptionValue, label: newOptionLabel }]);
                handleChangeCategory(newOptionValue); // Set the newly added option as selected
            }
        } else {
            handleChangeCategory(value);
        }
    };

    return (
        <div className="dropdown-container">
            <label htmlFor="category-dropdown" className="dropdown-label">Choose Category:</label>
            <select
                id="category-dropdown"
                className="dropdown-select"
                value={selectedValue}
                onChange={handleChange}
                required
            >
                <option value="">Select...</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
                <option className="add-new" value="add-new">Add Option...</option>
            </select>
        </div>
    );
};

export default CategoryDropdown;
