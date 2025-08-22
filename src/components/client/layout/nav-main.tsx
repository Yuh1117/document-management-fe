import { type LucideIcon } from "lucide-react"

import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Link, useLocation } from "react-router"

export function NavMain({
    items,
}: {
    items: {
        title: string
        url: string
        icon: LucideIcon
    }[]
}) {
    const location = useLocation();

    return (
        <SidebarGroup>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.url}>
                        <SidebarMenuButton tooltip={item.title} asChild isActive={location.pathname === item.url} className="p-5">
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