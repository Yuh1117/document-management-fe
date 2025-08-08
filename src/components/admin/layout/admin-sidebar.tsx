"use client"

import * as React from "react"
import {
  ChartPie,
  Settings2,
  ShieldUser,
  User,
  UserLock
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { NavUser } from "./nav-user"
import { NavMain } from "./admin-nav-main"
import { useAppSelector } from "@/redux/hooks"

const data = {
  navMain: [
    {
      title: "Bảng điều khiển",
      url: "/admin",
      icon: ChartPie,
    },
    {
      title: "Cài đặt",
      url: "/admin/settings",
      icon: Settings2,
    },
    {
      title: "Người dùng",
      url: "/admin/users",
      icon: User,
    },
    {
      title: "Vai trò",
      url: "/admin/roles",
      icon: ShieldUser,
    },
    {
      title: "Quyền",
      url: "/admin/permissions",
      icon: UserLock,
    },
  ],
}

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useAppSelector(state => state.users.user);

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="grid flex-1 text-left text-lg leading-tight">
                  <span className="truncate font-medium">DMS</span>
                  <span className="truncate text-xs">ADMIN</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}