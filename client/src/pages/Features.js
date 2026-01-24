import React, { useState } from 'react';

const Features = () => {
  const [hoveredFeature, setHoveredFeature] = useState(null);

  const features = [
    {
      icon: '⚡',
      title: 'High Performance Servers',
      description: 'Blazing-fast servers powered by latest CPUs and NVMe SSDs, optimized specially for Minecraft and gaming workloads. No lag, no compromise — just pure performance.'
    },
    {
      icon: '🌍',
      title: 'Global Low-Latency Network',
      description: 'Multiple global server locations to ensure ultra-low ping and smooth gameplay for players worldwide.'
    },
    {
      icon: '🛡️',
      title: 'Advanced DDoS Protection',
      description: 'Enterprise-grade DDoS protection keeps your servers safe 24/7 from attacks, floods, and exploits.'
    },
    {
      icon: '🎮',
      title: 'Minecraft Optimized Hosting',
      description: 'Fully optimized for Vanilla, Spigot, Paper, Fabric, and Forge. Run mods, plugins, and custom jars with ease.'
    },
    {
      icon: '⚙️',
      title: 'Full Control Panel Access',
      description: 'Powerful and user-friendly control panel with Start/Stop/Restart, File Manager, Plugin & Mod installer, and Console access.'
    },
    {
      icon: '📦',
      title: 'One-Click Mod & Plugin Installer',
      description: 'Install popular plugins, mods, and modpacks with just one click — no manual setup needed.'
    },
    {
      icon: '🧠',
      title: 'Smart Resource Allocation',
      description: 'Dedicated RAM, CPU, and storage — no overselling. What you buy is what you get.'
    },
    {
      icon: '🔄',
      title: 'Instant Setup',
      description: 'Your server is deployed within seconds after purchase. No waiting, no delays.'
    },
    {
      icon: '💬',
      title: '24/7 Premium Support',
      description: 'Our expert support team is available 24/7 to help you with setup, optimization, and troubleshooting.'
    },
    {
      icon: '🔒',
      title: 'Secure & Reliable',
      description: 'Automatic backups, secure file access, encrypted connections, and 99.9% uptime guarantee.'
    },
    {
      icon: '💰',
      title: 'Affordable & Flexible Plans',
      description: 'Premium performance at budget-friendly prices with scalable plans for beginners and professionals.'
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <div style={{
        textAlign: 'center',
        marginBottom: '60px',
        position: 'relative'
      }}>
        <h1 style={{
          fontSize: '3.5rem',
          fontWeight: '900',
          background: 'linear-gradient(135deg, #FF2E00, #FF6A00, #FFD000)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px'
        }}>
          <img src="/logo.png" alt="Flame Cloud" style={{width: '64px', height: '64px', objectFit: 'contain'}} />
          FLAME CLOUD — FEATURES
        </h1>
        <p style={{
          fontSize: '1.3rem',
          color: 'var(--text-secondary)',
          maxWidth: '700px',
          margin: '0 auto',
          lineHeight: '1.8'
        }}>
          Powerful Gaming Hosting Features
        </p>
        <div style={{
          height: '3px',
          background: 'linear-gradient(90deg, transparent, #FF6A00, transparent)',
          maxWidth: '200px',
          margin: '24px auto 0'
        }}></div>
      </div>

      {/* Taglines section removed per user request */}

      {/* Requested 6-feature center-aligned 3x2 grid */}
      <div style={{textAlign: 'center', marginBottom: '40px'}}>
        <h2 style={{
          fontSize: '1.9rem',
          fontWeight: 800,
          color: 'var(--text-primary)',
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px'
        }}>
          <img src="/logo.png" alt="logo" style={{width: '36px', height: '36px', objectFit: 'contain'}} />
          FLAME CLOUD – Minecraft Hosting Features
        </h2>
        <p style={{color: 'var(--text-secondary)', marginBottom: '18px'}}>Everything you need to run fast, reliable Minecraft servers.</p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(220px, 1fr))',
          gap: '20px',
          maxWidth: '980px',
          margin: '0 auto'
        }}>
          {(() => {
            const core = [
              { icon: '⚡', title: 'High-Performance NVMe SSD Servers', desc: 'Blazing-fast NVMe storage and tuned CPUs for lag-free gameplay.' },
              { icon: '🧠', title: 'Easy-to-Use Control Panel', desc: 'Intuitive panel for server start/stop, file management and settings.' },
              { icon: '🔒', title: 'Advanced DDoS Protection', desc: 'Enterprise-grade protection to keep your server online under attack.' },
              { icon: '🔌', title: 'One-Click Plugins & Mods Installer', desc: 'Install plugins and mods instantly with zero manual setup.' },
              { icon: '💬', title: '24/7 Live Chat Support', desc: 'Support team available around the clock to help with issues.' },
              { icon: '📦', title: 'Instant Minecraft Server Setup', desc: 'Auto-deploy servers in seconds after purchase.' }
            ];

            // create 9 slots (3x3). fill remaining with null placeholders to preserve grid shape
            const slots = [...core, ...Array(9 - core.length).fill(null)];

            return slots.map((f, i) => {
              if (!f) {
                // invisible placeholder to keep the 3x3 layout centered
                return <div key={`ph-${i}`} style={{visibility: 'hidden'}} />;
              }

              return (
                <div
                  key={i}
                  onMouseEnter={() => setHoveredFeature(i)}
                  onMouseLeave={() => setHoveredFeature(null)}
                  style={{
                    position: 'relative',
                    background: 'linear-gradient(165deg, rgba(18,14,12,0.92), rgba(28,18,14,0.88))',
                    border: '1px solid rgba(255,106,0,0.12)',
                    borderRadius: '12px',
                    padding: '14px',
                    textAlign: 'center',
                    color: 'var(--text-primary)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'transform 220ms ease, box-shadow 220ms ease, border 160ms ease',
                    transform: hoveredFeature === i ? 'translateY(-8px) scale(1.035)' : 'translateY(0) scale(1)',
                    border: hoveredFeature === i ? '2px solid rgba(255,46,0,0.95)' : '1px solid rgba(255,106,0,0.12)',
                    boxShadow: hoveredFeature === i
                      ? '0 16px 40px rgba(255,46,0,0.18), inset 0 0 40px rgba(255,46,0,0.03)'
                      : '0 6px 18px rgba(0,0,0,0.35)',
                    cursor: 'pointer',
                    outline: hoveredFeature === i ? '3px solid rgba(255,46,0,0.06)' : 'none',
                    outlineOffset: hoveredFeature === i ? '6px' : '0'
                  }}
                >
                  {/* subtle top glow accent */}
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: hoveredFeature === i ? '64px' : '44px',
                    height: '6px',
                    borderRadius: '6px',
                    background: hoveredFeature === i ? 'linear-gradient(90deg, #FF2E00, #FF6A00)' : 'linear-gradient(90deg, rgba(255,106,0,0.14), rgba(255,106,0,0.06))',
                    transition: 'all 220ms ease',
                    boxShadow: hoveredFeature === i ? '0 6px 20px rgba(255,106,0,0.14)' : 'none',
                    pointerEvents: 'none'
                  }} />

                  <div style={{fontSize: '1.9rem'}}>{f.icon}</div>
                  <div style={{fontWeight: 800, fontSize: '1rem'}}>{f.title}</div>
                  <div style={{color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '260px'}}>{f.desc}</div>
                </div>
              );
            });
          })()}
        </div>
      </div>

      {/* Features Grid removed per user request; kept the 6-item 3x3 block above as the canonical features display */}

      {/* Feature Highlights Section */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(255, 46, 0, 0.15), rgba(255, 106, 0, 0.08))',
        border: '2px solid rgba(255, 106, 0, 0.3)',
        borderRadius: '24px',
        padding: '48px',
        marginBottom: '60px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{position: 'relative', zIndex: 1}}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: '800',
            color: 'var(--text-primary)',
            marginBottom: '32px',
            textAlign: 'center'
          }}>
            🎮 Minecraft Optimization
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '16px'
          }}>
            {['Vanilla', 'Spigot', 'Paper', 'Fabric', 'Forge'].map((type, idx) => (
              <div key={idx} style={{
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 106, 0, 0.3)',
                borderRadius: '12px',
                padding: '16px',
                textAlign: 'center',
                fontWeight: '600',
                color: 'var(--text-primary)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 106, 0, 0.15)';
                e.currentTarget.style.borderColor = 'rgba(255, 106, 0, 0.6)';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.3)';
                e.currentTarget.style.borderColor = 'rgba(255, 106, 0, 0.3)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}>
                {type}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
