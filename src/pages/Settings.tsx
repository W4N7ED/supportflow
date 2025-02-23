
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserManagement from "@/components/settings/UserManagement";
import GeneralSettings from "@/components/settings/GeneralSettings";
import TicketingSettings from "@/components/settings/TicketingSettings";
import SecuritySettings from "@/components/settings/SecuritySettings";
import IntegrationSettings from "@/components/settings/IntegrationSettings";
import EmailSettings from "@/components/settings/EmailSettings";
import OrganizationSettings from "@/components/settings/OrganizationSettings";
import { useToast } from "@/components/ui/use-toast";
import { Profile } from "@/types/supabase";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

const Settings = () => {
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (error) {
            throw error;
          }

          console.log("Profile loaded:", profile);
          setCurrentUser(profile);
        }
      } catch (error: any) {
        toast({
          title: "Erreur",
          description: "Impossible de charger votre profil",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">
          Vous n'avez pas accès à cette page. Seuls les administrateurs peuvent y accéder.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="container mx-auto py-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Paramètres</h1>
          <p className="text-muted-foreground">
            Gérez les paramètres de l'application
          </p>
        </div>

        <Tabs defaultValue="general">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="general">Général</TabsTrigger>
            <TabsTrigger value="ticketing">Tickets</TabsTrigger>
            <TabsTrigger value="organizations">Organisations</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
            <TabsTrigger value="security">Sécurité</TabsTrigger>
            <TabsTrigger value="integrations">Intégrations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4">
            <Card className="p-6">
              <GeneralSettings />
            </Card>
          </TabsContent>
          
          <TabsContent value="ticketing" className="space-y-4">
            <Card className="p-6">
              <TicketingSettings />
            </Card>
          </TabsContent>
          
          <TabsContent value="organizations" className="space-y-4">
            <Card className="p-6">
              <OrganizationSettings />
            </Card>
          </TabsContent>
          
          <TabsContent value="email" className="space-y-4">
            <Card className="p-6">
              <EmailSettings />
            </Card>
          </TabsContent>
          
          <TabsContent value="users" className="space-y-4">
            <Card className="p-6">
              <UserManagement />
            </Card>
          </TabsContent>
          
          <TabsContent value="security" className="space-y-4">
            <Card className="p-6">
              <SecuritySettings />
            </Card>
          </TabsContent>
          
          <TabsContent value="integrations" className="space-y-4">
            <Card className="p-6">
              <IntegrationSettings />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
