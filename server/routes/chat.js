const express = require('express');
const { supabase } = require('../database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Get chat messages between user and admin
router.get('/messages/:otherUserId', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const otherUserId = parseInt(req.params.otherUserId);
  
  const { data: messages } = await supabase
    .from('chat_messages')
    .select('*, users!chat_messages_sender_id_fkey(avatar)')
    .or(`and(sender_id.eq.${userId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${userId})`)
    .order('created_at');
  
  // Mark messages as read
  await supabase
    .from('chat_messages')
    .update({ is_read: true })
    .eq('sender_id', otherUserId)
    .eq('receiver_id', userId);
  
  const mappedMessages = (messages || []).map(m => ({
    id: m.id,
    senderId: m.sender_id,
    receiverId: m.receiver_id,
    message: m.message,
    isRead: m.is_read,
    createdAt: m.created_at,
    senderAvatar: m.users?.avatar
  }));
  
  res.json(mappedMessages);
});

// Send message
router.post('/send', authMiddleware, async (req, res) => {
  const { receiverId, message } = req.body;
  const senderId = req.user.id;
  
  if (!message || !receiverId) {
    return res.status(400).json({ error: 'Message and receiver required' });
  }
  
  const { data, error } = await supabase
    .from('chat_messages')
    .insert({ sender_id: senderId, receiver_id: receiverId, message })
    .select();
  
  if (error) {
    return res.status(500).json({ error: 'Failed to send message' });
  }
  
  res.json({ id: data[0].id, message: 'Message sent' });
});

// Get admin user (for regular users to chat with)
router.get('/admin', authMiddleware, async (req, res) => {
  const { data } = await supabase
    .from('users')
    .select('id, username')
    .eq('is_admin', true)
    .limit(1);
  
  res.json(data?.[0] || null);
});

// Get all users with unread count (for admin)
router.get('/users', authMiddleware, async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: 'Admin only' });
  }
  
  const { data: users } = await supabase
    .from('users')
    .select('id, username, email, avatar')
    .eq('is_admin', false)
    .order('username');
  
  // Get unread counts for each user
  const usersWithUnread = await Promise.all((users || []).map(async (u) => {
    const { count } = await supabase
      .from('chat_messages')
      .select('*', { count: 'exact', head: true })
      .eq('sender_id', u.id)
      .eq('receiver_id', req.user.id)
      .eq('is_read', false);
    
    return { ...u, unreadCount: count || 0 };
  }));
  
  res.json(usersWithUnread);
});

// Get unread count for user
router.get('/unread', authMiddleware, async (req, res) => {
  const { count } = await supabase
    .from('chat_messages')
    .select('*', { count: 'exact', head: true })
    .eq('receiver_id', req.user.id)
    .eq('is_read', false);
  
  res.json({ unread: count || 0 });
});

module.exports = router;
