'use client'

import { ChevronsUpDown } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { useAuthStore } from '@/store/authStore'
import api, { endpoints } from '@/lib/api'
import type { IAccount } from '@/types/type'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'

export function NavUser({ user }: { user: IAccount | null }) {
  const { isMobile } = useSidebar()
  const { clearAuth } = useAuthStore()
  const nav = useRouter()
  const { t } = useTranslation()

  const handleLogout = async () => {
    try {
      await api.post(endpoints['logout'])
    } catch {}
    clearAuth()
    nav.push('/login')
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src={user?.avatar} alt="avatar" />
                <AvatarFallback className="rounded-lg">a</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{`${user?.lastName} ${user?.firstName}`}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>{`${user?.lastName} ${user?.firstName}`}</span>
                <span className="text-muted-foreground truncate text-xs">{user?.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="font-medium" onClick={() => nav.push('/')}>
                {t('pages.home')}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="font-medium">
              <span className="text-red-500">{t('nav.logout')}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
