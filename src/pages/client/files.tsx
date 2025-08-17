import Document from "@/components/client/document/document";
import Folder from "@/components/client/folder/folder";
import { Spinner } from "@/components/ui/spinner";
import { authApis, endpoints } from "@/config/Api";
import type { IFileItem } from "@/types/type";
import { useEffect, useState, useMemo, useRef } from "react";

const Files = () => {
    const [files, setFiles] = useState<IFileItem[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);

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
            <div className="flex items-center rounded-xl p-2">
                <h1 className="text-center text-2xl">Files của tôi</h1>
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
                                        <Folder key={`folder-${f.folder.id}`} data={f.folder} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {documents.length > 0 && (
                            <div>
                                <h2 className="text-lg mb-2">Tài liệu</h2>
                                <div className="grid grid-cols-[repeat(auto-fill,_minmax(220px,_1fr))] gap-4 px-2 py-4">
                                    {documents.map((f) => (
                                        <Document key={`doc-${f.document.id}`} data={f.document} />
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
        </div>
    );
};

export default Files;