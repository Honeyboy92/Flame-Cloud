import React, { useState, useEffect } from 'react';
import { useAuth, supabase } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('tickets');
  const [locations, setLocations] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState({});

  // additional state
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [partners, setPartners] = useState([]);
  const [screenshotModalSrc, setScreenshotModalSrc] = useState(null);
  const [showScreenshotModal, setShowScreenshotModal] = useState(false);

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

  const loadData = async () => {
    try {
      setLoading(true);

      // Load all data efficiently
      const [
        { data: locData },
        { data: plansData },
        { data: ticketsData },
        { data: usersData },
        { data: partnersData }
      ] = await Promise.all([
        supabase.from('location_settings').select('*').order('sort_order'),
        supabase.from('paid_plans').select('*').order('sort_order'),
        supabase.from('tickets').select('*').order('created_at', { ascending: false }),
        supabase.from('users').select('*').order('created_at', { ascending: false }),
        supabase.from('yt_partners').select('*').order('sort_order')
      ]);

      if (locData) setLocations(locData);
      if (plansData) setPlans(plansData);
      if (ticketsData) setTickets(ticketsData);
      if (usersData) setUsers(usersData);
      if (partnersData) setPartners(partnersData);

    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationToggle = async (location) => {
    try {
      const { error } = await supabase
        .from('location_settings')
        .update({ is_available: !location.is_available }) // Ensure column match DB
        .eq('id', location.id);

      if (!error) {
        loadData();
      }
    } catch (err) {
      console.error('Error updating location:', err);
    }
  };

  const handleEditPlan = (plan) => {
    setEditingPlan(plan.id);
    setFormData({ ...plan, discount: plan.discount || 0 });
  };

  const handleSavePlan = async () => {
    try {
      const { error } = await supabase
        .from('paid_plans')
        .update(formData)
        .eq('id', editingPlan);

      if (!error) {
        setEditingPlan(null);
        loadData();
      }
    } catch (err) {
      console.error('Error saving plan:', err);
    }
  };

  const handleCreateFlameCustom = async () => {
    try {
      const payload = {
        name: 'Flame Custom Plan',
        ram: 'Custom',
        cpu: 'Custom',
        storage: 'Custom',
        location: 'UAE',
        price: 'Custom',
        discount: 0,
        is_active: true
      };

      const { error } = await supabase
        .from('paid_plans')
        .insert([payload]);

      if (!error) {
        loadData();
        alert('Flame Custom Plan created in UAE');
      } else {
        alert('Failed to create plan');
      }
    } catch (err) {
      console.error('Error creating custom plan:', err);
    }
  };

  const handleDeletePlan = async (id) => {
    if (!confirm('Are you sure you want to delete this plan?')) return;
    try {
      const { error } = await supabase
        .from('paid_plans')
        .delete()
        .eq('id', id);

      if (!error) {
        loadData();
      } else {
        alert('Failed to delete plan');
      }
    } catch (err) {
      console.error('Error deleting plan:', err);
    }
  };

  const handleRestoreDefaults = async () => {
    if (!confirm('Restore default paid plans? This will insert standard plans if missing.')) return;
    // We cannot call server endpoint. We must insert manually if needed.
    // For now, simpler to alert that this feature is disabled or reimplement client-side.
    alert('Automatic restore is disabled in serverless mode. Please create plans manually.');
  };

  // Tickets handling
  const handleUpdateTicket = async (ticketId, updates) => {
    try {
      // Map frontend camelCase to DB snake_case if needed
      const dbUpdates = {};
      if (updates.status) dbUpdates.status = updates.status;
      if (updates.adminResponse) dbUpdates.admin_response = updates.adminResponse;

      const { error } = await supabase
        .from('tickets')
        .update(dbUpdates)
        .eq('id', ticketId);

      if (!error) loadData();
    } catch (e) { console.error(e); }
  };

  // YT Partners handling
  const [editingPartner, setEditingPartner] = useState(null);
  const [partnerForm, setPartnerForm] = useState({ name: '', link: '', logo: '', isFeatured: false });
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [partnerLogoPreview, setPartnerLogoPreview] = useState(null);
  const fileInputRef = React.useRef();

  const handleSavePartner = async () => {
    try {
      const payload = {
        name: partnerForm.name,
        channel_link: partnerForm.link,
        logo: partnerForm.logo,
        is_featured: partnerForm.isFeatured,
        is_active: true
      };

      if (editingPartner !== null) {
        await supabase.from('yt_partners').update(payload).eq('id', editingPartner);
      } else {
        await supabase.from('yt_partners').insert([payload]);
      }

      setEditingPartner(null);
      setPartnerForm({ name: '', link: '', logo: '', isFeatured: false });
      setShowPartnerModal(false);
      loadData();
    } catch (e) { console.error(e); }
  };

  const handleDeletePartner = async (id) => {
    if (!confirm('Delete this partner?')) return;
    try {
      await supabase.from('yt_partners').delete().eq('id', id);
      loadData();
    } catch (e) { console.error(e); }
  };

  // Users handling
  const handleDeleteUser = async (id) => {
    if (!confirm('Delete this user? (Only removes from database, not Auth system)')) return;
    try {
      const { error } = await supabase.from('users').delete().eq('id', id);
      if (!error) loadData();
    } catch (e) { console.error(e); }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
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
          <div style={{ marginTop: '20px' }}>
            {locations.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No locations found</p>
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
                  <span style={{ fontWeight: '600' }}>{loc.location}</span>
                  <button
                    className={`btn ${loc.is_available ? 'btn-success' : 'btn-danger'}`}
                    onClick={() => handleLocationToggle(loc)}
                    style={{ padding: '8px 16px', fontSize: '0.9rem' }}
                  >
                    {loc.is_available ? '✓ Available' : '✗ Disabled'}
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
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginBottom: '12px' }}>
            <button className="btn btn-secondary" onClick={handleRestoreDefaults} style={{ padding: '8px 12px' }}>Restore Default Plans</button>
            <button className="btn btn-primary" onClick={handleCreateFlameCustom} style={{ padding: '8px 12px' }}>Create Flame Custom Plan (UAE)</button>
          </div>
          <div style={{ marginTop: '20px', overflowX: 'auto' }}>
            {plans.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No plans found</p>
            ) : (
              <table style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th>Plan Name</th>
                    <th>RAM</th>
                    <th>CPU</th>
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
                      <td>{plan.price}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            className="btn btn-secondary"
                            onClick={() => handleEditPlan(plan)}
                            style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() => handleDeletePlan(plan.id)}
                            style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                          >
                            Delete
                          </button>
                        </div>
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
          <div style={{ marginTop: '16px' }}>
            {tickets.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No tickets found</p>
            ) : (
              tickets.map(t => (
                <div key={t.id} style={{ border: '1px solid rgba(0,0,0,0.06)', padding: '12px', borderRadius: 8, marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <strong>{t.subject || 'Ticket'}</strong>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{t.user_id}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div>Status: <strong>{t.status || 'open'}</strong></div>
                      <div style={{ marginTop: 8 }}>
                        <select defaultValue={t.status || 'open'} onChange={e => handleUpdateTicket(t.id, { status: e.target.value })}>
                          <option value="open">open</option>
                          <option value="in_progress">in_progress</option>
                          <option value="resolved">resolved</option>
                          <option value="closed">closed</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div style={{ marginTop: 10 }}>{t.message}</div>
                  {t.screenshot && (
                    <div style={{ marginTop: 12 }}>
                      <img src={t.screenshot} alt="screenshot" style={{ maxWidth: 220, maxHeight: 140, borderRadius: 8, cursor: 'pointer', border: '1px solid rgba(0,0,0,0.06)' }} onClick={() => { setScreenshotModalSrc(t.screenshot); setShowScreenshotModal(true); }} />
                    </div>
                  )}

                  <div style={{ marginTop: 12 }}>
                    <label style={{ display: 'block', fontSize: '0.9rem' }}>Admin Response</label>
                    <textarea defaultValue={t.admin_response || ''} onBlur={e => handleUpdateTicket(t.id, { adminResponse: e.target.value })} style={{ width: '100%', minHeight: 80 }} />
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
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
            <button className="btn btn-primary" onClick={() => { setEditingPartner(null); setPartnerForm({ name: '', link: '', logo: '', isFeatured: false }); setShowPartnerModal(true); }}>+ Add Partner</button>
          </div>
          <div>
            {partners.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No partners yet</p>
            ) : (
              partners.map(p => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 8, marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <img src={p.logo} alt={p.name} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6 }} />
                    <div>
                      <div style={{ fontWeight: 600 }}>{p.name}</div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{p.channel_link}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-secondary" onClick={() => { setEditingPartner(p.id); setPartnerForm({ name: p.name, link: p.channel_link, logo: p.logo, isFeatured: !!p.is_featured }); setShowPartnerModal(true); }}>Edit</button>
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
          <div style={{ marginTop: 12 }}>
            {users.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No users found</p>
            ) : (
              users.map(u => (
                <div key={u.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 8, marginBottom: 10 }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{u.email}</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{u.username} • {u.is_admin ? 'Admin' : 'User'}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-danger" onClick={() => handleDeleteUser(u.id)}>Delete DB Entry</button>
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
              <input type="text" value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label>RAM</label>
              <input type="text" value={formData.ram || ''} onChange={e => setFormData({ ...formData, ram: e.target.value })} />
            </div>
            <div className="form-group">
              <label>CPU</label>
              <input type="text" value={formData.cpu || ''} onChange={e => setFormData({ ...formData, cpu: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Storage</label>
              <input type="text" value={formData.storage || ''} onChange={e => setFormData({ ...formData, storage: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Price</label>
              <input type="text" value={formData.price || ''} onChange={e => setFormData({ ...formData, price: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Location</label>
              <select value={formData.location || ''} onChange={e => setFormData({ ...formData, location: e.target.value })}>
                <option value="">-- Select Location --</option>
                {locations.map(l => (
                  <option key={l.id} value={l.location}>{l.location}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Discount (%)</label>
              <input type="number" value={formData.discount || 0} onChange={e => setFormData({ ...formData, discount: Number(e.target.value) })} />
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
              <input type="text" value={partnerForm.name} onChange={e => setPartnerForm({ ...partnerForm, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Link</label>
              <input type="text" value={partnerForm.link} onChange={e => setPartnerForm({ ...partnerForm, link: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Logo URL</label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input type="text" value={partnerForm.logo} onChange={e => setPartnerForm({ ...partnerForm, logo: e.target.value })} style={{ flex: 1 }} />
                {/* File upload removed for simplicity or needs Supabase Storage */}
              </div>
              {partnerForm.logo && (
                <div style={{ marginTop: 8 }}>
                  <img src={partnerForm.logo} alt="preview" style={{ width: 80, height: 48, objectFit: 'cover', borderRadius: 6, border: '1px solid rgba(0,0,0,0.06)' }} />
                </div>
              )}
            </div>
            <div className="form-group">
              <label><input type="checkbox" checked={!!partnerForm.isFeatured} onChange={e => setPartnerForm({ ...partnerForm, isFeatured: e.target.checked })} /> Featured</label>
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
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '90%', padding: 12 }}>
            <img src={screenshotModalSrc} alt="screenshot full" style={{ width: '100%', height: 'auto', borderRadius: 8 }} />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
              <button className="btn btn-secondary" onClick={() => setShowScreenshotModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
