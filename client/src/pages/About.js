import React, { useState, useEffect } from 'react';
import axios from 'axios';

const About = () => {
  const [about, setAbout] = useState(null);

  useEffect(() => {
    axios.get('/api/about').then(res => setAbout(res.data));
  }, []);

  if (!about) {
    return (
      <div className="card" style={{textAlign: 'center', padding: '60px'}}>
        <div style={{fontSize: '2rem', marginBottom: '16px'}}>⏳</div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h2>📋 About Flame Cloud Team</h2>
        <p>Learn more about our team and what makes us special</p>
      </div>

      {/* Main Layout: Staff on Left, Features on Right */}
      <div className="about-page-layout" style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'start'}}>
        
        {/* Left Side - Staff Members */}
        <div>
          <h3 style={{color: 'var(--text-primary)', marginBottom: '24px', fontSize: '1.3rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '12px'}}>
            <img src="/logo.png" alt="Flame Cloud" style={{width: '32px', height: '32px'}} />
            Flame Cloud Team
          </h3>
          <div style={{display: 'flex', flexDirection: 'column', gap: '50px'}}>
            {/* Founder */}
            <div style={{position: 'relative', marginTop: '50px'}}>
              {/* Badge Above Card */}
              <div style={{
                position: 'absolute',
                top: '-55px',
                left: '20px',
                background: 'transparent',
                border: '2px solid #ef4444',
                padding: '8px 20px',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                zIndex: 10
              }}>
                <span style={{fontSize: '1rem'}}>👑</span>
                <span style={{color: '#ef4444', fontWeight: '700', fontSize: '0.85rem'}}>FLAME FOUNDER</span>
              </div>
              
              <div className="plan-card" style={{padding: '20px', display: 'flex', alignItems: 'center', gap: '15px'}}>
                {about.coOwnerPhoto ? (
                  <img 
                    src={about.coOwnerPhoto} 
                    alt={about.coOwner}
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '3px solid #ef4444',
                      boxShadow: '0 0 20px rgba(239, 68, 68, 0.5)'
                    }}
                  />
                ) : (
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    fontWeight: '700',
                    color: '#fff',
                    border: '3px solid #ef4444'
                  }}>
                    {(about.coOwner || 'Rameez_xD').charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h3 style={{fontSize: '1.4rem', marginBottom: '6px', color: '#ef4444', fontWeight: '700'}}>{about.coOwner || 'Rameez_xD'}</h3>
                  <div style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
                    <span style={{fontSize: '18px'}}>👑</span>
                    <span style={{color: 'var(--text-muted)', fontSize: '0.95rem'}}>Founder & Lead Developer</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Owner */}
            <div style={{position: 'relative', marginTop: '50px'}}>
              {/* Badge Above Card */}
              <div style={{
                position: 'absolute',
                top: '-55px',
                left: '20px',
                background: 'transparent',
                border: '2px solid #FF6A00',
                padding: '8px 20px',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                zIndex: 10
              }}>
                <span style={{fontSize: '1rem'}}>👑</span>
                <span style={{color: '#FF6A00', fontWeight: '700', fontSize: '0.85rem'}}>FLAME OWNER</span>
              </div>
              
              <div className="plan-card" style={{padding: '20px', display: 'flex', alignItems: 'center', gap: '15px'}}>
                {about.ownerPhoto ? (
                  <img 
                    src={about.ownerPhoto} 
                    alt={about.owner}
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '3px solid #FF6A00',
                      boxShadow: '0 0 20px rgba(255, 106, 0, 0.5)'
                    }}
                  />
                ) : (
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #FF6A00, #FF2E00)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    fontWeight: '700',
                    color: '#fff'
                  }}>
                    {(about.owner || 'TGK').charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h3 style={{fontSize: '1.4rem', marginBottom: '6px', color: '#FF6A00', fontWeight: '700'}}>{about.owner || 'TGK'}</h3>
                  <div style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
                    <span style={{fontSize: '18px'}}>👑</span>
                    <span style={{color: 'var(--text-muted)', fontSize: '0.95rem'}}>Owner & Administrator</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Manager */}
            <div style={{position: 'relative', marginTop: '50px'}}>
              {/* Badge Above Card */}
              <div style={{
                position: 'absolute',
                top: '-55px',
                left: '20px',
                background: 'transparent',
                border: '2px solid #10b981',
                padding: '8px 20px',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                zIndex: 10
              }}>
                <span style={{fontSize: '1rem'}}>🛡️</span>
                <span style={{color: '#10b981', fontWeight: '700', fontSize: '0.85rem'}}>FLAME MANAGEMENT</span>
              </div>
              
              <div className="plan-card" style={{padding: '20px', display: 'flex', alignItems: 'center', gap: '15px'}}>
                {about.managersPhoto ? (
                  <img 
                    src={about.managersPhoto} 
                    alt={about.managers}
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '3px solid #10b981',
                      boxShadow: '0 0 20px rgba(16, 185, 129, 0.5)'
                    }}
                  />
                ) : (
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    fontWeight: '700',
                    color: '#fff'
                  }}>
                    {(about.managers || 'Newest_YT').charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h3 style={{fontSize: '1.4rem', marginBottom: '6px', color: '#10b981', fontWeight: '700'}}>{about.managers || 'Newest_YT'}</h3>
                  <div style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
                    <span style={{fontSize: '18px'}}>🛡️</span>
                    <span style={{color: 'var(--text-muted)', fontSize: '0.95rem'}}>Server Manager</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Features */}
        <div>
          <h3 style={{color: 'var(--text-primary)', marginBottom: '24px', fontSize: '1.3rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '12px'}}>
            <span>✨</span>
            Our Features
          </h3>
          <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
            {/* AMD EPYC */}
            <div className="card" style={{padding: '20px', display: 'flex', gap: '16px', alignItems: 'flex-start'}}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '12px',
                background: 'rgba(6, 182, 212, 0.1)',
                border: '1px solid rgba(6, 182, 212, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#06b6d4" strokeWidth="1.5"><rect x="2" y="6" width="20" height="12" rx="2"/><line x1="6" y1="10" x2="6" y2="14"/><line x1="4" y1="12" x2="8" y2="12"/><circle cx="16" cy="10" r="1.5"/><circle cx="19" cy="13" r="1.5"/></svg>
              </div>
              <div>
                <h4 style={{fontSize: '0.95rem', marginBottom: '2px', color: 'var(--text-primary)', fontWeight: '700'}}>AMD EPYC POWERED</h4>
                <p style={{fontSize: '0.8rem', color: '#06b6d4', marginBottom: '4px', fontWeight: '600'}}>Premium Performance</p>
                <p style={{fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4'}}>All servers powered by AMD EPYC processors.</p>
              </div>
            </div>

            {/* DDoS Protection */}
            <div className="card" style={{padding: '20px', display: 'flex', gap: '16px', alignItems: 'flex-start'}}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '12px',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#10b981" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <div>
                <h4 style={{fontSize: '0.95rem', marginBottom: '2px', color: 'var(--text-primary)', fontWeight: '700'}}>DDOS PROTECTION</h4>
                <p style={{fontSize: '0.8rem', color: '#10b981', marginBottom: '4px', fontWeight: '600'}}>Online, Always</p>
                <p style={{fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4'}}>Advanced security to keep your server safe.</p>
              </div>
            </div>

            {/* Lag Free */}
            <div className="card" style={{padding: '20px', display: 'flex', gap: '16px', alignItems: 'flex-start'}}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '12px',
                background: 'rgba(139, 92, 246, 0.1)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#8b5cf6" strokeWidth="1.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              </div>
              <div>
                <h4 style={{fontSize: '0.95rem', marginBottom: '2px', color: 'var(--text-primary)', fontWeight: '700'}}>LAG IS NO MORE</h4>
                <p style={{fontSize: '0.8rem', color: '#8b5cf6', marginBottom: '4px', fontWeight: '600'}}>Smooth Gameplay</p>
                <p style={{fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4'}}>Latest hardware for zero lag gaming.</p>
              </div>
            </div>

            {/* Multiple Locations */}
            <div className="card" style={{padding: '20px', display: 'flex', gap: '16px', alignItems: 'flex-start'}}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '12px',
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#f59e0b" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              </div>
              <div>
                <h4 style={{fontSize: '0.95rem', marginBottom: '2px', color: 'var(--text-primary)', fontWeight: '700'}}>MULTIPLE LOCATIONS</h4>
                <p style={{fontSize: '0.8rem', color: '#f59e0b', marginBottom: '4px', fontWeight: '600'}}>UAE • India • Germany</p>
                <p style={{fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4'}}>Choose from 3 global locations.</p>
              </div>
            </div>

            {/* Instant Setup */}
            <div className="card" style={{padding: '20px', display: 'flex', gap: '16px', alignItems: 'flex-start'}}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '12px',
                background: 'rgba(6, 182, 212, 0.1)',
                border: '1px solid rgba(6, 182, 212, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#06b6d4" strokeWidth="1.5"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24"/></svg>
              </div>
              <div>
                <h4 style={{fontSize: '0.95rem', marginBottom: '2px', color: 'var(--text-primary)', fontWeight: '700'}}>INSTANT SETUP</h4>
                <p style={{fontSize: '0.8rem', color: '#06b6d4', marginBottom: '4px', fontWeight: '600'}}>60 Seconds</p>
                <p style={{fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4'}}>Your server is ready in under a minute.</p>
              </div>
            </div>

            {/* 24/7 Support */}
            <div className="card" style={{padding: '20px', display: 'flex', gap: '16px', alignItems: 'flex-start'}}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '12px',
                background: 'rgba(236, 72, 153, 0.1)',
                border: '1px solid rgba(236, 72, 153, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#ec4899" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87m-4-12a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <div>
                <h4 style={{fontSize: '0.95rem', marginBottom: '2px', color: 'var(--text-primary)', fontWeight: '700'}}>24/7 SUPPORT</h4>
                <p style={{fontSize: '0.8rem', color: '#ec4899', marginBottom: '4px', fontWeight: '600'}}>Always Available</p>
                <p style={{fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4'}}>Expert support team ready to help anytime.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;