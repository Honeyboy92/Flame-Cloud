import { supabase } from '../supabaseClient';

// Plans API
export const plansAPI = {
  // Get all paid plans
  getPaidPlans: async () => {
    const { data, error } = await supabase
      .from('paid_plans')
      .select('*')
      .order('sort_order');
    
    if (error) throw error;
    return data;
  },

  // Get site settings
  getSetting: async (key) => {
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', key)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update site setting
  updateSetting: async (key, value) => {
    const { data, error } = await supabase
      .from('site_settings')
      .upsert({ key, value })
      .select();
    
    if (error) throw error;
    return data;
  }
};

// Tickets API
export const ticketsAPI = {
  // Create ticket
  createTicket: async (ticketData) => {
    const { data, error } = await supabase
      .from('tickets')
      .insert([ticketData])
      .select();
    
    if (error) throw error;
    return data;
  },

  // Get user tickets
  getUserTickets: async (userId) => {
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
};

// Admin API
export const adminAPI = {
  // Get all users
  getUsers: async () => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Get all tickets
  getAllTickets: async () => {
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Update plan
  updatePlan: async (id, updates) => {
    const { data, error } = await supabase
      .from('paid_plans')
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data;
  },

  // Delete plan
  deletePlan: async (id) => {
    const { data, error } = await supabase
      .from('paid_plans')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return data;
  }
};