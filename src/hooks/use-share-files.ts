import { authApis, endpoints } from "@/config/Api";
import type { IDocument } from "@/types/type";
import { useState } from "react";
import { toast } from "sonner";

export function useShareFiles() {
    const [isUrlModalOpen, setIsUrlModalOpen] = useState<boolean>(false)
    const [sharing, setSharing] = useState<boolean>(false);
    const [sharedUrlDocument, setSharedUrlDocument] = useState<IDocument | null>(null)

    const createSignedUrl = async (id: number, expiredTime: number): Promise<string> => {
        try {
            setSharing(true);

            const req: { documentId: number, expiredTime: number } = {
                documentId: id,
                expiredTime: expiredTime
            }

            const res = await authApis().post(endpoints["share-url"], req);

            toast.success("Đã tạo link thành công", {
                duration: 2000
            })
            return res.data.data;
        } catch (error) {
            console.error("Lỗi khi chia sẻ", error);
            toast.error("Chia sẻ thất bại", {
                duration: 2000
            })
            return ""
        } finally {
            setSharing(false);
        }
    };

    return {
        createSignedUrl,
        sharing,
        setSharing,
        isUrlModalOpen,
        setIsUrlModalOpen,
        sharedUrlDocument,
        setSharedUrlDocument
    };
}