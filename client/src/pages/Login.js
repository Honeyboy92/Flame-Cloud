import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      navigate(user.isAdmin ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="logo-text">🔥 Flame Cloud</div>
        <p style={{textAlign: 'center', color: 'var(--text-muted)', marginBottom: '40px', fontSize: '0.95rem', position: 'relative', zIndex: 1}}>
          Premium Minecraft Server Hosting
        </p>
        <h2>Welcome Back</h2>
        
        {error && <div className="alert alert-error">⚠️ {error}</div>}
        
        <form onSubmit={handleSubmit} style={{position: 'relative', zIndex: 1}}>
          <div className="form-group">
            <label>📧 Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              placeholder="Enter your email"
              required 
            />
          </div>
          <div className="form-group">
            <label>🔑 Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              placeholder="Enter your password"
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{width: '100%', marginTop: '10px'}} disabled={loading}>
            {loading ? '⏳ Signing in...' : '🚀 Sign In'}
          </button>
        </form>
        
        <p className="auth-link">
          New here? <Link to="/signup">Create an Account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
