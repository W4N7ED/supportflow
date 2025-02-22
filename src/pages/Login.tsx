
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { Microsoft } from "lucide-react";

const Login = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Vérifier d'abord si l'identifiant est un email
      const isEmail = identifier.includes('@');
      
      let authResponse;
      if (isEmail) {
        // Connexion avec email
        authResponse = await supabase.auth.signInWithPassword({
          email: identifier,
          password,
        });
      } else {
        // Connexion avec username - rechercher d'abord l'email correspondant
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('email')
          .eq('username', identifier)
          .single();

        if (profileError) throw new Error("Nom d'utilisateur non trouvé");

        authResponse = await supabase.auth.signInWithPassword({
          email: profileData.email,
          password,
        });
      }

      const { data: { user }, error } = authResponse;

      if (error) throw error;

      if (user) {
        // Vérifier le rôle de l'utilisateur
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;

        if (profile && ['admin', 'technician', 'user'].includes(profile.role)) {
          toast({
            title: "Connexion réussie",
            description: `Bienvenue ${identifier}`,
          });
          navigate('/');
        } else {
          throw new Error("Accès non autorisé");
        }
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMicrosoftLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'azure',
        options: {
          scopes: 'email user.read',
        },
      });

      if (error) throw error;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur de connexion Microsoft",
        description: error.message,
      });
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!identifier.includes('@')) {
        throw new Error("L'inscription nécessite une adresse email valide");
      }

      const { data, error } = await supabase.auth.signUp({
        email: identifier,
        password,
        options: {
          data: {
            role: 'user',
          },
        },
      });

      if (error) throw error;

      toast({
        title: "Inscription réussie",
        description: "Veuillez vérifier votre email pour confirmer votre compte.",
      });

      if (data.user) {
        const username = identifier.split('@')[0];
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: data.user.email,
            username: username,
            role: 'user',
          });

        if (profileError) throw profileError;
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur d'inscription",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="text-center">Minticket</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="identifier">Email ou nom d'utilisateur</Label>
              <Input
                id="identifier"
                type="text"
                placeholder="email@example.com ou username"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col space-y-2">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Connexion..." : "Se connecter"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="w-full"
                onClick={handleSignUp} 
                disabled={isLoading}
              >
                {isLoading ? "Inscription..." : "S'inscrire"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleMicrosoftLogin}
                disabled={isLoading}
              >
                <Microsoft className="mr-2 h-4 w-4" />
                Connexion avec Microsoft
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
