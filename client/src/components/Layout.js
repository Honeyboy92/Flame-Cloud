import React, { useState, useEffect, useRef } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';

const Layout = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [showChat, setShowChat] = useState(false);
  const [showUserList, setShowUserList] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [adminId, setAdminId] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [profileData, setProfileData] = useState({ email: '', username: '', currentPassword: '', newPassword: '', confirmPassword: '', avatar: null });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState({ type: '', text: '' });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (user) {
      // Chat functionality temporarily disabled - will be updated to use Supabase later
      // if (!user.isAdmin) {
      //   axios.get('/api/chat/admin').then(res => setAdminId(res.data?.id)).catch(() => {});
      // }
    }
  }, [user]);

  useEffect(() => {
    if (showChat && (adminId || selectedUser)) {
      loadMessages();
      const interval = setInterval(loadMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [showChat, adminId, selectedUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadMessages = () => {
    // Chat functionality temporarily disabled
    // const otherId = user.isAdmin ? selectedUser?.id : adminId;
    // if (otherId) {
    //   axios.get(`/api/chat/messages/${otherId}`).then(res => {
    //     setMessages(res.data);
    //   });
    // }
  };

  const loadUsers = () => {
    // Chat functionality temporarily disabled
    // axios.get('/api/chat/users').then(res => setUsers(res.data));
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    // Chat functionality temporarily disabled
    // const receiverId = user.isAdmin ? selectedUser?.id : adminId;
    // if (!receiverId) return;
    // 
    // await axios.post('/api/chat/send', { receiverId, message: newMessage });
    // setNewMessage('');
    // loadMessages();
  };

  const openUserList = () => {
    setShowUserList(true);
    loadUsers();
  };

  const selectUser = (u) => {
    setSelectedUser(u);
    setShowUserList(false);
    setShowChat(true);
  };

  const openProfileModal = () => {
    setProfileData({ 
      email: user?.email || '', 
      username: user?.user_metadata?.username || '', 
      currentPassword: '', 
      newPassword: '', 
      confirmPassword: '', 
      avatar: user?.user_metadata?.avatar || null 
    });
    setAvatarPreview(user?.user_metadata?.avatar || null);
    setProfileMessage({ type: '', text: '' });
    setShowProfileModal(true);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        setProfileData({...profileData, avatar: reader.result});
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        setProfileData({...profileData, avatar: reader.result});
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMessage({ type: '', text: '' });

    try {
      // Update username in Supabase user metadata
      if (profileData.username && profileData.username !== user?.user_metadata?.username) {
        const { error } = await supabase.auth.updateUser({
          data: { username: profileData.username }
        });
        if (error) throw error;
        updateUser({ ...user, user_metadata: { ...user.user_metadata, username: profileData.username } });
      }

      // Update avatar if changed
      if (profileData.avatar && profileData.avatar !== user?.user_metadata?.avatar) {
        const { error } = await supabase.auth.updateUser({
          data: { avatar: profileData.avatar }
        });
        if (error) throw error;
        updateUser({ ...user, user_metadata: { ...user.user_metadata, avatar: profileData.avatar } });
      }

      // Update email if changed
      if (profileData.email && profileData.email !== user?.email) {
        const { error } = await supabase.auth.updateUser({
          email: profileData.email
        });
        if (error) throw error;
        updateUser({ ...user, email: profileData.email });
      }

      // Update password if provided
      if (profileData.newPassword) {
        if (profileData.newPassword !== profileData.confirmPassword) {
          setProfileMessage({ type: 'error', text: 'New passwords do not match!' });
          setProfileLoading(false);
          return;
        }
        const { error } = await supabase.auth.updateUser({
          password: profileData.newPassword
        });
        if (error) throw error;
      }

      setProfileMessage({ type: 'success', text: '✅ Profile updated successfully!' });
      setProfileData({ ...profileData, currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setProfileMessage({ type: 'error', text: err.response?.data?.error || 'Failed to update profile' });
    } finally {
      setProfileLoading(false);
    }
  };

  return (
    <div className="app-layout">
      {/* Fire Sparks / Embers */}
      <div className="fire-sparks">
        <div className="spark"></div>
        <div className="spark"></div>
        <div className="spark"></div>
        <div className="spark"></div>
        <div className="spark"></div>
        <div className="spark"></div>
        <div className="spark"></div>
        <div className="spark"></div>
        <div className="spark"></div>
        <div className="spark"></div>
        <div className="spark"></div>
        <div className="spark"></div>
        <div className="spark"></div>
        <div className="spark"></div>
        <div className="spark"></div>
        <div className="spark"></div>
        <div className="spark"></div>
        <div className="spark"></div>
        <div className="spark"></div>
        <div className="spark"></div>
      </div>

      <header className="top-navbar">
        <div className="navbar-brand" onClick={() => navigate('/dashboard')} style={{cursor: 'pointer', transition: 'all 0.3s ease'}}>
          <img src="/logo.png" alt="🔥" className="brand-logo" style={{width: '50px', height: '50px', objectFit: 'contain', transition: 'transform 0.3s ease'}} />
          <div className="brand-text" style={{transition: 'transform 0.3s ease'}}>
            <h1>Flame Cloud</h1>
            <span>Premium Minecraft Hosting</span>
          </div>
        </div>

        <nav className="navbar-menu">
          <NavLink to="/dashboard" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
            <div className="nav-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            </div>
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/paid-plans" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
            <div className="nav-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
            </div>
            <span>Paid Plans</span>
          </NavLink>

          <NavLink to="/yt-partners" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
            <div className="nav-icon">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="#FF0000">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
              </svg>
            </div>
            <span>YT Partners</span>
          </NavLink>

          <NavLink to="/about" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
            <div className="nav-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
            </div>
            <span>About</span>
          </NavLink>


          <NavLink to="/features" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
            <div className="nav-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            </div>
            <span>Features</span>
          </NavLink>

          <NavLink to="/chat" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
            <div className="nav-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <span>Chat</span>
          </NavLink>

          {user?.user_metadata?.isAdmin && (
            <NavLink to="/admin" className={({isActive}) => `nav-item admin-item ${isActive ? 'active' : ''}`}>
              <div className="nav-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
              </div>
              <span>Admin</span>
            </NavLink>
          )}
        </nav>

        <div className="navbar-user">
          {user ? (
            <>
              <div className="user-info" onClick={openProfileModal} style={{cursor: 'pointer'}}>
                <div className="user-avatar" style={user?.user_metadata?.avatar ? {background: `url(${user.user_metadata.avatar}) center/cover`} : {}}>
                  {!user?.user_metadata?.avatar && user?.user_metadata?.username ? user.user_metadata.username.charAt(0).toUpperCase() : '🔥'}
                </div>
                <span className="user-name">{user?.user_metadata?.username || user?.email}</span>
              </div>
              <button className="logout-btn" onClick={logout}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
              </button>
            </>
          ) : (
            <div style={{display: 'flex', gap: '10px'}}>
              <NavLink to="/login" className="btn btn-secondary" style={{padding: '8px 16px'}}>Sign In</NavLink>
              <NavLink to="/signup" className="btn btn-primary" style={{padding: '8px 16px'}}>Sign Up</NavLink>
            </div>
          )}
        </div>
      </header>
      
      <main className="main-content-top">
        {/* Background Logo */}
        <div className="page-bg-logo">
          <img src="/logo.png" alt="" />
        </div>
        <Outlet />
      </main>


      {/* Floating Buttons Container - Right Side */}
      <div className="floating-buttons-right">
        {/* Game Panel Button */}
        <a href="https://panel.flamecloud.online/" target="_blank" rel="noopener noreferrer" className="float-btn game-panel-btn">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4-3c-.83 0-1.5-.67-1.5-1.5S18.67 9 19.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
          </svg>
          <span>Game Panel</span>
        </a>

        {/* Client Chat Button (for users) / Users Button (for admin) */}
        {user?.user_metadata?.isAdmin ? (
          <button className="float-btn users-btn" onClick={() => navigate('/chat')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <span>Users</span>
          </button>
        ) : (
          <button className="float-btn chat-btn" onClick={() => navigate('/chat')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <span>Client Chat</span>
          </button>
        )}
      </div>

      {/* Discord Button - Bottom Right */}
      <a href="https://discord.gg/WXWYz5ywTU" target="_blank" rel="noopener noreferrer" className="discord-float-btn">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
        </svg>
      </a>

      {/* User List Modal (Admin) */}
      {showUserList && (
        <div className="chat-modal-overlay" onClick={() => setShowUserList(false)}>
          <div className="user-list-modal" onClick={e => e.stopPropagation()}>
            <div className="chat-header">
              <h3>👥 Users</h3>
              <button className="close-btn" onClick={() => setShowUserList(false)}>✕</button>
            </div>
            <div className="user-list">
              {users.length === 0 ? (
                <p style={{textAlign: 'center', color: 'var(--text-muted)', padding: '40px'}}>No users yet</p>
              ) : (
                users.map(u => (
                  <div key={u.id} className="user-list-item" onClick={() => selectUser(u)}>
                    <div className="user-avatar-small" style={u.avatar ? {background: `url(${u.avatar}) center/cover`} : {}}>
                      {!u.avatar ? u.username.charAt(0).toUpperCase() : ''}
                    </div>
                    <div className="user-list-info">
                      <span className="user-list-name">{u.username}</span>
                      <span className="user-list-email">{u.email}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Chat Modal */}
      {showChat && (
        <div className="chat-modal-overlay" onClick={() => { setShowChat(false); setSelectedUser(null); }}>
          <div className="chat-modal" onClick={e => e.stopPropagation()}>
            <div className="chat-header">
              {user?.user_metadata?.isAdmin ? (
                <>
                  <div className="chat-header-info">
                    <div className="chat-avatar" style={selectedUser?.avatar ? {background: `url(${selectedUser.avatar}) center/cover`} : {}}>{!selectedUser?.avatar && selectedUser?.username?.charAt(0).toUpperCase()}</div>
                    <div>
                      <h3>{selectedUser?.username}</h3>
                      <span className="chat-status">User</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="chat-header-info">
                    <div className="chat-avatar admin-avatar">🔥</div>
                    <div>
                      <h3>Flame Cloud Support</h3>
                      <span className="chat-status online">● Online</span>
                    </div>
                  </div>
                </>
              )}
              <button className="close-btn" onClick={() => { setShowChat(false); setSelectedUser(null); }}>✕</button>
            </div>
            <div className="chat-messages">
              {messages.length === 0 ? (
                <div style={{textAlign: 'center', padding: '40px'}}>
                  <div style={{fontSize: '3rem', marginBottom: '16px'}}>💬</div>
                  <p style={{color: '#949ba4'}}>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map((msg, index) => {
                  const showAvatar = index === 0 || messages[index - 1]?.senderId !== msg.senderId;
                  return (
                    <div key={msg.id} className={`chat-message ${msg.senderId === user.id ? 'sent' : 'received'}`} style={{paddingTop: showAvatar ? '8px' : '2px'}}>
                      {showAvatar && msg.senderId !== user.id && (
                        <div className="message-avatar" style={msg.senderAvatar ? {background: `url(${msg.senderAvatar}) center/cover`} : {background: user?.user_metadata?.isAdmin ? '#5865f2' : 'linear-gradient(135deg, #FF2E00, #FF6A00)'}}>
                          {!msg.senderAvatar && (user?.user_metadata?.isAdmin ? selectedUser?.username?.charAt(0).toUpperCase() : '🔥')}
                        </div>
                      )}
                      {showAvatar && msg.senderId === user.id && (
                        <div className="message-avatar" style={user?.avatar ? {background: `url(${user.avatar}) center/cover`} : {background: '#5865f2'}}>
                          {!user?.avatar && user?.username?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="message-bubble" style={{paddingLeft: showAvatar ? '0' : '0'}}>
                        {showAvatar && (
                          <span className="message-sender">
                            {msg.senderId === user.id ? user?.user_metadata?.username : (user?.user_metadata?.isAdmin ? selectedUser?.username : 'Flame Cloud Support')}
                            <span className="message-time">{new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                          </span>
                        )}
                        <div className="message-content">{msg.message}</div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>
            <form className="chat-input-form" onSubmit={sendMessage}>
              <input 
                type="text" 
                value={newMessage} 
                onChange={e => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                autoFocus
              />
              <button type="submit" className="send-btn">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Profile Settings Modal */}
      {showProfileModal && (
        <div className="modal-overlay" onClick={() => setShowProfileModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{maxWidth: '450px'}}>
            <h3>⚙️ Profile Settings</h3>
            
            <div style={{background: 'linear-gradient(135deg, rgba(255, 106, 0, 0.1), rgba(255, 46, 0, 0.05))', padding: '20px', borderRadius: '16px', marginBottom: '24px', textAlign: 'center'}}>
              {/* Avatar Upload */}
              <div style={{position: 'relative', display: 'inline-block', marginBottom: '12px'}}>
                <div 
                  style={{
                    width: '80px', 
                    height: '80px', 
                    borderRadius: '50%', 
                    background: avatarPreview ? `url(${avatarPreview}) center/cover` : 'linear-gradient(135deg, var(--primary), var(--secondary))', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontSize: '2rem', 
                    fontWeight: '700', 
                    color: '#fff',
                    cursor: 'pointer',
                    border: '3px solid var(--primary)'
                  }}
                  onClick={() => document.getElementById('avatar-input').click()}
                >
                  {!avatarPreview && user?.user_metadata?.username?.charAt(0).toUpperCase()}
                </div>
                <div 
                  style={{
                    position: 'absolute',
                    bottom: '0',
                    right: '0',
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #FF2E00, #FF6A00)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    border: '2px solid var(--dark-1)'
                  }}
                  onClick={() => document.getElementById('avatar-input').click()}
                >
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#fff" strokeWidth="2">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                    <circle cx="12" cy="13" r="4"/>
                  </svg>
                </div>
                <input 
                  type="file" 
                  id="avatar-input" 
                  accept="image/*" 
                  onChange={handleAvatarChange} 
                  style={{display: 'none'}} 
                />
              </div>
              <p style={{color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '8px'}}>Click to change avatar</p>
              <p style={{color: 'var(--text-primary)', fontWeight: '700', fontSize: '1.2rem'}}>{user?.username}</p>
              <p style={{color: 'var(--text-muted)', fontSize: '0.9rem'}}>{user?.email}</p>
            </div>

            {profileMessage.text && (
              <div style={{
                padding: '12px 16px',
                borderRadius: '10px',
                marginBottom: '20px',
                background: profileMessage.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                border: `1px solid ${profileMessage.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                color: profileMessage.type === 'success' ? 'var(--success)' : '#ef4444'
              }}>
                {profileMessage.text}
              </div>
            )}

            <form onSubmit={handleProfileUpdate}>
              <div className="form-group">
                <label>👤 Username</label>
                <input 
                  type="text" 
                  value={profileData.username} 
                  onChange={e => setProfileData({...profileData, username: e.target.value})}
                  placeholder="Enter new username"
                />
              </div>

              <div className="form-group">
                <label>📧 Email</label>
                <input 
                  type="email" 
                  value={profileData.email} 
                  onChange={e => setProfileData({...profileData, email: e.target.value})}
                  placeholder="Enter new email"
                />
              </div>

              <div style={{borderTop: '1px solid var(--glass-border)', margin: '24px 0', paddingTop: '24px'}}>
                <p style={{color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '16px'}}>🔒 Change Password</p>
                
                <div className="form-group">
                  <label>Current Password</label>
                  <input 
                    type="password" 
                    value={profileData.currentPassword} 
                    onChange={e => setProfileData({...profileData, currentPassword: e.target.value})}
                    placeholder="Enter current password"
                  />
                </div>

                <div className="form-group">
                  <label>New Password</label>
                  <input 
                    type="password" 
                    value={profileData.newPassword} 
                    onChange={e => setProfileData({...profileData, newPassword: e.target.value})}
                    placeholder="Enter new password"
                  />
                </div>

                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input 
                    type="password" 
                    value={profileData.confirmPassword} 
                    onChange={e => setProfileData({...profileData, confirmPassword: e.target.value})}
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowProfileModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={profileLoading}>
                  {profileLoading ? '⏳ Saving...' : '💾 Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
