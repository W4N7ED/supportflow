
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import PrivateRoute from "@/components/PrivateRoute";
import Index from "./pages/Index";
import Settings from "./pages/Settings";
import Messages from "./pages/Messages";
import Reports from "./pages/Reports";
import KnowledgeBase from "./pages/KnowledgeBase";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import CreateTicket from "./pages/CreateTicket";
import TicketDetails from "./pages/TicketDetails";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Index />
                </PrivateRoute>
              }
            />
            <Route
              path="/create-ticket"
              element={
                <PrivateRoute>
                  <CreateTicket />
                </PrivateRoute>
              }
            />
            <Route
              path="/ticket/:id"
              element={
                <PrivateRoute>
                  <TicketDetails />
                </PrivateRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <PrivateRoute>
                  <Settings />
                </PrivateRoute>
              }
            />
            <Route
              path="/messages"
              element={
                <PrivateRoute>
                  <Messages />
                </PrivateRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <PrivateRoute>
                  <Reports />
                </PrivateRoute>
              }
            />
            <Route
              path="/knowledge-base"
              element={
                <PrivateRoute>
                  <KnowledgeBase />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
