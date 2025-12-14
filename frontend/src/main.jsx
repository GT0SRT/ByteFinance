import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { auth } from './firebase'
import LandingPage from './components/LandingPage.jsx'
import LoanDashboard from './components/LoanDashboard.jsx'
import Auth from './components/Auth.jsx'
import Profile from './components/Profile.jsx'

const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(u => setUser(u));
    return () => unsub();
  }, []);

  if (user === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(255, 215, 0, 0.5)', borderTopColor: '#FFD700' }} />
          <span className="text-sm text-gray-400">Checking sign-in…</span>
        </div>
      </div>
    );
  }
  return user ? children : <Navigate to="/auth" replace />;
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app" element={<ProtectedRoute><LoanDashboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
