
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, Plus, Bell, User } from "lucide-react";
import TicketList from "@/components/TicketList";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

const Index = () => {
  const [selectedTicket, setSelectedTicket] = useState<number | null>(null);

  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto bg-gray-50 p-4">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Tickets</h1>
            <p className="text-sm text-gray-500">Gérez vos tickets de support</p>
          </div>
          <TicketList onSelectTicket={setSelectedTicket} />
        </main>
      </div>
    </div>
  );
};

export default Index;
