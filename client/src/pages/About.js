import React, { useState, useEffect } from 'react';
import { supabase } from '../context/AuthContext';

const About = () => {
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    try {
      const { data, error } = await supabase
        .from('about_content')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 is 'not found'
      if (data) {
        setAbout(data);
      }
    } catch (err) {
      console.error('Error fetching about:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <div className="page-header">
        <h2>🔥 About Flame Cloud</h2>
        <p>Premium Gaming Server Hosting Platform</p>
      </div>

      {/* Main About Section - Two Column Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '60px',
        alignItems: 'start',
        marginBottom: '60px',
        '@media (max-width: 1024px)': {
          gridTemplateColumns: '1fr',
          gap: '40px'
        }
      }}>
        {/* LEFT SIDE - Team Hierarchy */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          alignItems: 'flex-start'
        }}>
          {/* Founder Card - Top Left (Highlighted) */}
          <div
            onMouseEnter={() => setHoveredCard('founder')}
            onMouseLeave={() => setHoveredCard(null)}
            style={{
              background: 'linear-gradient(165deg, rgba(255, 46, 0, 0.12), rgba(255, 106, 0, 0.06))',
              backdropFilter: 'blur(14px)',
              border: '1px solid rgba(255, 46, 0, 0.25)',
              borderRadius: '18px',
              padding: '28px',
              width: '100%',
              maxWidth: '360px',
              textAlign: 'center',
              alignSelf: 'center',
              position: 'relative',
              overflow: 'visible',
              transition: 'all 0.25s ease',
              transform: hoveredCard === 'founder' ? 'translateY(-8px) scale(1.02)' : 'scale(1)',
              boxShadow: hoveredCard === 'founder'
                ? '0 18px 48px rgba(255, 46, 0, 0.24), 0 0 30px rgba(255, 106, 0, 0.14)'
                : '0 8px 26px rgba(255, 46, 0, 0.12)'
            }}>
            {/* Flame Founder badge (outside box, glowing gradient text) */}
            <div style={{ position: 'absolute', top: '-44px', left: '50%', transform: 'translateX(-50%)', zIndex: 3 }}>
              <div style={{
                display: 'inline-block',
                padding: '6px 14px',
                background: 'rgba(10,6,4,0.28)',
                border: '1px solid rgba(255,46,0,0.18)',
                borderRadius: '18px',
                boxShadow: '0 12px 36px rgba(255,60,10,0.18), 0 0 30px rgba(255,110,20,0.12)'
              }}>
                <span style={{
                  background: 'linear-gradient(90deg,#FF2E00,#FF6A00,#FFD000)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontWeight: 800,
                  fontSize: '0.92rem',
                  letterSpacing: '0.6px',
                  whiteSpace: 'nowrap',
                  display: 'inline-block'
                }}>Flame Founder</span>
              </div>
            </div>

            {/* Glow background */}
            <div style={{
              position: 'absolute',
              top: '-50%',
              left: '-50%',
              width: '200%',
              height: '200%',
              background: 'radial-gradient(circle, rgba(255, 46, 0, 0.2) 0%, transparent 70%)',
              pointerEvents: 'none',
              opacity: hoveredCard === 'founder' ? 1 : 0.5,
              transition: 'opacity 0.3s ease'
            }}></div>

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{
                width: '96px',
                height: '96px',
                borderRadius: '50%',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                boxShadow: '0 8px 30px rgba(255, 46, 0, 0.36)',
                border: '3px solid rgba(255, 106, 0, 0.22)',
                background: 'linear-gradient(180deg, rgba(30,18,10,0.7), rgba(20,12,8,0.6))'
              }}>
                <img src="/rameez-xd.png" alt="Rammez_xD" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/logo.png' }} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
              </div>
              <div style={{
                background: 'linear-gradient(135deg, #FF2E00, #FF6A00)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontSize: '0.65rem',
                fontWeight: '800',
                letterSpacing: '1.8px',
                marginBottom: '6px',
                textTransform: 'uppercase'
              }}>
                Founder & Visionary
              </div>
              {/* Owner badge will appear above the Owner card (moved to owner card) */}
              <h3 style={{
                fontSize: '1.1rem',
                fontWeight: '800',
                color: 'var(--text-primary)',
                marginBottom: '8px'
              }}>
                {'Rammez_xD'}
              </h3>
              <p style={{
                color: 'var(--text-muted)',
                fontSize: '0.95rem',
                lineHeight: '1.4',
                margin: 0
              }}>
                {about?.founder_bio ? about.founder_bio : 'Founder of Flame Cloud.'}
              </p>
            </div>
          </div>

          {/* Owner & Management Cards - Bottom Row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '24px',
            width: '100%',
            marginTop: '22px',
            maxWidth: '620px',
            marginRight: 'auto'
          }}>
            {/* Owner Card - Left */}
            <div
              onMouseEnter={() => setHoveredCard('owner')}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                background: 'transparent',
                border: hoveredCard === 'owner' ? '1px solid rgba(255,106,0,0.18)' : '1px solid rgba(255,106,0,0.08)',
                borderRadius: '18px',
                padding: '30px',
                textAlign: 'center',
                position: 'relative',
                overflow: 'visible',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: hoveredCard === 'owner' ? 'translateY(-8px) scale(1.02)' : 'translateY(0)',
                boxShadow: hoveredCard === 'owner'
                  ? '0 20px 48px rgba(255, 106, 0, 0.12), inset 0 2px 10px rgba(255,46,0,0.02)'
                  : '0 6px 22px rgba(0,0,0,0.42)'
              }}>
              <div style={{ position: 'relative', zIndex: 1 }}>
                {/* Flame Owner badge (outside box, glowing gradient text) */}
                <div style={{ position: 'absolute', top: '-52px', left: '50%', transform: 'translateX(-50%)', zIndex: 6 }}>
                  <div style={{
                    display: 'inline-block',
                    padding: '8px 16px',
                    background: 'rgba(22,14,10,0.6)',
                    border: '1px solid rgba(255,120,40,0.16)',
                    borderRadius: '24px',
                    boxShadow: '0 14px 40px rgba(255,80,10,0.14)'
                  }}>
                    <span style={{
                      background: 'linear-gradient(90deg,#FF2E00,#FF6A00,#FFD000)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      fontWeight: 900,
                      fontSize: '1rem',
                      whiteSpace: 'nowrap',
                      display: 'inline-block'
                    }}>Flame Owner</span>
                  </div>
                </div>

                <div style={{
                  width: '84px',
                  height: '84px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  boxShadow: '0 10px 30px rgba(255, 106, 0, 0.30)',
                  border: '2px solid rgba(255, 208, 0, 0.2)',
                  background: 'linear-gradient(180deg, rgba(30,18,10,0.7), rgba(20,12,8,0.6))'
                }}>
                  <img src="/tgkflex.jpg" alt="TGKFLEX" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/logo.png' }} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                </div>
                <div style={{
                  background: 'linear-gradient(135deg, #FF6A00, #FFD000)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontSize: '0.65rem',
                  fontWeight: '700',
                  letterSpacing: '1.5px',
                  marginBottom: '6px',
                  textTransform: 'uppercase'
                }}>
                  Operations Head
                </div>
                <h4 style={{
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  color: 'var(--text-primary)',
                  marginBottom: '8px'
                }}>
                  {about?.owner_name || 'TGKFLEX'}
                </h4>
                <p style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.85rem',
                  lineHeight: '1.5',
                  margin: 0
                }}>
                  Manages core infrastructure and uptime.
                </p>
              </div>
            </div>

            {/* Management Card - Right */}
            <div
              onMouseEnter={() => setHoveredCard('management')}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                background: 'transparent',
                border: hoveredCard === 'management' ? '1px solid rgba(255,106,0,0.18)' : '1px solid rgba(255,106,0,0.08)',
                borderRadius: '18px',
                padding: '30px',
                textAlign: 'center',
                position: 'relative',
                overflow: 'visible',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: hoveredCard === 'management' ? 'translateY(-8px) scale(1.02)' : 'translateY(0)',
                boxShadow: hoveredCard === 'management'
                  ? '0 20px 48px rgba(255, 106, 0, 0.12), inset 0 2px 10px rgba(255,46,0,0.02)'
                  : '0 6px 22px rgba(0,0,0,0.42)'
              }}>
              <div style={{ position: 'relative', zIndex: 1 }}>
                {/* Flame Management badge (outside box, glowing gradient text) */}
                <div style={{ position: 'absolute', top: '-52px', left: '50%', transform: 'translateX(-50%)', zIndex: 6 }}>
                  <div style={{
                    display: 'inline-block',
                    padding: '8px 16px',
                    background: 'rgba(22,14,10,0.6)',
                    border: '1px solid rgba(255,120,40,0.16)',
                    borderRadius: '24px',
                    boxShadow: '0 14px 40px rgba(255,80,10,0.14)'
                  }}>
                    <span style={{
                      background: 'linear-gradient(90deg,#FF2E00,#FF6A00,#FFD000)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      fontWeight: 900,
                      fontSize: '1rem',
                      whiteSpace: 'nowrap',
                      display: 'inline-block'
                    }}>Flame Management</span>
                  </div>
                </div>

                <div style={{
                  width: '84px',
                  height: '84px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  boxShadow: '0 10px 30px rgba(255, 106, 0, 0.30)',
                  border: '2px solid rgba(255, 106, 0, 0.2)',
                  background: 'linear-gradient(180deg, rgba(30,18,10,0.7), rgba(20,12,8,0.6))'
                }}>
                  <img src="/pie-legend.jpg" alt="!Pie LEGEND" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/logo.png' }} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                </div>
                <div style={{
                  background: 'linear-gradient(135deg, #FF2E00, #FF6A00)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontSize: '0.65rem',
                  fontWeight: '700',
                  letterSpacing: '1.5px',
                  marginBottom: '6px',
                  textTransform: 'uppercase'
                }}>
                  Support Lead
                </div>
                <h4 style={{
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  color: 'var(--text-primary)',
                  marginBottom: '8px'
                }}>
                  {about?.management_name || '!Pie LEGEND'}
                </h4>
                <p style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.85rem',
                  lineHeight: '1.5',
                  margin: 0
                }}>
                  Responsible for customer support and satisfaction.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - Company Story */}
        <div>
          <div style={{
            background: 'linear-gradient(165deg, rgba(20, 12, 8, 0.95), rgba(30, 18, 10, 0.85))',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 106, 0, 0.2)',
            borderRadius: '24px',
            padding: '40px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Glow effect */}
            <div style={{
              position: 'absolute',
              top: '-50%',
              left: '-50%',
              width: '200%',
              height: '200%',
              background: 'radial-gradient(circle, rgba(255, 46, 0, 0.1) 0%, transparent 70%)',
              pointerEvents: 'none'
            }}></div>

            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 style={{
                fontSize: '2.2rem',
                fontWeight: '800',
                background: 'linear-gradient(135deg, #FF2E00, #FF6A00, #FFD000)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <img src="/logo.png" alt="Flame Cloud" style={{ width: '42px', height: '42px', objectFit: 'contain' }} />
                About Flame Cloud
              </h2>

              {/* Key Features */}
              <div style={{ marginTop: '32px' }}>
                <h3 style={{
                  fontSize: '1.3rem',
                  fontWeight: '700',
                  color: 'var(--text-primary)',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  ⚡ Why Choose Flame Cloud?
                </h3>

                <div style={{ display: 'grid', gap: '14px' }}>
                  {[
                    { icon: '🚀', text: 'Ultra-Fast NVMe SSD Servers' },
                    { icon: '🌍', text: 'Global Server Locations' },
                    { icon: '🔒', text: 'DDoS Protection (Enterprise Level)' },
                    { icon: '⚙️', text: 'Full Control Panel Access' },
                    { icon: '🧠', text: 'Optimized for Minecraft & Game Servers' },
                    { icon: '📦', text: 'One-Click Mod & Plugin Installation' },
                    { icon: '⏱️', text: '99.9% Uptime Guarantee' },
                    { icon: '💬', text: '24/7 Premium Support' },
                    { icon: '💰', text: 'High Performance at Affordable Pricing' }
                  ].map((feature, idx) => (
                    <div key={idx} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 16px',
                      background: 'transparent',
                      borderRadius: '10px',
                      border: '1px solid transparent',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.borderColor = 'transparent';
                        e.currentTarget.style.transform = 'translateX(8px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.borderColor = 'transparent';
                        e.currentTarget.style.transform = 'translateX(0)';
                      }}>
                      <span style={{ fontSize: '1.3rem' }}>{feature.icon}</span>
                      <span style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>
                        {feature.text}
                      </span>
                    </div>
                  ))}
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
