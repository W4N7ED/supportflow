
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Send } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { Ticket } from "@/types/supabase";

const TicketDetails = () => {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchTicket();
    fetchMessages();
  }, [id]);

  const fetchTicket = async () => {
    try {
      const { data, error } = await supabase
        .from("tickets")
        .select("*")
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
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">{ticket.title}</h1>
            <p className="text-muted-foreground mb-4">
              Créé le {formatDate(ticket.created_at)}
            </p>
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary">
              {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
            </Badge>
            <Badge>
              {ticket.status.split("-").map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(" ")}
            </Badge>
          </div>
        </div>
        <p className="text-base">{ticket.description}</p>
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
