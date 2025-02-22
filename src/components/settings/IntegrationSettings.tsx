
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
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

const IntegrationSettings = () => {
  const form = useForm({
    defaultValues: {
      slackWebhook: "",
      emailNotifications: true,
      jiraIntegration: false,
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium">Intégrations</h2>
        <p className="text-sm text-muted-foreground">
          Configurez les intégrations avec d'autres services
        </p>
      </div>

      <Form {...form}>
        <form className="space-y-4">
          <FormField
            control={form.control}
            name="slackWebhook"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Webhook Slack</FormLabel>
                <FormControl>
                  <Input placeholder="https://hooks.slack.com/..." {...field} />
                </FormControl>
                <FormDescription>
                  URL du webhook pour les notifications Slack
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="emailNotifications"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    Notifications par email
                  </FormLabel>
                  <FormDescription>
                    Envoyer des notifications par email
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
            name="jiraIntegration"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Intégration Jira</FormLabel>
                  <FormDescription>
                    Synchroniser les tickets avec Jira
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

export default IntegrationSettings;
