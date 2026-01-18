import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

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
              <span style={{
                background: 'linear-gradient(135deg, #ff6a00, #ff2e00, #ff6a00)',
                backgroundSize: '200% 200%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'flameGradient 3s ease-in-out infinite',
                fontWeight: '600'
              }}>Instant Setup</span>
            </div>
            <div className="hero-badge">
              <svg className="badge-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
              <span style={{
                background: 'linear-gradient(135deg, #ff6a00, #ff2e00, #ff6a00)',
                backgroundSize: '200% 200%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'flameGradient 3s ease-in-out infinite',
                fontWeight: '600'
              }}>DDoS Protected</span>
            </div>
            <div className="hero-badge">
              <svg className="badge-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span style={{
                background: 'linear-gradient(135deg, #ff6a00, #ff2e00, #ff6a00)',
                backgroundSize: '200% 200%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'flameGradient 3s ease-in-out infinite',
                fontWeight: '600'
              }}>99.9% Uptime</span>
            </div>
          </div>

          <div className="hero-buttons">
            <Link to="/paid-plans" className="btn btn-hero-primary">
              <img src="/logo.png" alt="" style={{width: '24px', height: '24px', marginRight: '8px'}} /> 
              <span style={{
                background: 'linear-gradient(135deg, #FF2E00, #FF6A00, #FFD000)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontWeight: '700',
                fontSize: '1rem'
              }}>
                Start Hosting →
              </span>
            </Link>
          </div>
        </div>

        <div className="hero-stats">
          <div className="stat-box">
            <div className="stat-icon-box" style={{background: 'transparent', border: '2px solid #FF6A00'}}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#FF6A00" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            </div>
            <div className="stat-value">99.9%</div>
            <div className="stat-label">Uptime SLA</div>
          </div>
          
          <div className="stat-box">
            <div className="stat-icon-box" style={{background: 'transparent', border: '2px solid #FF6A00'}}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#FF6A00" strokeWidth="2">
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
            <div className="stat-icon-box" style={{background: 'transparent', border: '2px solid #FF6A00'}}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#FF6A00" strokeWidth="2">
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
        <h3 style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
          <img src="/logo.png" alt="" style={{width: '28px', height: '28px'}} />
          Greetings! {user?.username || 'Guest'} from Flame-Cloud Team
        </h3>
        <p style={{color: 'var(--text-muted)', marginBottom: '20px'}}>Flame-Cloud relive on performance and budget friendly host. Join Us now for incredible experience....</p>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-grid">
        <Link to="/paid-plans" className="quick-action-card">
          <div className="quick-action-icon" style={{background: 'transparent', border: '2px solid #FF2E00'}}>
            <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="#FF2E00" strokeWidth="1.5">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
              <line x1="8" y1="21" x2="16" y2="21"></line>
              <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
          </div>
          <h4>Get a Server</h4>
          <p>Browse our hosting plans</p>
        </Link>
        
        <a href="https://dash.diamondnode.qzz.io" target="_blank" rel="noopener noreferrer" className="quick-action-card">
          <div className="quick-action-icon" style={{background: 'transparent', border: '2px solid #FF2E00'}}>
            <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="#FF2E00" strokeWidth="1.5">
              <rect x="2" y="6" width="20" height="12" rx="2"></rect>
              <line x1="6" y1="10" x2="6" y2="14"></line>
              <line x1="4" y1="12" x2="8" y2="12"></line>
              <circle cx="16" cy="10" r="1.5"></circle>
              <circle cx="19" cy="13" r="1.5"></circle>
            </svg>
          </div>
          <h4>Game Panel</h4>
          <p>Manage your servers</p>
        </a>
        
        <Link to="/features" className="quick-action-card">
          <div className="quick-action-icon" style={{background: 'transparent', border: '2px solid #FF2E00'}}>
            <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="#FF2E00" strokeWidth="1.5">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
          </div>
          <h4>Features</h4>
          <p>See what we offer</p>
        </Link>
        
        <a href="https://discord.gg/WXWYz5ywTU" target="_blank" rel="noopener noreferrer" className="quick-action-card">
          <div className="quick-action-icon" style={{background: 'transparent', border: '2px solid #FF2E00'}}>
            <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="#FF2E00" strokeWidth="1.5">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
            </svg>
          </div>
          <h4>Discord</h4>
          <p>Join our community</p>
        </a>
      </div>

      {/* Why Choose Us */}
      <div className="card">
        <h3 style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
          <img src="/logo.png" alt="" style={{width: '28px', height: '28px'}} />
          Why Choose Flame Cloud?
        </h3>
        <div className="features-mini-grid">
          <div className="feature-mini">
            <span className="feature-mini-icon" style={{background: 'transparent', border: '2px solid #FF2E00'}}>
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#FF2E00" strokeWidth="1.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            </span>
            <div>
              <h5>Instant Setup</h5>
              <p>Server ready in minutes</p>
            </div>
          </div>
          <div className="feature-mini">
            <span className="feature-mini-icon" style={{background: 'transparent', border: '2px solid #FF2E00'}}>
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#FF2E00" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </span>
            <div>
              <h5>DDoS Protection</h5>
              <p>Enterprise-grade security</p>
            </div>
          </div>
          <div className="feature-mini">
            <span className="feature-mini-icon" style={{background: 'transparent', border: '2px solid #FF2E00'}}>
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#FF2E00" strokeWidth="1.5"><rect x="4" y="4" width="16" height="16" rx="2"/><line x1="4" y1="10" x2="20" y2="10"/></svg>
            </span>
            <div>
              <h5>NVMe Storage</h5>
              <p>Lightning fast SSDs</p>
            </div>
          </div>
          <div className="feature-mini">
            <span className="feature-mini-icon" style={{background: 'transparent', border: '2px solid #FF2E00'}}>
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#FF2E00" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            </span>
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
