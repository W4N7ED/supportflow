
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserManagement from "@/components/settings/UserManagement";
import RoleManagement from "@/components/settings/RoleManagement";
import EmailSettings from "@/components/settings/EmailSettings";
import { useToast } from "@/components/ui/use-toast";
import { Profile } from "@/types/supabase";
import { supabase } from "@/lib/supabase";

const Settings = () => {
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          toast({
            title: "Erreur",
            description: "Impossible de charger votre profil",
            variant: "destructive",
          });
          return;
        }

        setCurrentUser(profile);
      }
    };

    fetchCurrentUser();
  }, []);

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">
          Vous n'avez pas accès à cette page
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Paramètres</h1>
        <p className="text-muted-foreground">
          Gérez les paramètres de l'application
        </p>
      </div>

      <Tabs defaultValue="users">
        <TabsList>
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          <TabsTrigger value="roles">Rôles</TabsTrigger>
          <TabsTrigger value="email">Configuration Email</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="space-y-4">
          <Card className="p-6">
            <UserManagement />
          </Card>
        </TabsContent>
        
        <TabsContent value="roles" className="space-y-4">
          <Card className="p-6">
            <RoleManagement />
          </Card>
        </TabsContent>
        
        <TabsContent value="email" className="space-y-4">
          <Card className="p-6">
            <EmailSettings />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
