import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('locations');
  const [locations, setLocations] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!user.isAdmin) {
      navigate('/dashboard');
      return;
    }

    loadData();
  }, [user, navigate]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } : { 'Content-Type': 'application/json' };
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [locRes, plansRes] = await Promise.all([
        fetch('/api/admin/locations', { headers: getAuthHeaders() }),
        fetch('/api/admin/paid-plans', { headers: getAuthHeaders() })
      ]);

      if (locRes.ok) {
        const locData = await locRes.json();
        setLocations(locData);
      }

      if (plansRes.ok) {
        const plansData = await plansRes.json();
        setPlans(plansData);
      }
      // load tickets, users and partners for admin
      try {
        const [ticketsRes, usersRes, partnersRes] = await Promise.all([
          fetch('/api/admin/tickets', { headers: getAuthHeaders() }),
          fetch('/api/admin/users', { headers: getAuthHeaders() }),
          fetch('/api/admin/yt-partners', { headers: getAuthHeaders() })
        ]);
        if (ticketsRes.ok) setTickets(await ticketsRes.json());
        if (usersRes.ok) setUsers(await usersRes.json());
        if (partnersRes.ok) setPartners(await partnersRes.json());
      } catch (e) {
        console.error('Error loading additional admin data', e);
      }
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  // additional state
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [partners, setPartners] = useState([]);
  const [screenshotModalSrc, setScreenshotModalSrc] = useState(null);
  const [showScreenshotModal, setShowScreenshotModal] = useState(false);

  const handleLocationToggle = async (location) => {
    try {
      const res = await fetch(`/api/admin/locations/${location.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ isAvailable: !location.isAvailable })
      });

      if (res.ok) {
        loadData();
      }
    } catch (err) {
      console.error('Error updating location:', err);
    }
  };

  const handleEditPlan = (plan) => {
    setEditingPlan(plan.id);
    setFormData({...plan, discount: plan.discount || 0});
  };

  const handleSavePlan = async () => {
    try {
      const res = await fetch(`/api/admin/paid-plans/${editingPlan}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setEditingPlan(null);
        loadData();
      }
    } catch (err) {
      console.error('Error saving plan:', err);
    }
  };

  const handleCreateFlameCustom = async () => {
    try {
      // Create a Flame Custom Plan in UAE with placeholder values
      const payload = {
        name: 'Flame Custom Plan',
        ram: 'Custom',
        cpu: 'Custom',
        storage: 'Custom',
        location: 'UAE',
        price: 'Custom',
        discount: 0
      };
      const res = await fetch('/api/admin/paid-plans', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        loadData();
        alert('Flame Custom Plan created in UAE');
      } else {
        alert('Failed to create plan');
      }
    } catch (err) {
      console.error('Error creating custom plan:', err);
    }
  };

  const handleRestoreDefaults = async () => {
    if (!confirm('Restore default paid plans (Bronze → Black Ruby)? This will only insert missing plans. Continue?')) return;
    try {
      const res = await fetch('/api/admin/paid-plans/restore-defaults', {
        method: 'POST',
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message || 'Default plans restored');
        loadData();
      } else {
        alert(data.error || JSON.stringify(data) || 'Failed to restore defaults');
      }
    } catch (e) {
      console.error('Restore defaults error', e);
      alert('Error contacting server');
    }
  };

  // Tickets handling
  const handleUpdateTicket = async (ticketId, updates) => {
    try {
      const res = await fetch(`/api/admin/tickets/${ticketId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates)
      });
      if (res.ok) loadData();
    } catch (e) { console.error(e); }
  };

  // YT Partners handling
  const [editingPartner, setEditingPartner] = useState(null);
  const [partnerForm, setPartnerForm] = useState({name: '', link: '', logo: '', isFeatured: false});
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [partnerLogoPreview, setPartnerLogoPreview] = useState(null);
  const fileInputRef = React.useRef();

  const handleSavePartner = async () => {
    try {
      if (editingPartner !== null) {
        await fetch(`/api/admin/yt-partners/${editingPartner}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(partnerForm)
        });
      } else {
        await fetch('/api/admin/yt-partners', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(partnerForm)
        });
      }
      setEditingPartner(null);
      setPartnerForm({name: '', link: '', logo: '', isFeatured: false});
      setShowPartnerModal(false);
      loadData();
    } catch (e) { console.error(e); }
  };

  const handleDeletePartner = async (id) => {
    if (!confirm('Delete this partner?')) return;
    try {
      await fetch(`/api/admin/yt-partners/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
      loadData();
    } catch (e) { console.error(e); }
  };

  // Users handling
  const handleDeleteUser = async (id) => {
    if (!confirm('Delete this user? This is irreversible.')) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
      if (res.ok) loadData();
    } catch (e) { console.error(e); }
  };

  if (loading) {
    return (
      <div style={{textAlign: 'center', padding: '60px 20px'}}>
        <p>Loading admin panel...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h2>⚙️ Admin Panel</h2>
        <p>Manage your hosting platform</p>
      </div>

      <div className="admin-tabs">
        <button className={`${activeTab === 'tickets' ? 'active' : ''}`} onClick={() => setActiveTab('tickets')}>🎫 Tickets/Orders</button>
        <button className={`${activeTab === 'plans' ? 'active' : ''}`} onClick={() => setActiveTab('plans')}>💎 Paid Plans</button>
        <button className={`${activeTab === 'locations' ? 'active' : ''}`} onClick={() => setActiveTab('locations')}>🌍 Locations</button>
        <button className={`${activeTab === 'partners' ? 'active' : ''}`} onClick={() => setActiveTab('partners')}>▶️ YT Partners</button>
        <button className={`${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>👥 Users</button>
      </div>

      {activeTab === 'locations' && (
        <div className="card">
          <h3>🌍 Location Settings</h3>
          <div style={{marginTop: '20px'}}>
            {locations.length === 0 ? (
              <p style={{color: 'var(--text-muted)'}}>No locations found</p>
            ) : (
              locations.map(loc => (
                <div
                  key={loc.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px',
                    background: 'rgba(255, 106, 0, 0.05)',
                    borderRadius: '8px',
                    marginBottom: '12px',
                    border: '1px solid rgba(255, 106, 0, 0.2)'
                  }}
                >
                  <span style={{fontWeight: '600'}}>{loc.location}</span>
                  <button
                    className={`btn ${loc.isAvailable ? 'btn-success' : 'btn-danger'}`}
                    onClick={() => handleLocationToggle(loc)}
                    style={{padding: '8px 16px', fontSize: '0.9rem'}}
                  >
                    {loc.isAvailable ? '✓ Available' : '✗ Disabled'}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'plans' && (
        <div className="card">
          <h3>💎 Hosting Plans</h3>
          <div style={{display: 'flex', justifyContent: 'flex-end', gap: '12px', marginBottom: '12px'}}>
            <button className="btn btn-secondary" onClick={handleRestoreDefaults} style={{padding: '8px 12px'}}>Restore Default Plans</button>
            <button className="btn btn-primary" onClick={handleCreateFlameCustom} style={{padding: '8px 12px'}}>Create Flame Custom Plan (UAE)</button>
          </div>
          <div style={{marginTop: '20px', overflowX: 'auto'}}>
            {plans.length === 0 ? (
              <p style={{color: 'var(--text-muted)'}}>No plans found</p>
            ) : (
              <table style={{width: '100%'}}>
                <thead>
                  <tr>
                    <th>Plan Name</th>
                    <th>RAM</th>
                    <th>CPU</th>
                    <th>Storage</th>
                    <th>Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {plans.map(plan => (
                    <tr key={plan.id}>
                      <td>{plan.name}</td>
                      <td>{plan.ram}</td>
                      <td>{plan.cpu}</td>
                      <td>{plan.storage}</td>
                      <td>{plan.price}</td>
                      <td>
                        <button
                          className="btn btn-secondary"
                          onClick={() => handleEditPlan(plan)}
                          style={{padding: '6px 12px', fontSize: '0.85rem'}}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {activeTab === 'tickets' && (
        <div className="card">
          <h3>🎫 Tickets & Orders</h3>
          <div style={{marginTop: '16px'}}>
            {tickets.length === 0 ? (
              <p style={{color: 'var(--text-muted)'}}>No tickets found</p>
            ) : (
              tickets.map(t => (
                <div key={t.id} style={{border: '1px solid rgba(0,0,0,0.06)', padding: '12px', borderRadius: 8, marginBottom: 12}}>
                  <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <div>
                      <strong>{t.subject || 'Ticket'}</strong>
                      <div style={{fontSize: '0.9rem', color: 'var(--text-muted)'}}>{t.email || t.userEmail}</div>
                    </div>
                    <div style={{textAlign: 'right'}}>
                      <div>Status: <strong>{t.status || 'open'}</strong></div>
                      <div style={{marginTop:8}}>
                        <select defaultValue={t.status || 'open'} onChange={e => handleUpdateTicket(t.id, { status: e.target.value })}>
                          <option value="open">open</option>
                          <option value="in_progress">in_progress</option>
                          <option value="resolved">resolved</option>
                          <option value="closed">closed</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div style={{marginTop: 10}}>{t.message}</div>
                  {t.screenshot && (
                    <div style={{marginTop: 12}}>
                      <img src={t.screenshot} alt="screenshot" style={{maxWidth: 220, maxHeight: 140, borderRadius:8, cursor: 'pointer', border: '1px solid rgba(0,0,0,0.06)'}} onClick={() => { setScreenshotModalSrc(t.screenshot); setShowScreenshotModal(true); }} />
                    </div>
                  )}

                  <div style={{marginTop: 12}}>
                    <label style={{display: 'block', fontSize: '0.9rem'}}>Admin Response</label>
                    <textarea defaultValue={t.adminResponse || ''} onBlur={e => handleUpdateTicket(t.id, { adminResponse: e.target.value })} style={{width: '100%', minHeight: 80}} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'partners' && (
        <div className="card">
          <h3>▶️ YouTube Partners</h3>
          <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: 12}}>
            <button className="btn btn-primary" onClick={() => { setEditingPartner(null); setPartnerForm({name: '', link: '', logo: '', isFeatured: false}); setShowPartnerModal(true); }}>+ Add Partner</button>
          </div>
          <div>
            {partners.length === 0 ? (
              <p style={{color: 'var(--text-muted)'}}>No partners yet</p>
            ) : (
              partners.map(p => (
                <div key={p.id} style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding: '10px 12px', border: '1px solid rgba(0,0,0,0.06)', borderRadius:8, marginBottom:10}}>
                  <div style={{display:'flex', alignItems:'center', gap:12}}>
                    <img src={p.logo} alt={p.name} style={{width:48, height:48, objectFit:'cover', borderRadius:6}} />
                    <div>
                      <div style={{fontWeight:600}}>{p.name}</div>
                      <div style={{fontSize:'0.9rem', color:'var(--text-muted)'}}>{p.link}</div>
                    </div>
                  </div>
                  <div style={{display:'flex', gap:8}}>
                    <button className="btn btn-secondary" onClick={() => { setEditingPartner(p.id); setPartnerForm({name: p.name, link: p.link, logo: p.logo, isFeatured: !!p.isFeatured}); setShowPartnerModal(true); }}>Edit</button>
                    <button className="btn btn-danger" onClick={() => handleDeletePartner(p.id)}>Delete</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="card">
          <h3>👥 Users</h3>
          <div style={{marginTop:12}}>
            {users.length === 0 ? (
              <p style={{color: 'var(--text-muted)'}}>No users found</p>
            ) : (
              users.map(u => (
                <div key={u.id} style={{display:'flex', justifyContent:'space-between', padding: '10px', border: '1px solid rgba(0,0,0,0.06)', borderRadius:8, marginBottom:10}}>
                  <div>
                    <div style={{fontWeight:600}}>{u.email || u.user_email}</div>
                    <div style={{fontSize:'0.9rem', color:'var(--text-muted)'}}>{u.isAdmin ? 'Admin' : 'User'}</div>
                  </div>
                  <div style={{display:'flex', gap:8}}>
                    <button className="btn btn-danger" onClick={() => handleDeleteUser(u.id)}>Delete</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {editingPlan && (
        <div className="modal-overlay" onClick={() => setEditingPlan(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Edit Plan</h3>
            <div className="form-group">
              <label>Plan Name</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>RAM</label>
              <input
                type="text"
                value={formData.ram || ''}
                onChange={e => setFormData({...formData, ram: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>CPU</label>
              <input
                type="text"
                value={formData.cpu || ''}
                onChange={e => setFormData({...formData, cpu: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Storage</label>
              <input
                type="text"
                value={formData.storage || ''}
                onChange={e => setFormData({...formData, storage: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Price</label>
              <input
                type="text"
                value={formData.price || ''}
                onChange={e => setFormData({...formData, price: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Location</label>
              <select value={formData.location || ''} onChange={e => setFormData({...formData, location: e.target.value})}>
                <option value="">-- Select Location --</option>
                {locations.map(l => (
                  <option key={l.id} value={l.location}>{l.location}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Discount (%)</label>
              <input
                type="number"
                value={formData.discount || 0}
                onChange={e => setFormData({...formData, discount: Number(e.target.value)})}
              />
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setEditingPlan(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSavePlan}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
      {showPartnerModal && (
        <div className="modal-overlay" onClick={() => setShowPartnerModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>{editingPartner !== null ? 'Edit Partner' : 'Add Partner'}</h3>
            <div className="form-group">
              <label>Name</label>
              <input type="text" value={partnerForm.name} onChange={e => setPartnerForm({...partnerForm, name: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Link</label>
              <input type="text" value={partnerForm.link} onChange={e => setPartnerForm({...partnerForm, link: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Logo URL</label>
              <div style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
                <input type="text" value={partnerForm.logo} onChange={e => setPartnerForm({...partnerForm, logo: e.target.value})} style={{flex: 1}} />
                <button type="button" className="btn btn-secondary" onClick={() => fileInputRef.current?.click()} style={{padding: '8px 10px'}}>Upload</button>
                <input ref={fileInputRef} type="file" accept="image/*" style={{display: 'none'}} onChange={async (e) => {
                  const f = e.target.files && e.target.files[0];
                  if (!f) return;
                  const reader = new FileReader();
                  reader.onload = () => {
                    const data = reader.result;
                    setPartnerForm({...partnerForm, logo: data});
                    setPartnerLogoPreview(data);
                  };
                  reader.readAsDataURL(f);
                }} />
              </div>
              {partnerLogoPreview && (
                <div style={{marginTop: 8}}>
                  <img src={partnerLogoPreview} alt="preview" style={{width: 80, height: 48, objectFit: 'cover', borderRadius: 6, border: '1px solid rgba(0,0,0,0.06)'}} />
                </div>
              )}
            </div>
            <div className="form-group">
              <label><input type="checkbox" checked={!!partnerForm.isFeatured} onChange={e => setPartnerForm({...partnerForm, isFeatured: e.target.checked})} /> Featured</label>
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowPartnerModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSavePartner}>Save</button>
            </div>
          </div>
        </div>
      )}
      {showScreenshotModal && (
        <div className="modal-overlay" onClick={() => setShowScreenshotModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{maxWidth: '90%', padding: 12}}>
            <img src={screenshotModalSrc} alt="screenshot full" style={{width: '100%', height: 'auto', borderRadius: 8}} />
            <div style={{display:'flex', justifyContent:'flex-end', marginTop:8}}>
              <button className="btn btn-secondary" onClick={() => setShowScreenshotModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
