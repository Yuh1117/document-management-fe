import type { IDocument, IFolder } from "@/types/type";
import { useState } from "react";

export function useTransferFiles() {
    const [isTransferModalOpen, setIsTransferModalOpen] = useState<boolean>(false)
    const [transfering, setTransfering] = useState<boolean>(false);
    const [transferDocument, setTransferDocument] = useState<IDocument | null>(null)
    const [transferFolder, setTransferFolder] = useState<IFolder | null>(null)
    const [transferMode, setTransferMode] = useState<"move" | "copy">()

    return {
        isTransferModalOpen,
        setIsTransferModalOpen,
        transfering,
        setTransfering,
        transferDocument,
        setTransferDocument,
        transferFolder,
        setTransferFolder,
        transferMode,
        setTransferMode
    };
}