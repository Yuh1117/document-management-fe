import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/Sidebar"
import { Link, useLocation } from "react-router"
import type { NavItem } from "./AdminSidebar";

export function NavMain({ items }: { items: NavItem[] }) {
    const location = useLocation();

    return (
        <SidebarGroup>
            <SidebarMenu>
                {items.map((item) => (
                    item.access && <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild tooltip={item.title} isActive={location.pathname === item.url} className="py-5">
                            <Link to={item.url}>
                                <item.icon />
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    )
}
