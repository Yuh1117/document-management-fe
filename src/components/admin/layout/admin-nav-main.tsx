"use client"

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
        icon: LucideIcon,
        access: boolean
    }[]
}) {
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
