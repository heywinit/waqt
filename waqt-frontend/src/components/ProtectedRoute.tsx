import { isAuthenticated } from "@/services/authService";
import { useNavigate } from "react-router-dom";
import { SidebarInset, SidebarProvider } from "./ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { useEffect } from "react";
import TopBar from "./TopBar";
import { useToast } from "@/hooks/use-toast";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "Please sign in to continue",
      });
      navigate("/signin");
      return;
    }

    if (!isAuthenticated()) {
      toast({
        variant: "destructive",
        title: "Session Expired",
        description: "Please sign in again",
      });
      navigate("/signin");
    }
  }, [navigate, toast]);

  return (
    <SidebarProvider>
      <div className="flex flex-col w-screen h-screen">
        <div className="flex flex-1">
          <AppSidebar />
          <SidebarInset>
            <TopBar />
            {children}
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ProtectedRoute;
