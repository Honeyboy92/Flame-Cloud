import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const PaidPlans = () => {
  const { user } = useAuth();
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);
  const [screenshot, setScreenshot] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [locationSettings, setLocationSettings] = useState([]);

  useEffect(() => {
    axios.get('/api/plans/paid').then(res => setPlans(res.data));
    axios.get('/api/plans/locations').then(res => setLocationSettings(res.data));
  }, []);

  const isLocationAvailable = (location) => {
    const loc = locationSettings.find(l => l.location === location);
    return loc ? loc.isAvailable : false;
  };

  const handlePlanClick = (plan) => {
    // Check if location is not available - show Coming Soon
    if (!isLocationAvailable(plan.location)) {
      setSelectedPlan(plan);
      setShowComingSoonModal(true);
      return;
    }
    // Available location - show purchase modal
    setSelectedPlan(plan);
    setShowModal(true);
    setScreenshot(null);
    setScreenshotPreview(null);
    setSuccess('');
    setSelectedPaymentMethod(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setScreenshot(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!screenshot) {
      alert('Please upload payment screenshot!');
      return;
    }
    setLoading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result;
        await axios.post('/api/tickets', {
          subject: `Plan Order: ${selectedPlan.name}`,
          message: `Plan: ${selectedPlan.name}\nRAM: ${selectedPlan.ram}\nCPU: ${selectedPlan.cpu}\nPrice: ${selectedPlan.price}\n\nPayment Screenshot Attached`,
          screenshot: base64Image
        });
        setSuccess('✅ Order submitted successfully! We will verify and activate your server within 24 hours.');
        setScreenshot(null);
        setScreenshotPreview(null);
      };
      reader.readAsDataURL(screenshot);
    } catch (err) {
      alert('Error submitting order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getPlanIcon = (name) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('bronze')) return '/bronze.png';
    if (lowerName.includes('silver')) return '/silver.png';
    if (lowerName.includes('gold')) return '/gold.png';
    if (lowerName.includes('platinum')) return '/platinum.png';
    if (lowerName.includes('emerald')) return '/emerald.png';
    if (lowerName.includes('diamond')) return '/diamond.png';
    if (lowerName.includes('ruby')) return '/ruby.png';
    return null;
  };

  const getRankStyle = (name) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('ruby')) return { bg: 'linear-gradient(135deg, #ef4444, #dc2626)' };
    if (lowerName.includes('diamond')) return { bg: 'linear-gradient(135deg, #60a5fa, #3b82f6)' };
    if (lowerName.includes('emerald')) return { bg: 'linear-gradient(135deg, #34d399, #10b981)' };
    if (lowerName.includes('platinum')) return { bg: 'linear-gradient(135deg, #a78bfa, #8b5cf6)' };
    if (lowerName.includes('gold')) return { bg: 'linear-gradient(135deg, #fbbf24, #f59e0b)' };
    if (lowerName.includes('silver')) return { bg: 'linear-gradient(135deg, #94a3b8, #64748b)' };
    if (lowerName.includes('bronze')) return { bg: 'linear-gradient(135deg, #f97316, #ea580c)' };
    return { bg: 'linear-gradient(135deg, #FF6A00, #FF2E00)' };
  };

  return (
    <div>
      <div className="page-header">
        <h2>💰 Premium Server Plans</h2>
        <p>Select a location to view available plans</p>
      </div>

      {success && <div className="alert alert-success">{success}</div>}

      {/* Location Flags Selection */}
      {!selectedLocation && (
        <div className="location-flags-container">
          <div className="flags-bg-logo">
            <img src="/logo.png" alt="" className="flags-logo-img" />
          </div>

          {/* Location Flags First */}
          <h3 style={{textAlign: 'center', marginBottom: '30px', color: 'var(--text-primary)', position: 'relative', zIndex: 1}}>🌍 Choose Server Location</h3>
          <div className="location-flags">
            <div className="location-flag" onClick={() => setSelectedLocation('UAE')}>
              <img src="/uae-flag.png" alt="UAE" className="flag-img" />
              <span className="flag-name">UAE</span>
              {isLocationAvailable('UAE') && <span className="flag-status available">Available</span>}
              {!isLocationAvailable('UAE') && <span className="flag-status coming-soon">Coming Soon</span>}
            </div>
            <div className="location-flag" onClick={() => setSelectedLocation('Germany')}>
              <img src="/germany-flag.png" alt="Germany" className="flag-img" />
              <span className="flag-name">Germany</span>
              {isLocationAvailable('Germany') && <span className="flag-status available">Available</span>}
              {!isLocationAvailable('Germany') && <span className="flag-status coming-soon">Coming Soon</span>}
            </div>
            <div className="location-flag" onClick={() => setSelectedLocation('Singapore')}>
              <img src="/singapore-flag.png" alt="Singapore" className="flag-img" />
              <span className="flag-name">Singapore</span>
              {isLocationAvailable('Singapore') && <span className="flag-status available">Available</span>}
              {!isLocationAvailable('Singapore') && <span className="flag-status coming-soon">Coming Soon</span>}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions-grid" style={{marginTop: '50px', marginBottom: '40px', position: 'relative', zIndex: 1}}>
            <div className="quick-action-card" onClick={() => setSelectedLocation('UAE')} style={{cursor: 'pointer'}}>
              <div className="quick-action-icon" style={{background: 'linear-gradient(135deg, #ef4444, #f59e0b)'}}>🚀</div>
              <h4>Get a Server</h4>
              <p>Browse our premium hosting plans</p>
            </div>
            
            <a href="https://dash.diamondnode.qzz.io" target="_blank" rel="noopener noreferrer" className="quick-action-card">
              <div className="quick-action-icon" style={{background: 'linear-gradient(135deg, #10b981, #059669)'}}>🎮</div>
              <h4>Game Panel</h4>
              <p>Manage your servers</p>
            </a>
            
            <a href="/features" className="quick-action-card">
              <div className="quick-action-icon" style={{background: 'linear-gradient(135deg, #fbbf24, #f59e0b)'}}>⭐</div>
              <h4>Features</h4>
              <p>See what we offer</p>
            </a>
            
            <a href="https://discord.gg/WXWYz5ywTU" target="_blank" rel="noopener noreferrer" className="quick-action-card">
              <div className="quick-action-icon" style={{background: 'linear-gradient(135deg, #5865F2, #4752c4)'}}>💬</div>
              <h4>Discord</h4>
              <p>Join our community</p>
            </a>
          </div>

          {/* Why Choose Section */}
          <div className="card" style={{marginBottom: '40px', position: 'relative', zIndex: 1}}>
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
      )}

      {/* Plans Grid - Only show when location is selected */}
      {selectedLocation && (
        <>
          <div style={{marginBottom: '20px'}}>
            <button className="btn btn-secondary" onClick={() => setSelectedLocation(null)}>
              ← Back to Locations
            </button>
            <span style={{marginLeft: '15px', color: 'var(--text-primary)', fontWeight: '600'}}>
              {selectedLocation === 'UAE' && '🇦🇪'}
              {selectedLocation === 'Germany' && '🇩🇪'}
              {selectedLocation === 'Singapore' && '🇸🇬'}
              {' '}{selectedLocation} Servers
            </span>
          </div>

          {!isLocationAvailable(selectedLocation) ? (
            <>
              {plans.filter(p => p.location === selectedLocation).length === 0 ? (
                <div className="coming-soon-container">
                  <div className="coming-soon-content">
                    <div className="coming-soon-icon">🚀</div>
                    <h2>Coming Soon!</h2>
                    <p>{selectedLocation} servers are under development.</p>
                    <p>We're working hard to bring you the best gaming experience!</p>
                    <button className="btn btn-primary" onClick={() => setSelectedLocation(null)} style={{marginTop: '20px'}}>
                      ← Check Other Locations
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div style={{background: 'rgba(255, 106, 0, 0.1)', border: '1px solid rgba(255, 106, 0, 0.3)', borderRadius: '12px', padding: '12px 20px', marginBottom: '20px', textAlign: 'center'}}>
                    <span style={{color: 'var(--warning)', fontWeight: '600'}}>⚠️ {selectedLocation} servers coming soon - Plans shown for preview only</span>
                  </div>
                  <div className="plans-grid">
                    {plans.filter(p => p.location === selectedLocation).map(plan => {
                      const style = getRankStyle(plan.name);
                      return (
                        <div key={plan.id} className="plan-card" onClick={() => handlePlanClick(plan)} style={{cursor: 'pointer', opacity: 0.85}}>
                          <h3 style={{background: style.bg, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
                            {getPlanIcon(plan.name) && <img src={getPlanIcon(plan.name)} alt="" className="plan-icon" />}
                            {plan.name}
                          </h3>
                          <div className="spec">
                            <span className="spec-label"><span className="spec-emoji ram-emoji">🔲</span> RAM</span>
                            <span className="spec-value">{plan.ram}</span>
                          </div>
                          <div className="spec">
                            <span className="spec-label"><span className="spec-emoji cpu-emoji">🔳</span> CPU</span>
                            <span className="spec-value">{plan.cpu}</span>
                          </div>
                          <div className="spec">
                            <span className="spec-label"><span className="spec-emoji storage-emoji">💾</span> Storage</span>
                            <span className="spec-value">{plan.storage}</span>
                          </div>
                          <div className="spec">
                            <span className="spec-label"><span className="spec-emoji location-emoji">📍</span> Location</span>
                            <span className="spec-value">{plan.location}</span>
                          </div>
                          <div className="spec">
                            <span className="spec-label"><span className="spec-emoji ddos-emoji">🛡️</span> DDoS</span>
                            <span className="spec-value">Protected</span>
                          </div>
                          <div className="price">{plan.price}</div>
                          <button className="btn btn-secondary" style={{width: '100%', marginTop: '20px'}}>
                            🚀 Coming Soon
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              <div className="plans-grid">
                {plans.map(plan => {
                  const style = getRankStyle(plan.name);
                  return (
                    <div key={plan.id} className="plan-card" onClick={() => handlePlanClick(plan)} style={{cursor: 'pointer'}}>
                      <h3 style={{background: style.bg, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
                        {getPlanIcon(plan.name) && <img src={getPlanIcon(plan.name)} alt="" className="plan-icon" />}
                        {plan.name}
                      </h3>
                      <div className="spec">
                        <span className="spec-label"><span className="spec-emoji ram-emoji">🔲</span> RAM</span>
                        <span className="spec-value">{plan.ram}</span>
                      </div>
                      <div className="spec">
                        <span className="spec-label"><span className="spec-emoji cpu-emoji">🔳</span> CPU</span>
                        <span className="spec-value">{plan.cpu}</span>
                      </div>
                      <div className="spec">
                        <span className="spec-label"><span className="spec-emoji storage-emoji">💾</span> Storage</span>
                        <span className="spec-value">{plan.storage}</span>
                      </div>
                      <div className="spec">
                        <span className="spec-label"><span className="spec-emoji location-emoji">📍</span> Location</span>
                        <span className="spec-value">{plan.location}</span>
                      </div>
                      <div className="spec">
                        <span className="spec-label"><span className="spec-emoji ddos-emoji">🛡️</span> DDoS</span>
                        <span className="spec-value">Protected</span>
                      </div>
                      <div className="price">{plan.price}</div>
                      <button className="btn btn-primary" style={{width: '100%', marginTop: '20px'}}>
                        🛒 Order Now
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="extra-info">
                <h4>✨ All Premium Plans Include</h4>
                <ul>
                  <li>24/7 Expert Support via Discord & Tickets</li>
                  <li>AMD Ryzen 9 Processors for Maximum Performance</li>
                  <li>Enterprise DDoS Protection</li>
                  <li>Instant Server Setup after Payment Verification</li>
                  <li>Full FTP & SFTP Access</li>
                  <li>Automatic Backups</li>
                </ul>
              </div>
            </>
          )}
        </>
      )}

      {/* Order Modal */}
      {showModal && selectedPlan && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{maxWidth: '500px'}}>
            <h3>🛒 Order {selectedPlan.name}</h3>
            
            {success ? (
              <div style={{textAlign: 'center', padding: '20px'}}>
                <div style={{fontSize: '4rem', marginBottom: '20px'}}>✅</div>
                <p style={{color: 'var(--success)', fontSize: '1.1rem'}}>{success}</p>
                <button className="btn btn-primary" style={{marginTop: '24px'}} onClick={() => setShowModal(false)}>
                  Close
                </button>
              </div>
            ) : (
              <>
                <div style={{background: 'linear-gradient(135deg, rgba(255, 106, 0, 0.1), rgba(255, 46, 0, 0.05))', padding: '20px', borderRadius: '16px', marginBottom: '24px', border: '1px solid var(--glass-border)'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '12px'}}>
                    <span style={{color: 'var(--text-muted)'}}>Plan:</span>
                    <span style={{color: 'var(--primary-light)', fontWeight: '700'}}>{selectedPlan.name}</span>
                  </div>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '12px'}}>
                    <span style={{color: 'var(--text-muted)'}}>RAM / CPU:</span>
                    <span style={{color: 'var(--text-primary)', fontWeight: '600'}}>{selectedPlan.ram} / {selectedPlan.cpu}</span>
                  </div>
                  <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <span style={{color: 'var(--text-muted)'}}>Price:</span>
                    <span style={{color: 'var(--success)', fontWeight: '800', fontSize: '1.2rem'}}>{selectedPlan.price}</span>
                  </div>
                </div>

                {/* Payment Method Selection */}
                {!selectedPaymentMethod ? (
                  <div style={{marginBottom: '24px'}}>
                    <p style={{color: 'var(--text-secondary)', fontWeight: '600', marginBottom: '20px', textAlign: 'center'}}>
                      💳 Select Payment Method
                    </p>
                    
                    {/* Row 1 - Mobile Wallets */}
                    <div style={{display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '12px'}}>
                      <button 
                        className="payment-btn easypaisa"
                        onClick={() => setSelectedPaymentMethod('EasyPaisa')}
                        style={{
                          width: '100%',
                          padding: '16px 24px',
                          background: 'linear-gradient(135deg, #00c853, #009624)',
                          border: 'none',
                          borderRadius: '50px',
                          color: '#fff',
                          fontSize: '1rem',
                          fontWeight: '700',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '12px',
                          transition: 'transform 0.2s, box-shadow 0.2s',
                          boxShadow: '0 4px 15px rgba(0, 200, 83, 0.4)'
                        }}
                      >
                        <img src="/easypaisa.png" alt="EasyPaisa" style={{width: '32px', height: '32px', objectFit: 'contain'}} />
                        EasyPaisa
                      </button>
                      
                      <button 
                        className="payment-btn sadapay"
                        onClick={() => setSelectedPaymentMethod('SadaPaisa')}
                        style={{
                          width: '100%',
                          padding: '16px 24px',
                          background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
                          border: 'none',
                          borderRadius: '50px',
                          color: '#fff',
                          fontSize: '1rem',
                          fontWeight: '700',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '12px',
                          transition: 'transform 0.2s, box-shadow 0.2s',
                          boxShadow: '0 4px 15px rgba(139, 92, 246, 0.4)'
                        }}
                      >
                        <img src="/sadapay.png" alt="SadaPay" style={{width: '32px', height: '32px', objectFit: 'contain'}} />
                        SadaPay
                      </button>
                      
                      <button 
                        className="payment-btn nayapay"
                        onClick={() => setSelectedPaymentMethod('NayaPaisa')}
                        style={{
                          width: '100%',
                          padding: '16px 24px',
                          background: 'linear-gradient(135deg, #10b981, #059669)',
                          border: 'none',
                          borderRadius: '50px',
                          color: '#fff',
                          fontSize: '1rem',
                          fontWeight: '700',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '12px',
                          transition: 'transform 0.2s, box-shadow 0.2s',
                          boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)'
                        }}
                      >
                        <img src="/nayapay.png" alt="NayaPay" style={{width: '32px', height: '32px', objectFit: 'contain'}} />
                        NayaPay
                      </button>
                    </div>
                    
                    {/* Row 2 - Banks */}
                    <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                      <button 
                        className="payment-btn jsbank"
                        onClick={() => setSelectedPaymentMethod('JSBank')}
                        style={{
                          width: '100%',
                          padding: '16px 24px',
                          background: 'linear-gradient(135deg, #1e40af, #1e3a8a)',
                          border: 'none',
                          borderRadius: '50px',
                          color: '#fff',
                          fontSize: '1rem',
                          fontWeight: '700',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '12px',
                          transition: 'transform 0.2s, box-shadow 0.2s',
                          boxShadow: '0 4px 15px rgba(30, 64, 175, 0.4)'
                        }}
                      >
                        <img src="/jsbank.png" alt="JS Bank" style={{width: '32px', height: '32px', objectFit: 'contain'}} />
                        JS Bank
                      </button>
                      
                      <button 
                        className="payment-btn ubl"
                        onClick={() => setSelectedPaymentMethod('UBLBank')}
                        style={{
                          width: '100%',
                          padding: '16px 24px',
                          background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                          border: 'none',
                          borderRadius: '50px',
                          color: '#fff',
                          fontSize: '1rem',
                          fontWeight: '700',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '12px',
                          transition: 'transform 0.2s, box-shadow 0.2s',
                          boxShadow: '0 4px 15px rgba(220, 38, 38, 0.4)'
                        }}
                      >
                        <img src="/ubl.png" alt="UBL Bank" style={{width: '32px', height: '32px', objectFit: 'contain'}} />
                        UBL Bank
                      </button>
                      
                      <a 
                        className="payment-btn other"
                        href="https://discord.gg/FyE5vXbSuf"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          width: '100%',
                          padding: '16px 24px',
                          background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                          border: 'none',
                          borderRadius: '50px',
                          color: '#1a1a2e',
                          fontSize: '1rem',
                          fontWeight: '700',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '12px',
                          transition: 'transform 0.2s, box-shadow 0.2s',
                          boxShadow: '0 4px 15px rgba(251, 191, 36, 0.4)',
                          textDecoration: 'none'
                        }}
                      >
                        <span style={{fontSize: '1.5rem'}}>💬</span>
                        Other Payments
                      </a>
                    </div>
                    
                    <div className="modal-actions" style={{marginTop: '24px'}}>
                      <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <button 
                      onClick={() => setSelectedPaymentMethod(null)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        marginBottom: '16px',
                        fontSize: '0.95rem'
                      }}
                    >
                      ← Change Payment Method
                    </button>

                    <div style={{textAlign: 'center', marginBottom: '24px'}}>
                      <p style={{color: 'var(--warning)', fontWeight: '700', fontSize: '1rem', marginBottom: '16px', background: 'rgba(245, 158, 11, 0.1)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(245, 158, 11, 0.3)'}}>
                        ⚠️ MUST TAKE SCREENSHOT AFTER PAYMENT
                      </p>
                      
                      {selectedPaymentMethod === 'EasyPaisa' && (
                        <>
                          <div style={{background: '#fff', padding: '20px', borderRadius: '16px', display: 'inline-block', marginBottom: '16px'}}>
                            <img src="/qr-code.png" alt="Payment QR Code" style={{width: '200px', height: 'auto'}} />
                          </div>
                          <p style={{color: 'var(--text-primary)', fontWeight: '700', fontSize: '1.1rem', marginBottom: '4px'}}>
                            ADEEL MUBARIK
                          </p>
                          <p style={{color: 'var(--text-muted)', fontSize: '0.9rem'}}>
                            EasyPaisa Account
                          </p>
                        </>
                      )}
                      
                      {selectedPaymentMethod === 'SadaPaisa' && (
                        <>
                          <div style={{background: 'rgba(139, 92, 246, 0.1)', padding: '24px', borderRadius: '16px', marginBottom: '16px', border: '1px solid rgba(139, 92, 246, 0.3)'}}>
                            <img src="/sadapay.png" alt="SadaPay" style={{width: '60px', height: '60px', marginBottom: '16px', objectFit: 'contain'}} />
                            <p style={{color: 'var(--text-primary)', fontWeight: '700', fontSize: '1.3rem', marginBottom: '12px'}}>
                              03241401310
                            </p>
                            <p style={{color: 'var(--text-primary)', fontWeight: '600', fontSize: '1rem'}}>
                              Adeel Mubarik
                            </p>
                            <p style={{color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '8px'}}>
                              SadaPay Account
                            </p>
                          </div>
                        </>
                      )}
                      
                      {selectedPaymentMethod === 'NayaPaisa' && (
                        <>
                          <div style={{background: 'rgba(16, 185, 129, 0.1)', padding: '24px', borderRadius: '16px', marginBottom: '16px', border: '1px solid rgba(16, 185, 129, 0.3)'}}>
                            <img src="/nayapay.png" alt="NayaPay" style={{width: '60px', height: '60px', marginBottom: '16px', objectFit: 'contain'}} />
                            <p style={{color: 'var(--text-primary)', fontWeight: '700', fontSize: '1.3rem', marginBottom: '12px'}}>
                              03241401310
                            </p>
                            <p style={{color: 'var(--text-primary)', fontWeight: '600', fontSize: '1rem'}}>
                              Adeel Mubarik
                            </p>
                            <p style={{color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '8px'}}>
                              NayaPay Account
                            </p>
                          </div>
                        </>
                      )}
                      
                      {selectedPaymentMethod === 'JSBank' && (
                        <>
                          <div style={{background: 'rgba(30, 64, 175, 0.1)', padding: '24px', borderRadius: '16px', marginBottom: '16px', border: '1px solid rgba(30, 64, 175, 0.3)'}}>
                            <img src="/jsbank.png" alt="JS Bank" style={{width: '60px', height: '60px', marginBottom: '16px', objectFit: 'contain'}} />
                            <p style={{color: 'var(--text-primary)', fontWeight: '700', fontSize: '1.2rem', marginBottom: '12px'}}>
                              ADEEL MUBARIK
                            </p>
                            <div style={{background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '10px', marginBottom: '10px'}}>
                              <p style={{color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '4px'}}>Account Number</p>
                              <p style={{color: 'var(--text-primary)', fontWeight: '600', fontSize: '1.1rem'}}>0002860109</p>
                            </div>
                            <div style={{background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '10px'}}>
                              <p style={{color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '4px'}}>IBAN</p>
                              <p style={{color: 'var(--text-primary)', fontWeight: '600', fontSize: '0.95rem'}}>PK98JSBL9019000002860109</p>
                            </div>
                            <p style={{color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '12px'}}>
                              JS Bank Account
                            </p>
                          </div>
                        </>
                      )}
                      
                      {selectedPaymentMethod === 'UBLBank' && (
                        <>
                          <div style={{background: 'rgba(220, 38, 38, 0.1)', padding: '24px', borderRadius: '16px', marginBottom: '16px', border: '1px solid rgba(220, 38, 38, 0.3)'}}>
                            <img src="/ubl.png" alt="UBL Bank" style={{width: '60px', height: '60px', marginBottom: '16px', objectFit: 'contain'}} />
                            <p style={{color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '16px'}}>
                              Scan this QR to send money
                            </p>
                            <div style={{background: '#fff', padding: '16px', borderRadius: '16px', display: 'inline-block', marginBottom: '16px'}}>
                              <img src="/ubl-qr.png" alt="UBL QR Code" style={{width: '180px', height: '180px', objectFit: 'contain'}} />
                            </div>
                            <p style={{color: 'var(--text-primary)', fontWeight: '700', fontSize: '1.2rem', marginBottom: '8px'}}>
                              Adeel Mubarik - 5186
                            </p>
                            <p style={{color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '12px'}}>
                              UBL Digital Account
                            </p>
                          </div>
                        </>
                      )}
                    </div>

                    <div style={{marginBottom: '24px'}}>
                      <label style={{display: 'block', marginBottom: '12px', color: 'var(--text-secondary)', fontWeight: '600'}}>
                        📸 Upload Payment Screenshot
                      </label>
                      
                      <div 
                        style={{
                          border: '2px dashed var(--glass-border)',
                          borderRadius: '16px',
                          padding: '30px',
                          textAlign: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.3s',
                          background: screenshotPreview ? 'transparent' : 'rgba(255, 106, 0, 0.05)'
                        }}
                        onClick={() => document.getElementById('screenshot-input').click()}
                      >
                        {screenshotPreview ? (
                          <img src={screenshotPreview} alt="Screenshot Preview" style={{maxWidth: '100%', maxHeight: '200px', borderRadius: '12px'}} />
                        ) : (
                          <>
                            <div style={{fontSize: '3rem', marginBottom: '12px'}}>📤</div>
                            <p style={{color: 'var(--text-muted)'}}>Click to upload screenshot</p>
                            <p style={{color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '8px'}}>PNG, JPG up to 5MB</p>
                          </>
                        )}
                      </div>
                      
                      <input type="file" id="screenshot-input" accept="image/*" onChange={handleFileChange} style={{display: 'none'}} />
                    </div>

                    <div className="modal-actions">
                      <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                      <button className="btn btn-success" onClick={handleSubmit} disabled={!screenshot || loading}>
                        {loading ? '⏳ Submitting...' : '✅ Submit Order'}
                      </button>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Coming Soon Modal for Germany/Singapore */}
      {showComingSoonModal && selectedPlan && (
        <div className="modal-overlay" onClick={() => setShowComingSoonModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{maxWidth: '450px', textAlign: 'center'}}>
            <div style={{fontSize: '5rem', marginBottom: '20px'}}>🚀</div>
            <h2 style={{background: 'linear-gradient(135deg, #FF6A00, #FFD000)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '16px'}}>Coming Soon!</h2>
            
            <div style={{background: 'linear-gradient(135deg, rgba(255, 106, 0, 0.1), rgba(255, 46, 0, 0.05))', padding: '20px', borderRadius: '16px', marginBottom: '24px', border: '1px solid var(--glass-border)'}}>
              <p style={{color: 'var(--text-primary)', fontWeight: '700', fontSize: '1.2rem', marginBottom: '8px'}}>{selectedPlan.name}</p>
              <p style={{color: 'var(--text-muted)'}}>{selectedPlan.ram} RAM • {selectedPlan.cpu} CPU</p>
              <p style={{color: 'var(--success)', fontWeight: '700', fontSize: '1.1rem', marginTop: '8px'}}>{selectedPlan.price}</p>
            </div>
            
            <p style={{color: 'var(--text-secondary)', marginBottom: '8px'}}>{selectedPlan.location} servers are under development.</p>
            <p style={{color: 'var(--text-muted)', fontSize: '0.9rem'}}>We'll notify you when this location becomes available!</p>
            
            <div className="modal-actions" style={{justifyContent: 'center', marginTop: '24px'}}>
              <button className="btn btn-secondary" onClick={() => setShowComingSoonModal(false)}>Close</button>
              <button className="btn btn-primary" onClick={() => { setShowComingSoonModal(false); setSelectedLocation('UAE'); }}>
                Check UAE Plans
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaidPlans;
