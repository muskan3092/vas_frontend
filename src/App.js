import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SplashScreen from './components/SplashScreen';
import Login from './components/Login';
import Register from './components/Register';
import OTPVerification from './components/OTPVerification';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
    }

    // Hide splash screen after 3 seconds
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!isAuthenticated ? <Login setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/" />}
        />
        <Route
          path="/register"
          element={!isAuthenticated ? <Register /> : <Navigate to="/" />}
        />
        <Route
          path="/verify-otp"
          element={!isAuthenticated ? <OTPVerification setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/" />}
        />
      </Routes>
    </div>
  );
}

export default App;