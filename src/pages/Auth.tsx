import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ChefHat, User, Lock } from 'lucide-react';

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp, signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast({
        title: "Errore",
        description: "Inserisci username e password",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    const { error } = isSignUp 
      ? await signUp(username, password)
      : await signIn(username, password);

    if (error) {
      toast({
        title: "Errore",
        description: error.message === 'Invalid login credentials' 
          ? 'Username o password non corretti'
          : isSignUp 
            ? 'Errore durante la registrazione' 
            : 'Errore durante il login',
        variant: "destructive"
      });
    } else {
      toast({
        title: "Successo",
        description: isSignUp ? 'Registrazione completata!' : 'Login effettuato!',
      });
      navigate('/');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-restaurant-cream to-restaurant-gold/20 p-4">
      <Card className="w-full max-w-md shadow-elegant">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <ChefHat className="h-12 w-12 text-restaurant-gold" />
          </div>
          <CardTitle className="text-2xl font-bold text-restaurant-brown">
            Menu Designer
          </CardTitle>
          <CardDescription>
            {isSignUp ? 'Crea un nuovo account' : 'Accedi al tuo account'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Username
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="Inserisci il tuo username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Inserisci la password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              variant="gold"
              disabled={loading}
            >
              {loading ? 'Caricamento...' : (isSignUp ? 'Registrati' : 'Accedi')}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <Button 
              variant="link" 
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-restaurant-brown"
            >
              {isSignUp ? 'Hai già un account? Accedi' : 'Non hai un account? Registrati'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;