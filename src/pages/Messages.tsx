
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

interface Message {
  id: number;
  ticket_id: number;
  sender_id: string;
  content: string;
  created_at: string;
  is_internal: boolean;
  profiles: {
    full_name: string | null;
    email: string;
  };
  tickets: {
    title: string;
  };
}

const Messages = () => {
  const [selectedTicket, setSelectedTicket] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const { toast } = useToast();

  const { data: tickets } = useQuery({
    queryKey: ["tickets"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tickets")
        .select("id, title")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const { data: messages, refetch: refetchMessages } = useQuery({
    queryKey: ["messages", selectedTicket],
    queryFn: async () => {
      if (!selectedTicket) return [];

      const { data, error } = await supabase
        .from("messages")
        .select(`
          *,
          profiles (full_name, email),
          tickets (title)
        `)
        .eq("ticket_id", selectedTicket)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data as Message[];
    },
    enabled: !!selectedTicket,
  });

  const sendMessage = async () => {
    if (!selectedTicket || !newMessage.trim()) return;

    const { error } = await supabase.from("messages").insert({
      ticket_id: selectedTicket,
      content: newMessage.trim(),
      sender_id: (await supabase.auth.getUser()).data.user?.id,
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'envoyer le message",
      });
      return;
    }

    setNewMessage("");
    refetchMessages();
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Messages</h1>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="p-6">
          <div className="space-y-4">
            <Select
              value={selectedTicket?.toString()}
              onValueChange={(value) => setSelectedTicket(Number(value))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionner un ticket" />
              </SelectTrigger>
              <SelectContent>
                {tickets?.map((ticket) => (
                  <SelectItem key={ticket.id} value={ticket.id.toString()}>
                    {ticket.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedTicket && (
              <div className="space-y-4">
                <div className="space-y-4 max-h-96 overflow-y-auto p-4 border rounded-lg">
                  {messages?.map((message) => (
                    <div
                      key={message.id}
                      className="p-4 rounded-lg bg-gray-50 space-y-2"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">
                            {message.profiles.full_name || message.profiles.email}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(message.created_at).toLocaleString()}
                          </p>
                        </div>
                        {message.is_internal && (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                            Interne
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {message.content}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <Textarea
                    placeholder="Votre message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <div className="flex justify-end">
                    <Button onClick={sendMessage}>Envoyer</Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Messages;
