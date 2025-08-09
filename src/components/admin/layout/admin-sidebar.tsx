"use client"

import * as React from "react"
import {
  ChartPie,
  Lock,
  Settings2,
  Shield,
  User,
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
import { ALL_PERMISSIONS } from "@/config/permissions"

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useAppSelector(state => state.users.user);
  const permissions = useAppSelector(state => state.users.user?.role.permissions)

  const data = {
    navMain: [
      {
        title: "Bảng điều khiển",
        url: "/admin",
        icon: ChartPie,
        access: true
      },
      {
        title: "Cài đặt",
        url: "/admin/settings",
        icon: Settings2,
        access: permissions?.some(item => item.apiPath === ALL_PERMISSIONS.SETTINGS.LIST.apiPath &&
          item.method === ALL_PERMISSIONS.SETTINGS.LIST.method) ?? false
      },
      {
        title: "Người dùng",
        url: "/admin/users",
        icon: User,
        access: permissions?.some(item => item.apiPath === ALL_PERMISSIONS.USERS.LIST.apiPath &&
          item.method === ALL_PERMISSIONS.USERS.LIST.method) ?? false
      },
      {
        title: "Vai trò",
        url: "/admin/roles",
        icon: Shield,
        access: permissions?.some(item => item.apiPath === ALL_PERMISSIONS.ROLES.LIST.apiPath &&
          item.method === ALL_PERMISSIONS.ROLES.LIST.method) ?? false
      },
      {
        title: "Quyền",
        url: "/admin/permissions",
        icon: Lock,
        access: permissions?.some(item => item.apiPath === ALL_PERMISSIONS.PERMISSIONS.LIST.apiPath &&
          item.method === ALL_PERMISSIONS.PERMISSIONS.LIST.method) ?? false
      },
    ],
  }

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