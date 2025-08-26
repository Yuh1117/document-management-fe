import { useEffect, useMemo, useRef, useState } from "react";
import type { IFileItem } from "@/types/type";
import { authApis } from "@/config/Api";

export function useFilesLoader(endpoint: string | null, reloadFlag?: any, query?: string | Record<string, string>) {
    const [files, setFiles] = useState<IFileItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const observerRef = useRef<HTMLDivElement | null>(null);

    const stableQuery = useMemo(() => {
        const params = new URLSearchParams();
        if (query && typeof query === "string") {
            params.set("kw", query);
        } else if (query && typeof query === "object") {
            for (const [key, value] of Object.entries(query)) {
                if (value) params.set(key, value);
            }
        }
        return params;
    }, [JSON.stringify(query)]);

    const loadFiles = async () => {
        try {
            setLoading(true);

            const params = new URLSearchParams(stableQuery);
            params.set("page", page.toString());

            const url = `${endpoint}?${params.toString()}`;
            const res = await authApis().get(url);
            const data = res.data.data;

            setFiles((prev) => [...prev, ...data.result]);
            setHasMore(data.currentPage < data.totalPages);

            if (data.currentPage >= data.totalPages)
                setPage(0);
        } catch (err) {
            console.error(err);
            setHasMore(false);
            setPage(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (endpoint && page > 0)
            loadFiles();
    }, [page, endpoint, stableQuery]);

    useEffect(() => {
        setFiles([]);
        setPage(1);
        setHasMore(true);
    }, [reloadFlag, endpoint, stableQuery]);

    useEffect(() => {
        if (!hasMore || loading) return;
        const scrollViewport = document.querySelector('[data-slot="scroll-area-viewport"]');
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && page > 0 && !loading) {
                    setPage((prev) => prev + 1);
                }
            },
            { root: scrollViewport, threshold: 1.0 }
        );
        if (observerRef.current) observer.observe(observerRef.current);
        return () => {
            if (observerRef.current) observer.unobserve(observerRef.current);
        };
    }, [hasMore, loading, page]);

    return { files, loading, hasMore, observerRef };
}