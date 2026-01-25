import React, { useState, useEffect, useRef } from 'react';
import { useAuth, supabase } from '../context/AuthContext';
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
  const [errorMessage, setErrorMessage] = useState('');
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

  // Poll messages periodically
  useEffect(() => {
    const iv = setInterval(() => {
      loadMessages();
      if (user?.isAdmin) loadUsers();
    }, 3000); // 3 seconds poll
    return () => clearInterval(iv);
  }, [user, selectedUser]);

  useEffect(() => {
    if (messages.length > 0) {
      // Auto-scroll to bottom only if near bottom or initial load? For now always scroll.
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Initial load
  useEffect(() => {
    loadMessages();
  }, [user, selectedUser]);

  const loadUsers = async () => {
    try {
      // Load all users for admin panel chat list
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('last_seen', { ascending: false, nullsFirst: false }); // Optional: order by activity if column exists or just created_at

      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      console.error('Error loading users:', err);
    }
  };

  const loadMessages = async () => {
    if (!user?.id) return;

    try {
      let query = supabase
        .from('chat_messages')
        .select('*, sender:users!sender_id(username, avatar), receiver:users!receiver_id(username, avatar)')
        .order('created_at', { ascending: true });

      if (user.isAdmin) {
        if (!selectedUser?.id) {
          setMessages([]);
          return;
        }
        // Filter messages between Admin and Selected User
        // Because admin ID might not be fixed, assume current user is admin
        query = query.or(`and(sender_id.eq.${user.id},receiver_id.eq.${selectedUser.id}),and(sender_id.eq.${selectedUser.id},receiver_id.eq.${user.id})`);
      } else {
        // Regular user: fetch their own messages (sent or received)
        // Usually chat is with Support (Admin).
        // Since we don't have a single "Support" ID, we fetch all messages involving this user.
        // And we assume the other party is Support.
        query = query.or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Map to UI format
      const mapped = (data || []).map(m => {
        const isOwn = m.sender_id === user.id;
        const senderName = isOwn ? 'You' : (m.sender?.username || 'Support');
        const senderAvatar = m.sender?.avatar;

        return {
          id: m.id,
          senderId: m.sender_id,
          receiverId: m.receiver_id,
          senderName,
          senderAvatar,
          message: m.message,
          createdAt: m.created_at,
          isOwn
        };
      });
      setMessages(mapped);
    } catch (err) {
      console.error('Error loading messages:', err);
    }
  };

  const getAdminId = async () => {
    // Helper to find an admin ID to send message to
    const { data } = await supabase
      .from('users')
      .select('id')
      .eq('is_admin', true)
      .limit(1)
      .single();
    return data?.id;
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setLoading(true);
    try {
      let receiverId = null;
      if (user.isAdmin) {
        receiverId = selectedUser?.id;
      } else {
        // Find an admin to send to
        receiverId = await getAdminId();
        if (!receiverId) {
          setErrorMessage('No support staff available.');
          return;
        }
      }

      const { error } = await supabase
        .from('chat_messages')
        .insert([{
          sender_id: user.id,
          receiver_id: receiverId, // If null (broadcast?), schema says uuid not null usually.
          message: newMessage.trim()
        }]);

      if (error) throw error;

      setNewMessage('');
      loadMessages();
    } catch (err) {
      console.error('Error sending message:', err);
      setErrorMessage('Failed to send message.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2>💬 {user.isAdmin ? 'Support Messages' : 'Client Chat'}</h2>
        <p>{user.isAdmin ? 'Manage customer messages' : 'Chat with our support team'}</p>
      </div>

      <div className="card" style={{ padding: '28px', borderRadius: '20px', background: 'linear-gradient(180deg, rgba(18,12,10,0.92), rgba(28,18,14,0.86))', border: '1px solid rgba(255,106,0,0.12)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <h3>Messages</h3>
          {user.isAdmin && (
            <button className="btn btn-secondary" onClick={() => setShowUserList(!showUserList)}>
              👥 Users ({users.length})
            </button>
          )}
          {user.isAdmin && selectedUser && (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button className="btn btn-secondary" onClick={() => { setEditData({ username: selectedUser.username }); setEditAvatarPreview(selectedUser.avatar || null); setEditModalOpen(true); }}>
                ✏️ Edit User
              </button>
            </div>
          )}
        </div>

        {showUserList && user.isAdmin && (
          <div style={{ background: 'rgba(255, 106, 0, 0.05)', padding: '16px', borderRadius: '12px', marginBottom: '20px', border: '1px solid rgba(255, 106, 0, 0.2)' }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: '12px', fontSize: '0.9rem' }}>Select a user to view their messages:</p>
            {users.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No users yet</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '8px' }}>
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

        <div style={{ display: 'flex', gap: '18px' }}>
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
              <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '12px' }}>💬</div>
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div key={index} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '8px', flexDirection: msg.isOwn ? 'row-reverse' : 'row' }}>
                  <img src={msg.senderAvatar || '/logo.png'} alt={msg.senderName} style={{ width: '36px', height: '36px', borderRadius: '8px', objectFit: 'cover' }} />
                  <div style={{
                    maxWidth: '80%',
                    padding: '10px 14px',
                    background: msg.isOwn ? 'rgba(255, 106, 0, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    borderTopRightRadius: msg.isOwn ? '2px' : '12px',
                    borderTopLeftRadius: msg.isOwn ? '12px' : '2px'
                  }}>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', marginBottom: '4px', textAlign: msg.isOwn ? 'right' : 'left' }}>
                      {msg.senderName}
                    </p>
                    <p style={{ color: '#ffffff', margin: 0, fontSize: '0.95rem' }}>{msg.message}</p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <form onSubmit={sendMessage} style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '12px' }}>
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
            ➤
          </button>
        </form>
        {errorMessage && <div style={{ color: 'red', marginTop: 10, textAlign: 'center' }}>{errorMessage}</div>}

        {/* Edit User Modal for Admins */}
        {editModalOpen && selectedUser && (
          <div className="modal-overlay" onClick={() => setEditModalOpen(false)}>
            <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '420px' }}>
              <h3>Edit User — {selectedUser.username}</h3>
              <form onSubmit={async (e) => {
                e.preventDefault();
                try {
                  const updates = { username: editData.username };
                  if (editAvatarPreview) updates.avatar = editAvatarPreview;

                  const { error } = await supabase
                    .from('users')
                    .update(updates)
                    .eq('id', selectedUser.id);

                  if (!error) {
                    await loadUsers();
                    setEditModalOpen(false);
                    alert('User updated');
                  } else {
                    alert('Update failed: ' + error.message);
                  }
                } catch (err) {
                  console.error(err);
                  alert('Update failed');
                }
              }}>
                <div className="form-group">
                  <label>Username</label>
                  <input value={editData.username} onChange={e => setEditData({ ...editData, username: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Avatar (optional)</label>
                  <input type="file" accept="image/*" onChange={e => {
                    const f = e.target.files && e.target.files[0];
                    if (!f) return;
                    // For now using base64 preview as value. For prod, use Supabase Storage.
                    const r = new FileReader();
                    r.onload = () => setEditAvatarPreview(r.result);
                    r.readAsDataURL(f);
                  }} />
                  {editAvatarPreview && <div style={{ marginTop: '8px' }}><img src={editAvatarPreview} alt="preview" style={{ width: '64px', height: '64px', borderRadius: '8px', objectFit: 'cover' }} /></div>}
                </div>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '12px' }}>
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
