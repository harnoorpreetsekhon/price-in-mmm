"use client";
import React from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  LayoutGrid,
  BarChartBig,
  DollarSign,
  Megaphone,
  Swords,
  Badge,
} from "lucide-react";
import { Logo } from "@/components/icons";
import AutomatedInsights from "./automated-insights";

const menuItems = [
  { id: "kpis", label: "Key KPIs", icon: LayoutGrid },
  { id: "core-performance", label: "MMM Core", icon: BarChartBig },
  { id: "price-effect", label: "Price Effects", icon: DollarSign },
  { id: "marketing-impact", label: "Marketing Impact", icon: Megaphone },
  { id: "competition", label: "Competition", icon: Swords },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeId, setActiveId] = React.useState("kpis");

  React.useEffect(() => {
    const handleScroll = () => {
      const sections = menuItems.map((item) =>
        document.getElementById(item.id)
      );
      const scrollPosition = window.scrollY + 150; // Offset for better accuracy

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveId(menuItems[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth'
    });
    setActiveId(id);
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Logo className="size-8 text-primary" />
            <div className="flex flex-col">
              <span className="text-lg font-semibold tracking-tighter">
                Price in MMM
              </span>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.id}>
                <a href={`#${item.id}`} onClick={(e) => handleLinkClick(e, item.id)}>
                  <SidebarMenuButton
                    isActive={activeId === item.id}
                    tooltip={{ children: item.label }}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </a>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarSeparator />
          <AutomatedInsights />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 lg:h-[60px] lg:px-6">
          <div className="flex-1">
            <div className="md:hidden">
              <SidebarTrigger />
            </div>
          </div>
        </header>
        <main>{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
