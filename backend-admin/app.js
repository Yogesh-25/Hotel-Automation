const express = require('express');
const mongoose = require('mongoose');

const cors = require('cors');   
const app = express();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const MenuItem = require('./models/Menu');
const User = require('./models/User');
const authRoutes = require('./routes/authRoutes');
const categoriesRouter = require('./routes/categories');
const productRoutes = require('./routes/products');
const reviewsRouter = require('./routes/Reviews');
const port = 5000;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

app.use('/api', authRoutes);

mongoose.connect('mongodb://127.0.0.1:27017/hotel-data').then(() => {
    console.log("Connected to MongoDB...")
}).catch((err) => {
    console.log("MongoDB error", err);
});

const productSchema = new mongoose.Schema({
    image: String,
    productName: String,
    productId: Number,
    quantity: Number,
    price: Number,
    orderTime: String,
    customer: String
});

const Product = mongoose.model('hotal-data', productSchema);

let user = { username: 'admin', password: 'admin' };

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (username === user.username && password === user.password) {
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

app.get('/api/menu/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await MenuItem.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// // Define a schema and model for the category options
// const categorySchema = new mongoose.Schema({
//     value: String,
//     label: String
// });

// const Category = mongoose.model('Category', categorySchema);

// // Endpoint to get all categories
// app.get('/categories', async (req, res) => {
//     try {
//         const categories = await Category.find();
//         res.json(categories);
//     } catch (err) {
//         res.status(500).send(err);
//     }
// });

// // Endpoint to add a new category
// app.post('/categories', async (req, res) => {
//     const { value, label } = req.body;
//     const newCategory = new Category({ value, label });
//     try {
//         const savedCategory = await newCategory.save();
//         res.json(savedCategory);
//     } catch (err) {
//         res.status(500).send(err);
//     }
// });
app.use('/api/categories', categoriesRouter);

// Get user by username
app.get('/by-username/:username', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching user by username:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

app.get('/user/:userId', async (req, res) => {
    try {
        const reviews = await Review.find({ userId: req.params.userId });
        res.json(reviews);
    } catch (error) {
        console.error('Error fetching user reviews:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});


/* Login/register main page */

// User Schema
// const userSchema = new mongoose.Schema({
//     username: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     createdAt: { type: Date, default: Date.now }
// });

// const User = mongoose.model('User', userSchema);

// Routes
// Backend - app.js

app.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });

        await newUser.save();
        res.status(201).json({ success: true, username, message: 'Registration successful' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ success: false, message: 'Invalid email or password' });
        }

        res.status(200).json({ success: true, username: user.username, message: 'Login successful' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

/* Login/register end */


// Route to delete a user profile
app.delete('/api/users/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        // Find user by ID and delete it
        await User.findByIdAndDelete(userId);
        res.status(200).json({ message: 'User profile deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



/* REVIEW ______________ */
app.use('/api/reviews', reviewsRouter);
const Review = require('./models/Review');
// Create an endpoint to get the total review count



// app.get('/api/reviews', async (req, res) => {
//     try {
//         // Fetch reviews from the database
//         const reviews = await Review.find();
//         // Send reviews as response
//         res.json(reviews);
//     } catch (error) {
//         console.error('Error fetching reviews:', error);
//         res.status(500).json({ message: 'Internal Server Error' });
//     }
// });

// // Route for submitting reviews
// app.post('/api/reviews', async (req, res) => {
//     try {
//         const { menuItemId, username, rating, feedback } = req.body;
//         const review = new Review({
//             menuItemId,
//             username,
//             rating,
//             feedback
//         });
//         await review.save();
//         res.status(201).json({ success: true, message: 'Review submitted successfully' });
//     } catch (error) {
//         console.error('Error submitting review:', error);
//         res.status(500).json({ success: false, message: 'Internal server error' });
//     }
// });

/* REVIEW END_____________ */


// Create endpoint to get count of new users in the last 24 hours
app.get('/api/users/newcount', async (req, res) => {
    try {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1); // Calculate date 24 hours ago
        const count = await User.countDocuments({ createdAt: { $gte: yesterday } });
        res.json({ count });
    } catch (error) {
        console.error('Error fetching new user count:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Create endpoint to get total user count
app.get('/api/users/totalcount', async (req, res) => {
    try {
        const totalCount = await User.countDocuments();
        res.json({ totalCount });
    } catch (error) {
        console.error('Error fetching total user count:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Create an endpoint to get the total review count
app.get('/api/reviews/totalcount', async (req, res) => {
    try {
        const totalCount = await Review.countDocuments();
        res.json({ totalCount });
    } catch (error) {
        console.error('Error fetching total review count:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.use('/api/products', productRoutes);



//////////////////////////////////admin//////////////////////////

/*
const adminUserSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    mobile: { type: String, unique: true },
    password: String,
    otp: String,
    otpExpires: Date,
});

const Admin = mongoose.model('Admin', adminUserSchema);
const fast2sms = async (message, contactNumber) => {
    try {
        const response = await axios.post(
            'https://www.fast2sms.com/dev/bulkV2',
            {
                route: 'q',
                message,
                language: 'english',
                flash: 0,
                numbers: 8767699987,
            },
            {
                headers: {
                    authorization: 'aKpNPmXhlc6x2gVMW0HSoyQ4JwqfC8zYvsE1RUjt93uZTrn7G5YcfQA8IDaJPrzZFWnmlMBNk9SopHqd',
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error sending SMS:', error);
        throw error;
    }
};
// Endpoint to send OTP
app.post('/api/send-otp', async (req, res) => {
    const { mobile } = req.body;

    try {
        const user = await Admin.findOne({ mobile });

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const otp = crypto.randomBytes(3).toString('hex');
        const otpExpires = Date.now() + 3600000; // 1 hour

        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();

        await fast2sms(`Your OTP for password reset is: ${otp}`, mobile);

        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Endpoint to verify OTP and reset password
app.post('/api/verify-otp', async (req, res) => {
    const { mobile, otp, newPassword } = req.body;

    try {
        const user = await Admin.findOne({ mobile });

        if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
*/

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});