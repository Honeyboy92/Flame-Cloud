import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const AdminPanel = () => {
  const [tab, setTab] = useState('tickets');
  const [paidPlans, setPaidPlans] = useState([]);
  const [users, setUsers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [about, setAbout] = useState({});
  const [ytPartners, setYtPartners] = useState([]);
  const [ytPartnersEnabled, setYtPartnersEnabled] = useState(false);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [planLocation, setPlanLocation] = useState('UAE');
  const [locationSettings, setLocationSettings] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [discordMembers, setDiscordMembers] = useState('400+');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load all data from Supabase
      const [paidPlansRes, usersRes, ticketsRes, aboutRes, locationsRes, ytRes, settingsRes] = await Promise.all([
        supabase.from('paid_plans').select('*').order('sort_order'),
        supabase.from('users').select('*').order('created_at', { ascending: false }),
        supabase.from('tickets').select('*').order('created_at', { ascending: false }),
        supabase.from('about_content').select('*').limit(1),
        supabase.from('location_settings').select('*'),
        supabase.from('yt_partners').select('*').order('sort_order'),
        supabase.from('site_settings').select('*')
      ]);
      
      setPaidPlans(paidPlansRes.data || []);
      setUsers(usersRes.data || []);
      setTickets(ticketsRes.data || []);
      setAbout((aboutRes.data && aboutRes.data[0]) || {});
      setLocationSettings(locationsRes.data || []);
      setYtPartners(ytRes.data || []);
      
      // Process settings
      const settings = settingsRes.data || [];
      const ytSetting = settings.find(s => s.key === 'yt_partners_enabled');
      const discordSetting = settings.find(s => s.key === 'discord_members');
      
      setYtPartnersEnabled(ytSetting?.value === '1');
      setDiscordMembers(discordSetting?.value || '400+');
      
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleDiscordMembersUpdate = async () => {
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({ key: 'discord_members', value: discordMembers });
      
      if (error) throw error;
      alert('Discord members updated!');
    } catch (error) {
      console.error('Error updating Discord members:', error);
      alert('Error updating Discord members');
    }
  };

  const handleAboutUpdate = async () => {
    try {
      await axios.put('/api/admin/about', about);
      alert('About section updated successfully!');
    } catch (error) {
      console.error('Error updating about:', error);
      alert('Error updating about section');
    }
  };

  const handleSavePlan = async (type) => {
    if (form.id) {
      await axios.put(`/api/admin/paid-plans/${form.id}`, form);
    } else {
      await axios.post(`/api/admin/paid-plans`, form);
    }
    setModal(null);
    loadData();
  };

  const handleQuickDiscount = async (plan, discount) => {
    await axios.put(`/api/admin/paid-plans/${plan.id}`, { ...plan, discount: parseInt(discount) || 0 });
    loadData();
  };

  const handleDeletePlan = async (type, id) => {
    if (!window.confirm('Delete this plan?')) return;
    await axios.delete(`/api/admin/paid-plans/${id}`);
    loadData();
  };

  const handleTicketUpdate = async (id, status, response) => {
    await axios.put(`/api/admin/tickets/${id}`, { status, adminResponse: response });
    setModal(null);
    loadData();
  };



  const handleLocationToggle = async (location, currentStatus) => {
    await axios.put(`/api/admin/locations/${location}`, { isAvailable: !currentStatus });
    loadData();
  };

  const openPlanModal = (plan = null) => {
    setForm(plan || { name: '', ram: '', cpu: '', storage: '', location: planLocation, price: '', discount: 0, sortOrder: 0 });
    setModal({ type: 'plan' });
  };

  const openTicketModal = (ticket) => {
    setForm({ ...ticket, newResponse: ticket.adminResponse || '' });
    setModal({ type: 'ticket' });
  };

  const openYtPartnerModal = (partner = null) => {
    setForm(partner || { name: '', link: '', logo: '' });
    setModal({ type: 'ytpartner' });
  };

  const handleSaveYtPartner = async () => {
    if (form.id) {
      await axios.put(`/api/admin/yt-partners/${form.id}`, form);
    } else {
      await axios.post('/api/admin/yt-partners', form);
    }
    setModal(null);
    loadData();
  };

  const handleDeleteYtPartner = async (id) => {
    if (!window.confirm('Delete this partner?')) return;
    await axios.delete(`/api/admin/yt-partners/${id}`);
    loadData();
  };

  const handleYtPartnersToggle = async () => {
    await axios.put('/api/admin/settings/yt_partners_enabled', { value: ytPartnersEnabled ? '0' : '1' });
    setYtPartnersEnabled(!ytPartnersEnabled);
  };

  // Drag & Drop handlers for YT Partners
  const handleDragStart = (e, partner) => {
    setDraggedItem(partner);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, targetPartner) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.id === targetPartner.id) return;

    const newPartners = [...ytPartners];
    const draggedIndex = newPartners.findIndex(p => p.id === draggedItem.id);
    const targetIndex = newPartners.findIndex(p => p.id === targetPartner.id);

    // Remove dragged item and insert at target position
    newPartners.splice(draggedIndex, 1);
    newPartners.splice(targetIndex, 0, draggedItem);

    setYtPartners(newPartners);
    setDraggedItem(null);

    // Save new order to server
    const orderedIds = newPartners.map(p => p.id);
    await axios.put('/api/admin/yt-partners-reorder', { orderedIds });
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  return (
    <div>
      <div className="page-header">
        <h2>⚙️ Admin Panel</h2>
        <p>Manage your hosting platform</p>
      </div>

      <div className="admin-tabs">
        <button className={tab === 'tickets' ? 'active' : ''} onClick={() => setTab('tickets')}>🎫 Orders/Tickets</button>
        <button className={tab === 'paid' ? 'active' : ''} onClick={() => setTab('paid')}>💰 Paid Plans</button>
        <button className={tab === 'locations' ? 'active' : ''} onClick={() => setTab('locations')}>🌍 Locations</button>
        <button className={tab === 'about' ? 'active' : ''} onClick={() => setTab('about')}>🔥 About Section</button>
        <button className={tab === 'ytpartners' ? 'active' : ''} onClick={() => setTab('ytpartners')}>📺 YT Partners</button>
        <button className={tab === 'members' ? 'active' : ''} onClick={() => setTab('members')}>👥 Members</button>
        <button className={tab === 'users' ? 'active' : ''} onClick={() => setTab('users')}>🔐 Users</button>
      </div>

      {/* Members Tab */}
      {tab === 'members' && (
        <div className="card">
          <h3 style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px'}}>
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#5865F2" strokeWidth="1.5">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
            </svg>
            Discord Members
          </h3>
          <p style={{color: 'var(--text-muted)', marginBottom: '24px'}}>
            Set the Discord member count that shows on Dashboard
          </p>
          
          <div style={{
            background: 'rgba(88, 101, 242, 0.1)',
            border: '1px solid rgba(88, 101, 242, 0.3)',
            borderRadius: '16px',
            padding: '30px'
          }}>
            <label style={{color: 'var(--text-secondary)', fontWeight: '600', display: 'block', marginBottom: '12px'}}>
              Member Count
            </label>
            <div style={{display: 'flex', gap: '16px', alignItems: 'center'}}>
              <input 
                type="text" 
                value={discordMembers} 
                onChange={e => setDiscordMembers(e.target.value)}
                placeholder="e.g., 500+, 1K+, 2.5K"
                style={{
                  flex: 1,
                  padding: '16px 20px',
                  background: 'rgba(0,0,0,0.4)',
                  border: '2px solid rgba(88, 101, 242, 0.4)',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '1.2rem',
                  fontWeight: '700'
                }}
              />
              <button className="btn btn-discord" onClick={handleDiscordMembersUpdate} style={{padding: '16px 32px', fontSize: '1rem'}}>
                💾 Save
              </button>
            </div>
            <p style={{color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '12px'}}>
              💡 Examples: 500+, 1K+, 2.5K, 10K+
            </p>
          </div>

          {/* Preview */}
          <div style={{marginTop: '30px'}}>
            <h4 style={{color: 'var(--text-secondary)', marginBottom: '16px'}}>Preview on Dashboard:</h4>
            <div style={{
              display: 'inline-flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '24px 40px',
              background: 'rgba(0,0,0,0.3)',
              borderRadius: '16px',
              border: '1px solid var(--glass-border)'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '12px',
                background: 'transparent',
                border: '2px solid #FF2E00',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '12px'
              }}>
                <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#FF2E00" strokeWidth="1.5">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
                </svg>
              </div>
              <h4 style={{color: 'var(--text-primary)', fontWeight: '700', marginBottom: '4px'}}>{discordMembers} Members</h4>
              <p style={{color: 'var(--text-muted)', fontSize: '0.85rem'}}>Join our community</p>
            </div>
          </div>
        </div>
      )}

      {/* Tickets/Orders Tab */}
      {tab === 'tickets' && (
        <div className="card">
          <h3>🎫 All Orders & Tickets ({tickets.length})</h3>
          {tickets.length === 0 ? (
            <div className="empty-state"><p>No tickets yet.</p></div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>User</th>
                    <th>Subject</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map(t => (
                    <tr key={t.id}>
                      <td style={{color: 'var(--primary-light)', fontWeight: '700'}}>#{t.id}</td>
                      <td>{t.username}</td>
                      <td>{t.subject}</td>
                      <td><span className={`badge badge-${t.status}`}>{t.status}</span></td>
                      <td style={{color: 'var(--text-muted)'}}>{new Date(t.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button className="btn btn-primary" style={{padding: '8px 16px'}} onClick={() => openTicketModal(t)}>
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}


      {/* Paid Plans Tab */}
      {tab === 'paid' && (
        <div className="card">
          {/* Location Tabs */}
          <div style={{display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap'}}>
            <button 
              className={`btn ${planLocation === 'UAE' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setPlanLocation('UAE')}
            >
              🇦🇪 UAE
            </button>
            <button 
              className={`btn ${planLocation === 'Germany' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setPlanLocation('Germany')}
            >
              🇩🇪 Germany
            </button>
            <button 
              className={`btn ${planLocation === 'Singapore' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setPlanLocation('Singapore')}
            >
              🇸🇬 Singapore
            </button>
          </div>

          {/* Coming Soon Notice for Germany and Singapore */}
          {(planLocation === 'Germany' || planLocation === 'Singapore') && (
            <div style={{background: 'rgba(255, 106, 0, 0.1)', border: '1px solid rgba(255, 106, 0, 0.3)', borderRadius: '12px', padding: '12px 20px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px'}}>
              <span style={{fontSize: '1.2rem'}}>⚠️</span>
              <span style={{color: 'var(--warning)'}}>Note: {planLocation} plans will show as "Coming Soon" to users until activated.</span>
            </div>
          )}

          <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
            <h3>💰 {planLocation} Plans ({paidPlans.filter(p => p.location === planLocation).length})</h3>
            <button className="btn btn-primary" onClick={() => openPlanModal()}>+ Add Plan</button>
          </div>
          <div className="table-container">
            <table>
              <thead><tr><th>Name</th><th>RAM</th><th>CPU</th><th>Storage</th><th>Location</th><th>Price</th><th>Discount</th><th>Actions</th></tr></thead>
              <tbody>
                {paidPlans.filter(p => p.location === planLocation).length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{textAlign: 'center', padding: '40px', color: 'var(--text-muted)'}}>
                      No plans for {planLocation} yet. Click "+ Add Plan" to create one.
                    </td>
                  </tr>
                ) : (
                  paidPlans.filter(p => p.location === planLocation).map(p => (
                    <tr key={p.id}>
                      <td style={{fontWeight: '700', color: 'var(--primary-light)'}}>{p.name}</td>
                      <td>{p.ram}</td>
                      <td>{p.cpu}</td>
                      <td>{p.storage}</td>
                      <td>{p.location}</td>
                      <td style={{color: 'var(--success)', fontWeight: '700'}}>{p.price}</td>
                      <td>
                        <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                          <input 
                            type="number" 
                            min="0" 
                            max="100" 
                            defaultValue={p.discount || 0}
                            onBlur={(e) => handleQuickDiscount(p, e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleQuickDiscount(p, e.target.value)}
                            style={{
                              width: '60px',
                              padding: '8px',
                              background: 'rgba(0, 200, 83, 0.1)',
                              border: '1px solid rgba(0, 200, 83, 0.3)',
                              borderRadius: '8px',
                              color: '#00E676',
                              fontWeight: '700',
                              textAlign: 'center'
                            }}
                          />
                          <span style={{color: 'var(--text-muted)'}}>%</span>
                        </div>
                      </td>
                      <td className="action-btns">
                        <button className="btn btn-secondary" onClick={() => openPlanModal(p)}>Edit</button>
                        <button className="btn btn-danger" onClick={() => handleDeletePlan('paid', p.id)}>Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Locations Tab */}
      {tab === 'locations' && (
        <div className="card">
          <h3>🌍 Server Locations</h3>
          <p style={{color: 'var(--text-muted)', marginBottom: '24px'}}>
            Enable or disable server locations. Disabled locations will show "Coming Soon" to users.
          </p>
          
          <div style={{display: 'grid', gap: '16px'}}>
            {locationSettings.map(loc => (
              <div 
                key={loc.location}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '20px 24px',
                  background: 'rgba(0,0,0,0.3)',
                  borderRadius: '16px',
                  border: `1px solid ${loc.isAvailable ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255, 106, 0, 0.3)'}`
                }}
              >
                <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
                  <span style={{fontSize: '2rem'}}>
                    {loc.location === 'UAE' && '🇦🇪'}
                    {loc.location === 'Germany' && '🇩🇪'}
                    {loc.location === 'Singapore' && '🇸🇬'}
                  </span>
                  <div>
                    <h4 style={{margin: 0, color: 'var(--text-primary)'}}>{loc.location}</h4>
                    <p style={{margin: '4px 0 0', color: 'var(--text-muted)', fontSize: '0.9rem'}}>
                      {paidPlans.filter(p => p.location === loc.location).length} plans configured
                    </p>
                  </div>
                </div>
                
                <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
                  <span className={`badge ${loc.isAvailable ? 'badge-approved' : 'badge-pending'}`}>
                    {loc.isAvailable ? 'Available' : 'Coming Soon'}
                  </span>
                  <button 
                    className={`btn ${loc.isAvailable ? 'btn-danger' : 'btn-success'}`}
                    onClick={() => handleLocationToggle(loc.location, loc.isAvailable)}
                    style={{minWidth: '120px'}}
                  >
                    {loc.isAvailable ? '❌ Disable' : '✅ Enable'}
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div style={{marginTop: '24px', padding: '16px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.3)'}}>
            <p style={{color: 'var(--text-secondary)', margin: 0}}>
              💡 <strong>Tip:</strong> Add plans for a location first, then enable it to make it available to users.
            </p>
          </div>
        </div>
      )}

      {/* YT Partners Tab */}
      {tab === 'ytpartners' && (
        <div className="card">
          {/* Enable/Disable Toggle */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            background: ytPartnersEnabled ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 106, 0, 0.1)',
            border: `1px solid ${ytPartnersEnabled ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255, 106, 0, 0.3)'}`,
            borderRadius: '12px',
            marginBottom: '20px'
          }}>
            <div>
              <h4 style={{margin: 0, color: 'var(--text-primary)'}}>📺 YT Partners Page</h4>
              <p style={{margin: '4px 0 0', color: 'var(--text-muted)', fontSize: '0.9rem'}}>
                {ytPartnersEnabled ? 'Page is visible to users' : 'Page shows "Coming Soon" to users'}
              </p>
            </div>
            <button 
              className={`btn ${ytPartnersEnabled ? 'btn-danger' : 'btn-success'}`}
              onClick={handleYtPartnersToggle}
              style={{minWidth: '120px'}}
            >
              {ytPartnersEnabled ? '❌ Disable' : '✅ Enable'}
            </button>
          </div>

          <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
            <h3>📺 YT Partners ({ytPartners.length})</h3>
            <button className="btn btn-primary" onClick={() => openYtPartnerModal()}>+ Add Partner</button>
          </div>
          {ytPartners.length === 0 ? (
            <div className="empty-state"><p>No YT Partners yet. Click "+ Add Partner" to add one.</p></div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th style={{width: '40px'}}>⋮⋮</th>
                    <th>ID</th>
                    <th>Name</th>
                    <th>YouTube Link</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {ytPartners.map(p => (
                    <tr 
                      key={p.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, p)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, p)}
                      onDragEnd={handleDragEnd}
                      style={{
                        cursor: 'grab',
                        background: draggedItem?.id === p.id ? 'rgba(255, 106, 0, 0.2)' : 'transparent',
                        opacity: draggedItem?.id === p.id ? 0.5 : 1
                      }}
                    >
                      <td style={{cursor: 'grab', color: 'var(--text-muted)', fontSize: '1.2rem'}}>⋮⋮</td>
                      <td style={{color: 'var(--primary-light)', fontWeight: '700'}}>#{p.id}</td>
                      <td style={{fontWeight: '600'}}>{p.name}</td>
                      <td>
                        <a href={p.link} target="_blank" rel="noopener noreferrer" style={{color: '#FF0000', textDecoration: 'none'}}>
                          {p.link.length > 40 ? p.link.substring(0, 40) + '...' : p.link}
                        </a>
                      </td>
                      <td className="action-btns">
                        <button className="btn btn-secondary" onClick={() => openYtPartnerModal(p)}>Edit</button>
                        <button className="btn btn-danger" onClick={() => handleDeleteYtPartner(p.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p style={{color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '12px', textAlign: 'center'}}>
                💡 Drag rows to reorder partners
              </p>
            </div>
          )}
        </div>
      )}

      {/* Users Tab */}
      {tab === 'users' && (
        <div className="card">
          <h3>👥 All Users ({users.length})</h3>
          <div className="table-container">
            <table>
              <thead><tr><th>Username</th><th>Email</th><th>Role</th><th>Joined</th><th>Actions</th></tr></thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td style={{fontWeight: '600'}}>{u.username}</td>
                    <td style={{color: 'var(--text-muted)'}}>{u.email}</td>
                    <td><span className={`badge ${u.isAdmin ? 'badge-approved' : 'badge-pending'}`}>{u.isAdmin ? 'Admin' : 'User'}</span></td>
                    <td style={{color: 'var(--text-muted)'}}>{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td>
                      {!u.isAdmin && (
                        <button 
                          className="btn btn-danger" 
                          style={{padding: '6px 12px', fontSize: '0.85rem'}}
                          onClick={async () => {
                            if (window.confirm(`Delete user ${u.username}?`)) {
                              await axios.delete(`/api/admin/users/${u.id}`);
                              loadData();
                            }
                          }}
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}




      {/* Plan Modal */}
      {modal?.type === 'plan' && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>{form.id ? 'Edit' : 'Add'} Paid Plan</h3>
            <div className="form-group">
              <label>Plan Name</label>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g., S-Rank" />
            </div>
            <div className="form-group">
              <label>RAM</label>
              <input value={form.ram} onChange={e => setForm({...form, ram: e.target.value})} placeholder="e.g., 4GB" />
            </div>
            <div className="form-group">
              <label>CPU</label>
              <input value={form.cpu} onChange={e => setForm({...form, cpu: e.target.value})} placeholder="e.g., 200%" />
            </div>
            <div className="form-group">
              <label>Storage</label>
              <input value={form.storage} onChange={e => setForm({...form, storage: e.target.value})} placeholder="e.g., 20 GB SSD" />
            </div>
            <div className="form-group">
              <label>Location</label>
              <select value={form.location} onChange={e => setForm({...form, location: e.target.value})} style={{width: '100%', padding: '16px 20px', background: 'rgba(3, 0, 20, 0.6)', border: '1px solid var(--glass-border)', borderRadius: '14px', color: 'var(--text-primary)', fontSize: '1rem'}}>
                <option value="UAE">🇦🇪 UAE</option>
                <option value="Germany">🇩🇪 Germany</option>
                <option value="Singapore">🇸🇬 Singapore</option>
              </select>
            </div>
            <div className="form-group">
              <label>Price</label>
              <input value={form.price} onChange={e => setForm({...form, price: e.target.value})} placeholder="e.g., 500 PKR" />
            </div>
            <div className="form-group">
              <label>Discount % (0 for no discount)</label>
              <input type="number" min="0" max="100" value={form.discount || 0} onChange={e => setForm({...form, discount: parseInt(e.target.value) || 0})} placeholder="e.g., 20" />
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-success" onClick={() => handleSavePlan()}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Ticket Detail Modal with Screenshot */}
      {modal?.type === 'ticket' && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{maxWidth: '600px'}}>
            <h3>🎫 Ticket #{form.id}</h3>
            
            <div style={{background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(6, 182, 212, 0.05))', padding: '20px', borderRadius: '16px', marginBottom: '20px', border: '1px solid var(--glass-border)'}}>
              <p><strong style={{color: 'var(--text-muted)'}}>User:</strong> <span style={{color: 'var(--primary-light)'}}>{form.username}</span> ({form.userEmail})</p>
              <p style={{marginTop: '8px'}}><strong style={{color: 'var(--text-muted)'}}>Subject:</strong> <span style={{color: 'var(--text-primary)'}}>{form.subject}</span></p>
              <p style={{marginTop: '8px'}}><strong style={{color: 'var(--text-muted)'}}>Status:</strong> <span className={`badge badge-${form.status}`}>{form.status}</span></p>
            </div>

            <div style={{marginBottom: '20px'}}>
              <label style={{color: 'var(--text-muted)', fontWeight: '600', display: 'block', marginBottom: '10px'}}>Message:</label>
              <div style={{background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '12px', whiteSpace: 'pre-wrap', color: 'var(--text-secondary)'}}>
                {form.message}
              </div>
            </div>

            {/* Payment Screenshot */}
            {form.screenshot && (
              <div style={{marginBottom: '20px'}}>
                <label style={{color: 'var(--text-muted)', fontWeight: '600', display: 'block', marginBottom: '10px'}}>📸 Payment Screenshot:</label>
                <div style={{background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '12px', textAlign: 'center'}}>
                  <img 
                    src={form.screenshot} 
                    alt="Payment Screenshot" 
                    style={{maxWidth: '100%', maxHeight: '300px', borderRadius: '8px', cursor: 'pointer'}}
                    onClick={() => window.open(form.screenshot, '_blank')}
                  />
                  <p style={{color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '10px'}}>Click image to view full size</p>
                </div>
              </div>
            )}

            <div className="form-group">
              <label>Admin Response</label>
              <textarea 
                value={form.newResponse} 
                onChange={e => setForm({...form, newResponse: e.target.value})} 
                placeholder="Write your response to the user..."
              />
            </div>

            <div className="modal-actions" style={{flexWrap: 'wrap', gap: '12px'}}>
              <button className="btn btn-secondary" onClick={() => setModal(null)}>Close</button>
              <button className="btn btn-danger" onClick={() => handleTicketUpdate(form.id, 'rejected', form.newResponse)}>
                ❌ Reject
              </button>
              <button className="btn btn-success" onClick={() => handleTicketUpdate(form.id, 'approved', form.newResponse)}>
                ✅ Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* YT Partner Modal */}
      {modal?.type === 'ytpartner' && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>{form.id ? 'Edit' : 'Add'} YT Partner</h3>
            <div className="form-group">
              <label>YouTuber Name</label>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g., TechGamer" />
            </div>
            <div className="form-group">
              <label>YouTube Channel Link</label>
              <input value={form.link} onChange={e => setForm({...form, link: e.target.value})} placeholder="e.g., https://youtube.com/@channel" />
            </div>
            <div className="form-group">
              <label>Logo (Upload Image)</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={e => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => setForm({...form, logo: reader.result});
                    reader.readAsDataURL(file);
                  }
                }}
                style={{padding: '10px'}}
              />
              {form.logo && (
                <div style={{marginTop: '10px', textAlign: 'center'}}>
                  <img src={form.logo} alt="Preview" style={{width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover'}} />
                </div>
              )}
            </div>
            <div className="form-group" style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
              <input 
                type="checkbox" 
                id="isFeatured"
                checked={form.isFeatured || false}
                onChange={e => setForm({...form, isFeatured: e.target.checked})}
                style={{width: '20px', height: '20px', cursor: 'pointer'}}
              />
              <label htmlFor="isFeatured" style={{cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'}}>
                <span style={{color: '#FFD700', fontSize: '1.2rem'}}>⭐</span> Featured Partner (Big YouTuber)
              </label>
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-success" onClick={handleSaveYtPartner}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* About Section Tab */}
      {tab === 'about' && (
        <div className="card">
          <h3>🔥 Edit About Section</h3>
          <p style={{color: 'var(--text-muted)', marginBottom: '30px'}}>
            Customize your About section content and team information
          </p>

          {/* About Content */}
          <div className="form-group">
            <label>About Content Description</label>
            <textarea 
              value={about.content || ''} 
              onChange={e => setAbout({...about, content: e.target.value})} 
              rows={4}
              placeholder="Describe your company and services..."
              style={{resize: 'vertical'}}
            />
          </div>

          {/* Team Members Section */}
          <div style={{marginTop: '40px'}}>
            <h4 style={{color: 'var(--primary)', marginBottom: '20px'}}>👑 Team Members</h4>
            
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px'}}>
              
              {/* Flame Founder */}
              <div style={{background: 'rgba(255, 46, 0, 0.1)', padding: '25px', borderRadius: '16px', border: '1px solid rgba(255, 46, 0, 0.3)'}}>
                <div style={{textAlign: 'center', marginBottom: '20px'}}>
                  <div 
                    style={{
                      width: '80px', 
                      height: '80px', 
                      borderRadius: '50%', 
                      background: about.founder_photo ? `url("${about.founder_photo}") center/cover` : 'linear-gradient(135deg, #FF2E00, #dc2626)', 
                      margin: '0 auto 15px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      border: '3px solid #FF2E00',
                      fontSize: '2rem',
                      color: '#fff',
                      fontWeight: '700'
                    }}
                    onClick={() => document.getElementById('founder-photo').click()}
                  >
                    {!about.founder_photo && 'FF'}
                  </div>
                  <input 
                    type="file" 
                    id="founder-photo" 
                    accept="image/*" 
                    style={{display: 'none'}}
                    onChange={e => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => setAbout({...about, founder_photo: reader.result});
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <p style={{color: 'var(--text-muted)', fontSize: '0.8rem'}}>Click to upload photo</p>
                </div>
                <div className="form-group" style={{marginBottom: 0}}>
                  <label>🔥 Flame Founder Name</label>
                  <input 
                    value={about.founder_name || ''} 
                    onChange={e => setAbout({...about, founder_name: e.target.value})} 
                    placeholder="Enter founder name"
                  />
                </div>
              </div>

              {/* Flame Owner */}
              <div style={{background: 'rgba(255, 106, 0, 0.1)', padding: '25px', borderRadius: '16px', border: '1px solid rgba(255, 106, 0, 0.3)'}}>
                <div style={{textAlign: 'center', marginBottom: '20px'}}>
                  <div 
                    style={{
                      width: '80px', 
                      height: '80px', 
                      borderRadius: '50%', 
                      background: about.owner_photo ? `url("${about.owner_photo}") center/cover` : 'linear-gradient(135deg, #FF6A00, #FF2E00)', 
                      margin: '0 auto 15px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      border: '3px solid #FF6A00',
                      fontSize: '2rem',
                      color: '#fff',
                      fontWeight: '700'
                    }}
                    onClick={() => document.getElementById('owner-photo').click()}
                  >
                    {!about.owner_photo && 'FO'}
                  </div>
                  <input 
                    type="file" 
                    id="owner-photo" 
                    accept="image/*" 
                    style={{display: 'none'}}
                    onChange={e => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => setAbout({...about, owner_photo: reader.result});
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <p style={{color: 'var(--text-muted)', fontSize: '0.8rem'}}>Click to upload photo</p>
                </div>
                <div className="form-group" style={{marginBottom: 0}}>
                  <label>🔥 Flame Owner Name</label>
                  <input 
                    value={about.owner_name || ''} 
                    onChange={e => setAbout({...about, owner_name: e.target.value})} 
                    placeholder="Enter owner name"
                  />
                </div>
              </div>

              {/* Flame Management */}
              <div style={{background: 'rgba(255, 140, 0, 0.1)', padding: '25px', borderRadius: '16px', border: '1px solid rgba(255, 140, 0, 0.3)'}}>
                <div style={{textAlign: 'center', marginBottom: '20px'}}>
                  <div 
                    style={{
                      width: '80px', 
                      height: '80px', 
                      borderRadius: '50%', 
                      background: about.management_photo ? `url("${about.management_photo}") center/cover` : 'linear-gradient(135deg, #FF8C00, #FF6A00)', 
                      margin: '0 auto 15px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      border: '3px solid #FF8C00',
                      fontSize: '2rem',
                      color: '#fff',
                      fontWeight: '700'
                    }}
                    onClick={() => document.getElementById('management-photo').click()}
                  >
                    {!about.management_photo && 'FM'}
                  </div>
                  <input 
                    type="file" 
                    id="management-photo" 
                    accept="image/*" 
                    style={{display: 'none'}}
                    onChange={e => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => setAbout({...about, management_photo: reader.result});
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <p style={{color: 'var(--text-muted)', fontSize: '0.8rem'}}>Click to upload photo</p>
                </div>
                <div className="form-group" style={{marginBottom: 0}}>
                  <label>🔥 Flame Management Name</label>
                  <input 
                    value={about.management_name || ''} 
                    onChange={e => setAbout({...about, management_name: e.target.value})} 
                    placeholder="Enter management name"
                  />
                </div>
              </div>

            </div>
          </div>

          {/* Save Button */}
          <div style={{textAlign: 'center', marginTop: '40px'}}>
            <button className="btn btn-success" onClick={handleAboutUpdate} style={{padding: '16px 32px', fontSize: '1.1rem'}}>
              🔥 Save About Section
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
