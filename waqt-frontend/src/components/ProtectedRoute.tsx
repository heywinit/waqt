import { useNavigate } from "react-router-dom";
import { SidebarInset, SidebarProvider } from "./ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { useEffect } from "react";
import TopBar from "./TopBar";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";

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
      <div className="flex flex-col w-screen h-screen">
        <div className="flex flex-1">
          <AppSidebar />
          <SidebarInset>
            <TopBar />
            <div className="p-4">{children}</div>
          </SidebarInset>
          <AppSidebar />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ProtectedRoute;
