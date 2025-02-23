
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Sidebar from "@/components/Sidebar";
import { Ticket } from "@/types/supabase";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const Index = () => {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  const { data: tickets = [], isLoading } = useQuery({
    queryKey: ["tickets"],
    queryFn: async () => {
      let query = supabase.from("tickets").select("*").order("created_at", { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }
      if (priorityFilter !== "all") {
        query = query.eq("priority", priorityFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const formatDate = (date: string) => {
    return format(new Date(date), "dd MMM yyyy HH:mm", { locale: fr });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600";
      case "medium":
        return "text-orange-600";
      case "low":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "text-blue-600";
      case "in-progress":
        return "text-purple-600";
      case "resolved":
        return "text-green-600";
      case "closed":
        return "text-gray-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="flex flex-1 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-hidden bg-gray-50">
        <div className="flex h-full">
          {/* Liste des tickets */}
          <div className="w-1/2 border-r border-gray-200 bg-white p-4 flex flex-col">
            <div className="mb-4 space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher un ticket..."
                    className="h-10 w-full rounded-md border border-gray-200 pl-10 pr-4 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les status</SelectItem>
                    <SelectItem value="open">Ouvert</SelectItem>
                    <SelectItem value="in-progress">En cours</SelectItem>
                    <SelectItem value="resolved">Résolu</SelectItem>
                    <SelectItem value="closed">Fermé</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Priorité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les priorités</SelectItem>
                    <SelectItem value="high">Haute</SelectItem>
                    <SelectItem value="medium">Moyenne</SelectItem>
                    <SelectItem value="low">Basse</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex-1 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Titre</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priorité</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tickets.map((ticket) => (
                    <TableRow
                      key={ticket.id}
                      className={`cursor-pointer hover:bg-gray-50 ${
                        selectedTicket?.id === ticket.id ? "bg-gray-50" : ""
                      }`}
                      onClick={() => setSelectedTicket(ticket)}
                    >
                      <TableCell className="font-medium">{ticket.title}</TableCell>
                      <TableCell className={getStatusColor(ticket.status)}>
                        {ticket.status}
                      </TableCell>
                      <TableCell className={getPriorityColor(ticket.priority)}>
                        {ticket.priority}
                      </TableCell>
                      <TableCell className="text-gray-500">
                        {formatDate(ticket.created_at)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Prévisualisation du ticket */}
          <div className="w-1/2 p-6 bg-white overflow-auto">
            {selectedTicket ? (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold">{selectedTicket.title}</h2>
                  <p className="text-sm text-gray-500">
                    Créé le {formatDate(selectedTicket.created_at)}
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className={`text-sm ${getStatusColor(selectedTicket.status)}`}>
                    Status: {selectedTicket.status}
                  </div>
                  <div className={`text-sm ${getPriorityColor(selectedTicket.priority)}`}>
                    Priorité: {selectedTicket.priority}
                  </div>
                </div>
                <Card className="p-4">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {selectedTicket.description}
                  </p>
                </Card>
                <div className="space-y-4">
                  <h3 className="font-semibold">Détails supplémentaires</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Type de demande</p>
                      <p>{selectedTicket.request_type || "Non spécifié"}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Catégorie</p>
                      <p>{selectedTicket.category || "Non spécifié"}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Équipement</p>
                      <p>{selectedTicket.equipment || "Non spécifié"}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Utilisateur impacté</p>
                      <p>{selectedTicket.impacted_user || "Non spécifié"}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-gray-500">
                Sélectionnez un ticket pour voir les détails
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
