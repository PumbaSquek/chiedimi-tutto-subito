import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  getCurrentUser, 
  setCurrentUser, 
  createUser, 
  authenticateUser, 
  findUserByUsername 
} from '@/lib/localStorage';

interface AuthContextType {
  user: User | null;
  username: string | null;
  signUp: (username: string, password: string) => Promise<{ error: any }>;
  signIn: (username: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Carica utente dalla sessione salvata
    const savedUser = getCurrentUser();
    setUser(savedUser);
    setLoading(false);
  }, []);

  const signUp = async (username: string, password: string) => {
    try {
      console.log('Tentativo di registrazione per username:', username);
      
      // Controlla se l'username esiste già
      const existingUser = findUserByUsername(username);
      if (existingUser) {
        return { error: { message: 'Username già esistente' } };
      }
      
      // Validazioni base
      if (username.length < 3) {
        return { error: { message: 'Username deve essere almeno 3 caratteri' } };
      }
      
      if (password.length < 6) {
        return { error: { message: 'Password deve essere almeno 6 caratteri' } };
      }
      
      // Crea nuovo utente
      const newUser = createUser(username, password);
      setUser(newUser);
      setCurrentUser(newUser);
      
      console.log('Utente registrato con successo:', newUser);
      return { error: null };
      
    } catch (err) {
      console.error('Errore durante la registrazione:', err);
      return { error: { message: 'Errore durante la registrazione' } };
    }
  };

  const signIn = async (username: string, password: string) => {
    try {
      console.log('Tentativo di login per username:', username);
      
      const user = authenticateUser(username, password);
      if (!user) {
        return { error: { message: 'Username o password non corretti' } };
      }
      
      setUser(user);
      setCurrentUser(user);
      
      console.log('Login effettuato con successo per:', user);
      return { error: null };
      
    } catch (err) {
      console.error('Errore durante il login:', err);
      return { error: { message: 'Errore durante il login' } };
    }
  };

  const signOut = async () => {
    try {
      setUser(null);
      setCurrentUser(null);
      console.log('Logout effettuato');
      return { error: null };
    } catch (err) {
      console.error('Errore durante il logout:', err);
      return { error: { message: 'Errore durante il logout' } };
    }
  };

  const value = {
    user,
    username: user?.username || null,
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