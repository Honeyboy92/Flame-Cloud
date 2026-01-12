import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = () => {
    axios.get('/api/tickets').then(res => setTickets(res.data));
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <div className="hero-logo-bg">
              <img src="/logo.png" alt="" className="hero-bg-logo" />
            </div>
            <span className="title-flame">FLAME</span>
            <span className="title-cloud">CLOUD</span>
          </h1>
          <p className="hero-description">
            Start your game server with <span className="highlight-fire">powerful server hosting</span>, a user-friendly control panel, and support that's always ready to help. Get <span className="highlight-yellow">top performance</span> at great prices — Flame Cloud has you covered.
          </p>
          
          <div className="hero-badges">
            <div className="hero-badge">
              <svg className="badge-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
              <span>Instant Setup</span>
            </div>
            <div className="hero-badge">
              <svg className="badge-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
              <span>DDoS Protected</span>
            </div>
            <div className="hero-badge">
              <svg className="badge-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span>99.9% Uptime</span>
            </div>
          </div>

          <div className="hero-buttons">
            <Link to="/paid-plans" className="btn btn-hero-primary">
              <span>🔥</span> Start Hosting →
            </Link>
          </div>
        </div>

        <div className="hero-stats">
          <div className="stat-box">
            <div className="stat-icon-box green">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            </div>
            <div className="stat-value">99.9%</div>
            <div className="stat-label">Uptime SLA</div>
          </div>
          
          <div className="stat-box">
            <div className="stat-icon-box purple">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <div className="stat-value">24/7</div>
            <div className="stat-label">Support</div>
          </div>
          
          <div className="stat-box">
            <div className="stat-icon-box green">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
            </div>
            <div className="stat-value">Global</div>
            <div className="stat-label">Network</div>
          </div>
        </div>
      </div>

      {/* User Welcome Card */}
      <div className="card" style={{marginTop: '40px'}}>
        <h3>🔥 Greetings! {user?.username} from Flame-Cloud Team</h3>
        <p style={{color: 'var(--text-muted)', marginBottom: '20px'}}>Flame-Cloud relive on performance and budget friendly host. Join Us now for incredible experience....</p>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-grid">
        <Link to="/paid-plans" className="quick-action-card">
          <div className="quick-action-icon" style={{background: 'linear-gradient(135deg, #ef4444, #f59e0b)'}}>🚀</div>
          <h4>Get a Server</h4>
          <p>Browse our premium hosting plans</p>
        </Link>
        
        <a href="https://dash.diamondnode.qzz.io" target="_blank" rel="noopener noreferrer" className="quick-action-card">
          <div className="quick-action-icon" style={{background: 'linear-gradient(135deg, #10b981, #059669)'}}>🎮</div>
          <h4>Game Panel</h4>
          <p>Manage your servers</p>
        </a>
        
        <Link to="/features" className="quick-action-card">
          <div className="quick-action-icon" style={{background: 'linear-gradient(135deg, #8b5cf6, #6366f1)'}}>⭐</div>
          <h4>Features</h4>
          <p>See what we offer</p>
        </Link>
        
        <a href="https://discord.gg/WXWYz5ywTU" target="_blank" rel="noopener noreferrer" className="quick-action-card">
          <div className="quick-action-icon" style={{background: 'linear-gradient(135deg, #5865F2, #4752c4)'}}>💬</div>
          <h4>Discord</h4>
          <p>Join our community</p>
        </a>
      </div>

      {/* Why Choose Us */}
      <div className="card">
        <h3>🔥 Why Choose Flame Cloud?</h3>
        <div className="features-mini-grid">
          <div className="feature-mini">
            <span className="feature-mini-icon">⚡</span>
            <div>
              <h5>Instant Setup</h5>
              <p>Server ready in minutes</p>
            </div>
          </div>
          <div className="feature-mini">
            <span className="feature-mini-icon">🛡️</span>
            <div>
              <h5>DDoS Protection</h5>
              <p>Enterprise-grade security</p>
            </div>
          </div>
          <div className="feature-mini">
            <span className="feature-mini-icon">💾</span>
            <div>
              <h5>NVMe Storage</h5>
              <p>Lightning fast SSDs</p>
            </div>
          </div>
          <div className="feature-mini">
            <span className="feature-mini-icon">🌍</span>
            <div>
              <h5>UAE Servers</h5>
              <p>Low latency gaming</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
