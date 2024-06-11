// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import HomePage from './pages/HomePage';
// import AboutPage from './pages/AboutPage';
// import ContactPage from './pages/ContactPage';
// import Navigation from './Components/Navigation';
// import { AuthProvider } from './context/AuthContext';
// import ResetPassword from './Components/ResetPassword';
// import ForgotPassword from './Components/ForgotPassword';

// const App = () => {
//   return (
//     <>
//       <AuthProvider>
//         <Router>
//           <Navigation />
//           <Routes>
//             <Route exact path="/" element={<HomePage />} />
//             <Route path="/about" element={<AboutPage />} />
//             <Route path="/contact" element={<ContactPage />} />
//             <Route path="/forgot-password" component={ForgotPassword} />
//             <Route path="/reset-password/:id/:token" component={ResetPassword} />
//           </Routes>
//         </Router>
//       </AuthProvider>
//     </>
//   );
// };

// export default App;
// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import Navigation from './Components/Navigation';
import { AuthProvider } from './context/AuthContext';
import ResetPassword from './Components/ResetPassword';
import ForgotPassword from './Components/ForgotPassword';
import QrCodeComponent from './Components/QRCodeComponent';
import CartItem from './pages/CartItem';
import Cart from './Components/Cart';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navigation />
        <Routes>
          {/* <Route path="/" element={<QrCodeComponent />} /> */}
          <Route path="/" element={<HomePage />} />

          <Route path="/home" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          {/* <Route path="/cart" element={<Cart />} /> */}

          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:id/:token" element={<ResetPassword />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
