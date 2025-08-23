import * as React from "react"
import {
  Home,
  Box,
  Users,
  Trash,
} from "lucide-react"

import { NavMain } from "@/components/client/layout/nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail
} from "@/components/ui/sidebar"
import { NewDropDown } from "../new-dropdown"
import type { NavItem } from "@/components/admin/layout/admin-sidebar"

const navMainItems: NavItem[] = [
  {
    title: "Trang chủ",
    url: "/",
    icon: Home,
    access: true
  },
  {
    title: "Files của tôi",
    url: "/my-files",
    icon: Box,
    access: true
  },
  {
    title: "Được chia sẻ",
    url: "/shared",
    icon: Users,
    access: true
  },
  {
    title: "Thùng rác",
    url: "/trash",
    icon: Trash,
    access: true
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarRail />
      <SidebarHeader className="pt-1 md:pt-0">
        <NewDropDown />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMainItems} />
      </SidebarContent>
    </Sidebar>
  )
}