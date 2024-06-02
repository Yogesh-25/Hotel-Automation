
// import './App.css';
// import React, { useState } from 'react';
// import { UserProvider } from './pages/UserContext';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// import DashComponets from './DashComponets';
// import Login from './Components/Login';
// import Navbar from './Components/Navbar';
// import ForgotPassword from './Components/ForgotPassword';

// function App() {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [user, setUser] = useState(null);

//   const login = (username) => {
//     setIsAuthenticated(true);
//     setUser(username); // Set user info here
//   };

//   const logout = () => {
//     setIsAuthenticated(false);
//     setUser(null);
//   };

//   return (
//     <UserProvider>
//       <Router>
//         {isAuthenticated && <Navbar user={user} logout={logout} />}
//         <Routes>
//           <Route path="/login" element={<Login login={login} />} />
//           <Route path="/forgot-password" element={<ForgotPassword />} />
//           <Route path="/*" element={isAuthenticated ? <DashComponets /> : <Navigate to="/login" />} />
//           <Route path="*" element={<Navigate to="/login" />} />
//         </Routes>
//       </Router>
//     </UserProvider>
//   );
// }

// export default App;

import React, { useState } from 'react';
import { UserProvider } from './pages/UserContext';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashComponents from './DashComponets';
import Login from './Components/Login';
import Navbar from './Components/Navbar';
import ForgotPassword from './Components/ForgotPassword';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const adminlogin = (username) => {
    setIsAuthenticated(true);
    setUser(username);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <UserProvider>
      <Router>
        {isAuthenticated && <Navbar user={user} logout={logout} />}
        <Routes>
          <Route path="/adminlogin" element={<Login login={adminlogin} />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/*" element={isAuthenticated ? <DashComponents /> : <Navigate to="/adminlogin" />} />
          <Route path="*" element={<Navigate to="/adminlogin" />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;

