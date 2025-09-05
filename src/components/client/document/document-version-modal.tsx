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
import { EllipsisVertical } from "lucide-react"
import type { IDocument, IDocumentVersion } from "@/types/type"
import { authApis, endpoints } from "@/config/Api"
import { cn } from "@/lib/utils"
import { Spinner } from "@/components/ui/spinner"
import { formatTime } from "@/config/utils"

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

    useEffect(() => {
        if (page > 0)
            loadVersions();
    }, [page, loadKey]);

    useEffect(() => {
        if (open) {
            setDocumentVersions([])
            setPage(1)
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
                        <div className={cn("flex items-center justify-between w-full px-3 py-2 text-left rounded-md hover:bg-accent")}>
                            <div className="flex flex-col">
                                <div>
                                    Phiên bản hiện tại <span className="text-muted-foreground text-sm">{data?.name}</span>
                                </div>
                            </div>
                            <EllipsisVertical className="h-4 w-4 text-muted-foreground" />
                        </div>
                        {documentVersions.length > 0 && documentVersions.map((d) => <div key={d.id}
                            className={cn("flex items-center justify-between w-full px-3 py-2 text-left rounded-md hover:bg-accent")}
                        >
                            <div className="flex flex-col">
                                <div>
                                    Phiên bản {d.versionNumber} <span className="text-muted-foreground text-sm">{d.name}</span>
                                </div>
                                <div className="text-muted-foreground text-xs">
                                    {formatTime(d.createdAt)}
                                </div>
                            </div>
                            <EllipsisVertical className="h-4 w-4 text-muted-foreground" />
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