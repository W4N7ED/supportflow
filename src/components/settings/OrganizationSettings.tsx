
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
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
import { useForm } from "react-hook-form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface OrganizationForm {
  name: string;
  type: "client" | "partner" | "internal";
  address?: string;
  phone?: string;
  website?: string;
}

interface ContactForm {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  role?: string;
  is_primary: boolean;
}

const OrganizationSettings = () => {
  const [selectedOrganization, setSelectedOrganization] = useState<number | null>(null);
  const { toast } = useToast();

  const form = useForm<OrganizationForm>({
    defaultValues: {
      name: "",
      type: "client",
    },
  });

  const contactForm = useForm<ContactForm>({
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      is_primary: false,
    },
  });

  const { data: organizations = [], refetch: refetchOrganizations } = useQuery({
    queryKey: ["organizations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("organizations")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const { data: contacts = [], refetch: refetchContacts } = useQuery({
    queryKey: ["contacts", selectedOrganization],
    queryFn: async () => {
      if (!selectedOrganization) return [];
      const { data, error } = await supabase
        .from("contacts")
        .select("*")
        .eq("organization_id", selectedOrganization)
        .order("last_name");
      if (error) throw error;
      return data;
    },
  });

  const onSubmit = async (data: OrganizationForm) => {
    try {
      const { error } = await supabase.from("organizations").insert(data);
      if (error) throw error;

      toast({
        title: "Succès",
        description: "L'organisation a été créée",
      });
      form.reset();
      refetchOrganizations();
    } catch (error) {
      console.error("Error creating organization:", error);
      toast({
        title: "Erreur",
        description: "Impossible de créer l'organisation",
        variant: "destructive",
      });
    }
  };

  const onSubmitContact = async (data: ContactForm) => {
    if (!selectedOrganization) return;

    try {
      const { error } = await supabase.from("contacts").insert({
        ...data,
        organization_id: selectedOrganization,
      });
      if (error) throw error;

      toast({
        title: "Succès",
        description: "Le contact a été créé",
      });
      contactForm.reset();
      refetchContacts();
    } catch (error) {
      console.error("Error creating contact:", error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le contact",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium">Gestion des organisations</h2>
        <p className="text-sm text-muted-foreground">
          Gérez vos organisations et leurs contacts
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="text-md font-medium mb-4">Nouvelle organisation</h3>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="client">Client</SelectItem>
                        <SelectItem value="partner">Partenaire</SelectItem>
                        <SelectItem value="internal">Interne</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adresse</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Téléphone</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Site web</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button type="submit">Créer l'organisation</Button>
            </form>
          </Form>
        </div>

        <div>
          <h3 className="text-md font-medium mb-4">Organisations existantes</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {organizations.map((org) => (
                <TableRow
                  key={org.id}
                  className={selectedOrganization === org.id ? "bg-muted" : ""}
                >
                  <TableCell>{org.name}</TableCell>
                  <TableCell className="capitalize">{org.type}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      onClick={() => setSelectedOrganization(org.id)}
                    >
                      Gérer les contacts
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {selectedOrganization && (
        <div className="space-y-6">
          <h3 className="text-md font-medium">
            Contacts pour {organizations.find(org => org.id === selectedOrganization)?.name}
          </h3>

          <Form {...contactForm}>
            <form onSubmit={contactForm.handleSubmit(onSubmitContact)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={contactForm.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prénom</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={contactForm.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={contactForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={contactForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Téléphone</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={contactForm.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rôle</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button type="submit">Ajouter le contact</Button>
            </form>
          </Form>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rôle</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell>
                    {contact.first_name} {contact.last_name}
                  </TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell>{contact.role || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default OrganizationSettings;
