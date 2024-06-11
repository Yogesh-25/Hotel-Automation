import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './Components/Sidebar';
import Dashboard from './Components/Dashboard';
import AddProduct from './pages/AddProduct';
import Review from './pages/Review';
import UserProfile from './pages/Allow';
import Menu from './pages/Menu';
import './App.css';

function DashComponets() {
  return (
    <>
      <div className="dashboard-container">
        <Sidebar />
        <div className="content-routes">

          <Routes>
            <Route path="/dash" element={<Dashboard />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/review" element={<Review />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/userProfile" element={<UserProfile />} />
            {/* <Route path="/manage-user" element={<ManagePeople />} /> */}
          </Routes>
        </div>
      </div>
    </>
  );
}

export default DashComponets;
