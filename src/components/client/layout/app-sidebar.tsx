"use client"

import * as React from "react"
import {
  Home,
  Clock,
  FolderPlus,
  FolderUp,
  FileUp,
  Box,
  Users,
  Trash,
} from "lucide-react"

import { NavMain } from "@/components/client/layout/nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { NewDropDown } from "../new-dropdown"

const data = {
  new: [
    {
      name: "Thư mục mới",
      icon: FolderPlus,
    },
    {
      name: "Tải tệp lên",
      icon: FolderUp,
      plan: "Startup",
    },
    {
      name: "Tải thư mục lên",
      icon: FileUp,
    },
  ],
  navMain: [
    {
      title: "Trang chủ",
      url: "#",
      icon: Home,
      isActive: true,
    },
    {
      title: "Files của tôi",
      url: "#",
      icon: Box,
    },
    {
      title: "Gần đây",
      url: "#",
      icon: Clock,
    },
    {
      title: "Được chia sẻ",
      url: "#",
      icon: Users,
    },
    {
      title: "Thùng rác",
      url: "#",
      icon: Trash,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarRail />
      <SidebarHeader className="pt-1 md:pt-0">
        <NewDropDown items={data.new} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
    </Sidebar>
  )
}