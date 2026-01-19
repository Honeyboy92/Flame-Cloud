import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const Chat = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [adminId, setAdminId] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (user?.user_metadata?.isAdmin) {
      loadUsers();
      const interval = setInterval(loadUsers, 5000);
      return () => clearInterval(interval);
    } else {
      // Set admin ID for customer chat
      setAdminId('f50b3415-730a-49e8-bb7f-05ac2fa97ed1'); // Admin user ID from Supabase
      setSelectedUser({ id: 'f50b3415-730a-49e8-bb7f-05ac2fa97ed1', username: 'Flame Cloud Support' });
    }
  }, [user, navigate]);

  useEffect(() => {
    if (selectedUser || adminId) {
      loadMessages();
      const interval = setInterval(loadMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [selectedUser, adminId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadUsers = async () => {
    if (user?.user_metadata?.isAdmin) {
      try {
        // Simplified user list for admin
        setUsers([
          { id: 'cbe5d44e-7394-4b6b-82a3-bbf4eee15df8', username: 'Test Customer', email: 'customer@test.com' }
        ]);
      } catch (err) {
        console.error('Error loading users:', err);
      }
    }
  };

  const loadMessages = async () => {
    const otherId = user?.user_metadata?.isAdmin ? selectedUser?.id : adminId;
    if (otherId && user?.id) {
      try {
        const { data, error } = await supabase
          .from('chat_messages')
          .select('*')
          .or(`and(sender_id.eq.${user.id},receiver_id.eq.${otherId}),and(sender_id.eq.${otherId},receiver_id.eq.${user.id})`)
          .order('created_at', { ascending: true });
        
        if (!error && data) {
          setMessages(data.map(msg => ({
            ...msg,
            senderId: msg.sender_id,
            createdAt: msg.created_at
          })));
        }
      } catch (err) {
        console.error('Error loading messages:', err);
      }
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    const receiverId = user?.user_metadata?.isAdmin ? selectedUser?.id : adminId;
    if (!receiverId || !user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert([{
          sender_id: user.id,
          receiver_id: receiverId,
          message: newMessage.trim(),
          is_read: false
        }])
        .select();
      
      if (!error) {
        setNewMessage('');
        loadMessages();
      } else {
        console.error('Error sending message:', error);
        alert('Failed to send message');
      }
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Failed to send message');
    }
  };

  if (!user) {
    return (
      <div style={{textAlign: 'center', padding: '100px 20px'}}>
        <h2 style={{color: 'var(--text-primary)'}}>Please login to access chat</h2>
      </div>
    );
  }

  return (
    <div className="chat-page">
      {/* Users Sidebar */}
      <div className="chat-sidebar">
        <div className="chat-sidebar-header">
          <h3>{user?.isAdmin ? '👥 Users' : '💬 Support'}</h3>
        </div>
        <div className="chat-users-list">
          {user?.isAdmin ? (
            users.length === 0 ? (
              <p style={{textAlign: 'center', color: 'rgba(255,255,255,0.5)', padding: '40px 20px'}}>No users yet</p>
            ) : (
              users.map(u => (
                <div 
                  key={u.id} 
                  className={`chat-user-item ${selectedUser?.id === u.id ? 'active' : ''}`}
                  onClick={() => setSelectedUser(u)}
                >
                  <div className="chat-user-avatar" style={u.avatar ? {background: `url(${u.avatar}) center/cover`} : {}}>
                    {!u.avatar && u.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="chat-user-info">
                    <span className="chat-user-name">{u.username}</span>
                    <span className="chat-user-email">{u.email}</span>
                  </div>
                </div>
              ))
            )
          ) : (
            <div className={`chat-user-item active`}>
              <div className="chat-user-avatar" style={{background: 'transparent', overflow: 'visible'}}>
                <img src="/logo.png" alt="" style={{width: '44px', height: '44px', objectFit: 'contain'}} />
              </div>
              <div className="chat-user-info">
                <span className="chat-user-name">Flame Cloud Support</span>
                <span className="chat-user-status online">● Online</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="chat-main">
        {(user?.isAdmin && !selectedUser) ? (
          <div className="chat-no-selection">
            <div style={{fontSize: '4rem', marginBottom: '20px'}}>💬</div>
            <h3>Select a user to start chatting</h3>
            <p>Choose a user from the left sidebar</p>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="chat-main-header">
              <div className="chat-header-user">
                <div className="chat-header-avatar" style={
                  user?.isAdmin 
                    ? (selectedUser?.avatar ? {background: `url(${selectedUser.avatar}) center/cover`} : {})
                    : {background: 'transparent', overflow: 'visible'}
                }>
                  {user?.isAdmin ? (!selectedUser?.avatar && selectedUser?.username?.charAt(0).toUpperCase()) : <img src="/logo.png" alt="" style={{width: '44px', height: '44px', objectFit: 'contain'}} />}
                </div>
                <div>
                  <h4>{user?.isAdmin ? selectedUser?.username : 'Flame Cloud Support'}</h4>
                  <span className="chat-header-status">{user?.isAdmin ? 'User' : '● Online'}</span>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="chat-messages-area">
              {messages.length === 0 ? (
                <div style={{textAlign: 'center', padding: '60px 20px'}}>
                  <div style={{fontSize: '3rem', marginBottom: '16px'}}>💬</div>
                  <p style={{color: 'rgba(255,255,255,0.5)'}}>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map((msg, index) => {
                  const showAvatar = index === 0 || messages[index - 1]?.senderId !== msg.senderId;
                  const isMine = msg.senderId === user.id;
                  const isAdminMsg = user?.isAdmin ? isMine : !isMine;
                  return (
                    <div key={msg.id} className="chat-msg">
                      {showAvatar && (
                        <div className="chat-msg-avatar" style={
                          isAdminMsg && !user?.isAdmin
                            ? {background: 'transparent', overflow: 'visible'}
                            : (isMine 
                                ? (user?.avatar ? {background: `url(${user.avatar}) center/cover`} : {background: '#5865f2'})
                                : (msg.senderAvatar ? {background: `url(${msg.senderAvatar}) center/cover`} : {background: '#5865f2'}))
                        }>
                          {isAdminMsg && !user?.isAdmin 
                            ? <img src="/logo.png" alt="" style={{width: '40px', height: '40px', objectFit: 'contain'}} />
                            : (isMine ? (!user?.avatar && user?.username?.charAt(0).toUpperCase()) : (!msg.senderAvatar && selectedUser?.username?.charAt(0).toUpperCase()))}
                        </div>
                      )}
                      <div className="chat-msg-content" style={{marginLeft: showAvatar ? '0' : '52px'}}>
                        {showAvatar && (
                          <div className="chat-msg-header">
                            <span className="chat-msg-sender">{isMine ? user?.username : (user?.isAdmin ? selectedUser?.username : 'Flame Cloud Support')}</span>
                            <span className="chat-msg-time">{new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                          </div>
                        )}
                        <div className="chat-msg-text">{msg.message}</div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form className="chat-input-area" onSubmit={sendMessage}>
              <input 
                type="text" 
                value={newMessage} 
                onChange={e => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                autoFocus
              />
              <button type="submit">
                <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                </svg>
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Chat;
