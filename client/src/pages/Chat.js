import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Chat = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserList, setShowUserList] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState({ username: '' });
  const [editAvatarPreview, setEditAvatarPreview] = useState(null);
  const [editAvatarFile, setEditAvatarFile] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (user.isAdmin) {
      loadUsers();
    }
  }, [user, navigate]);

  // Poll messages periodically to simulate live chat
  useEffect(() => {
    const iv = setInterval(() => {
      loadMessages();
      if (user?.isAdmin) loadUsers();
    }, 3000);
    return () => clearInterval(iv);
  }, [user, selectedUser]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } : { 'Content-Type': 'application/json' };
  };

  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Load messages initially when user or selectedUser changes
  useEffect(() => {
    loadMessages();
  }, [user, selectedUser]);

  const loadUsers = async () => {
    try {
      const res = await fetch('/api/chat/users', { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error('Error loading users:', err);
    }
  };

  const loadMessages = async () => {
    if (!user?.id) return;

    try {
      let url = '';
      // Admin must select a user to see that conversation
      if (user.isAdmin) {
        if (!selectedUser?.id) {
          setMessages([]);
          return;
        }
        url = `/api/chat/messages/${selectedUser.id}`;
      } else {
        // Regular user: get the admin id then fetch messages between user and admin
        const adminRes = await fetch('/api/chat/admin', { headers: getAuthHeaders() });
        if (!adminRes.ok) return;
        const admin = await adminRes.json();
        if (!admin?.id) return;
        url = `/api/chat/messages/${admin.id}`;
      }

      const res = await fetch(url, { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        // Map messages to client format
        const mapped = (data || []).map(m => {
          const sid = m.senderId || m.sender_id;
          const created = m.createdAt || m.created_at;
          const senderName = sid === user.id ? (user.username || 'You') : (selectedUser?.username || 'Support');
          return {
            id: m.id,
            senderId: sid,
            receiverId: m.receiverId || m.receiver_id,
            senderName,
            senderAvatar: m.senderAvatar || null,
            message: m.message,
            createdAt: created,
            isOwn: sid === user.id
          };
        });
        setMessages(mapped);
      }
    } catch (err) {
      console.error('Error loading messages:', err);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setLoading(true);
    try {
      let receiverId = undefined;
      if (user.isAdmin) {
        receiverId = selectedUser?.id;
      } else {
        // get admin id
        const adminRes = await fetch('/api/chat/admin', { headers: getAuthHeaders() });
        if (adminRes.ok) {
          const admin = await adminRes.json();
          receiverId = admin?.id;
        }
      }

      const res = await fetch('/api/chat/send', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ message: newMessage.trim(), receiverId })
      });

      if (res.ok) {
        setNewMessage('');
        loadMessages();
      }
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div>
      <div className="page-header">
        <h2>💬 {user.isAdmin ? 'Support Messages' : 'Client Chat'}</h2>
        <p>{user.isAdmin ? 'Manage customer messages' : 'Chat with our support team'}</p>
      </div>

      <div className="card" style={{padding: '28px', borderRadius: '20px', background: 'linear-gradient(180deg, rgba(18,12,10,0.92), rgba(28,18,14,0.86))', border: '1px solid rgba(255,106,0,0.12)'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px'}}>
          <h3>Messages</h3>
          {user.isAdmin && (
            <button className="btn btn-secondary" onClick={() => setShowUserList(!showUserList)}>
              👥 Users ({users.length})
            </button>
          )}
          {user.isAdmin && selectedUser && (
            <div style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
              <button className="btn btn-secondary" onClick={() => { setEditData({ username: selectedUser.username }); setEditAvatarPreview(selectedUser.avatar || null); setEditModalOpen(true); }}>
                ✏️ Edit User
              </button>
            </div>
          )}
        </div>

        {showUserList && user.isAdmin && (
          <div style={{background: 'rgba(255, 106, 0, 0.05)', padding: '16px', borderRadius: '12px', marginBottom: '20px', border: '1px solid rgba(255, 106, 0, 0.2)'}}>
            <p style={{color: 'var(--text-muted)', marginBottom: '12px', fontSize: '0.9rem'}}>Select a user to view their messages:</p>
            {users.length === 0 ? (
              <p style={{color: 'var(--text-muted)'}}>No users yet</p>
            ) : (
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '8px'}}>
                {users.map(u => (
                  <button
                    key={u.id}
                    onClick={() => {
                      setSelectedUser(u);
                      setShowUserList(false);
                    }}
                    style={{
                      padding: '10px',
                      background: selectedUser?.id === u.id ? 'linear-gradient(135deg, #FF2E00, #FF6A00)' : 'rgba(255, 106, 0, 0.1)',
                      border: selectedUser?.id === u.id ? '2px solid #FF2E00' : '1px solid rgba(255, 106, 0, 0.2)',
                      borderRadius: '8px',
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    {u.username}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div style={{display: 'flex', gap: '18px'}}>
          {/* Left-side user/team list (Discord-like) */}
          <div style={{width: '220px'}}>
            <div style={{
              background: 'linear-gradient(180deg, rgba(20,14,12,0.6), rgba(12,8,6,0.45))',
              borderRadius: '14px',
              padding: '12px',
              height: '480px',
              overflowY: 'auto',
              border: '1px solid rgba(255,106,0,0.06)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.02)'
            }}>
              <h4 style={{marginTop: 0, marginBottom: '12px', color: 'var(--text-primary)'}}>Users</h4>
              {user.isAdmin ? (
                users.length === 0 ? <p style={{color: 'var(--text-muted)'}}>No users</p> : (
                  <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                    {users.map(u => (
                      <div key={u.id} style={{display: 'flex', alignItems: 'center', gap: '10px', padding: '8px', borderRadius: '10px', background: selectedUser?.id === u.id ? 'linear-gradient(90deg, rgba(255,46,0,0.06), rgba(255,106,0,0.03))' : 'transparent', cursor: 'pointer'}} onClick={() => { setSelectedUser(u); loadMessages(); }}>
                            {/* Don't show founder's personal image in public chat list; use logo instead */}
                        {
                          (() => {
                            const avatar = u.avatar || '';
                            const uname = (u.username || '').toLowerCase();
                            const isFounderAvatar = avatar.toLowerCase().includes('rameez') || uname.includes('rammez') || uname.includes('founder');
                            const avatarSrc = isFounderAvatar ? '/logo.png' : (u.avatar || '/logo.png');
                            return <img src={avatarSrc} alt={u.username} style={{width: '40px', height: '40px', borderRadius: '10px'}} />;
                          })()
                        }
                        <div style={{display: 'flex', flexDirection: 'column'}}>
                          <strong style={{color: 'var(--text-primary)'}}>{u.username}</strong>
                          <small style={{color: 'var(--text-muted)'}}>id: {u.id}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                <div>
                  <h5 style={{color: '#ff6a00', margin: '8px 0'}}>Flame Cloud Team</h5>
                  {/* Show a single team entry for regular users */}
                  <div style={{display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 6px'}}>
                    <img src={'/logo.png'} alt={'Flame Cloud Team'} style={{width: '40px', height: '40px', borderRadius: '10px'}} />
                    <span style={{color: 'var(--text-primary)'}}>Flame Cloud Team</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div style={{
            flex: 1,
            background: 'transparent',
            borderRadius: '14px',
            padding: '18px',
            height: '480px',
            overflowY: 'auto',
            marginBottom: '16px',
            border: 'none',
            boxShadow: 'none',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end'
          }}>
          {messages.length === 0 ? (
            <div style={{textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)'}}>
              <div style={{fontSize: '2rem', marginBottom: '12px'}}>💬</div>
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div key={index} style={{display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '8px'}}>
                <img src={msg.senderAvatar || '/logo.png'} alt={msg.senderName} style={{width: '36px', height: '36px', borderRadius: '8px', objectFit: 'cover'}} />
                <div style={{
                  maxWidth: '86%',
                  padding: '8px 10px',
                  background: 'transparent'
                }}>
                  <p style={{color: 'rgba(255,255,255,0.95)', fontSize: '0.75rem', marginBottom: '6px'}}>
                    {msg.senderName} • {new Date(msg.createdAt).toLocaleTimeString()}
                  </p>
                  <p style={{color: '#ffffff', margin: 0, fontSize: '0.95rem', background: 'transparent'}}>{msg.message}</p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
          </div>

          {/* Left-side user list moved above; right side removed */}
        </div>

        <form onSubmit={sendMessage} style={{display: 'flex', gap: '12px', alignItems: 'center', marginTop: '12px'}}>
          <input
            type="text"
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            style={{
              flex: 1,
              padding: '14px 18px',
              background: 'linear-gradient(180deg, rgba(10,8,6,0.45), rgba(18,12,10,0.36))',
              border: '1px solid rgba(255,106,0,0.06)',
              borderRadius: '12px',
              color: 'var(--text-primary)',
              fontFamily: 'inherit',
              outline: 'none'
            }}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !newMessage.trim()}
            style={{
              background: 'linear-gradient(180deg,#FF4500,#FF6A00)',
              border: 'none',
              width: '56px',
              height: '48px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 22px rgba(255,80,10,0.18)',
              cursor: loading || !newMessage.trim() ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? (
              '⏳'
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 2L11 13" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
        </form>
        {/* Edit User Modal for Admins */}
        {editModalOpen && selectedUser && (
          <div className="modal-overlay" onClick={() => setEditModalOpen(false)}>
            <div className="modal" onClick={e => e.stopPropagation()} style={{maxWidth: '420px'}}>
              <h3>Edit User — {selectedUser.username}</h3>
              <form onSubmit={async (e) => {
                e.preventDefault();
                try {
                  const token = localStorage.getItem('token');
                  const headers = { 'Content-Type': 'application/json' };
                  if (token) headers.Authorization = `Bearer ${token}`;
                  const body = { username: editData.username };
                  if (editAvatarPreview) body.avatar = editAvatarPreview;
                  const res = await fetch(`/api/admin/users/${selectedUser.id}`, {
                    method: 'PUT',
                    headers,
                    body: JSON.stringify(body)
                  });
                  if (res.ok) {
                    const json = await res.json();
                    // Refresh users and selected user
                    await loadUsers();
                    setSelectedUser(json.user);
                    setEditModalOpen(false);
                    alert('User updated');
                  } else {
                    const t = await res.text();
                    alert('Update failed: ' + t);
                  }
                } catch (err) {
                  console.error(err);
                  alert('Update failed');
                }
              }}>
                <div className="form-group">
                  <label>Username</label>
                  <input value={editData.username} onChange={e => setEditData({...editData, username: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Avatar (optional)</label>
                  <input type="file" accept="image/*" onChange={e => {
                    const f = e.target.files && e.target.files[0];
                    if (!f) return;
                    setEditAvatarFile(f);
                    const r = new FileReader();
                    r.onload = () => setEditAvatarPreview(r.result);
                    r.readAsDataURL(f);
                  }} />
                  {editAvatarPreview && <div style={{marginTop: '8px'}}><img src={editAvatarPreview} alt="preview" style={{width: '64px', height: '64px', borderRadius: '8px', objectFit: 'cover'}} /></div>}
                </div>
                <div style={{display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '12px'}}>
                  <button type="button" className="btn btn-secondary" onClick={() => setEditModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
