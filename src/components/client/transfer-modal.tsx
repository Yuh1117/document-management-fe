import { useMemo, useState, useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronRight, ArrowLeft, Folder } from "lucide-react"
import type { IDocument, IFolder } from "@/types/type"
import { toast } from "sonner"
import { useAppDispatch } from "@/redux/hooks"
import { triggerReload } from "@/redux/reducers/filesSlice"
import { authApis, endpoints } from "@/config/Api"
import { useFilesLoader } from "@/hooks/use-files-loader"
import { Spinner } from "../ui/spinner"
import { cn } from "@/lib/utils"
import { isDocument, isFolder } from "@/config/utils"

type Props = {
    data: IDocument | IFolder | null,
    open: boolean,
    onOpenChange: (open: boolean) => void,
    mode: "copy" | "move" | null
}

const rootEntries = [
    { id: 0, name: "Files của tôi", endpoint: endpoints["my-files"] },
]

const TransferModal = ({
    data,
    open,
    onOpenChange,
    mode
}: Props) => {
    const [selectedFolder, setSelectedFolder] = useState<number | null>(null)
    const [currentEndpoint, setCurrentEndpoint] = useState<string | null>(null)
    const [breadcrumb, setBreadcrumb] = useState<{ id: number, name: string }[]>([])
    const dispatch = useAppDispatch()
    const [transfering, setTransfering] = useState<boolean>(false)
    const { files, loading, hasMore, observerRef } = useFilesLoader(currentEndpoint, open)


    const handleTransfer = async () => {
        if (selectedFolder === null) return
        try {
            setTransfering(true)

            const targetFolderId = selectedFolder === 0 ? null : selectedFolder
            const req = {
                ids: [data?.id],
                targetFolderId: targetFolderId
            }

            let url = ""
            if (mode == "copy") {
                if (isDocument(data)) {
                    url = endpoints["copy-doc"]
                } else {
                    url = endpoints["copy-folder"]
                }
            } else {
                if (isDocument(data)) {
                    url = endpoints["move-doc"]
                } else {
                    url = endpoints["move-folder"]
                }
            }

            await authApis().post(url, req)

            dispatch(triggerReload())
            toast.success("Thành công")
            onOpenChange(false)
        } catch (error) {
            console.error("Lỗi khi di chuyển", error)
            toast.error("Thất bại")
        } finally {
            setTransfering(false)
        }
    }

    const folders = useMemo(() => files.filter((f) => f.type === "folder"), [files])

    const goBack = () => {
        if (breadcrumb.length === 0) return
        const newBreadcrumb = [...breadcrumb]
        newBreadcrumb.pop()
        setBreadcrumb(newBreadcrumb)

        if (newBreadcrumb.length === 0) {
            setCurrentEndpoint(null)
        } else {
            const last = newBreadcrumb.at(-1)!
            if (last.id > 0) {
                setCurrentEndpoint(endpoints["folder-files"](last.id))
            } else {
                const root = rootEntries.find(r => r.id === last.id)
                if (root) setCurrentEndpoint(root.endpoint)
            }
        }
    }

    useEffect(() => {
        if (open) {
            setSelectedFolder(null)
            setCurrentEndpoint(null)
            setBreadcrumb([])
        }
    }, [open])

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg" aria-describedby={undefined}>
                <DialogHeader>
                    <DialogTitle>
                        {mode == "copy" ? "Sao chép" : "Di chuyển"} "{data?.name}"
                    </DialogTitle>
                </DialogHeader>

                <Tabs defaultValue="all" className="w-full">
                    <TabsList className="grid grid-cols-3 w-full">
                        <TabsTrigger value="all">Tất cả vị trí</TabsTrigger>
                    </TabsList>
                </Tabs>

                <div className="flex items-center gap-2 py-2 px-1">
                    {breadcrumb.length > 0 && (
                        <Button variant="ghost" size="icon" className="rounded-xl" onClick={goBack}>
                            <ArrowLeft />
                        </Button>
                    )}
                    <div className="text-sm text-muted-foreground truncate">
                        {breadcrumb.map(b => b.name).join(" / ")}
                    </div>
                </div>

                <ScrollArea className="h-64 border rounded-lg select-none">
                    <div className="space-y-1 p-1">
                        {currentEndpoint === null ? (
                            rootEntries.map((root) => (
                                <div
                                    key={root.id}
                                    className={cn(
                                        "flex items-center justify-between w-full px-3 py-2 text-left rounded-md hover:bg-accent",
                                        selectedFolder === root.id ? "bg-accent" : ""
                                    )}
                                    onClick={() => setSelectedFolder(root.id)}
                                    onDoubleClick={() => {
                                        setCurrentEndpoint(root.endpoint)
                                        setBreadcrumb([{ id: root.id, name: root.name }])
                                    }}
                                >
                                    <span className="truncate">{root.name}</span>
                                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                </div>
                            ))
                        ) : folders.length === 0 && !loading ? (
                            <div className="flex justify-center items-center py-8 text-muted-foreground">
                                Không có dữ liệu
                            </div>
                        ) : (
                            folders.map((f) => {
                                const isInvalid = isFolder(data) && f.folder.id === data?.id

                                return <div
                                    key={f.folder.id}
                                    className={cn(
                                        "flex items-center justify-between w-full px-3 py-2 text-left rounded-md",
                                        selectedFolder === f.folder.id ? "bg-accent" : "", isInvalid ? "text-muted-foreground cursor-not-allowed" : "hover:bg-accent",
                                    )}
                                    onClick={() => {
                                        if (!isInvalid) setSelectedFolder(f.folder.id)
                                    }}
                                    onDoubleClick={() => {
                                        if (!isInvalid) {
                                            setCurrentEndpoint(endpoints["folder-files"](f.folder.id))
                                            setBreadcrumb([...breadcrumb, { id: f.folder.id, name: f.folder.name }])
                                        }
                                    }}
                                >
                                    <div className="flex items-center">
                                        <Folder size={18} className="me-2" />{f.folder.name}
                                    </div>
                                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                </div>
                            })
                        )}

                        {loading && (
                            <div className="flex justify-center items-center py-8">
                                <Spinner />
                            </div>
                        )}

                        {hasMore && !loading && <div ref={observerRef} className="h-10" />}

                    </div>
                </ScrollArea>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Hủy
                    </Button>
                    <Button disabled={selectedFolder === null || transfering} onClick={handleTransfer}>
                        {transfering ? <Spinner /> : mode == "copy" ? "Sao chép" : "Di chuyển"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default TransferModal