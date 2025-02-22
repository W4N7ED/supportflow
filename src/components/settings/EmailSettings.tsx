
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface EmailConfigFormValues {
  enabled: boolean;
  protocol: "imap" | "o365";
  server: string;
  port: string;
  username: string;
  password: string;
  folder: string;
  ssl: boolean;
  checkInterval: string;
}

const EmailSettings = () => {
  const form = useForm<EmailConfigFormValues>({
    defaultValues: {
      enabled: false,
      protocol: "imap",
      server: "",
      port: "",
      username: "",
      password: "",
      folder: "INBOX",
      ssl: true,
      checkInterval: "5",
    },
  });

  const protocol = form.watch("protocol");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium">Configuration Email</h2>
        <p className="text-sm text-muted-foreground">
          Configurez l'intégration email pour la création automatique de tickets
        </p>
      </div>

      <Form {...form}>
        <form className="space-y-4">
          <FormField
            control={form.control}
            name="enabled"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Activer l'intégration email</FormLabel>
                  <FormDescription>
                    Créer automatiquement des tickets à partir des emails reçus
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="protocol"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Protocole</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un protocole" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="imap">IMAP</SelectItem>
                    <SelectItem value="o365">Office 365</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Choisissez le protocole de connexion à votre serveur email
                </FormDescription>
              </FormItem>
            )}
          />

          {protocol === "imap" && (
            <>
              <FormField
                control={form.control}
                name="server"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Serveur IMAP</FormLabel>
                    <FormControl>
                      <Input placeholder="imap.example.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      L'adresse de votre serveur IMAP
                    </FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="port"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Port</FormLabel>
                    <FormControl>
                      <Input placeholder="993" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ssl"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Utiliser SSL/TLS</FormLabel>
                      <FormDescription>
                        Activer la connexion sécurisée
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </>
          )}

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom d'utilisateur</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="email@example.com" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mot de passe</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="folder"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dossier à surveiller</FormLabel>
                <FormControl>
                  <Input placeholder="INBOX" {...field} />
                </FormControl>
                <FormDescription>
                  Le dossier à surveiller pour les nouveaux emails
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="checkInterval"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Intervalle de vérification (minutes)</FormLabel>
                <FormControl>
                  <Input type="number" min="1" {...field} />
                </FormControl>
                <FormDescription>
                  Fréquence de vérification des nouveaux emails
                </FormDescription>
              </FormItem>
            )}
          />

          <Button type="submit">Sauvegarder la configuration</Button>
        </form>
      </Form>
    </div>
  );
};

export default EmailSettings;
