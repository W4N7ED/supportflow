
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";

const TicketingSettings = () => {
  const form = useForm({
    defaultValues: {
      autoAssignment: false,
      defaultPriority: "normal",
      defaultCategory: "software",
      resolveTime: "24",
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium">Paramètres des Tickets</h2>
        <p className="text-sm text-muted-foreground">
          Configurez le comportement des tickets
        </p>
      </div>

      <Tabs defaultValue="creation">
        <TabsList>
          <TabsTrigger value="creation">Création</TabsTrigger>
          <TabsTrigger value="assignment">Attribution</TabsTrigger>
          <TabsTrigger value="sla">SLA</TabsTrigger>
        </TabsList>

        <TabsContent value="creation" className="space-y-4">
          <Form {...form}>
            <form className="space-y-4">
              <FormField
                control={form.control}
                name="defaultCategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Catégorie par défaut</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une catégorie" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="software">Logiciel</SelectItem>
                        <SelectItem value="hardware">Matériel</SelectItem>
                        <SelectItem value="network">Réseau</SelectItem>
                        <SelectItem value="security">Sécurité</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="defaultPriority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priorité par défaut</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une priorité" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="urgent">Urgent</SelectItem>
                        <SelectItem value="high">Élevé</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="low">Faible</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="assignment" className="space-y-4">
          <FormField
            control={form.control}
            name="autoAssignment"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Attribution automatique</FormLabel>
                  <FormDescription>
                    Attribue automatiquement les tickets selon la charge de travail
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
        </TabsContent>

        <TabsContent value="sla" className="space-y-4">
          <FormField
            control={form.control}
            name="resolveTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Temps de résolution (heures)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormDescription>
                  Temps maximum avant escalade
                </FormDescription>
              </FormItem>
            )}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TicketingSettings;
