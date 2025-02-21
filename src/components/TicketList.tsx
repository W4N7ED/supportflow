
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Ticket {
  id: number;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  status: "open" | "in-progress" | "resolved" | "closed";
  createdAt: string;
}

const mockTickets: Ticket[] = [
  {
    id: 1,
    title: "Problème de connexion VPN",
    description: "Impossible de se connecter au VPN depuis ce matin",
    priority: "high",
    status: "open",
    createdAt: "2024-03-10T09:00:00",
  },
  {
    id: 2,
    title: "Mise à jour logiciel",
    description: "Demande de mise à jour de l'application de comptabilité",
    priority: "medium",
    status: "in-progress",
    createdAt: "2024-03-09T14:30:00",
  },
  {
    id: 3,
    title: "Problème d'impression",
    description: "L'imprimante du service marketing ne répond plus",
    priority: "low",
    status: "resolved",
    createdAt: "2024-03-08T11:15:00",
  },
];

interface TicketListProps {
  onSelectTicket: (id: number) => void;
}

const TicketList = ({ onSelectTicket }: TicketListProps) => {
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

  return (
    <div className="grid gap-4 animate-slide-in">
      {mockTickets.map((ticket) => (
        <Card
          key={ticket.id}
          className="ticket-card cursor-pointer"
          onClick={() => onSelectTicket(ticket.id)}
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
            Créé le {formatDate(ticket.createdAt)}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default TicketList;
