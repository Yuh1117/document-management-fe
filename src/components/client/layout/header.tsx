import { useMemo, useState } from "react";
import { Menu } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, } from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from "../../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Link, useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logout } from "@/redux/reducers/userSlice";
import logoImg from "@/assets/react.svg";
import Setting from "@/components/shared/settings/setting-button";
import type { IAccount } from "@/types/type";
import SearchBar from "./search";
import HideDataModal from "../document/hide-data-modal";

const logo = {
    url: "",
    title: "DMS",
    icon: <img src={logoImg} alt="Logo" />
}

const Account = ({ user }: { user: IAccount | null }) => {
    const dispatch = useAppDispatch();
    const nav = useNavigate();

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
                        {user.role.name.startsWith("ROLE_ADMIN") &&
                            <DropdownMenuItem className="font-medium" onClick={() => nav("/admin")}>
                                Admin
                            </DropdownMenuItem>
                        }
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

const Header = () => {
    const user = useAppSelector(state => state.users.user);
    const [openModal, setOpenModal] = useState<boolean>(false)

    const desktopMenu = useMemo(() => {
        return (
            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul>
                                <li>
                                    <NavigationMenuLink asChild onClick={() => setOpenModal(true)}>
                                        <Link to="#">Hide data</Link>
                                    </NavigationMenuLink>
                                    <NavigationMenuLink asChild>
                                        <Link to="#">Documentation</Link>
                                    </NavigationMenuLink>
                                    <NavigationMenuLink asChild>
                                        <Link to="#">Blocks</Link>
                                    </NavigationMenuLink>
                                </li>
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
        )
    }, [])

    const mobileMenu = useMemo(() => {
        return (
            <Accordion type="single" collapsible className="flex w-full flex-col gap-4">
                <AccordionItem value="item-1" className="border-b-0" >
                    <AccordionTrigger className="text-md py-0 font-semibold hover:no-underline">
                        Resources
                    </AccordionTrigger>
                    <AccordionContent className="mt-2">
                        <ul>
                            <li>
                                <Link to="#" className="flex  rounded-xl p-3 hover:bg-muted hover:text-accent-foreground">
                                    <span className="text-sm font-medium">Components</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="#" className="flex gap-2 rounded-xl p-3 hover:bg-muted hover:text-accent-foreground">
                                    <span className="text-sm font-medium">Documentation</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="#" className="flex gap-2 rounded-xl p-3 hover:bg-muted hover:text-accent-foreground">
                                    <span className="text-sm font-medium">Blocks</span>
                                </Link>
                            </li>
                        </ul>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        )
    }, [])

    return (
        <section className="py-3 sticky top-0 z-50 bg-background">
            <div className="mx-auto px-4">
                <nav className="hidden justify-between lg:flex items-center">
                    <div className="flex items-center gap-6">
                        <Link to={logo.url} className="flex items-center gap-2">
                            <span className="flex items-center gap-3 text-xl font-semibold tracking-tighter">
                                {logo.icon}
                                {logo.title}
                            </span>
                        </Link>
                        <div className="flex items-center">
                            {desktopMenu}
                        </div>
                    </div>

                    <div className="flex-1 flex justify-center">
                        <SearchBar />
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
                            <SheetContent className="overflow-y-auto" aria-describedby={undefined}>
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
                                    {mobileMenu}

                                    <SearchBar />

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

            <HideDataModal
                open={openModal}
                onOpenChange={setOpenModal}
            />
        </section>
    );
};

export default Header;