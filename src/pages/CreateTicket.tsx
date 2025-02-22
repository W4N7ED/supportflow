
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";

const ticketSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().min(1, "La description est requise"),
  priority: z.enum(["urgent", "high", "medium", "low"]),
  request_type: z.enum(["incident", "anomaly", "improvement", "question"]),
  category: z.enum(["hardware", "software", "network", "specific_application"]),
  equipment: z.enum(["pc", "mobile", "server", "other"]),
  context: z.string().optional(),
  expected_behavior: z.string().optional(),
  actual_behavior: z.string().optional(),
  reproducibility: z.string().optional(),
  impacted_user: z.string().optional(),
  software_version: z.string().optional(),
  browser_version: z.string().optional(),
  attempted_actions: z.string().optional(),
  contact_person: z.string().optional(),
  availability_slots: z.string().optional(),
});

type TicketFormValues = z.infer<typeof ticketSchema>;

const CreateTicket = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<TicketFormValues>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      priority: "medium",
      request_type: "incident",
      category: "software",
      equipment: "pc",
    },
  });

  const onSubmit = async (data: TicketFormValues) => {
    setIsSubmitting(true);
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error("Non authentifié");

      const { error } = await supabase.from("tickets").insert({
        ...data,
        status: "open",
        created_by: user.id,
      });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Le ticket a été créé avec succès",
      });
      navigate("/");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de créer le ticket",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Créer un nouveau ticket</h1>
      <Card className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titre</FormLabel>
                    <FormControl>
                      <Input placeholder="Titre du ticket" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="request_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type de demande</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="incident">Incident</SelectItem>
                        <SelectItem value="anomaly">Anomalie</SelectItem>
                        <SelectItem value="improvement">
                          Demande d'amélioration
                        </SelectItem>
                        <SelectItem value="question">Question</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priorité</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une priorité" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="urgent">Urgent</SelectItem>
                        <SelectItem value="high">Élevé</SelectItem>
                        <SelectItem value="medium">Moyen</SelectItem>
                        <SelectItem value="low">Faible</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Catégorie</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une catégorie" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="hardware">Matériel</SelectItem>
                        <SelectItem value="software">Logiciel</SelectItem>
                        <SelectItem value="network">Réseau</SelectItem>
                        <SelectItem value="specific_application">
                          Application spécifique
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="equipment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Équipement concerné</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un équipement" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pc">PC</SelectItem>
                        <SelectItem value="mobile">Mobile</SelectItem>
                        <SelectItem value="server">Serveur</SelectItem>
                        <SelectItem value="other">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="impacted_user"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Utilisateur impacté</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nom, identifiant, service..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description générale</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Description détaillée du problème"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="context"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contexte</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Décrivez la situation dans laquelle le problème est survenu"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="expected_behavior"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comportement attendu</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Que devrait-il se passer normalement ?"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="actual_behavior"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comportement actuel</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Que se passe-t-il actuellement ?"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="software_version"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Version du logiciel</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Windows 10, Office 365..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="browser_version"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Version du navigateur</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Chrome 91.0.4472.124" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="reproducibility"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reproductibilité</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Le problème est-il systématique ou aléatoire ? Comment le reproduire ?"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="attempted_actions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Actions déjà effectuées</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Quelles actions avez-vous déjà tentées pour résoudre le problème ?"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="contact_person"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Personne à contacter</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nom et coordonnées de la personne à contacter"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="availability_slots"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Créneaux de disponibilité</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: Lundi 14h-16h, Mardi matin..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/")}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Création..." : "Créer le ticket"}
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default CreateTicket;
