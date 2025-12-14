// src/App.jsx
import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import Auth from './components/Auth';
// Import all the Dashboard code I gave you earlier as a component named 'LoanDashboard'
import LoanDashboard from './components/LoanDashboard'; // Ensure you saved the previous huge code as this file

const App = () => {
  const [currentView, setCurrentView] = useState('landing'); // 'landing', 'auth', 'dashboard'

  // Navigation Logic
  const handleGetStarted = () => setCurrentView('auth');
  const handleLoginSuccess = () => setCurrentView('dashboard');

  return (
    <>
      {currentView === 'landing' && <LandingPage onGetStarted={handleGetStarted} />}
      {currentView === 'auth' && <Auth onLogin={handleLoginSuccess} />}
      {currentView === 'dashboard' && <LoanDashboard />}
    </>
  );
};

export default App;