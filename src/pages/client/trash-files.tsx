import { useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { authApis, endpoints } from "@/config/Api";
import { Spinner } from "@/components/ui/spinner";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast, Toaster } from "sonner";
import Document from "@/components/client/document/document";
import Folder from "@/components/client/folder/folder";
import { useFilesLoader } from "@/hooks/use-files-loader";
import { useDetailSheet } from "@/hooks/use-detail-sheet";
import { triggerReload } from "@/redux/reducers/filesSlice";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const TrashFilesPage = () => {
    const { reloadFlag } = useAppSelector(state => state.files);
    const { files, loading, hasMore, observerRef } = useFilesLoader(endpoints["trash-files"], reloadFlag);
    const details = useDetailSheet();
    const [cleaning, setCleaning] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false)
    const dispatch = useAppDispatch()

    const handleCleanTrash = async () => {
        try {
            setCleaning(true)

            await authApis().delete(endpoints["files-delete-permanent"]);
            
            setOpen(false)
            dispatch(triggerReload())
            toast.success("Đã dọn sạch thùng rác", {
                duration: 2000
            })
        } catch (error) {
            console.log(error)
            toast.error("Dọn thất bại", {
                duration: 2000
            })
        } finally {
            setCleaning(false)
        }

    }

    const folders = useMemo(() => files.filter((f) => f.type === "folder"), [files]);
    const documents = useMemo(() => files.filter((f) => f.type === "document"), [files]);

    return (
        <div className="bg-muted dark:bg-muted flex flex-col rounded-xl p-2 select-none">
            <Toaster richColors position="top-center" />

            <div className="bg-muted/60 backdrop-blur flex items-center justify-between rounded-xl p-4 border-b">
                <div className="flex items-center gap-4">
                    <SidebarTrigger />
                    <h1 className="text-2xl font-semibold">Thùng rác</h1>
                </div>
                {cleaning ? <Spinner /> : <div className="cursor-pointer p-2 rounded-xl hover:bg-input/50 dark:hover:bg-input/50"
                    onClick={() => {
                        if (documents.length === 0 && folders.length === 0) return;
                        setOpen(true);
                    }} >
                    Dọn sạch thùng rác
                </div>}
            </div>

            <ScrollArea className="p-2 h-[calc(100vh-160px)]">
                {files.length === 0 && !loading ? (
                    <div className="flex justify-center items-center py-8 text-muted-foreground">
                        Không có dữ liệu
                    </div>
                ) : (
                    <>
                        {folders.length > 0 && (
                            <div className="mb-6">
                                <h2 className="text-lg mb-2">Thư mục</h2>
                                <div className="grid grid-cols-[repeat(auto-fill,_minmax(220px,_1fr))] gap-4 px-2 py-4">
                                    {folders.map((f) => (
                                        <Folder
                                            key={`folder-${f.folder.id}`}
                                            data={f.folder}
                                            setLoadingDetail={details.setLoadingFolderDetail}
                                            setFolderDetail={details.setFolderDetail}
                                            setIsSheetOpen={details.setIsFolderSheetOpen}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {documents.length > 0 && (
                            <div>
                                <h2 className="text-lg mb-2">Tài liệu</h2>
                                <div className="grid grid-cols-[repeat(auto-fill,_minmax(220px,_1fr))] gap-4 px-2 py-4">
                                    {documents.map((f) => (
                                        <Document
                                            key={`doc-${f.document.id}`}
                                            data={f.document}
                                            setIsSheetOpen={details.setIsDocumentSheetOpen}
                                            setDocumentDetail={details.setDocumentDetail}
                                            setLoadingDetail={details.setLoadingDocumentDetail}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}

                {loading && (
                    <div className="flex justify-center items-center py-8">
                        <Spinner />
                    </div>
                )}

                {hasMore && !loading && <div ref={observerRef} className="h-10" />}

                {!hasMore && files.length > 0 && (
                    <p className="text-center text-muted-foreground py-4">Đã tải hết</p>
                )}
            </ScrollArea>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent aria-describedby={undefined}>
                    <DialogHeader>
                        <DialogTitle>Xóa vĩnh viễn</DialogTitle>
                        <DialogDescription>
                            Tất cả các mục trong thùng rác sẽ bị xóa vĩnh viễn.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(false)}>Hủy</Button>
                        <Button variant="destructive" onClick={handleCleanTrash} disabled={cleaning}>
                            {cleaning ? <Spinner size={16} /> : "Xác nhận"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div >
    );
};

export default TrashFilesPage;