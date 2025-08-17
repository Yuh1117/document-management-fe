import Document from "@/components/client/document/document";
import DocumentDetail from "@/components/client/document/document-detail";
import Folder from "@/components/client/folder/folder";
import FolderDetail from "@/components/client/folder/folder-detail";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { authApis, endpoints } from "@/config/Api";
import type { IDocument, IFileItem, IFolder } from "@/types/type";
import { Download, ListChecks, X } from "lucide-react";
import { useEffect, useState, useMemo, useRef } from "react";

const Files = () => {
    const [files, setFiles] = useState<IFileItem[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [isFolderSheetOpen, setIsFolderSheetOpen] = useState(false);
    const [folderDetail, setFolderDetail] = useState<IFolder | null>(null);
    const [loadingFolderDetail, setLoadingFolderDetail] = useState(false);
    const [isDocumentSheetOpen, setIsDocumentSheetOpen] = useState(false);
    const [documentDetail, setDocumentDetail] = useState<IDocument | null>(null);
    const [loadingDocumentDetail, setLoadingDocumentDetail] = useState(false);
    const [selectedDocs, setSelectedDocs] = useState<number[]>([]);
    const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);

    const loadFiles = async () => {
        try {
            setLoading(true);
            const url = `${endpoints["my-files"]}?page=${page}`;
            const res = await authApis().get(url);
            const data = res.data.data;

            setFiles((prev) => [...prev, ...data.result]);
            setHasMore(data.currentPage < data.totalPages);

            if (data.currentPage >= data.totalPages) {
                setPage(0);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadSelected = async () => {
        if (selectedDocs.length === 0) return;

        try {
            const res = await authApis().post(
                endpoints["download-multiple-documents"],
                selectedDocs,
                { responseType: "blob" }
            );

            const blob = new Blob([res.data], { type: "application/zip" });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");

            link.href = url;
            link.setAttribute("download", "tai-lieu.zip");
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            setSelectedDocs([]);
            setIsMultiSelectMode(false);
        } catch (err) {
            console.error("Lỗi tải xuống nhiều tài liệu:", err);
        }
    };


    useEffect(() => {
        if (page > 0) {
            loadFiles();
        }
    }, [page]);

    const observerRef = useRef<HTMLDivElement | null>(null);

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

    const folders = useMemo(() => files.filter((f) => f.type === "folder"), [files]);
    const documents = useMemo(() => files.filter((f) => f.type === "document"), [files]);

    return (
        <div className="bg-muted dark:bg-sidebar flex flex-col min-h-svh rounded-xl p-2">
            <div className="sticky top-18 z-40 bg-muted/80 backdrop-blur supports-[backdrop-filter]:bg-muted/60 flex items-center justify-between rounded-xl p-4 border-b">
                <h1 className="text-2xl font-semibold">Files của tôi</h1>
                <div className="cursor-pointer p-2 rounded-2xl hover:bg-input/50 dark:hover:bg-input/50"
                    onClick={() => {
                        setIsMultiSelectMode(!isMultiSelectMode);
                        setSelectedDocs([]);
                    }}
                >
                    {isMultiSelectMode ? <X /> : <ListChecks />}
                </div>
            </div>


            <div className="p-2">
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
            </div>

            {isMultiSelectMode && (
                <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 flex justify-between items-center z-50 shadow-lg">
                    <span className="text-sm text-muted-foreground">
                        {selectedDocs.length} tài liệu được chọn
                    </span>
                    <div className="flex gap-2">
                        <Button
                            onClick={handleDownloadSelected}
                        >
                            <Download className="text-black-900" />
                            Tải xuống
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsMultiSelectMode(false);
                                setSelectedDocs([]);
                            }}
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
        </div>
    );
};

export default Files;