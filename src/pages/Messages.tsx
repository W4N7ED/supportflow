
import { 
  Sidebar, 
  SidebarContent,
  SidebarProvider 
} from "@/components/ui/sidebar";
import { Card } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

const Messages = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarContent>
            {/* Sidebar content will be rendered here */}
          </SidebarContent>
        </Sidebar>
        <main className="flex-1 overflow-auto bg-background p-4">
          <Card className="flex h-[500px] items-center justify-center text-muted-foreground">
            <div className="text-center">
              <MessageSquare className="mx-auto h-12 w-12 opacity-50" />
              <p className="mt-2">Aucun message pour le moment</p>
            </div>
          </Card>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Messages;
