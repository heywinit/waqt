import * as React from "react";
import {
  Bot,
  Calendar,
  Clock11,
  Frame,
  LifeBuoy,
  Send,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import { useUser } from "@/contexts/UserContext";
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
    isActive: true,
    items: [
      {
        title: "Overview",
        url: "#",
      },
      {
        title: "Analytics",
        url: "#",
      },
      {
        title: "Reports",
        url: "#",
      },
    ],
  },
  {
    title: "Tasks",
    url: "#",
    icon: Bot,
    items: [
      {
        title: "All Tasks",
        url: "#",
      },
      {
        title: "Completed",
        url: "#",
      },
      {
        title: "Pending",
        url: "#",
      },
    ],
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
    items: [
      {
        title: "Daily View",
        url: "#",
      },
      {
        title: "Weekly View",
        url: "#",
      },
      {
        title: "Monthly View",
        url: "#",
      },
    ],
  },
  {
    title: "Projects",
    url: "#",
    icon: Frame,
    items: [
      {
        title: "Ongoing Projects",
        url: "#",
      },
      {
        title: "Completed Projects",
        url: "#",
      },
      {
        title: "New Project",
        url: "#",
      },
    ],
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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser();

  // If no user is logged in, you might want to show a different sidebar or return null
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
        <NavMain items={navMainData} />
        <NavSecondary items={navSecondaryData} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
