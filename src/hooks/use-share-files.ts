import { authApis, endpoints } from "@/config/Api";
import { isDocument } from "@/config/utils";
import type { IDocument, IFolder } from "@/types/type";
import { useState } from "react";
import { toast } from "sonner";

export function useShareFiles() {
    const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false)
    const [sharedDocument, setSharedDocument] = useState<IDocument | null>(null)
    const [sharedFolder, setSharedFolder] = useState<IFolder | null>(null)

    return {
        isShareModalOpen,
        setIsShareModalOpen,
        sharedDocument,
        setSharedDocument,
        sharedFolder,
        setSharedFolder
    };
}