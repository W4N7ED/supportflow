
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
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

const SecuritySettings = () => {
  const form = useForm({
    defaultValues: {
      twoFactorAuth: false,
      dataRetention: "30",
      auditLogs: true,
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium">Sécurité et Conformité</h2>
        <p className="text-sm text-muted-foreground">
          Configurez les paramètres de sécurité
        </p>
      </div>

      <Form {...form}>
        <form className="space-y-4">
          <FormField
            control={form.control}
            name="twoFactorAuth"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    Authentification à deux facteurs
                  </FormLabel>
                  <FormDescription>
                    Exiger la 2FA pour tous les utilisateurs
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
            name="dataRetention"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Conservation des données (jours)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormDescription>
                  Durée de conservation des tickets fermés
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="auditLogs"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Journaux d'audit</FormLabel>
                  <FormDescription>
                    Activer le suivi des actions utilisateurs
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

          <Button type="submit">Enregistrer les modifications</Button>
        </form>
      </Form>
    </div>
  );
};

export default SecuritySettings;
