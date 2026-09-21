import { supabase, isSupabaseConfigured } from './supabase';
import { RecoveryRequest, RecoveryStatus } from '../types';

export async function fetchRecoveryRequestsFromSupabase(): Promise<RecoveryRequest[] | null> {
  if (!isSupabaseConfigured() || !supabase) return null;

  try {
    const { data, error } = await supabase
      .from('recovery_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('FindBack: Failed to fetch recovery requests:', error);
      return null;
    }
    return (data || []) as RecoveryRequest[];
  } catch (err) {
    console.warn('FindBack: Exception fetching recovery requests:', err);
    return null;
  }
}

export async function insertRecoveryRequestToSupabase(req: RecoveryRequest): Promise<boolean> {
  if (!isSupabaseConfigured() || !supabase) return false;

  try {
    const { error } = await supabase
      .from('recovery_requests')
      .insert(req);

    if (error) {
      console.warn('FindBack: Failed to insert recovery request:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('FindBack: Exception inserting recovery request:', err);
    return false;
  }
}

export async function updateRecoveryStatusInSupabase(
  requestId: string,
  status: RecoveryStatus,
  adminRemarks?: string
): Promise<boolean> {
  if (!isSupabaseConfigured() || !supabase) return false;

  try {
    const updatePayload: Record<string, any> = { status };
    if (adminRemarks !== undefined) {
      updatePayload.admin_remarks = adminRemarks;
    }

    const { error } = await supabase
      .from('recovery_requests')
      .update(updatePayload)
      .eq('request_id', requestId);

    if (error) {
      console.warn('FindBack: Failed to update recovery status in Supabase:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('FindBack: Exception updating recovery status in Supabase:', err);
    return false;
  }
}
