import * as React from "react"
import {
  Home,
  Box,
  Users,
  Trash,
  Clock,
} from "lucide-react"

import { NavMain } from "@/components/client/layout/NavMain"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail
} from "@/components/ui/sidebar"
import { NewDropDown } from "../NewDropdown"
import type { NavItem } from "@/components/admin/layout/AdminSidebar"
import { useTranslation } from "react-i18next"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { t } = useTranslation()

  const navMainItems: NavItem[] = [
    {
      title: t('nav.home'),
      url: "/",
      icon: Home,
      access: true
    },
    {
      title: t('nav.my_files'),
      url: "/my-files",
      icon: Box,
      access: true
    },
    {
      title: t('nav.recent'),
      url: "/recent",
      icon: Clock,
      access: true
    },
    {
      title: t('nav.shared'),
      url: "/shared",
      icon: Users,
      access: true
    },
    {
      title: t('nav.trash'),
      url: "/trash",
      icon: Trash,
      access: true
    },
  ]

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
