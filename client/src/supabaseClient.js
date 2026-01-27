import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || '';

// Lightweight Supabase shim to redirect requests to local API
const createShim = () => {
  const query = (table, method = 'GET', data = null) => {
    let url = `${API_BASE}/api/${table}`;
    const params = {};

    const builder = {
      select: (cols) => {
        // In our local API, we usually just get everything
        return builder;
      },
      eq: (col, val) => {
        params[col] = val;
        return builder;
      },
      order: (col, { ascending = true } = {}) => {
        params.sort = col;
        params.order = ascending ? 'asc' : 'desc';
        return builder;
      },
      single: () => {
        params.single = true;
        return builder;
      },
      insert: (items) => {
        return query(table, 'POST', Array.isArray(items) ? items[0] : items);
      },
      // Promise-like behavior
      then: async (onSuccess, onError) => {
        try {
          const config = { params };
          let res;
          if (method === 'POST') {
            res = await axios.post(url, data);
          } else if (method === 'PUT') {
            res = await axios.put(url, data);
          } else if (method === 'DELETE') {
            res = await axios.delete(url, { params });
          } else {
            res = await axios.get(url, { params });
          }

          // If .single() was called and we got an array, return the first item
          let resultData = res.data;
          if (params.single && Array.isArray(resultData)) {
            resultData = resultData[0] || null;
          }

          // Supabase returns { data, error }
          const result = { data: resultData, error: null };
          if (onSuccess) return onSuccess(result);
          return result;
        } catch (err) {
          const result = { data: null, error: err.response?.data || err };
          if (onError) return onError(result);
          if (onSuccess) return onSuccess(result); // Supabase pattern often handles error in onSuccess check
          return result;
        }
      }
    };

    return builder;
  };

  return {
    from: (table) => query(table),
    auth: {
      // Auth is handled in AuthContext, but we can add stubs if needed
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
      signInWithPassword: () => { throw new Error('Use AuthContext.login'); },
      signUp: () => { throw new Error('Use AuthContext.signup'); },
      signOut: async () => ({ error: null })
    }
  };
};

export const supabase = createShim();

console.log('--- Flame Cloud: Using Local API Shim (Supabase Mock) ---');
