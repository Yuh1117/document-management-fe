'use client'

import * as React from 'react'
import { ChartPie, Lock, MessageSquareMore, Settings2, Shield, User } from 'lucide-react'
import { type LucideIcon } from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { NavUser } from './NavUser'
import { NavMain } from './AdminNavMain'
import { useAuthStore } from '@/store/authStore'
import { usePermissionStore } from '@/store/permissionStore'
import { ALL_PERMISSIONS } from '@/constants/permissions'
import { useTranslation } from 'react-i18next'

export type NavItem = {
  title: string
  url: string
  icon: LucideIcon
  access: boolean
  permission?: { name: string; apiPath: string; method: string; module: string }
}

export function AdminSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const { t } = useTranslation()
  const user = useAuthStore((s) => s.user)
  const { permissionsMap, fetchPermissions } = usePermissionStore()

  const navMainItems: NavItem[] = [
    { title: t('admin.dashboard'), url: '/admin', icon: ChartPie, access: true },
    { title: t('admin.settings'), url: '/admin/settings', icon: Settings2, access: false, permission: ALL_PERMISSIONS.SETTINGS.LIST },
    { title: t('admin.users'), url: '/admin/users', icon: User, access: false, permission: ALL_PERMISSIONS.USERS.LIST },
    { title: t('admin.roles'), url: '/admin/roles', icon: Shield, access: false, permission: ALL_PERMISSIONS.ROLES.LIST },
    { title: t('admin.permissions'), url: '/admin/permissions', icon: Lock, access: false, permission: ALL_PERMISSIONS.PERMISSIONS.LIST },
    { title: t('admin.summary_feedback'), url: '/admin/summary-feedback', icon: MessageSquareMore, access: true },
  ]

  const [navItems, setNavItems] = React.useState<NavItem[]>(navMainItems)

  React.useEffect(() => {
    const permsToCheck = navMainItems.flatMap((item) =>
      item.permission ? [{ apiPath: item.permission.apiPath, method: item.permission.method }] : []
    )
    fetchPermissions(permsToCheck)
  }, [])

  React.useEffect(() => {
    const updated = navMainItems.map((item) => {
      if (!item.permission) return { ...item, access: true }
      const key = `${item.permission.apiPath}|${item.permission.method.toUpperCase()}`
      return { ...item, access: permissionsMap?.[key] === true }
    })
    setNavItems(updated)
  }, [permissionsMap])

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
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
