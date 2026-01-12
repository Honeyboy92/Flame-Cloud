import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPanel = () => {
  const [tab, setTab] = useState('tickets');
  const [paidPlans, setPaidPlans] = useState([]);
  const [users, setUsers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [about, setAbout] = useState({});
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [planLocation, setPlanLocation] = useState('UAE');
  const [locationSettings, setLocationSettings] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [paid, usersRes, ticketsRes, aboutRes, locationsRes] = await Promise.all([
      axios.get('/api/admin/paid-plans'),
      axios.get('/api/admin/users'),
      axios.get('/api/admin/tickets'),
      axios.get('/api/admin/about'),
      axios.get('/api/admin/locations')
    ]);
    setPaidPlans(paid.data);
    setUsers(usersRes.data);
    setTickets(ticketsRes.data);
    setAbout(aboutRes.data);
    setLocationSettings(locationsRes.data);
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

  const handleAboutUpdate = async () => {
    await axios.put('/api/admin/about', about);
    setModal(null);
    alert('About content updated!');
  };

  const handleLocationToggle = async (location, currentStatus) => {
    await axios.put(`/api/admin/locations/${location}`, { isAvailable: !currentStatus });
    loadData();
  };

  const openPlanModal = (plan = null) => {
    setForm(plan || { name: '', ram: '', cpu: '', storage: '', location: planLocation, price: '', sortOrder: 0 });
    setModal({ type: 'plan' });
  };

  const openTicketModal = (ticket) => {
    setForm({ ...ticket, newResponse: ticket.adminResponse || '' });
    setModal({ type: 'ticket' });
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
        <button className={tab === 'users' ? 'active' : ''} onClick={() => setTab('users')}>👥 Users</button>
        <button className={tab === 'about' ? 'active' : ''} onClick={() => setTab('about')}>📋 About</button>
      </div>

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
              <thead><tr><th>Name</th><th>RAM</th><th>CPU</th><th>Storage</th><th>Location</th><th>Price</th><th>Actions</th></tr></thead>
              <tbody>
                {paidPlans.filter(p => p.location === planLocation).length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{textAlign: 'center', padding: '40px', color: 'var(--text-muted)'}}>
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

      {/* Users Tab */}
      {tab === 'users' && (
        <div className="card">
          <h3>👥 All Users ({users.length})</h3>
          <div className="table-container">
            <table>
              <thead><tr><th>Username</th><th>Email</th><th>Role</th><th>Joined</th></tr></thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td style={{fontWeight: '600'}}>{u.username}</td>
                    <td style={{color: 'var(--text-muted)'}}>{u.email}</td>
                    <td><span className={`badge ${u.isAdmin ? 'badge-approved' : 'badge-pending'}`}>{u.isAdmin ? 'Admin' : 'User'}</span></td>
                    <td style={{color: 'var(--text-muted)'}}>{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* About Tab */}
      {tab === 'about' && (
        <div className="card">
          <h3>📋 Edit About Content</h3>
          <div className="form-group">
            <label>About Content</label>
            <textarea value={about.content || ''} onChange={e => setAbout({...about, content: e.target.value})} rows={5} />
          </div>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px'}}>
            <div className="form-group">
              <label>Owner</label>
              <input value={about.owner || ''} onChange={e => setAbout({...about, owner: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Founder</label>
              <input value={about.coOwner || ''} onChange={e => setAbout({...about, coOwner: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Managers</label>
              <input value={about.managers || ''} onChange={e => setAbout({...about, managers: e.target.value})} />
            </div>
          </div>
          <button className="btn btn-success" onClick={handleAboutUpdate}>Save Changes</button>
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
    </div>
  );
};

export default AdminPanel;
