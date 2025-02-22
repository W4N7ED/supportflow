
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { Label } from "@/components/ui/label";

const GeneralSettings = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [backgroundPreview, setBackgroundPreview] = useState<string | null>(null);
  const { toast } = useToast();
  const form = useForm({
    defaultValues: {
      systemName: "Système de Ticketing",
      language: "fr",
      timezone: "Europe/Paris",
      theme: "light",
    },
  });

  useEffect(() => {
    loadCurrentBackground();
  }, []);

  const loadCurrentBackground = async () => {
    const { data, error } = await supabase
      .from('app_settings')
      .select('login_background_url')
      .single();

    if (!error && data?.login_background_url) {
      setBackgroundPreview(data.login_background_url);
    }
  };

  const handleBackgroundUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Vérification du type de fichier
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une image",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      // Upload de l'image
      const fileExt = file.name.split('.').pop();
      const filePath = `login-background-${Date.now()}.${fileExt}`;
      
      const { error: uploadError, data } = await supabase.storage
        .from('settings')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Récupération de l'URL publique
      const { data: { publicUrl } } = supabase.storage
        .from('settings')
        .getPublicUrl(filePath);

      // Mise à jour des paramètres
      const { error: updateError } = await supabase
        .from('app_settings')
        .update({ 
          login_background_url: publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', (await supabase.from('app_settings').select('id').single()).data.id);

      if (updateError) throw updateError;

      setBackgroundPreview(publicUrl);
      toast({
        title: "Succès",
        description: "L'image de fond a été mise à jour",
      });

    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium">Paramètres Généraux</h2>
        <p className="text-sm text-muted-foreground">
          Configurez les paramètres de base du système
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Image de fond de la page de connexion</Label>
          <div className="space-y-4">
            {backgroundPreview && (
              <div className="relative w-full h-48 rounded-lg overflow-hidden">
                <img
                  src={backgroundPreview}
                  alt="Aperçu du fond"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div>
              <Input
                type="file"
                accept="image/*"
                onChange={handleBackgroundUpload}
                disabled={isUploading}
              />
              <p className="text-sm text-muted-foreground mt-2">
                Format recommandé : JPG ou PNG, ratio 16:9
              </p>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form className="space-y-4">
            <FormField
              control={form.control}
              name="systemName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom du système</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Le nom qui sera affiché dans l'interface
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Langue</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une langue" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="timezone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fuseau horaire</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un fuseau horaire" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Europe/Paris">Europe/Paris</SelectItem>
                      <SelectItem value="America/New_York">America/New_York</SelectItem>
                      <SelectItem value="Asia/Tokyo">Asia/Tokyo</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <Button type="submit">Enregistrer les modifications</Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default GeneralSettings;
