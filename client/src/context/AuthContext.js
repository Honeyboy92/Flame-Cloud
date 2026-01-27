import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for active session on load
  useEffect(() => {
    // Safety timeout: ensure loading screen disappears after 3 seconds max
    const timeoutId = setTimeout(() => {
      setLoading(false);
      console.warn('Auth initialization timed out, forcing loading to false.');
    }, 3000);

    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          await fetchUserProfile(session.user.id);
        }
      } catch (error) {
        console.error('Session initialization error:', error);
      } finally {
        setLoading(false);
        clearTimeout(timeoutId);
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        await fetchUserProfile(session.user.id);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (uid) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', uid)
        .single();

      if (!error && data) {
        // Map DB flags to what the app expects
        setUser({
          ...data,
          isAdmin: !!data.is_admin
        });
      }
    } catch (e) {
      console.error('Error fetching profile:', e);
    }
  };

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    await fetchUserProfile(data.user.id);
    return data.user;
  };

  const signup = async (username, email, password) => {
    // 1. Sign up in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
    if (authError) throw authError;

    if (authData.user) {
      // 2. Create the profile in our users table
      const { error: profileError } = await supabase.from('users').insert([{
        id: authData.user.id,
        username,
        email,
        is_admin: false
      }]);
      if (profileError) throw profileError;
    }

    return authData.user;
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