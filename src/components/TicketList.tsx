
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { Ticket } from "@/types/supabase";
import { useToast } from "@/components/ui/use-toast";

const TicketList = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTickets();
    const subscription = supabase
      .channel('tickets')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'tickets' 
      }, handleTicketChange)
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchTickets = async () => {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTickets(data || []);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les tickets",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTicketChange = (payload: any) => {
    fetchTickets();
  };

  const getPriorityClass = (priority: Ticket["priority"]) => {
    return `priority-badge priority-${priority}`;
  };

  const getStatusClass = (status: Ticket["status"]) => {
    return `status-badge status-${status}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="grid gap-4 animate-slide-in">
      {tickets.map((ticket) => (
        <Card
          key={ticket.id}
          className="ticket-card cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => navigate(`/ticket/${ticket.id}`)}
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium text-gray-900">{ticket.title}</h3>
              <p className="mt-1 text-sm text-gray-500">{ticket.description}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge className={getPriorityClass(ticket.priority)}>
                {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
              </Badge>
              <Badge className={getStatusClass(ticket.status)}>
                {ticket.status.split("-").map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(" ")}
              </Badge>
            </div>
          </div>
          <div className="mt-4 text-xs text-gray-500">
            Créé le {formatDate(ticket.created_at)}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default TicketList;
