import { useNavigate } from "react-router-dom";
import { SidebarProvider } from "./ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { useEffect } from "react";
import TopBar from "./TopBar";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { AIChatWindow } from "./ai-chat/AIChatWindow";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useUser();

  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "Please sign in to continue",
      });
      navigate("/signin");
    }
  }, [isAuthenticated, navigate, toast]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="flex flex-col w-screen h-screen bg-background">
        <div className="flex flex-1 h-full">
          {/* Sidebar */}
          <div className="w-64 border-r border-border bg-sidebar">
            <AppSidebar />
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col min-h-0">
            <TopBar />
            <div className="flex-1 overflow-auto p-2">{children}</div>
          </div>

          {/* AI Chat */}
          <div className="w-80 border-l border-border bg-card flex flex-col h-full">
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">AI Assistant</h2>
                <button className="text-muted-foreground hover:text-foreground">
                  ×
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto">
              <AIChatWindow />
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ProtectedRoute;
