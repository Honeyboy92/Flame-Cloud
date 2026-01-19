import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const YTPartners = () => {
  const [partners, setPartners] = useState([]);
  const [isEnabled, setIsEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [partnersRes, settingRes] = await Promise.all([
          supabase.from('yt_partners').select('*').order('sort_order'),
          supabase.from('site_settings').select('value').eq('key', 'yt_partners_enabled').single()
        ]);
        setPartners(partnersRes.data || []);
        setIsEnabled(settingRes.data?.value === '1');
      } catch (err) {
        // If error, default to disabled
        setIsEnabled(false);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div>
        <div className="page-header">
          <h2 style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
            <svg viewBox="0 0 24 24" width="32" height="32" fill="#FF0000">
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
            </svg>
            YT Partners
          </h2>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Show Coming Soon if disabled
  if (!isEnabled) {
    return (
      <div>
        <div className="page-header">
          <h2 style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
            <svg viewBox="0 0 24 24" width="32" height="32" fill="#FF0000">
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
            </svg>
            YT Partners
          </h2>
          <p>Our amazing YouTube partners who support Flame Cloud</p>
        </div>
        <div className="card">
          <div className="empty-state">
            <div className="icon">🎥</div>
            <h3>Coming Soon!</h3>
            <p>Our YT Partners program is launching soon. Stay tuned!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h2 style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
          <svg viewBox="0 0 24 24" width="32" height="32" fill="#FF0000" style={{filter: 'drop-shadow(0 2px 4px rgba(255,0,0,0.3))'}}>
            <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
          </svg>
          YT Partners
        </h2>
        <p>Our amazing YouTube partners who support Flame Cloud</p>
      </div>

      {partners.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="icon">🎥</div>
            <h3>No Partners Yet</h3>
            <p>Check back soon for our YouTube partners!</p>
          </div>
        </div>
      ) : (
        <div className="plans-grid">
          {partners.map(partner => (
            <div key={partner.id} className="plan-card" style={{position: 'relative', padding: '20px'}}>
              {/* Featured Star Badge */}
              {partner.isFeatured === 1 && (
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  boxShadow: '0 4px 15px rgba(255, 215, 0, 0.4)'
                }}>
                  <span style={{fontSize: '1rem'}}>⭐</span>
                  <span style={{color: '#000', fontWeight: '700', fontSize: '0.75rem'}}>FEATURED</span>
                </div>
              )}
              
              {/* Logo and Name Side by Side */}
              <div style={{display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px'}}>
                {partner.logo ? (
                  <img 
                    src={partner.logo} 
                    alt={partner.name}
                    style={{
                      width: '70px',
                      height: '70px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: partner.isFeatured === 1 ? '3px solid #FFD700' : '2px solid #FF6A00',
                      boxShadow: partner.isFeatured === 1 ? '0 0 20px rgba(255, 215, 0, 0.5)' : 'none'
                    }}
                  />
                ) : (
                  <div style={{
                    width: '70px',
                    height: '70px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #FF6A00, #FF2E00)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.8rem',
                    fontWeight: '700',
                    color: '#fff',
                    border: partner.isFeatured === 1 ? '3px solid #FFD700' : 'none'
                  }}>
                    {partner.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h3 style={{fontSize: '1.2rem', marginBottom: '4px', color: 'var(--text-primary)'}}>{partner.name}</h3>
                  <div style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="#FF0000">
                      <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                    </svg>
                    <span style={{color: 'var(--text-muted)', fontSize: '0.85rem'}}>YouTube Partner</span>
                  </div>
                </div>
              </div>
              
              <a 
                href={partner.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{width: '100%', textAlign: 'center', textDecoration: 'none', background: 'linear-gradient(135deg, #FF0000, #CC0000)', padding: '12px', fontSize: '0.9rem'}}
              >
                <svg viewBox="0 0 24 24" fill="white" width="16" height="16" style={{verticalAlign: 'middle', marginRight: '8px'}}>
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                </svg>
                Visit Channel
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default YTPartners;
