import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  username: string | null;
  signUp: (username: string, password: string) => Promise<{ error: any }>;
  signIn: (username: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch username from profiles table
          setTimeout(async () => {
            const { data: profile } = await supabase
              .from('profiles')
              .select('username')
              .eq('user_id', session.user.id)
              .single();
            
            setUsername(profile?.username || null);
          }, 0);
        } else {
          setUsername(null);
        }
        
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (username: string, password: string) => {
    try {
      console.log('Tentativo di registrazione per username:', username);
      
      // Use generated email for Supabase auth
      const email = `${username}@menudesigner.local`;
      console.log('Email generata:', email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            username: username
          }
        }
      });
      
      console.log('Risposta Supabase signUp:', { data, error });
      
      if (error) {
        console.error('Errore durante la registrazione:', error);
      }
      
      return { error };
    } catch (err) {
      console.error('Errore imprevisto durante la registrazione:', err);
      return { error: err };
    }
  };

  const signIn = async (username: string, password: string) => {
    try {
      console.log('Tentativo di login per username:', username);
      
      // Use generated email for Supabase auth
      const email = `${username}@menudesigner.local`;
      console.log('Email generata per login:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      console.log('Risposta Supabase signIn:', { data, error });
      
      if (error) {
        console.error('Errore durante il login:', error);
      }
      
      return { error };
    } catch (err) {
      console.error('Errore imprevisto durante il login:', err);
      return { error: err };
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const value = {
    user,
    session,
    username,
    signUp,
    signIn,
    signOut,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}