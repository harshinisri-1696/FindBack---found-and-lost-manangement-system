import { supabase, isSupabaseConfigured } from './supabase';
import { NotificationItem } from '../types';

export async function fetchNotificationsFromSupabase(userId?: string): Promise<NotificationItem[] | null> {
  if (!isSupabaseConfigured() || !supabase) return null;

  try {
    let query = supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false });

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;
    if (error) {
      console.warn('FindBack: Failed to fetch notifications from Supabase:', error);
      return null;
    }
    return (data || []) as NotificationItem[];
  } catch (err) {
    console.warn('FindBack: Exception fetching notifications:', err);
    return null;
  }
}

export async function markNotificationAsReadInSupabase(notificationId: string): Promise<boolean> {
  if (!isSupabaseConfigured() || !supabase) return false;

  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('notification_id', notificationId);

    return !error;
  } catch {
    return false;
  }
}

export async function insertNotificationToSupabase(notification: NotificationItem): Promise<boolean> {
  if (!isSupabaseConfigured() || !supabase) return false;

  try {
    const { error } = await supabase
      .from('notifications')
      .insert(notification);

    return !error;
  } catch {
    return false;
  }
}
