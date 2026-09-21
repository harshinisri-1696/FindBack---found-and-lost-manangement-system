import { supabase, isSupabaseConfigured } from './supabase';
import { User, UserRole } from '../types';

export interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
}

export interface RegisterPayload {
  name: string;
  college_id: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  department?: string;
}

export async function registerWithSupabase(payload: RegisterPayload): Promise<AuthResponse> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: payload.email,
        password: payload.password,
        options: {
          data: {
            name: payload.name,
            college_id: payload.college_id,
            role: payload.role,
            phone: payload.phone,
            department: payload.department,
          },
        },
      });

      if (authError) {
        return { success: false, error: authError.message };
      }

      const userId = authData.user?.id || `usr_${Date.now()}`;

      // Insert profile into users table
      const profile: User = {
        user_id: userId,
        name: payload.name,
        college_id: payload.college_id,
        email: payload.email,
        phone: payload.phone,
        role: payload.role,
        status: 'active',
        created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
        department: payload.department,
      };

      const { error: profileError } = await supabase
        .from('users')
        .upsert(profile);

      if (profileError) {
        console.warn('FindBack: Profile upsert warning:', profileError);
      }

      return { success: true, user: profile };
    } catch (err: any) {
      return { success: false, error: err.message || 'Registration failed' };
    }
  }

  // Fallback local registration
  const fallbackUser: User = {
    user_id: `usr_${Date.now()}`,
    name: payload.name,
    college_id: payload.college_id,
    email: payload.email,
    phone: payload.phone,
    role: payload.role,
    status: 'active',
    created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
    department: payload.department,
  };

  return { success: true, user: fallbackUser };
}

export async function loginWithSupabase(identifier: string, password: string): Promise<AuthResponse> {
  if (isSupabaseConfigured() && supabase) {
    try {
      let emailToUse = identifier.trim();

      // If user provided a College ID instead of email, look up the email in the users table
      if (!emailToUse.includes('@')) {
        const { data: matchedUser } = await supabase
          .from('users')
          .select('email')
          .ilike('college_id', identifier.trim())
          .maybeSingle();

        if (matchedUser?.email) {
          emailToUse = matchedUser.email;
        }
      }

      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: emailToUse,
        password,
      });

      if (authError) {
        return { success: false, error: authError.message };
      }

      // Fetch user profile
      if (authData.user) {
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .or(`user_id.eq.${authData.user.id},email.eq.${authData.user.email}`)
          .maybeSingle();

        if (profile) {
          return { success: true, user: profile as User };
        }

        // Generate profile from auth user metadata if database row is initializing
        const meta = authData.user.user_metadata || {};
        const generatedUser: User = {
          user_id: authData.user.id,
          name: meta.name || authData.user.email?.split('@')[0] || 'Campus User',
          college_id: meta.college_id || 'USER104',
          email: authData.user.email || '',
          phone: meta.phone || '9876543210',
          role: (meta.role as UserRole) || 'student',
          status: 'active',
          created_at: authData.user.created_at || new Date().toISOString(),
          department: meta.department || 'Campus Department',
        };

        return { success: true, user: generatedUser };
      }
    } catch (err: any) {
      return { success: false, error: err.message || 'Login failed' };
    }
  }

  return { success: false, error: 'Supabase not configured for cloud authentication' };
}

export async function logoutFromSupabase(): Promise<void> {
  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('Supabase sign out error:', err);
    }
  }
}
