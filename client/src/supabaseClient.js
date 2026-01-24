// Lightweight shim to provide the small subset of Supabase client API
// used by the app, backed by the server REST endpoints.

export const supabase = {
  from: (table) => {
    return {
      select: (sel) => {
        return {
          order: async (col) => {
            try {
              if (table === 'paid_plans') {
                const res = await fetch('/api/plans');
                const data = await res.json();
                return { data, error: null };
              }

              // default fallback
              return { data: [], error: null };
            } catch (err) {
              return { data: null, error: err };
            }
          },
          eq: async (key, value) => {
            try {
              if (table === 'site_settings' && key === 'key') {
                const res = await fetch(`/api/plans/settings/${value}`);
                const data = await res.json();
                // server returns setting or { key, value }
                return { data: data ? [data] : [], error: null };
              }

              return { data: [], error: null };
            } catch (err) {
              return { data: null, error: err };
            }
          }
        };
      },
      insert: (rows) => {
        // Return an object with a `select()` method so callers can chain
        // `.insert([...]).select()` like the real Supabase client.
        return {
          select: async (sel) => {
            try {
              if (table === 'tickets') {
                const res = await fetch('/api/tickets', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(rows[0])
                });
                const data = await res.json();
                return { data: [data], error: null };
              }

              // generic fallback: echo back inserted rows
              return { data: rows, error: null };
            } catch (err) {
              return { data: null, error: err };
            }
          }
        };
      }
    };
  }
};
