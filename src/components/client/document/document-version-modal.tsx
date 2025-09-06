import { useState, useEffect, useRef } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Download, EllipsisVertical } from "lucide-react"
import type { IDocument, IDocumentVersion } from "@/types/type"
import { authApis, endpoints } from "@/config/Api"
import { cn } from "@/lib/utils"
import { Spinner } from "@/components/ui/spinner"
import { formatTime } from "@/config/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "sonner"

type Props = {
    data: IDocument | null,
    open: boolean,
    onOpenChange: (open: boolean) => void,
}

const DocumentVersionModal = ({ data, open, onOpenChange }: Props) => {
    const [documentVersions, setDocumentVersions] = useState<IDocumentVersion[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [page, setPage] = useState<number>(1);
    const [loadKey, setLoadKey] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [downloading, setDownloading] = useState<boolean>(false);
    const [dropdownOpen, setDropdownOpen] = useState<string | number | null>(null);
    const observerRef = useRef<HTMLDivElement | null>(null);

    const loadVersions = async () => {
        if (!data) return

        try {
            setLoading(true);

            let url = `${endpoints['document-version'](data.id)}?page=${page}`;

            const res = await authApis().get(url);
            const dataRes = res.data.data;

            setDocumentVersions((prev) => [...prev, ...dataRes.result]);
            setHasMore(dataRes.currentPage < dataRes.totalPages);
            if (dataRes.currentPage >= dataRes.totalPages) setPage(0);
        } catch (error) {
            console.error("Lỗi khi tải phiên bản tài liệu", error);
            setHasMore(false);
            setPage(0);
        } finally {
            setLoading(false);
        }
    }

    const handleDownload = async (version: IDocumentVersion | null) => {
        if (!data) return;

        try {
            setDownloading(true)

            let endpoint: string = "";
            if (version) {
                endpoint = endpoints["download-document-version"](data.id, version.id);
            } else {
                endpoint = endpoints["download-single-document"](data.id)
            }

            const res = await authApis().get(endpoint, {
                responseType: "blob",
            });

            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement("a");

            link.href = url;
            link.setAttribute("download", version ? version.name : data.name);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            toast.success("Tải về thành công", {
                duration: 2000
            })
        } catch (error) {
            console.error("Tải xuống thất bại:", error);
            toast.error("Tải về thất bại", {
                duration: 2000
            })
        } finally {
            setDownloading(false)
        }
    };

    const handleDropdownChange = (versionId: string | number) => {
        setDropdownOpen(dropdownOpen === versionId ? null : versionId)
    };

    useEffect(() => {
        if (page > 0)
            loadVersions();
    }, [page, loadKey]);

    useEffect(() => {
        if (open) {
            setDocumentVersions([])
            setPage(1)
            setDropdownOpen(null)
            setLoadKey((prev) => !prev)
        }
    }, [open])

    useEffect(() => {
        if (!hasMore || loading) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && page > 0 && !loading) {
                    setPage((prev) => prev + 1);
                }
            },
            { threshold: 1.0 }
        );
        if (observerRef.current) observer.observe(observerRef.current);
        return () => {
            if (observerRef.current) observer.unobserve(observerRef.current);
        };
    }, [hasMore, loading, page]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg" aria-describedby={undefined}>
                <DialogHeader>
                    <DialogTitle>Quản lý phiên bản "{data?.name}"</DialogTitle>
                </DialogHeader>

                <DialogDescription>
                    Các phiên bản.
                </DialogDescription>

                <ScrollArea className="h-64 border rounded-lg select-none">
                    <div className="space-y-1 p-1">
                        <div className={cn("flex items-center justify-between w-full px-3 py-2 text-left rounded-md hover:bg-accent",
                            dropdownOpen === "current" && "bg-input/50")}>
                            <div className="flex flex-col">
                                <div>
                                    Phiên bản hiện tại <span className="text-muted-foreground text-sm">{data?.name}</span>
                                </div>
                            </div>
                            <DropdownMenu onOpenChange={() => handleDropdownChange("current")}>
                                <DropdownMenuTrigger asChild>
                                    <div className="cursor-pointer hover:bg-background/90 p-1 rounded-xl">
                                        <EllipsisVertical size={16} />
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => handleDownload(null)}>
                                        <Download className="text-black-900" />
                                        <span>Tải về</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        {documentVersions.length > 0 && documentVersions.map((d) => <div key={d.id}
                            className={cn("flex items-center justify-between w-full px-3 py-2 text-left rounded-md hover:bg-accent",
                                dropdownOpen === d.id && "bg-input/50")}
                        >
                            <div className="flex flex-col">
                                <div>
                                    Phiên bản {d.versionNumber} <span className="text-muted-foreground text-sm">{d.name}</span>
                                </div>
                                <div className="text-muted-foreground text-xs">
                                    {formatTime(d.createdAt)}
                                </div>
                            </div>
                            <DropdownMenu onOpenChange={() => handleDropdownChange(d.id)}>
                                <DropdownMenuTrigger asChild>
                                    <div className="cursor-pointer hover:bg-background/90 p-1 rounded-xl">
                                        <EllipsisVertical size={16} />
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => handleDownload(d)}>
                                        <Download className="text-black-900" />
                                        <span>Tải xuống</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
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
                        Đóng
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DocumentVersionModal;