import Document from "@/components/client/document/document";
import DocumentDetail from "@/components/client/document/document-detail";
import DocumentModal from "@/components/client/document/document-modal";
import Folder from "@/components/client/folder/folder";
import FolderDetail from "@/components/client/folder/folder-detail";
import FolderModal from "@/components/client/folder/folder-modal";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Spinner } from "@/components/ui/spinner";
import { authApis, endpoints } from "@/config/Api";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { closeDocumentModal, closeFolderModal } from "@/redux/reducers/filesSlice";
import type { IDocument, IFileItem, IFolder } from "@/types/type";
import { Download, ListChecks, X } from "lucide-react";
import { useEffect, useState, useMemo, useRef } from "react";
import { useParams } from "react-router";
import { toast, Toaster } from "sonner";

const Files = ({ mode }: { mode: string }) => {
    const [files, setFiles] = useState<IFileItem[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [isFolderSheetOpen, setIsFolderSheetOpen] = useState<boolean>(false);
    const [folderDetail, setFolderDetail] = useState<IFolder | null>(null);
    const [loadingFolderDetail, setLoadingFolderDetail] = useState<boolean>(false);
    const [isDocumentSheetOpen, setIsDocumentSheetOpen] = useState<boolean>(false);
    const [documentDetail, setDocumentDetail] = useState<IDocument | null>(null);
    const [loadingDocumentDetail, setLoadingDocumentDetail] = useState<boolean>(false);
    const [selectedDocs, setSelectedDocs] = useState<number[]>([]);
    const [selectedFolders, setSelectedFolders] = useState<number[]>([]);
    const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
    const [downloading, setDownloading] = useState<boolean>(false);
    const { id } = useParams<{ id: string }>()
    const { reloadFlag, folderModal, documentModal } = useAppSelector(state => state.files)
    const dispatch = useAppDispatch()

    const buildUrl = () => {
        switch (mode) {
            case "my-files":
                return `${endpoints["my-files"]}?page=${page}`;
            case "folder":
                return `${endpoints["folder-files"](id!)}?page=${page}`;
            default:
                return "";
        }
    };

    const loadFiles = async () => {
        try {
            setLoading(true);
            const url = buildUrl();
            if (!url) return;

            const res = await authApis().get(url);
            const data = res.data.data;

            setFiles((prev) => [...prev, ...data.result]);
            setHasMore(data.currentPage < data.totalPages);

            if (data.currentPage >= data.totalPages) {
                setPage(0);
            }
        } catch (error) {
            console.error(error);
            setHasMore(false);
            setPage(0);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadSelected = async () => {
        if (selectedDocs.length === 0 && selectedFolders.length === 0) return;

        try {
            setDownloading(true);

            if (selectedDocs.length !== 0 && selectedFolders.length === 0) {
                const res = await authApis().post(endpoints["download-multiple-documents"], selectedDocs,
                    { responseType: "blob" }
                );

                const blob = new Blob([res.data], { type: "application/zip" });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement("a");

                link.href = url;
                link.setAttribute("download", "documents.zip");
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(url);

                toast.success("Tải về thành công", {
                    duration: 2000
                })

                setSelectedDocs([]);
                setIsMultiSelectMode(false);

            } else if (selectedDocs.length === 0 && selectedFolders.length !== 0) {
                const res = await authApis().post(endpoints["download-multiple-folders"], selectedFolders,
                    { responseType: "blob" }
                );

                const blob = new Blob([res.data], { type: "application/zip" });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement("a");

                link.href = url;
                link.setAttribute("download", "folders.zip");
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(url);

                toast.success("Tải về thành công", {
                    duration: 2000
                })

                setSelectedFolders([]);
                setIsMultiSelectMode(false);

            } else {
                const data: { [key: string]: number[] } = {
                    folderIds: selectedFolders,
                    documentIds: selectedDocs
                }

                const res = await authApis().post(endpoints["download-multiple-files"], data,
                    { responseType: "blob" }
                );

                const blob = new Blob([res.data], { type: "application/zip" });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement("a");

                link.href = url;
                link.setAttribute("download", "folders-documents.zip");
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(url);

                toast.success("Tải về thành công", {
                    duration: 2000
                })

                setSelectedFolders([]);
                setSelectedDocs([])
                setIsMultiSelectMode(false);
            }
        } catch (error) {
            console.log("Download error", error)
            toast.error("Tải về thất bại", {
                duration: 2000
            })
        } finally {
            setDownloading(false)
        }
    };

    useEffect(() => {
        if (page > 0) {
            loadFiles();
        }
    }, [page, id, mode]);

    useEffect(() => {
        setFiles([]);
        setPage(1);
        setHasMore(true);
        setIsMultiSelectMode(false)
        setSelectedDocs([])
        setSelectedFolders([])
    }, [id, mode, reloadFlag]);

    const observerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!hasMore || loading) return;

        const scrollViewport = document.querySelector('[data-slot="scroll-area-viewport"]');

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && page > 0 && !loading) {
                    setPage((prev) => prev + 1);
                }
            },
            {
                root: scrollViewport,
                threshold: 1.0
            }
        );

        if (observerRef.current) observer.observe(observerRef.current);

        return () => {
            if (observerRef.current) observer.unobserve(observerRef.current);
        };
    }, [hasMore, loading, page]);

    const folders = useMemo(() => files.filter((f) => f.type === "folder"), [files]);
    const documents = useMemo(() => files.filter((f) => f.type === "document"), [files]);

    return (
        <div className="bg-muted dark:bg-sidebar flex flex-col rounded-xl p-2 select-none">
            <Toaster richColors position="top-center" />
            <div className="bg-muted/60 backdrop-blur flex items-center justify-between rounded-xl p-4 border-b">
                <SidebarTrigger />
                <h1 className="text-2xl font-semibold">Files của tôi</h1>
                <div className="cursor-pointer p-2 rounded-2xl hover:bg-input/50 dark:hover:bg-input/50"
                    onClick={() => {
                        setIsMultiSelectMode(!isMultiSelectMode);
                        setSelectedDocs([]);
                    }}
                >
                    {isMultiSelectMode ? <X size={20} /> : <ListChecks size={20} />}
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
                                        <Folder key={`folder-${f.folder.id}`}
                                            data={f.folder}
                                            setLoadingDetail={setLoadingFolderDetail}
                                            setFolderDetail={setFolderDetail}
                                            setIsSheetOpen={setIsFolderSheetOpen}
                                            isMultiSelectMode={isMultiSelectMode}
                                            selectedFolders={selectedFolders}
                                            setSelectedFolders={setSelectedFolders}
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
                                            setIsSheetOpen={setIsDocumentSheetOpen}
                                            setDocumentDetail={setDocumentDetail}
                                            setLoadingDetail={setLoadingDocumentDetail}
                                            isMultiSelectMode={isMultiSelectMode}
                                            selectedDocs={selectedDocs}
                                            setSelectedDocs={setSelectedDocs}
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

                {hasMore && !loading && <div ref={observerRef} className="h-10"></div>}

                {!hasMore && files.length > 0 && (
                    <p className="text-center text-muted-foreground py-4">Đã tải hết</p>
                )}
            </ScrollArea>

            {isMultiSelectMode && (
                <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 flex justify-between items-center z-50 shadow-lg">
                    <span className="text-sm text-muted-foreground">
                        {selectedFolders.length} thư mục được chọn, {selectedDocs.length} tài liệu được chọn
                    </span>
                    <div className="flex gap-2">
                        <Button
                            onClick={handleDownloadSelected}
                            disabled={selectedDocs.length === 0 && selectedFolders.length === 0 || downloading}
                        >
                            {downloading ? <Spinner /> : <>
                                <Download className="text-black-900" />
                                Tải xuống (zip)
                            </>}
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsMultiSelectMode(false);
                                setSelectedDocs([]);
                            }}
                            disabled={downloading}
                        >
                            Huỷ
                        </Button>
                    </div>
                </div>
            )}

            <FolderDetail
                isSheetOpen={isFolderSheetOpen}
                setIsSheetOpen={setIsFolderSheetOpen}
                folderDetail={folderDetail}
                loadingDetail={loadingFolderDetail}
            />

            <DocumentDetail
                isSheetOpen={isDocumentSheetOpen}
                setIsSheetOpen={setIsDocumentSheetOpen}
                documentDetail={documentDetail}
                loadingDetail={loadingDocumentDetail}
            />

            <FolderModal
                open={folderModal.open}
                onOpenChange={(open) => {
                    if (!open) dispatch(closeFolderModal());
                }}
                isEditing={folderModal.isEditing}
                data={folderModal.data}
            />

            <DocumentModal
                open={documentModal.open}
                onOpenChange={(open) => {
                    if (!open) dispatch(closeDocumentModal());
                }}
                data={documentModal.data}
            />
        </div>
    );
};

export default Files;