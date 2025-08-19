import { useMemo } from "react";
import { useAppSelector } from "@/redux/hooks";
import { endpoints } from "@/config/Api";
import { Spinner } from "@/components/ui/spinner";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Toaster } from "sonner";
import Document from "@/components/client/document/document";
import Folder from "@/components/client/folder/folder";
import { useFilesLoader } from "@/hooks/useFilesLoader";
import { useDetailSheet } from "@/hooks/useDetailSheet";

const TrashFilesPage = () => {
    const { reloadFlag } = useAppSelector(state => state.files);
    const { files, loading, hasMore, observerRef } = useFilesLoader(endpoints["trash-files"], reloadFlag);
    const details = useDetailSheet();

    const folders = useMemo(() => files.filter((f) => f.type === "folder"), [files]);
    const documents = useMemo(() => files.filter((f) => f.type === "document"), [files]);

    return (
        <div className="bg-muted dark:bg-sidebar flex flex-col rounded-xl p-2 select-none">
            <Toaster richColors position="top-center" />

            <div className="bg-muted/60 backdrop-blur flex items-center justify-between rounded-xl p-4 border-b">
                <div className="flex items-center gap-4">
                    <SidebarTrigger />
                    <h1 className="text-2xl font-semibold">Thùng rác</h1>
                </div>
                <div className="cursor-pointer p-2 rounded-xl hover:bg-input/50 dark:hover:bg-input/50">
                    Dọn sạch thùng rác
                </div>
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

        </div >
    );
};

export default TrashFilesPage;