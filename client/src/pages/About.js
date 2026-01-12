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
        <h2>📋 About Flame Cloud</h2>
        <p>Learn more about our premium Minecraft hosting platform</p>
      </div>
      
      <div className="card about-card">
        <h3>🔥 Who We Are</h3>
        <p style={{lineHeight: '1.9', color: 'var(--text-secondary)', fontSize: '1.05rem'}}>{about.content}</p>
        
        <div className="staff-grid" style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'flex-end', gap: '30px'}}>
          <div className="staff-item staff-owner" style={{order: 1, minWidth: '200px', padding: '25px 35px'}}>
            <div className="role" style={{fontSize: '1.1rem'}}>👑 OWNER</div>
            <div className="name" style={{fontSize: '1.3rem'}}>{about.owner}</div>
          </div>
          <div className="staff-item staff-founder" style={{order: 2, transform: 'translateY(-30px)', minWidth: '240px', padding: '35px 45px', background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.2), rgba(239, 68, 68, 0.1))', border: '2px solid rgba(220, 38, 38, 0.5)'}}>
            <div className="role" style={{fontSize: '1.3rem', color: '#ef4444'}}>👑 FOUNDER</div>
            <div className="name" style={{fontSize: '1.5rem'}}>{about.coOwner || 'Rameez_xD'}</div>
          </div>
          <div className="staff-item staff-manager" style={{order: 3, minWidth: '200px', padding: '25px 35px'}}>
            <div className="role" style={{fontSize: '1rem'}}>🛡️ MANAGERS</div>
            <div className="name" style={{fontSize: '1.2rem'}}>{about.managers}</div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>🎯 Our Mission</h3>
        <p style={{color: 'var(--text-secondary)', lineHeight: '1.9', fontSize: '1.05rem'}}>
          We focus on providing high-performance, stable, and easy-to-manage Minecraft servers. 
          Our platform offers both paid and free hosting options with a modern panel-style dashboard, 
          custom plans, and a ticket-based support system with full transparency.
        </p>
      </div>

      <div className="card">
        <h3>⚡ Why Choose Us?</h3>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '20px'}}>
          <div className="staff-item">
            <div style={{fontSize: '2rem', marginBottom: '12px'}}>🚀</div>
            <div className="name">High Performance</div>
            <p style={{color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '8px'}}>AMD Ryzen powered servers</p>
          </div>
          <div className="staff-item">
            <div style={{fontSize: '2rem', marginBottom: '12px'}}>🛡️</div>
            <div className="name">DDoS Protection</div>
            <p style={{color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '8px'}}>Enterprise-grade security</p>
          </div>
          <div className="staff-item">
            <div style={{fontSize: '2rem', marginBottom: '12px'}}>💬</div>
            <div className="name">24/7 Support</div>
            <p style={{color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '8px'}}>Always here to help</p>
          </div>
          <div className="staff-item">
            <div style={{fontSize: '2rem', marginBottom: '12px'}}>💰</div>
            <div className="name">Affordable Prices</div>
            <p style={{color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '8px'}}>Best value for money</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
