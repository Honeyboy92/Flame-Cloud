import React, { createContext, useState, useContext, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://pvagrchxfxzwmnhbanwe.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'sb_publishable_dWDSutd10gS2e0JD2xyiCw_G4liIIH8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check current session
    // Check current session with timeout
    const checkSession = async () => {
      const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000));

      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // Get user profile from users table
          const fetchProfile = supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          // Race between profile fetch and timeout
          const { data: profile } = await Promise.race([fetchProfile, timeout]);

          setUser({
            id: session.user.id,
            email: session.user.email,
            username: profile?.username || session.user.email.split('@')[0],
            isAdmin: profile?.is_admin || false,
            avatar: profile?.avatar || null
          });
        }
      } catch (err) {
        console.error('Session check error:', err);
        // Even if error/timeout, we should stop loading to show the app (maybe login screen)
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        // Get user profile
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        setUser({
          id: session.user.id,
          email: session.user.email,
          username: profile?.username || session.user.email.split('@')[0],
          isAdmin: profile?.is_admin || false,
          avatar: profile?.avatar || null
        });
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      throw new Error(error.message);
    }

    // Get user profile from users table
    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    const userData = {
      id: data.user.id,
      email: data.user.email,
      username: profile?.username || data.user.email.split('@')[0],
      isAdmin: profile?.is_admin || false,
      avatar: profile?.avatar || null
    };

    setUser(userData);
    return userData;
  };

  const signup = async (username, email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username
        }
      }
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  };

  const logout = async () => {
    await supabase.auth.signOut();
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