import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = () => {
    axios.get('/api/tickets').then(res => setTickets(res.data));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      alert('Please fill all fields!');
      return;
    }
    setLoading(true);
    try {
      await axios.post('/api/tickets', { subject, message });
      setShowModal(false);
      setSubject('');
      setMessage('');
      loadTickets();
      alert('✅ Ticket created successfully!');
    } catch (err) {
      alert('Error creating ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2>🎫 Support Tickets</h2>
        <p>Create and track your support requests</p>
      </div>

      <div style={{marginBottom: '24px'}}>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          ➕ Create New Ticket
        </button>
      </div>

      {tickets.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="icon">🎫</div>
            <h3>No Tickets Yet</h3>
            <p style={{color: 'var(--text-muted)', marginTop: '12px'}}>
              Need help? Create a support ticket and we'll get back to you!
            </p>
          </div>
        </div>
      ) : (
        <div className="card">
          <h3>📋 Your Tickets ({tickets.length})</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Subject</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map(ticket => (
                  <tr key={ticket.id}>
                    <td style={{color: 'var(--primary-light)', fontWeight: '700'}}>#{ticket.id}</td>
                    <td>{ticket.subject}</td>
                    <td><span className={`badge badge-${ticket.status}`}>{ticket.status}</span></td>
                    <td style={{color: 'var(--text-muted)'}}>{new Date(ticket.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button className="btn btn-secondary" style={{padding: '8px 16px'}} onClick={() => setSelectedTicket(ticket)}>
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Ticket Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>🎫 Create New Ticket</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Subject</label>
                <input 
                  type="text" 
                  value={subject} 
                  onChange={e => setSubject(e.target.value)}
                  placeholder="e.g., Server Issue, Payment Query, etc."
                />
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea 
                  value={message} 
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Describe your issue or question in detail..."
                  rows={5}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-success" disabled={loading}>
                  {loading ? '⏳ Creating...' : '✅ Submit Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Ticket Modal */}
      {selectedTicket && (
        <div className="modal-overlay" onClick={() => setSelectedTicket(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>🎫 Ticket #{selectedTicket.id}</h3>
            
            <div style={{background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(245, 158, 11, 0.05))', padding: '20px', borderRadius: '16px', marginBottom: '20px', border: '1px solid var(--glass-border)'}}>
              <p><strong style={{color: 'var(--text-muted)'}}>Subject:</strong> <span style={{color: 'var(--primary-light)'}}>{selectedTicket.subject}</span></p>
              <p style={{marginTop: '8px'}}><strong style={{color: 'var(--text-muted)'}}>Status:</strong> <span className={`badge badge-${selectedTicket.status}`}>{selectedTicket.status}</span></p>
              <p style={{marginTop: '8px'}}><strong style={{color: 'var(--text-muted)'}}>Date:</strong> <span style={{color: 'var(--text-secondary)'}}>{new Date(selectedTicket.createdAt).toLocaleString()}</span></p>
            </div>

            <div style={{marginBottom: '20px'}}>
              <label style={{color: 'var(--text-muted)', fontWeight: '600', display: 'block', marginBottom: '10px'}}>Your Message:</label>
              <div style={{background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '12px', whiteSpace: 'pre-wrap', color: 'var(--text-secondary)'}}>
                {selectedTicket.message}
              </div>
            </div>

            {selectedTicket.adminResponse && (
              <div style={{marginBottom: '20px'}}>
                <label style={{color: 'var(--success)', fontWeight: '600', display: 'block', marginBottom: '10px'}}>🔥 Admin Response:</label>
                <div style={{background: 'rgba(16, 185, 129, 0.1)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.3)', color: 'var(--text-primary)'}}>
                  {selectedTicket.adminResponse}
                </div>
              </div>
            )}

            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setSelectedTicket(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tickets;
