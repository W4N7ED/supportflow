
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
import { Plus, X } from "lucide-react";

const TicketingSettings = () => {
  const [priorities, setPriorities] = useState<string[]>(["urgent", "high", "normal", "low"]);
  const [newPriority, setNewPriority] = useState("");

  const form = useForm({
    defaultValues: {
      autoAssignment: false,
      defaultPriority: "normal",
      defaultCategory: "software",
      resolveTime: "24",
    },
  });

  const handleAddPriority = () => {
    if (newPriority && !priorities.includes(newPriority.toLowerCase())) {
      setPriorities([...priorities, newPriority.toLowerCase()]);
      setNewPriority("");
    }
  };

  const handleRemovePriority = (priority: string) => {
    setPriorities(priorities.filter(p => p !== priority));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium">Paramètres des Tickets</h2>
        <p className="text-sm text-muted-foreground">
          Configurez le comportement des tickets
        </p>
      </div>

      <Tabs defaultValue="creation">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="creation">Création</TabsTrigger>
          <TabsTrigger value="priorities">Priorités</TabsTrigger>
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
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="priorities" className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Nouvelle priorité"
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value)}
              />
              <Button variant="outline" size="icon" onClick={handleAddPriority}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {priorities.map((priority) => (
                <div key={priority} className="flex items-center justify-between p-2 border rounded">
                  <span className="capitalize">{priority}</span>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleRemovePriority(priority)}
                    disabled={priorities.length <= 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
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
                    Attribue automatiquement les tickets selon la charge de travail et les priorités définies
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
          <div className="space-y-4">
            {priorities.map((priority) => (
              <FormField
                key={priority}
                control={form.control}
                name={`sla_${priority}`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="capitalize">Temps de résolution pour {priority}</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <Input type="number" {...field} placeholder="24" />
                        <span className="text-sm text-muted-foreground">heures</span>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Temps maximum avant escalade pour les tickets de priorité {priority}
                    </FormDescription>
                  </FormItem>
                )}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TicketingSettings;
