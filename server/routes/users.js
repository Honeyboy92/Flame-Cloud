const express = require('express');
const { prepare, saveDB } = require('../database');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

// Get user list (Authenticated users)
router.get('/', async (req, res) => {
    let sql = 'SELECT id, username, email, avatar, is_admin as is_admin, created_at as created_at FROM users ORDER BY created_at DESC';

    // If not admin, only show administrators (Support Staff)
    const isAdmin = req.user.isAdmin === true || req.user.isAdmin === 1;
    if (!isAdmin) {
        sql = 'SELECT id, username, email, avatar, is_admin as is_admin, created_at as created_at FROM users WHERE is_admin = 1 OR is_admin = true ORDER BY created_at DESC';
    }

    const users = await prepare(sql).all();
    res.json(users);
});

// Update user (Own profile or Admin)
router.put('/:id', async (req, res) => {
    const userId = req.params.id;
    const { username, email, avatar } = req.body;

    // Security check: Only original user OR admin can update
    const isSelf = String(req.user.id) === String(userId);
    const isAdmin = req.user.isAdmin === true || req.user.isAdmin === 1;

    if (!isSelf && !isAdmin) {
        return res.status(403).json({ error: `Permission denied: You cannot update this profile.` });
    }

    const updates = [];
    if (username) updates.push({ k: 'username', v: username });
    if (email) updates.push({ k: 'email', v: email });
    if (typeof avatar !== 'undefined') updates.push({ k: 'avatar', v: avatar });

    try {
        if (updates.length === 0) return res.status(400).json({ error: 'No updates provided' });

        // Unique checks
        if (username) {
            const existing = await prepare('SELECT id FROM users WHERE username = ? AND id != ?').get(username, userId);
            if (existing) return res.status(400).json({ error: 'Username already taken' });
        }
        if (email) {
            const existing = await prepare('SELECT id FROM users WHERE email = ? AND id != ?').get(email, userId);
            if (existing) return res.status(400).json({ error: 'Email already in use' });
        }

        for (const u of updates) {
            // Using parameterized query for key name is tricky but here it is simple field names
            await prepare(`UPDATE users SET ${u.k}=$1 WHERE id=$2`).run(u.v, userId);
        }

        const updated = await prepare('SELECT id, username, email, avatar, is_admin as is_admin FROM users WHERE id = ?').get(userId);
        if (saveDB) saveDB();
        res.json({ message: 'User updated successfully', user: updated });
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Delete user (Admin only)
router.delete('/:id', async (req, res) => {
    const isAdmin = req.user.isAdmin === true || req.user.isAdmin === 1;
    if (!isAdmin) {
        return res.status(403).json({ error: 'Admin access required for deletion' });
    }

    const userId = req.params.id;
    const user = await prepare('SELECT is_admin FROM users WHERE id = ?').get(userId);
    if (user?.is_admin || user?.isadmin) {
        return res.status(400).json({ error: 'Cannot delete admin user' });
    }
    await prepare('DELETE FROM chat_messages WHERE sender_id = ? OR receiver_id = ?').run(userId, userId);
    await prepare('DELETE FROM tickets WHERE user_id = ?').run(userId);
    await prepare('DELETE FROM users WHERE id = ?').run(userId);
    if (saveDB) saveDB();
    res.json({ message: 'User deleted successfully' });
});

module.exports = router;
