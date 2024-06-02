const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  resetPasswordOTP: { type: String },
  createdAt: { type: Date, default: Date.now, immutable: true },
});

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};
module.exports = mongoose.model('User', userSchema);


/*
import React, { useState } from 'react';
import jwt from 'jsonwebtoken';

const App = () => {
  const [token, setToken] = useState('');
  const [decodedToken, setDecodedToken] = useState(null);
  const SECRET_KEY = 'your-very-secure-and-long-secret-key-1234567890';

  // Function to create a JWT token
  const createToken = () => {
    const payload = {
      user_id: 123,
      username: 'example_user',
      exp: Math.floor(Date.now() / 1000) + (60 * 60), // Token expires in 1 hour
    };
    const newToken = jwt.sign(payload, SECRET_KEY);
    setToken(newToken);
  };

  // Function to verify a JWT token
  const verifyToken = () => {
    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      setDecodedToken(decoded);
    } catch (error) {
      console.error('Token verification failed:', error);
      setDecodedToken(null);
    }
  };

  return (
    <div>
      <h1>JWT Example in React</h1>
      <button onClick={createToken}>Create Token</button>
      <button onClick={verifyToken}>Verify Token</button>

      {token && (
        <div>
          <h2>Generated Token</h2>
          <p>{token}</p>
        </div>
      )}

      {decodedToken && (
        <div>
          <h2>Decoded Token</h2>
          <pre>{JSON.stringify(decodedToken, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default App;


*/