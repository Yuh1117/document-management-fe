import React, { useMemo } from "react";
import { Menu, Search } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, } from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Input } from "@/components/ui/input";
import Setting from "../settings/setting";
import { Link } from "react-router";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logout } from "@/redux/reducers/userSlide";

interface MenuItem {
    title: string;
    url: string;
    icon?: React.ReactNode;
    items?: MenuItem[];
}

interface NavBarProps {
    logo?: {
        url: string;
        title: string;
    };
    menu?: MenuItem[];
}

const SubMenuLink = ({ item }: { item: MenuItem }) => {
    return (
        <a
            className="flex flex-row gap-2 rounded-md p-3 min-w-[150px] transition-colors hover:bg-muted hover:text-accent-foreground"
            href={item.url}
        >
            <div className="text-foreground">{item.icon}</div>
            <div className="flex flex-col">
                <span className="text-sm font-medium">{item.title}</span>
            </div>
        </a>
    )
};

const SearchInput = () => {
    return (
        <div className="relative w-full max-w-lg">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
                type="text"
                placeholder="Tìm kiếm"
                className="pl-9 py-5"
            />
        </div>
    )
};

const Account = ({ user }: { user: any }) => {
    const dispatch = useAppDispatch();

    if (user) {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Avatar className="w-10 h-10 cursor-pointer">
                        <AvatarImage src={user.avatar} alt="avatar" />
                        <AvatarFallback className="rounded-lg">a</AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="mr-2">
                    <DropdownMenuLabel>
                        <div className="flex flex-col">
                            <span>{`${user.lastName} ${user.firstName}`}</span>
                            <span className="text-muted-foreground truncate text-xs">
                                {user.email}
                            </span>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuItem className="font-medium">
                            Tài khoản
                        </DropdownMenuItem>
                        <DropdownMenuItem className="font-medium">
                            Thông báo
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => dispatch(logout())} className="font-medium">
                        <span className="text-red-500">Đăng xuất</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        )
    }
};

const Header = ({
    logo = {
        url: "",
        title: "DMS",
    },
    menu = [
        {
            title: "Resources",
            url: "#",
            items: [
                { title: "Help Center", url: "#" },
                { title: "Contact Us", url: "#" },
                { title: "Status", url: "#" },
                { title: "Terms of Service", url: "#" },
            ],
        },
    ],
}: NavBarProps) => {
    const user = useAppSelector(state => state.users.user);

    const desktopMenu = useMemo(() => (
        menu.map((item) =>
            item.items ? (
                <NavigationMenuItem key={item.title}>
                    <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
                    <NavigationMenuContent className="bg-popover text-popover-foreground">
                        {item.items.map((subItem) => (
                            <NavigationMenuLink asChild key={subItem.title}>
                                <SubMenuLink item={subItem} />
                            </NavigationMenuLink>
                        ))}
                    </NavigationMenuContent>
                </NavigationMenuItem>
            ) : (
                <NavigationMenuItem key={item.title}>
                    <NavigationMenuLink
                        href={item.url}
                        className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-accent-foreground"
                    >
                        {item.title}
                    </NavigationMenuLink>
                </NavigationMenuItem>
            )
        )
    ), [menu]);

    const mobileMenu = useMemo(() => (
        menu.map((item) =>
            item.items ? (
                <AccordionItem key={item.title} value={item.title} className="border-b-0">
                    <AccordionTrigger className="text-md py-0 font-semibold hover:no-underline">
                        {item.title}
                    </AccordionTrigger>
                    <AccordionContent className="mt-2">
                        {item.items.map((subItem) => (
                            <SubMenuLink key={subItem.title} item={subItem} />
                        ))}
                    </AccordionContent>
                </AccordionItem>
            ) : (
                <a key={item.title} href={item.url} className="text-md font-semibold">
                    {item.title}
                </a>
            )
        )
    ), [menu]);

    return (
        <section className="py-3 sticky top-0 z-50 bg-background">
            <div className="mx-auto px-4">
                <nav className="hidden justify-between lg:flex items-center">
                    <div className="flex items-center gap-6">
                        <Link to={logo.url} className="flex items-center gap-2">
                            <span className="text-lg font-semibold tracking-tighter">
                                {logo.title}
                            </span>
                        </Link>
                        <div className="flex items-center">
                            <NavigationMenu>
                                <NavigationMenuList>
                                    {desktopMenu}
                                </NavigationMenuList>
                            </NavigationMenu>
                        </div>
                    </div>

                    <div className="flex-1 flex justify-center">
                        <SearchInput />
                    </div>

                    <div className="flex gap-3">
                        <Setting />
                        <Account user={user} />
                    </div>
                </nav>

                <div className="block lg:hidden">
                    <div className="flex items-center justify-between">
                        <a href={logo.url} className="flex items-center gap-2">
                            <span className="text-lg font-semibold tracking-tighter">
                                {logo.title}
                            </span>
                        </a>
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" size="icon">
                                    <Menu className="size-4" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent className="overflow-y-auto">
                                <SheetHeader>
                                    <SheetTitle>
                                        <a href={logo.url} className="flex items-center gap-2">
                                            <span className="text-lg font-semibold tracking-tighter">
                                                {logo.title}
                                            </span>
                                        </a>
                                    </SheetTitle>
                                </SheetHeader>
                                <div className="flex flex-col gap-6 p-4">
                                    <Accordion
                                        type="single"
                                        collapsible
                                        className="flex w-full flex-col gap-4"
                                    >
                                        {mobileMenu}
                                    </Accordion>

                                    <SearchInput />

                                    <div className="flex gap-3">
                                        <Setting />
                                        <Account user={user} />
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Header;