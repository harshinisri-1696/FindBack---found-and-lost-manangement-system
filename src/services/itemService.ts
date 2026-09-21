import { supabase, isSupabaseConfigured } from './supabase';
import { Item, ItemStatus } from '../types';

export async function fetchItemsFromSupabase(): Promise<Item[] | null> {
  if (!isSupabaseConfigured() || !supabase) return null;

  try {
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('FindBack: Failed to fetch items from Supabase:', error);
      return null;
    }

    return (data || []) as Item[];
  } catch (err) {
    console.warn('FindBack: Exception fetching items from Supabase:', err);
    return null;
  }
}

export async function insertItemToSupabase(item: Item): Promise<boolean> {
  if (!isSupabaseConfigured() || !supabase) return false;

  try {
    const { error } = await supabase
      .from('items')
      .insert({
        item_id: item.item_id,
        report_code: item.report_code,
        user_id: item.user_id,
        reporter_name: item.reporter_name,
        reporter_role: item.reporter_role,
        item_name: item.item_name,
        category: item.category,
        description: item.description,
        report_type: item.report_type,
        location: item.location,
        report_date: item.report_date,
        color: item.color,
        brand: item.brand,
        identifying_features: item.identifying_features,
        image: item.image,
        current_custody: item.current_custody,
        additional_info: item.additional_info,
        status: item.status,
        created_at: item.created_at,
      });

    if (error) {
      console.warn('FindBack: Failed to insert item to Supabase:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('FindBack: Exception inserting item to Supabase:', err);
    return false;
  }
}

export async function updateItemStatusInSupabase(itemId: string, status: ItemStatus): Promise<boolean> {
  if (!isSupabaseConfigured() || !supabase) return false;

  try {
    const { error } = await supabase
      .from('items')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('item_id', itemId);

    if (error) {
      console.warn('FindBack: Failed to update item in Supabase:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('FindBack: Exception updating item status in Supabase:', err);
    return false;
  }
}

export async function deleteItemFromSupabase(itemId: string): Promise<boolean> {
  if (!isSupabaseConfigured() || !supabase) return false;

  try {
    const { error } = await supabase
      .from('items')
      .delete()
      .eq('item_id', itemId);

    if (error) {
      console.warn('FindBack: Failed to delete item in Supabase:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('FindBack: Exception deleting item in Supabase:', err);
    return false;
  }
}
