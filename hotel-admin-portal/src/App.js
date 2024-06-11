import React, { useState, useEffect } from 'react';
import { UserProvider } from './pages/UserContext';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashComponents from './DashComponets';
import Login from './Components/Login';
import Navbar from './Components/Navbar';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const adminlogin = (username) => {
    setIsAuthenticated(true);
    setUser(username);
    localStorage.setItem('isAuthenticated', true);
    localStorage.setItem('user', JSON.stringify(username));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
  };

  return (
    <UserProvider>
      <Router>
        {isAuthenticated && <Navbar user={user} logout={logout} />}
        <Routes>
          <Route path="/adminlogin" element={<Login login={adminlogin} />} />
          <Route path="/*" element={isAuthenticated ? <DashComponents /> : <Navigate to="/adminlogin" />} />
          <Route path="*" element={<Navigate to="/adminlogin" />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;