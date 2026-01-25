// Unified Supabase Shim for Local API Redirection
const TOKEN_KEY = 'flame_token';

const getPath = (table) => {
  if (table === 'paid_plans') return '/api/plans';
  if (table === 'location_settings') return '/api/plans/locations';
  if (table === 'yt_partners') return '/api/plans/yt-partners';
  if (table === 'users') return '/api/users';
  if (table === 'tickets') return '/api/tickets';
  return `/api/${table}`;
};

export const supabase = {
  from: (table) => {
    let queryParams = new URLSearchParams();

    const builder = {
      select: (sel) => {
        return builder;
      },
      eq: (key, val) => {
        queryParams.append(key, `eq.${val}`);
        return builder;
      },
      or: (filterStr) => {
        queryParams.append('or', filterStr);
        return builder;
      },
      order: (col, { ascending } = {}) => {
        queryParams.append('order', col);
        queryParams.append('dir', ascending ? 'asc' : 'desc');
        return builder;
      },
      limit: (val) => {
        queryParams.append('limit', val);
        return builder;
      },
      single: async () => {
        try {
          const token = localStorage.getItem(TOKEN_KEY);
          const res = await fetch(`${getPath(table)}?${queryParams.toString()}&single=true`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const text = await res.text();
          let data = {};
          try { data = JSON.parse(text); } catch (e) { console.error("Non-JSON single response", text); }
          return { data: Array.isArray(data) ? data[0] : data, error: res.ok ? null : { message: data.error || 'Request failed' } };
        } catch (err) {
          return { data: null, error: { message: err.message } };
        }
      },
      // Terminal action for select() logic
      then: async (onSuccess) => {
        try {
          const token = localStorage.getItem(TOKEN_KEY);
          let url = `${getPath(table)}?${queryParams.toString()}`;

          const res = await fetch(url, {
            headers: { 'Authorization': `Bearer ${token}` }
          });

          const text = await res.text();
          let data = [];
          try {
            data = JSON.parse(text);
          } catch (e) {
            console.error("Non-JSON response for " + url, text);
            data = [];
          }

          const result = { data, error: res.ok ? null : { message: data.error || 'Request failed' } };
          return onSuccess ? onSuccess(result) : result;
        } catch (err) {
          console.error("Shim error:", err);
          const result = { data: [], error: { message: err.message } };
          return onSuccess ? onSuccess(result) : result;
        }
      },
      // Support await builder directly
      async promise() {
        return this.then();
      }
    };

    // Add legacy direct methods for compatibility if needed
    builder.insert = (rows) => {
      const executor = async () => {
        const token = localStorage.getItem(TOKEN_KEY);
        const res = await fetch(getPath(table), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(rows[0])
        });
        const data = await res.json();
        return { data: [data], error: res.ok ? null : { message: data.error } };
      };

      return {
        select: executor,
        then: (onFullfilled) => executor().then(onFullfilled)
      };
    };

    builder.update = (updates) => {
      const executor = async (id) => {
        const token = localStorage.getItem(TOKEN_KEY);
        let url = `${getPath(table)}/${id}`;

        const res = await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(updates)
        });

        const text = await res.text();
        let data = {};
        try {
          data = JSON.parse(text);
        } catch (e) {
          console.error("Failed to parse update response", text);
          return { data: null, error: { message: `Server returned non-JSON: ${text.slice(0, 100)}` } };
        }

        return { data, error: res.ok ? null : { message: data.error || 'Update failed' } };
      };

      return {
        eq: (key, val) => {
          return {
            then: (onFullfilled) => executor(val).then(onFullfilled)
          };
        },
        then: (onFullfilled) => executor().then(onFullfilled) // Default executor if eq not used (might not work for all cases but better than nothing)
      };
    };

    builder.delete = () => {
      const executor = async (id) => {
        const token = localStorage.getItem(TOKEN_KEY);
        let url = `${getPath(table)}/${id}`;

        const res = await fetch(url, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await res.json().catch(() => ({}));
        return { data, error: res.ok ? null : { message: data.error || 'Delete failed' } };
      };

      return {
        eq: (key, val) => {
          return {
            then: (onFullfilled) => executor(val).then(onFullfilled)
          };
        }
      };
    };

    // Make it thenable so `await query` works
    const finalBuilder = {
      ...builder,
      then: (onFullfilled) => builder.then(onFullfilled)
    };

    return finalBuilder;
  }
};
