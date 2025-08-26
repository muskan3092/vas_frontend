import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const phoneNumber = localStorage.getItem('phoneNumber');

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('phoneNumber');
    navigate('/login');
  };

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <h1>SmartVAS</h1>
          <p>Your Gateway to Value-Added Services</p>
        </div>
        <div className="dashboard">
          <h1>Welcome to SmartVAS!</h1>
          <p>Your account has been successfully verified</p>
          <p>Phone number: <strong>{phoneNumber}</strong></p>
          <button className="btn logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;