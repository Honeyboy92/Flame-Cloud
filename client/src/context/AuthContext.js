import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in (from localStorage)
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Ensure isAdmin is boolean
        parsedUser.isAdmin = Boolean(parsedUser.isAdmin);
        setUser(parsedUser);
      } catch (e) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const contentType = res.headers.get('content-type') || '';

    if (!res.ok) {
      // Try to parse JSON error, otherwise fallback to text
      if (contentType.includes('application/json')) {
        const error = await res.json();
        throw new Error(error.error || 'Login failed');
      } else {
        const text = await res.text();
        throw new Error(text || 'Login failed (non-JSON response)');
      }
    }

    let data;
    if (contentType.includes('application/json')) {
      data = await res.json();
    } else {
      // Unexpected non-JSON successful response
      const text = await res.text();
      throw new Error(text || 'Login succeeded but returned non-JSON');
    }
    // Ensure isAdmin is boolean
    const userData = {
      ...data.user,
      isAdmin: Boolean(data.user.isAdmin)
    };
    // Store both user and token
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', data.token);
    setUser(userData);
    return userData;
  };

  const signup = async (username, email, password) => {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });
    const contentType = res.headers.get('content-type') || '';

    if (!res.ok) {
      if (contentType.includes('application/json')) {
        const error = await res.json();
        throw new Error(error.error || 'Signup failed');
      } else {
        const text = await res.text();
        // Provide friendlier message when proxy/network issues occur
        if (text && text.toLowerCase().includes('proxy')) throw new Error('Server proxy error — backend may be down');
        throw new Error(text || 'Signup failed (non-JSON response)');
      }
    }

    if (contentType.includes('application/json')) {
      return await res.json();
    }

    const text = await res.text();
    throw new Error(text || 'Signup succeeded but returned non-JSON');
  };

  const logout = async () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  const updateUser = (updates) => {
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem('user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};