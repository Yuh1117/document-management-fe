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
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

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

const frameworks = [
    {
        value: "next.js",
        label: "Next.js",
    },
    {
        value: "sveltekit",
        label: "SvelteKit",
    },
    {
        value: "nuxt.js",
        label: "Nuxt.js",
    },
    {
        value: "remix",
        label: "Remix",
    },
    {
        value: "astro",
        label: "Astro",
    },
]

const ShareModal = () => {
    const [people, setPeople] = useState<Person[]>(initialPeople)
    const [email, setEmail] = useState("")
    const [permission, setPermission] = useState("view")
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")

    const handleShare = () => {
        if (!email) return

        const newPerson: Person = {
            name: email.split("@")[0],
            email,
            avatar: "/avatars/placeholder.png",
            permission,
        }

        if (people.find((p) => p.email === email)) return

        setPeople([...people, newPerson])
        setEmail("")
        setPermission("view")
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Share Document</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Chia sẻ ""</DialogTitle>
                    <DialogDescription>
                        Thêm người, nhóm và quản lý quyền truy cập.
                    </DialogDescription>
                </DialogHeader>
                <Tabs defaultValue="people">
                    <TabsList>
                        <TabsTrigger value="people">Người dùng</TabsTrigger>
                        <TabsTrigger value="group">Nhóm</TabsTrigger>
                    </TabsList>

                    <TabsContent value="people">
                        <div className="flex items-center gap-2">
                            <Input
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="h-8 flex-1"
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

                            <div className="grid gap-6">
                                {people.map((person, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between gap-4"
                                    >
                                        <div className="flex items-center gap-4">
                                            <Avatar className="w-10 h-10">
                                                <AvatarImage src={person.avatar} alt="avatar" />
                                                <AvatarFallback className="rounded-lg">a</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="text-sm font-medium leading-none">
                                                    {person.name}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {person.email}
                                                </p>
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
                        </div>
                    </TabsContent>

                    <TabsContent value="group">
                        <div className="flex items-center gap-2">
                            <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={open}
                                        className="w-[200px] justify-between"
                                    >
                                        {value
                                            ? frameworks.find((framework) => framework.value === value)?.label
                                            : "Select framework..."}
                                        <ChevronsUpDown className="opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="z-[9999] w-[200px] p-0">
                                    
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

                            <div className="grid gap-6">
                                {frameworks.map((f, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between gap-4"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div>
                                                <p className="text-sm font-medium leading-none">
                                                    {f.label}
                                                </p>
                                            </div>
                                        </div>
                                        <Select>
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
                        </div>
                    </TabsContent>
                </Tabs>

                <Separator className="my-4" />

                <DialogFooter>
                    <Button variant="outline">
                        OK
                    </Button>
                    <Button>Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ShareModal