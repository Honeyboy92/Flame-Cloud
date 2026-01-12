import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import About from './pages/About';
import PaidPlans from './pages/PaidPlans';
import Features from './pages/Features';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="auth-container">
        <div className="card" style={{textAlign: 'center', padding: '60px'}}>
          <div style={{fontSize: '3rem', marginBottom: '20px'}}>🔥</div>
          <p>Loading Flame Cloud...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Navigate to="/dashboard" replace />} />
      <Route path="/signup" element={<Navigate to="/dashboard" replace />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="about" element={<About />} />
        <Route path="paid-plans" element={<PaidPlans />} />
        <Route path="features" element={<Features />} />
        <Route path="admin" element={user.isAdmin ? <AdminPanel /> : <Navigate to="/dashboard" />} />
      </Route>
    </Routes>
  );
}

export default App;
