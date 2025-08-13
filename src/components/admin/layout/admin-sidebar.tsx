import * as React from "react"
import {
  ChartPie,
  Lock,
  Settings2,
  Shield,
  User,
} from "lucide-react"
import { type LucideIcon } from "lucide-react"

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
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { ALL_PERMISSIONS } from "@/config/permissions"
import { fetchPermissions } from "@/redux/reducers/permissionSlice"

export type NavItem = {
  title: string,
  url: string,
  icon: LucideIcon,
  access: boolean,
  permission?: {
    name: string,
    apiPath: string,
    method: string,
    module: string
  }
}

const navMainItems: NavItem[] = [
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
    access: false,
    permission: ALL_PERMISSIONS.SETTINGS.LIST
  },
  {
    title: "Người dùng",
    url: "/admin/users",
    icon: User,
    access: false,
    permission: ALL_PERMISSIONS.USERS.LIST
  },
  {
    title: "Vai trò",
    url: "/admin/roles",
    icon: Shield,
    access: false,
    permission: ALL_PERMISSIONS.ROLES.LIST
  },
  {
    title: "Quyền",
    url: "/admin/permissions",
    icon: Lock,
    access: false,
    permission: ALL_PERMISSIONS.PERMISSIONS.LIST
  },
]

export function AdminSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const user = useAppSelector((state) => state.users.user);
  const permissions = useAppSelector((state) => state.permissions.permissionsMap);
  const dispatch = useAppDispatch();
  const [navItems, setNavItems] = React.useState<NavItem[]>(navMainItems);

  React.useEffect(() => {
    const permissionsToCheck = navMainItems.flatMap(item =>
      item.permission ? [{ apiPath: item.permission.apiPath, method: item.permission.method }] : []
    );

    dispatch(fetchPermissions(permissionsToCheck));
  }, [dispatch]);

  React.useEffect(() => {
    const updatedNav = navMainItems.map((item) => {
      if (!item.permission) return { ...item, access: true };
      const key = `${item.permission.apiPath}|${item.permission.method.toUpperCase()}`;
      return {
        ...item,
        access: permissions?.[key] === true,
      };
    });
    setNavItems(updatedNav);
  }, [permissions]);

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