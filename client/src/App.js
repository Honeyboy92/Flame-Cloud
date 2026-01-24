import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import About from './pages/About';
import PaidPlans from './pages/PaidPlans';
import YTPartners from './pages/YTPartners';
import Features from './pages/Features';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import Chat from './pages/Chat';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="auth-container">
        <div className="card" style={{textAlign: 'center', padding: '60px'}}>
          <img src="/logo.png" alt="Flame Cloud" style={{width: '80px', height: '80px', marginBottom: '20px'}} />
          <p>Loading Flame Cloud...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/signup" element={user ? <Navigate to="/dashboard" replace /> : <Signup />} />
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="about" element={<About />} />
  <Route path="paid-plans" element={<PaidPlans />} />
  <Route path="yt-partners" element={<YTPartners />} />
        <Route path="features" element={<Features />} />
        <Route path="chat" element={<Chat />} />
  <Route path="admin" element={user?.isAdmin ? <AdminPanel /> : <Navigate to="/dashboard" replace />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
