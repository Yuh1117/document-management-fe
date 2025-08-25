import type { IDocument, IFolder } from "@/types/type";
import { useState } from "react";

export const useDetailSheet = () => {
    const [isFolderSheetOpen, setIsFolderSheetOpen] = useState(false);
    const [folderDetail, setFolderDetail] = useState<IFolder | null>(null);
    const [loadingFolderDetail, setLoadingFolderDetail] = useState(false);


    return {
        isFolderSheetOpen,
        setIsFolderSheetOpen,
        folderDetail,
        setFolderDetail,
        loadingFolderDetail,
        setLoadingFolderDetail,
    };
};