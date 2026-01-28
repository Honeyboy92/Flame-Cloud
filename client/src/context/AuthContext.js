import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { supabase } from '../supabaseClient';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Configure axios base URL
// If in development and no API URL provided, default to localhost:5000
const API_BASE = process.env.REACT_APP_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000' : '');

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for active session on load
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Set default authorization header
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const response = await axios.get(`${API_BASE}/api/auth/me`);
          if (response.data) {
            setUser({
              ...response.data,
              isAdmin: !!response.data.isAdmin
            });
          }
        } catch (error) {
          console.error('Session initialization error:', error);
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE}/api/auth/login`, { email, password });
      const { token, user: userData } = response.data;

      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      const userWithFlag = {
        ...userData,
        isAdmin: !!userData.isAdmin
      };
      setUser(userWithFlag);
      return userWithFlag;
    } catch (error) {
      throw error.response?.data || error;
    }
  };

  const signup = async (username, email, password) => {
    try {
      const response = await axios.post(`${API_BASE}/api/auth/signup`, { username, email, password });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  };

  const logout = async () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const updateUser = (updates) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading, updateUser, supabase }}>
      {children}
    </AuthContext.Provider>
  );
};

export { supabase };
