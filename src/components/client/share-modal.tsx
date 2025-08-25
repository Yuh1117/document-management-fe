import {
    Dialog,
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
import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Check, ChevronsUpDown, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { ScrollArea } from "../ui/scroll-area"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command"
import MultiEmailInput from "./multi-input-email"
import type { IDocument, IDocumentShare, IFolder, IFolderShare } from "@/types/type"
import { isDocument } from "@/config/utils"
import { authApis, endpoints } from "@/config/Api"
import { Spinner } from "../ui/spinner"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { resetPermission } from "@/redux/reducers/filesSlice"
import { toast } from "sonner"

const initialGroups = [
    {
        name: "Group 1",
        permission: "VIEW",
    },
    {
        name: "Group 2",
        permission: "VIEW",
    },
    {
        name: "Group 3",
        permission: "VIEW",
    },
    {
        name: "Group 4",
        permission: "VIEW",
    },
]

type Props = {
    data: IDocument | IFolder | null,
    open: boolean,
    onOpenChange: (open: boolean) => void,
}

interface Person {
    id: number
    name: string
    email: string
    avatar: string
    shareType: string
    remove: boolean
    originalShareType: string
}

const ShareModal = ({ data, open, onOpenChange }: Props) => {
    const [emails, setEmails] = useState<string[]>([])
    const [people, setPeople] = useState<Person[]>([])
    const [groups, setGroups] = useState(initialGroups)
    const [shareType, setShareType] = useState<string>("VIEW")
    const [value, setValue] = useState<string>("")
    const [openSelect, setOpenSelect] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const permission = useAppSelector(state => state.files.permission)
    const [sharing, setSharing] = useState<boolean>(false)
    const dispatch = useAppDispatch()

    const loadUserPermissions = async () => {
        if (!data) return;

        try {
            setLoading(true)

            let res;
            if (isDocument(data)) {
                res = await authApis().get(endpoints["share-doc-detail"](data.id))
                setPeople(
                    res.data.data
                        .filter((item: IDocumentShare) => item.user)
                        .map((item: IDocumentShare) => ({
                            id: item.user.id,
                            name: `${item.user.lastName} ${item.user.firstName}`,
                            email: item.user.email,
                            avatar: item.user.avatar,
                            shareType: item.shareType ?? "VIEW",
                            originalShareType: item.shareType ?? "VIEW",
                            remove: false
                        }))
                )
            } else {
                res = await authApis().get(endpoints["share-folder-detail"](data.id))
                setPeople(
                    res.data.data
                        .filter((item: IFolderShare) => item.user)
                        .map((item: IFolderShare) => ({
                            id: item.user.id,
                            name: `${item.user.lastName} ${item.user.firstName}`,
                            email: item.user.email,
                            avatar: item.user.avatar,
                            shareType: item.shareType ?? "VIEW",
                            originalShareType: item.shareType ?? "VIEW",
                            remove: false
                        }))
                )
            }

        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const saveShare = async (data: IDocument | IFolder, people: { email: string, shareType: string }[]): Promise<boolean> => {
        try {
            setSharing(true);

            let url = "";
            const payload: any = {
                shares: people
            };

            if (isDocument(data)) {
                payload["documentId"] = data.id;
                url = endpoints["share-doc"];
            } else {
                payload["folderId"] = data.id;
                url = endpoints["share-folder"];
            }

            await authApis().post(url, payload)

            toast.success("Chia sẻ thành công", {
                duration: 2000
            })
            return true
        } catch (error: any) {
            console.error("Lỗi khi chia sẻ", error);
            const errors = error.response.data.error;
            let errorMsg: string = "";

            if (error.response?.status === 400) {
                if (Array.isArray(errors)) {
                    errors.forEach((err: { field: string; message: string }) => {
                        errorMsg += err.message + "\n";
                    });
                } else {
                    errorMsg = errors
                }
            } else {
                errorMsg = "Lỗi hệ thống hoặc kết nối"
            }

            toast.error("Chia sẻ thất bại", {
                duration: 3000,
                description: errorMsg
            });
            return false
        } finally {
            setSharing(false);
        }
    }

    const removeShare = async (data: IDocument | IFolder, ids: number[]): Promise<boolean> => {
        try {
            setSharing(true);

            let url = "";

            if (isDocument(data)) {
                url = endpoints["share-doc-detail"](data.id);
            } else {
                url = endpoints["share-folder-detail"](data.id);
            }

            await authApis().delete(url, {
                data: ids
            })

            toast.success("Đã xoá quyền chia sẻ", {
                duration: 2000
            })
            return true
        } catch (error: any) {
            console.error("Lỗi khi xóa", error);
            toast.error("Xóa quyền thất bại", {
                duration: 3000,
            });
            return false
        } finally {
            setSharing(false);
        }
    }

    const handleShare = async () => {
        if (!data) return;

        const toRemove = people.filter(p => p.remove);
        const toUpdate = people.filter(p => !p.remove && p.shareType !== p.originalShareType);
        const hasNewEmails = emails.length > 0;

        if (toUpdate.length > 0 || hasNewEmails) {
            const newPeople: { email: string, shareType: string }[] = [
                ...toUpdate.map(p => ({ email: p.email, shareType: p.shareType })),
                ...emails.map(email => ({ email, shareType })),
            ];
            const success = await saveShare(data, newPeople);
            if (!success) return;
        }

        if (toRemove.length > 0) {
            const ids = toRemove.map(p => p.id);
            const success = await removeShare(data, ids);
            if (!success) return
        }

        reset();
    }

    const reset = () => {
        loadUserPermissions()
        setEmails([])
        setShareType("VIEW")
    }

    useEffect(() => {
        if (open) {
            reset()
        }
    }, [open])

    return (
        <Dialog open={open} onOpenChange={() => {
            onOpenChange(false)
            dispatch(resetPermission())
        }}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Chia sẻ "{data?.name}"</DialogTitle>
                    <DialogDescription>Thêm người, nhóm và quản lý quyền truy cập.</DialogDescription>
                </DialogHeader>
                <Tabs defaultValue="people">
                    <TabsList className="mb-1">
                        <TabsTrigger value="people">Người dùng</TabsTrigger>
                        <TabsTrigger value="group">Nhóm</TabsTrigger>
                    </TabsList>

                    <TabsContent value="people">
                        {(permission === "OWNER" || permission === "EDIT") && <div className="flex items-center gap-2">
                            <MultiEmailInput
                                emails={emails}
                                setEmails={setEmails}
                            />

                            <Select value={shareType} onValueChange={setShareType}>
                                <SelectTrigger className="w-[120px] h-8 text-sm">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="VIEW">Xem</SelectItem>
                                    <SelectItem value="EDIT">Chỉnh sửa</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>}

                        <Separator className="my-4" />

                        <div className="flex flex-col gap-4">
                            <div className="text-sm font-medium">Những người có quyền truy cập</div>
                            {loading ? (
                                <div className="flex justify-center items-center py-10">
                                    <Spinner size={28} />
                                </div>
                            ) : people.length === 0 ? (
                                <div className="flex justify-center items-center py-10 text-sm">
                                    Chưa chia sẻ cho ai
                                </div>
                            ) : <ScrollArea className="h-50 p-3">
                                <div className="grid gap-6">
                                    {people.map((person, index) => (
                                        <div key={person.id} className="flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-4">
                                                <Avatar className="w-10 h-10">
                                                    <AvatarImage src={person.avatar || "/placeholder.svg"} alt="avatar" />
                                                    <AvatarFallback className="rounded-lg">a</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className={cn("text-sm font-medium leading-none", person.remove && "line-through text-muted-foreground")}>
                                                        {person.name}
                                                    </p>
                                                    <p className={cn("text-sm text-muted-foreground", person.remove && "line-through")}>
                                                        {person.email}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Select
                                                    value={person.shareType}
                                                    onValueChange={(value) => {
                                                        const updated = [...people];
                                                        if (value === "remove") {
                                                            updated[index].remove = true;
                                                            updated[index].shareType = "remove"
                                                        } else {
                                                            updated[index].remove = false;
                                                            updated[index].shareType = value;
                                                        }
                                                        setPeople(updated);
                                                    }}
                                                    disabled={(permission !== "OWNER" && permission !== "EDIT")}
                                                >
                                                    <SelectTrigger className="w-[120px] h-8 text-sm">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="VIEW">Xem</SelectItem>
                                                        <SelectItem value="EDIT">Chỉnh sửa</SelectItem>
                                                        <SelectItem value="remove" className="text-red-500 focus:text-red-500 dark:focus:text-red-500">
                                                            Xóa quyền
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>}
                        </div>
                    </TabsContent>

                    <TabsContent value="group">
                        <div className="flex items-center gap-2">
                            <Popover open={openSelect} onOpenChange={setOpenSelect} modal={true}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={openSelect}
                                        className="w-[200px] justify-between bg-transparent"
                                    >
                                        {value ? groups.find((g) => g.name === value)?.name : "Chọn nhóm"}
                                        <ChevronsUpDown className="opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[200px] p-0 z-[60]" side="bottom" align="start">
                                    <Command>
                                        <CommandInput placeholder="Search" className="h-9" autoFocus />
                                        <CommandList>
                                            <CommandEmpty>No data</CommandEmpty>
                                            <CommandGroup>
                                                {groups.map((g, index) => (
                                                    <CommandItem
                                                        key={index}
                                                        value={g.name}
                                                        onSelect={(currentValue) => {
                                                            setValue(currentValue === value ? "" : currentValue)
                                                            setOpenSelect(false)
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
                            <Select value={shareType} onValueChange={setShareType}>
                                <SelectTrigger className="w-[120px] h-8 text-sm">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="VIEW">Xem</SelectItem>
                                    <SelectItem value="EDIT">Chỉnh sửa</SelectItem>
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
                                                    <SelectItem value="VIEW">Xem</SelectItem>
                                                    <SelectItem value="EDIT">Chỉnh sửa</SelectItem>
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
                    <Button variant="outline" onClick={() => {
                        onOpenChange(false)
                        dispatch(resetPermission())
                    }}>
                        OK
                    </Button>
                    {(permission === "OWNER" || permission === "EDIT") &&
                        <Button onClick={handleShare} disabled={sharing}>
                            {sharing ? <Spinner size={16} /> : "Lưu"}
                        </Button>
                    }
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ShareModal