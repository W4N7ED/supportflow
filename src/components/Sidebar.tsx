
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  List,
  MessageSquare,
  PieChart,
  Plus,
  Settings,
  Ticket,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Profile } from "@/types/supabase";

const Sidebar = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        setCurrentUser(profile);
      }
    };

    fetchCurrentUser();
  }, []);

  return (
    <div className="flex w-64 flex-col border-r bg-white">
      <div className="p-4">
        <Button className="w-full gap-2" onClick={() => navigate('/create-ticket')}>
          <Plus className="h-4 w-4" /> Nouveau Ticket
        </Button>
      </div>
      <nav className="flex-1 space-y-1 p-2">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 px-3"
          onClick={() => navigate('/')}
        >
          <Ticket className="h-4 w-4" />
          Tickets
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 px-3"
          onClick={() => navigate('/messages')}
        >
          <MessageSquare className="h-4 w-4" />
          Messages
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 px-3"
          onClick={() => navigate('/reports')}
        >
          <PieChart className="h-4 w-4" />
          Rapports
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 px-3"
          onClick={() => navigate('/knowledge-base')}
        >
          <List className="h-4 w-4" />
          Base de connaissances
        </Button>
      </nav>
      {currentUser?.role === 'admin' && (
        <div className="border-t p-4">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 px-3"
            onClick={() => navigate('/settings')}
          >
            <Settings className="h-4 w-4" />
            Paramètres
          </Button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
