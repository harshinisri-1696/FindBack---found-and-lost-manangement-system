// Netlify Function: recovery-action.js
// Handles recovery approvals, status updates, and notification generation

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Content-Type': 'application/json'
};

exports.handler = async (event, context) => {
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
    const { requestId, newStatus, adminRemarks, itemId, requesterId } = body;

    if (!requestId || !newStatus) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing requestId or newStatus' })
      };
    }

    if (!supabase) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          mode: 'local_fallback',
          message: `Recovery request [${requestId}] marked as [${newStatus}]`,
          data: body
        })
      };
    }

    // 1. Update recovery request
    const { data: recoveryData, error: recoveryError } = await supabase
      .from('recovery_requests')
      .update({
        status: newStatus,
        admin_remarks: adminRemarks || null
      })
      .eq('request_id', requestId)
      .select()
      .single();

    if (recoveryError) throw recoveryError;

    // 2. If status is Approved or Recovered, update the associated item
    const targetItemId = itemId || recoveryData?.item_id;
    if (targetItemId && (newStatus === 'Approved' || newStatus === 'Recovered')) {
      const itemStatus = newStatus === 'Recovered' ? 'Recovered' : 'Recovery Requested';
      await supabase
        .from('items')
        .update({ status: itemStatus, updated_at: new Date().toISOString() })
        .eq('item_id', targetItemId);
    }

    // 3. Notify requester
    const targetUserId = requesterId || recoveryData?.requester_id;
    if (targetUserId) {
      await supabase.from('notifications').insert({
        notification_id: `notif_${Date.now()}`,
        user_id: targetUserId,
        title: `Recovery Claim Update: ${newStatus}`,
        message: adminRemarks 
          ? `Your claim status is now "${newStatus}". Remarks: ${adminRemarks}`
          : `Your recovery request status has been updated to "${newStatus}".`,
        type: 'recovery',
        item_id: targetItemId,
        is_read: false
      });
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: `Recovery request updated to ${newStatus}`,
        data: recoveryData
      })
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message || 'Server error' })
    };
  }
};
