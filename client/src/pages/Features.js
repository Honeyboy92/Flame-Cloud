import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const Features = () => {
  const [discordMembers, setDiscordMembers] = useState('400+');

  useEffect(() => {
    const fetchDiscordMembers = async () => {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'discord_members')
          .single();
        
        if (!error && data) {
          setDiscordMembers(data.value);
        }
      } catch (err) {
        console.error('Error fetching Discord members:', err);
      }
    };
    
    fetchDiscordMembers();
  }, []);

  const features = [
    {
      icon: <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#06b6d4" strokeWidth="1.5"><rect x="2" y="6" width="20" height="12" rx="2"/><line x1="6" y1="10" x2="6" y2="14"/><line x1="4" y1="12" x2="8" y2="12"/><circle cx="16" cy="10" r="1.5"/><circle cx="19" cy="13" r="1.5"/></svg>,
      title: 'AMD EPYC POWERED',
      subtitle: 'Premium Performance',
      description: 'All servers powered by AMD EPYC processors for ultimate performance.'
    },
    {
      icon: <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#10b981" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
      title: 'DDOS PROTECTION',
      subtitle: 'Online, Always',
      description: 'Advanced security to keep your server safe from attacks.'
    },
    {
      icon: <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#8b5cf6" strokeWidth="1.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
      title: 'LAG IS NO MORE',
      subtitle: 'Smooth Gameplay',
      description: 'Latest hardware for zero lag on your Minecraft server.'
    },
    {
      icon: <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#f59e0b" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
      title: 'MULTIPLE LOCATIONS',
      subtitle: 'UAE • India • Germany',
      description: 'Choose from 3 global locations for best gaming experience.'
    },
    {
      icon: <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#06b6d4" strokeWidth="1.5"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24"/></svg>,
      title: 'INSTANT SETUP',
      subtitle: '60 Seconds',
      description: 'Your server is ready in under a minute after purchase.'
    },
    {
      icon: <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#ec4899" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87m-4-12a4 4 0 0 1 0 7.75"/></svg>,
      title: '24/7 SUPPORT',
      subtitle: 'Always Available',
      description: 'Expert support team ready to help you anytime.'
    }
  ];

  return (
    <div>
      <div className="page-header">
        <h2>✨ Our Features</h2>
        <p>Why choose Flame Cloud for your Minecraft server?</p>
      </div>

      {/* Features Grid */}
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px', marginBottom: '50px'}}>
        {features.map((feature, index) => (
          <div key={index} className="card" style={{padding: '30px', display: 'flex', gap: '20px', alignItems: 'flex-start', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'}}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '12px',
              background: 'rgba(139, 92, 246, 0.1)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}>
              {feature.icon}
            </div>
            <div>
              <h3 style={{fontSize: '1.1rem', marginBottom: '4px', color: 'var(--text-primary)', fontWeight: '700'}}>{feature.title}</h3>
              <p style={{fontSize: '0.85rem', color: '#FF6A00', marginBottom: '8px', fontWeight: '600'}}>{feature.subtitle}</p>
              <p style={{fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6'}}>{feature.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions - At Bottom */}
      <div className="quick-actions-grid">
        <div className="quick-action-card">
          <div className="quick-action-icon" style={{background: 'transparent', border: '2px solid #FF2E00'}}>
            <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="#FF2E00" strokeWidth="1.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
          </div>
          <h4>99.9% Uptime</h4>
          <p>Guaranteed server availability</p>
        </div>
        
        <div className="quick-action-card">
          <div className="quick-action-icon" style={{background: 'transparent', border: '2px solid #FF2E00'}}>
            <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="#FF2E00" strokeWidth="1.5">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <h4>24/7 Support</h4>
          <p>Always here to help you</p>
        </div>
        
        <div className="quick-action-card">
          <div className="quick-action-icon" style={{background: 'transparent', border: '2px solid #FF2E00'}}>
            <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="#FF2E00" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
          </div>
          <h4>Global Network</h4>
          <p>Servers worldwide</p>
        </div>
        
        <a href="https://discord.gg/WXWYz5ywTU" target="_blank" rel="noopener noreferrer" className="quick-action-card">
          <div className="quick-action-icon" style={{background: 'transparent', border: '2px solid #FF2E00'}}>
            <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="#FF2E00" strokeWidth="1.5">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
            </svg>
          </div>
          <h4>{discordMembers} Members</h4>
          <p>Join our community</p>
        </a>
      </div>
    </div>
  );
};

export default Features;
