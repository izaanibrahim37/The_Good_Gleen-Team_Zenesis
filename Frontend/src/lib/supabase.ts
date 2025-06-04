import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials. Please check your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// User roles
export type UserRole = 'farmer' | 'retailer' | 'ngo';

// Authentication functions
export async function signUp(
  email: string, 
  password: string, 
  role: UserRole,
  firstName?: string,
  lastName?: string
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role,
        first_name: firstName,
        last_name: lastName
      }
    }
  });

  if (error) throw error;
  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser();
  return data?.user;
}

export async function getUserRole(): Promise<UserRole | undefined> {
  const user = await getCurrentUser();
  return user?.user_metadata?.role as UserRole | undefined;
}

export async function checkUserAccess(requiredRole: UserRole): Promise<boolean> {
  const userRole = await getUserRole();
  return userRole === requiredRole;
}

// Rate limiting for authentication attempts
const attempts = new Map<string, { count: number; lastAttempt: number }>();

export function checkRateLimit(email: string): boolean {
  const now = Date.now();
  const userAttempts = attempts.get(email);
  
  if (!userAttempts) {
    attempts.set(email, { count: 1, lastAttempt: now });
    return true;
  }
  
  // Reset count if last attempt was more than 15 minutes ago
  if (now - userAttempts.lastAttempt > 15 * 60 * 1000) {
    attempts.set(email, { count: 1, lastAttempt: now });
    return true;
  }
  
  // Allow maximum 5 attempts in 15 minutes
  if (userAttempts.count >= 5) {
    return false;
  }
  
  attempts.set(email, { 
    count: userAttempts.count + 1, 
    lastAttempt: now 
  });
  
  return true;
}