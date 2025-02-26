import * as React from "react";
import {
  Bot,
  Calendar,
  Clock11,
  Folder,
  LifeBuoy,
  Send,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import { useUser } from "@/contexts/UserContext";
import { getUserProjects } from "@/services/projectService";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const navMainData = [
  {
    title: "Dashboard",
    url: "#",
    icon: SquareTerminal,
  },
  {
    title: "Tasks",
    url: "#",
    icon: Bot,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
];

const navSecondaryData = [
  {
    title: "Support",
    url: "#",
    icon: LifeBuoy,
  },
  {
    title: "Feedback",
    url: "#",
    icon: Send,
  },
];

interface ProjectNavItem {
  title: React.ReactNode;
  url: string;
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser();
  const [projects, setProjects] = React.useState<ProjectNavItem[]>([]);

  React.useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectData = await getUserProjects();
        setProjects(
          projectData.map((project) => ({
            title: (
              <div className="flex items-center gap-2">
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: project.color }}
                />
                <span>{project.name}</span>
              </div>
            ),
            url: `#/projects/${project.id}`,
          }))
        );
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      }
    };

    fetchProjects();
  }, []);

  const projectsNav = {
    title: "Projects",
    url: "#/projects",
    icon: Folder,
    items: projects,
  };

  if (!user) {
    return null;
  }

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Clock11 className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Waqt</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={[...navMainData, projectsNav]} />
        <NavSecondary items={navSecondaryData} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
