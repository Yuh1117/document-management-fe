"use client"

import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Check, ChevronsUpDown, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { ScrollArea } from "../ui/scroll-area"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command"
import MultiEmailInput from "./multi-input-email"

interface Person {
    name: string
    email: string
    avatar: string
    permission: string
}

const initialPeople: Person[] = [
    {
        name: "Olivia Martin",
        email: "m@example.com",
        avatar: "/avatars/03.png",
        permission: "view",
    },
    {
        name: "Isabella Nguyen",
        email: "b@example.com",
        avatar: "/avatars/04.png",
        permission: "view",
    },
    {
        name: "Sofia Davis",
        email: "p@example.com",
        avatar: "/avatars/05.png",
        permission: "view",
    },
    {
        name: "Ethan Thompson",
        email: "e@example.com",
        avatar: "/avatars/01.png",
        permission: "view",
    },
]

const initialGroups = [
    {
        name: "Group 1",
        permission: "view",
    },
    {
        name: "Group 2",
        permission: "view",
    },
    {
        name: "Group 3",
        permission: "view",
    },
    {
        name: "Group 4",
        permission: "view",
    },
]

const ShareModal = () => {
    const [emails, setEmails] = useState<string[]>([])
    const [people, setPeople] = useState<Person[]>(initialPeople)
    const [groups, setGroups] = useState(initialGroups)
    const [permission, setPermission] = useState<string>("view")
    const [value, setValue] = useState<string>("")
    const [open, setOpen] = useState<boolean>(false)

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Share Document</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Chia sẻ ""</DialogTitle>
                    <DialogDescription>Thêm người, nhóm và quản lý quyền truy cập.</DialogDescription>
                </DialogHeader>
                <Tabs defaultValue="people">
                    <TabsList className="mb-1">
                        <TabsTrigger value="people">Người dùng</TabsTrigger>
                        <TabsTrigger value="group">Nhóm</TabsTrigger>
                    </TabsList>

                    <TabsContent value="people">
                        <div className="flex items-center gap-2">
                            <MultiEmailInput
                                onChange={(emails) => console.log("Emails:", emails)}
                                emails={emails}
                                setEmails={setEmails}
                            />

                            <Select value={permission} onValueChange={setPermission}>
                                <SelectTrigger className="w-[120px] h-8 text-sm">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="view">Xem</SelectItem>
                                    <SelectItem value="edit">Chỉnh sửa</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Separator className="my-4" />

                        <div className="flex flex-col gap-4">
                            <div className="text-sm font-medium">Những người có quyền truy cập</div>
                            <ScrollArea className="h-50 p-3">
                                <div className="grid gap-6">
                                    {people.map((person, index) => (
                                        <div key={index} className="flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-4">
                                                <Avatar className="w-10 h-10">
                                                    <AvatarImage src={person.avatar || "/placeholder.svg"} alt="avatar" />
                                                    <AvatarFallback className="rounded-lg">a</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="text-sm font-medium leading-none">{person.name}</p>
                                                    <p className="text-sm text-muted-foreground">{person.email}</p>
                                                </div>
                                            </div>
                                            <Select
                                                value={person.permission}
                                                onValueChange={(value) => {
                                                    const updated = [...people]
                                                    updated[index].permission = value
                                                    setPeople(updated)
                                                }}
                                            >
                                                <SelectTrigger className="w-[120px] h-8 text-sm">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="view">Xem</SelectItem>
                                                    <SelectItem value="edit">Chỉnh sửa</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </div>
                    </TabsContent>

                    <TabsContent value="group">
                        <div className="flex items-center gap-2">
                            <Popover open={open} onOpenChange={setOpen} modal={true}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={open}
                                        className="w-[200px] justify-between bg-transparent"
                                    >
                                        {value ? groups.find((g) => g.name === value)?.name : "Chọn nhóm"}
                                        <ChevronsUpDown className="opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[200px] p-0 z-[60]" side="bottom" align="start">
                                    <Command>
                                        <CommandInput placeholder="Search framework..." className="h-9" autoFocus />
                                        <CommandList>
                                            <CommandEmpty>No dataas</CommandEmpty>
                                            <CommandGroup>
                                                {groups.map((g, index) => (
                                                    <CommandItem
                                                        key={index}
                                                        value={g.name}
                                                        onSelect={(currentValue) => {
                                                            setValue(currentValue === value ? "" : currentValue)
                                                            setOpen(false)
                                                        }}
                                                        className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
                                                    >
                                                        {g.name}
                                                        <Check className={cn("ml-auto", value === g.name ? "opacity-100" : "opacity-0")} />
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            <Select value={permission} onValueChange={setPermission}>
                                <SelectTrigger className="w-[120px] h-8 text-sm">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="view">Xem</SelectItem>
                                    <SelectItem value="edit">Chỉnh sửa</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Separator className="my-4" />

                        <div className="flex flex-col gap-4">
                            <div className="text-sm font-medium">Những nhóm có quyền truy cập</div>
                            <ScrollArea className="h-50 p-3">
                                <div className="grid gap-6">
                                    {groups.map((g, index) => (
                                        <div key={index} className="flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-3">
                                                <Users size={16} />
                                                <div>
                                                    <p className="text-sm font-medium leading-none">{g.name}</p>
                                                </div>
                                            </div>
                                            <Select value={g.permission}
                                                onValueChange={(value) => {
                                                    const updated = [...groups]
                                                    updated[index].permission = value
                                                    setGroups(updated)
                                                }}>
                                                <SelectTrigger className="w-[120px] h-8 text-sm">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="view">Xem</SelectItem>
                                                    <SelectItem value="edit">Chỉnh sửa</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </div>
                    </TabsContent>
                </Tabs>

                <Separator />

                <DialogFooter>
                    <Button variant="outline">OK</Button>
                    <Button>Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ShareModal