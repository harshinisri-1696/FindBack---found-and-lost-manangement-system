// Netlify Function: admin-action.js
// Handles protected administrative tasks using Supabase service-role or elevated permissions

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Content-Type': 'application/json'
};

export const handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { action, itemId, userId, newStatus, adminRemarks } = body;

    if (!supabase) {
      // Graceful fallback response when credentials are not configured in local container
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          mode: 'local_fallback',
          message: `Admin action [${action}] acknowledged (configure SUPABASE_SERVICE_ROLE_KEY for cloud persistence)`,
          data: body
        })
      };
    }

    switch (action) {
      case 'update_item_status': {
        if (!itemId || !newStatus) {
          return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing itemId or newStatus' }) };
        }
        const { data, error } = await supabase
          .from('items')
          .update({ status: newStatus, updated_at: new Date().toISOString() })
          .eq('item_id', itemId)
          .select();

        if (error) throw error;
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true, message: 'Item status updated', data })
        };
      }

      case 'toggle_user_status': {
        if (!userId || !newStatus) {
          return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing userId or newStatus' }) };
        }
        const { data, error } = await supabase
          .from('users')
          .update({ status: newStatus })
          .eq('user_id', userId)
          .select();

        if (error) throw error;
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true, message: 'User status updated', data })
        };
      }

      case 'delete_item': {
        if (!itemId) {
          return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing itemId' }) };
        }
        const { error } = await supabase
          .from('items')
          .delete()
          .eq('item_id', itemId);

        if (error) throw error;
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true, message: 'Item deleted' })
        };
      }

      default:
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: `Unknown action: ${action}` })
        };
    }
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message || 'Server error' })
    };
  }
};

export default handler;
