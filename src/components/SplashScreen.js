import React from 'react';
import '../styles/SplashScreen.css';

const SplashScreen = () => {
  return (
    <div className="splash-screen">
      <div className="splash-container">
        <div className="logo">VAS</div>
        <h1>Value Added Services</h1>
        <div className="spinner"></div>
      </div>
    </div>
  );
};

export default SplashScreen;