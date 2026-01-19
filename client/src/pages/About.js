import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const About = () => {
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const { data, error } = await supabase
          .from('about_content')
          .select('*')
          .limit(1);
        
        if (!error && data && data[0]) {
          setAbout(data[0]);
        } else {
          // Set default data if API fails
          setAbout({
            content: "Flame Cloud is a next-generation gaming server hosting platform built for speed, power, and reliability.",
            founder_name: "Flame Founder",
            founder_photo: null,
            owner_name: "Flame Owner",
          owner_photo: null,
          management_name: "Flame Management",
          management_photo: null
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAbout();
  }, []);

  if (loading) {
    return (
      <div className="card" style={{textAlign: 'center', padding: '60px'}}>
        <img src="/logo.png" alt="Flame Cloud" style={{width: '80px', height: '80px', marginBottom: '20px'}} />
        <p>Loading about information...</p>
      </div>
    );
  }

  return (
    <div className="flame-about-section">
      {/* Fire Particles Background */}
      <div className="flame-particles">
        {[...Array(15)].map((_, i) => (
          <div key={i} className={`flame-particle flame-particle-${i + 1}`}></div>
        ))}
      </div>

      {/* Main About Layout */}
      <div className="flame-about-container">
        
        {/* Left Side - Team Hierarchy */}
        <div className="flame-about-left">
          <div className="flame-team-section">
            <h2 className="flame-team-title">
              <img src="/logo.png" alt="Flame Cloud" style={{width: '50px', height: '50px', marginRight: '15px', opacity: 0.8}} />
              Our Flame Team
            </h2>

            {/* Flame Founder - Top Center Highlighted */}
            <div className="flame-team-founder">
              <div className="flame-team-card flame-founder-card">
                <div className="flame-card-glow"></div>
                <div className="flame-card-content">
                  {/* Flame Founder Badge */}
                  <div style={{
                    background: 'rgba(255, 46, 0, 0.1)',
                    padding: '10px 20px',
                    borderRadius: '25px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1rem',
                    fontWeight: '800',
                    marginBottom: '20px',
                    boxShadow: '0 0 20px rgba(255, 46, 0, 0.3)',
                    border: '2px solid rgba(255, 46, 0, 0.4)',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <span style={{filter: 'drop-shadow(0 0 2px #ff2e00)'}}>👑</span>
                    <span style={{
                      background: 'linear-gradient(135deg, #ff6a00, #ff2e00, #ff6a00)',
                      backgroundSize: '200% 200%',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      animation: 'flameGradient 3s ease-in-out infinite',
                      textAlign: 'center',
                      flex: 1,
                      marginLeft: '10px'
                    }}>
                      FLAME FOUNDER
                    </span>
                  </div>
                  <div className="flame-avatar flame-founder-avatar" style={{backgroundImage: 'url("/rameez-xd.png")', backgroundSize: 'cover', backgroundPosition: 'center'}}>
                  </div>
                  <div className="flame-member-info">
                    <h3 className="flame-member-name">Rameez_xD</h3>
                    <p className="flame-member-role">Visionary & Architect of Flame Cloud</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row - Owner & Management */}
            <div className="flame-team-bottom">
              
              {/* Flame Owner - Left Card */}
              <div className="flame-team-card flame-owner-card">
                <div className="flame-card-glow"></div>
                <div className="flame-card-content">
                  {/* Flame Owner Badge */}
                  <div style={{
                    background: 'rgba(255, 46, 0, 0.1)',
                    padding: '10px 20px',
                    borderRadius: '25px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1rem',
                    fontWeight: '800',
                    marginBottom: '20px',
                    boxShadow: '0 0 20px rgba(255, 46, 0, 0.3)',
                    border: '2px solid rgba(255, 46, 0, 0.4)',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <span style={{filter: 'drop-shadow(0 0 2px #ff2e00)'}}>🔥</span>
                    <span style={{
                      background: 'linear-gradient(135deg, #ff6a00, #ff2e00, #ff6a00)',
                      backgroundSize: '200% 200%',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      animation: 'flameGradient 3s ease-in-out infinite',
                      textAlign: 'center',
                      flex: 1,
                      marginLeft: '10px'
                    }}>
                      FLAME OWNER
                    </span>
                  </div>
                  <div className="flame-avatar flame-owner-avatar" style={{backgroundImage: 'url("/tgkflex.jpg")', backgroundSize: 'cover', backgroundPosition: 'center'}}>
                  </div>
                  <div className="flame-member-info">
                    <h3 className="flame-member-name">TGKFlex</h3>
                    <p className="flame-member-role">
                      <span style={{filter: 'drop-shadow(0 0 2px #ff2e00)'}}>🔧</span> Operations & Infrastructure Head
                    </p>
                  </div>
                </div>
              </div>

              {/* Flame Management - Right Card */}
              <div className="flame-team-card flame-management-card">
                <div className="flame-card-glow"></div>
                <div className="flame-card-content">
                  {/* Flame Management Badge */}
                  <div style={{
                    background: 'rgba(255, 46, 0, 0.1)',
                    padding: '10px 20px',
                    borderRadius: '25px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1rem',
                    fontWeight: '800',
                    marginBottom: '20px',
                    boxShadow: '0 0 20px rgba(255, 46, 0, 0.3)',
                    border: '2px solid rgba(255, 46, 0, 0.4)',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <span style={{filter: 'drop-shadow(0 0 2px #ff2e00)'}}>⚙️</span>
                    <span style={{
                      background: 'linear-gradient(135deg, #ff6a00, #ff2e00, #ff6a00)',
                      backgroundSize: '200% 200%',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      animation: 'flameGradient 3s ease-in-out infinite',
                      textAlign: 'center',
                      flex: 1,
                      marginLeft: '10px'
                    }}>
                      FLAME MANAGEMENT
                    </span>
                  </div>
                  <div className="flame-avatar flame-management-avatar" style={{backgroundImage: 'url("/pie-legend.jpg")', backgroundSize: 'cover', backgroundPosition: 'center'}}>
                  </div>
                  <div className="flame-member-info">
                    <h3 className="flame-member-name">! Pie LEGEND</h3>
                    <p className="flame-member-role">
                      <span style={{filter: 'drop-shadow(0 0 2px #ff2e00)'}}>💬</span> Support & Client Experience
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Right Side - Company Story & Features */}
        <div className="flame-about-right">
          <div className="flame-company-story">
            <h1 className="flame-main-title" style={{fontSize: '2.2rem'}}>
              <img src="/logo.png" alt="Flame Cloud" style={{width: '55px', height: '55px', marginRight: '15px', opacity: 0.8}} />
              About Flame Cloud
            </h1>
            
            <div className="flame-story-content">
              <p className="flame-description">
                Flame Cloud - Premium Gaming Server Hosting Platform
              </p>
            </div>

            {/* Key Features Grid */}
            <div className="flame-features-section">
              <h3 className="flame-features-title">
                <img src="/logo.png" alt="Flame Cloud" style={{width: '40px', height: '40px', marginRight: '12px', opacity: 0.8}} />
                Key Hosting Features
              </h3>
              
              <div className="flame-features-grid">
                <div className="flame-feature-item">
                  <span className="flame-feature-icon" style={{opacity: 1, filter: 'drop-shadow(0 0 2px #ff2e00)'}}>🚀</span>
                  <span className="flame-feature-text" style={{
                    background: 'linear-gradient(135deg, #ff6a00, #ff2e00, #ff6a00)',
                    backgroundSize: '200% 200%',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    animation: 'flameGradient 3s ease-in-out infinite',
                    fontWeight: '600'
                  }}>Ultra-Fast NVMe SSD Servers</span>
                </div>
                <div className="flame-feature-item">
                  <span className="flame-feature-icon" style={{opacity: 1, filter: 'drop-shadow(0 0 2px #ff2e00)'}}>🌍</span>
                  <span className="flame-feature-text" style={{
                    background: 'linear-gradient(135deg, #ff6a00, #ff2e00, #ff6a00)',
                    backgroundSize: '200% 200%',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    animation: 'flameGradient 3s ease-in-out infinite',
                    fontWeight: '600'
                  }}>Global Server Locations</span>
                </div>
                <div className="flame-feature-item">
                  <span className="flame-feature-icon" style={{opacity: 1, filter: 'drop-shadow(0 0 2px #ff2e00)'}}>🛡️</span>
                  <span className="flame-feature-text" style={{
                    background: 'linear-gradient(135deg, #ff6a00, #ff2e00, #ff6a00)',
                    backgroundSize: '200% 200%',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    animation: 'flameGradient 3s ease-in-out infinite',
                    fontWeight: '600'
                  }}>DDoS Protection (Enterprise Level)</span>
                </div>
                <div className="flame-feature-item">
                  <span className="flame-feature-icon" style={{opacity: 1, filter: 'drop-shadow(0 0 2px #ff2e00)'}}>⚙️</span>
                  <span className="flame-feature-text" style={{
                    background: 'linear-gradient(135deg, #ff6a00, #ff2e00, #ff6a00)',
                    backgroundSize: '200% 200%',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    animation: 'flameGradient 3s ease-in-out infinite',
                    fontWeight: '600'
                  }}>Full Control Panel Access</span>
                </div>
                <div className="flame-feature-item">
                  <span className="flame-feature-icon" style={{opacity: 1, filter: 'drop-shadow(0 0 2px #ff2e00)'}}>🧠</span>
                  <span className="flame-feature-text" style={{
                    background: 'linear-gradient(135deg, #ff6a00, #ff2e00, #ff6a00)',
                    backgroundSize: '200% 200%',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    animation: 'flameGradient 3s ease-in-out infinite',
                    fontWeight: '600'
                  }}>Optimized for Minecraft & Game Servers</span>
                </div>
                <div className="flame-feature-item">
                  <span className="flame-feature-icon" style={{opacity: 1, filter: 'drop-shadow(0 0 2px #ff2e00)'}}>📦</span>
                  <span className="flame-feature-text" style={{
                    background: 'linear-gradient(135deg, #ff6a00, #ff2e00, #ff6a00)',
                    backgroundSize: '200% 200%',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    animation: 'flameGradient 3s ease-in-out infinite',
                    fontWeight: '600'
                  }}>One-Click Mod & Plugin Installation</span>
                </div>
                <div className="flame-feature-item">
                  <span className="flame-feature-icon" style={{opacity: 1, filter: 'drop-shadow(0 0 2px #ff2e00)'}}>⏰</span>
                  <span className="flame-feature-text" style={{
                    background: 'linear-gradient(135deg, #ff6a00, #ff2e00, #ff6a00)',
                    backgroundSize: '200% 200%',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    animation: 'flameGradient 3s ease-in-out infinite',
                    fontWeight: '600'
                  }}>99.9% Uptime Guarantee</span>
                </div>
                <div className="flame-feature-item">
                  <span className="flame-feature-icon" style={{opacity: 1, filter: 'drop-shadow(0 0 2px #ff2e00)'}}>💬</span>
                  <span className="flame-feature-text" style={{
                    background: 'linear-gradient(135deg, #ff6a00, #ff2e00, #ff6a00)',
                    backgroundSize: '200% 200%',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    animation: 'flameGradient 3s ease-in-out infinite',
                    fontWeight: '600'
                  }}>24/7 Premium Support</span>
                </div>
                <div className="flame-feature-item">
                  <span className="flame-feature-icon" style={{opacity: 1, filter: 'drop-shadow(0 0 2px #ff2e00)'}}>🔥</span>
                  <span className="flame-feature-text" style={{
                    background: 'linear-gradient(135deg, #ff6a00, #ff2e00, #ff6a00)',
                    backgroundSize: '200% 200%',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    animation: 'flameGradient 3s ease-in-out infinite',
                    fontWeight: '600'
                  }}>High Performance at Affordable Pricing</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;