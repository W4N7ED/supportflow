
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowLeft, Send, Plus, Users } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Ticket } from "@/types/supabase";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

const TicketDetails = () => {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<number[]>([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch organizations and their contacts
  const { data: organizations = [] } = useQuery({
    queryKey: ["organizations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("organizations")
        .select("*, contacts(*)");
      if (error) throw error;
      return data;
    },
  });

  // Fetch ticket contacts
  const { data: ticketContacts = [], refetch: refetchTicketContacts } = useQuery({
    queryKey: ["ticket-contacts", id],
    queryFn: async () => {
      if (!id) return [];
      const { data, error } = await supabase
        .from("ticket_contacts")
        .select("*, contacts(*)")
        .eq("ticket_id", id);
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    fetchTicket();
    fetchMessages();
  }, [id]);

  const fetchTicket = async () => {
    try {
      if (!id) return;
      const { data, error } = await supabase
        .from("tickets")
        .select("*, organizations(*)")
        .eq("id", id)
        .single();

      if (error) throw error;
      setTicket(data);
    } catch (error) {
      console.error("Error fetching ticket:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger le ticket",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      if (!id) return;
      const { data, error } = await supabase
        .from("messages")
        .select("*, profiles(*)")
        .eq("ticket_id", id)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      if (!id) return;
      const { error } = await supabase
        .from("tickets")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Le statut du ticket a été mis à jour",
      });
      fetchTicket();
    } catch (error) {
      console.error("Error updating ticket status:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive",
      });
    }
  };

  const handleOrganizationChange = async (orgId: string) => {
    try {
      if (!id) return;
      const { error } = await supabase
        .from("tickets")
        .update({ organization_id: orgId })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "L'organisation a été mise à jour",
      });
      fetchTicket();
    } catch (error) {
      console.error("Error updating ticket organization:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'organisation",
        variant: "destructive",
      });
    }
  };

  const handleAddContacts = async () => {
    try {
      if (!id) return;
      const contactsToAdd = selectedContacts.map(contactId => ({
        ticket_id: Number(id),
        contact_id: contactId,
      }));

      const { error } = await supabase
        .from("ticket_contacts")
        .insert(contactsToAdd);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Les contacts ont été ajoutés en copie",
      });
      setSelectedContacts([]);
      refetchTicketContacts();
    } catch (error) {
      console.error("Error adding contacts:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter les contacts",
        variant: "destructive",
      });
    }
  };

  const handleSendReply = async () => {
    if (!reply.trim()) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      const { error } = await supabase.from("messages").insert({
        ticket_id: id,
        content: reply,
        sender_id: user.id,
      });

      if (error) throw error;

      setReply("");
      await fetchMessages();
      
      toast({
        title: "Succès",
        description: "Votre réponse a été envoyée",
      });
    } catch (error) {
      console.error("Error sending reply:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer votre réponse",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-lg text-muted-foreground mb-4">Ticket introuvable</p>
        <Button onClick={() => navigate("/")}>Retour aux tickets</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <Button
        variant="ghost"
        onClick={() => navigate("/")}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Retour aux tickets
      </Button>

      <Card className="p-6 mb-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">{ticket.title}</h1>
            <p className="text-muted-foreground">
              Créé le {formatDate(ticket.created_at)}
            </p>
          </div>
          <div className="flex gap-4 items-center">
            <Select
              value={ticket.status}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Ouvert</SelectItem>
                <SelectItem value="in-progress">En cours</SelectItem>
                <SelectItem value="resolved">Résolu</SelectItem>
                <SelectItem value="closed">Fermé</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={ticket.organization_id?.toString() || ""}
              onValueChange={handleOrganizationChange}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Organisation" />
              </SelectTrigger>
              <SelectContent>
                {organizations.map((org) => (
                  <SelectItem key={org.id} value={org.id.toString()}>
                    {org.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Ajouter en copie
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Ajouter des contacts en copie</DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-[400px] pr-4">
                  {organizations.map((org) => (
                    <div key={org.id} className="mb-4">
                      <h4 className="font-medium mb-2">{org.name}</h4>
                      {org.contacts?.map((contact) => (
                        <div key={contact.id} className="flex items-center space-x-2 mb-2">
                          <Checkbox
                            id={`contact-${contact.id}`}
                            checked={selectedContacts.includes(contact.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedContacts([...selectedContacts, contact.id]);
                              } else {
                                setSelectedContacts(selectedContacts.filter(id => id !== contact.id));
                              }
                            }}
                          />
                          <label htmlFor={`contact-${contact.id}`} className="text-sm">
                            {contact.first_name} {contact.last_name} ({contact.email})
                          </label>
                        </div>
                      ))}
                    </div>
                  ))}
                </ScrollArea>
                <div className="mt-4 flex justify-end">
                  <Button onClick={handleAddContacts} disabled={selectedContacts.length === 0}>
                    Ajouter les contacts sélectionnés
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {ticketContacts.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2">En copie :</h4>
            <div className="flex flex-wrap gap-2">
              {ticketContacts.map(({ contacts: contact }) => (
                <Badge key={contact.id} variant="secondary">
                  {contact.email}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <p className="text-base whitespace-pre-wrap">{ticket.description}</p>
      </Card>

      <div className="space-y-6 mb-6">
        {messages.map((message) => (
          <Card key={message.id} className="p-4">
            <div className="flex justify-between items-start mb-2">
              <span className="font-medium">
                {message.profiles?.full_name || "Utilisateur"}
              </span>
              <span className="text-sm text-muted-foreground">
                {formatDate(message.created_at)}
              </span>
            </div>
            <p className="text-base whitespace-pre-wrap">{message.content}</p>
          </Card>
        ))}
      </div>

      <Card className="p-4">
        <Textarea
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          placeholder="Votre réponse..."
          className="min-h-[100px] mb-4"
        />
        <div className="flex justify-end">
          <Button onClick={handleSendReply} disabled={!reply.trim()}>
            <Send className="h-4 w-4 mr-2" />
            Envoyer
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default TicketDetails;
