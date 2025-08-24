import { authApis, endpoints } from "@/config/Api";
import { isDocument } from "@/config/utils";
import type { IDocument, IFolder } from "@/types/type";
import { useState } from "react";
import { toast } from "sonner";

export function useShareFiles() {
    const [isUrlModalOpen, setIsUrlModalOpen] = useState<boolean>(false)
    const [sharing, setSharing] = useState<boolean>(false);
    const [sharedUrlDocument, setSharedUrlDocument] = useState<IDocument | null>(null)
    const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false)
    const [sharedDocument, setSharedDocument] = useState<IDocument | null>(null)
    const [sharedFolder, setSharedFolder] = useState<IFolder | null>(null)

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

    const saveShare = async (data: IDocument | IFolder, people: { email: string, shareType: string }[]): Promise<boolean> => {
        try {
            setSharing(true);

            let url = "";
            const payload: any = {
                shares: people
            };

            if (isDocument(data)) {
                payload["documentId"] = data.id;
                url = endpoints["share-doc"];
            } else {
                payload["folderId"] = data.id;
                url = endpoints["share-folder"];
            }

            await authApis().post(url, payload)

            toast.success("Chia sẻ thành công", {
                duration: 2000
            })
            return true
        } catch (error: any) {
            console.error("Lỗi khi chia sẻ", error);
            const errors = error.response.data.error;
            let errorMsg: string = "";

            if (error.response?.status === 400) {
                if (Array.isArray(errors)) {
                    errors.forEach((err: { field: string; message: string }) => {
                        errorMsg += err.message + "\n";
                    });
                } else {
                    errorMsg = errors
                }
            } else {
                errorMsg = "Lỗi hệ thống hoặc kết nối"
            }

            toast.error("Chia sẻ thất bại", {
                duration: 3000,
                description: errorMsg
            });
            return false
        } finally {
            setSharing(false);
        }
    }

    const removeShare = async (data: IDocument | IFolder, ids: number[]): Promise<boolean> => {
        try {
            setSharing(true);

            let url = "";

            if (isDocument(data)) {
                url = endpoints["share-doc-detail"](data.id);
            } else {
                url = endpoints["share-folder-detail"](data.id);
            }

            await authApis().delete(url, {
                data: ids
            })

            toast.success("Đã xoá quyền chia sẻ", {
                duration: 2000
            })
            return true
        } catch (error: any) {
            console.error("Lỗi khi xóa", error);
            toast.error("Xóa quyền thất bại", {
                duration: 3000,
            });
            return false
        } finally {
            setSharing(false);
        }
    }

    return {
        createSignedUrl,
        sharing,
        setSharing,
        isUrlModalOpen,
        setIsUrlModalOpen,
        sharedUrlDocument,
        setSharedUrlDocument,
        isShareModalOpen,
        setIsShareModalOpen,
        sharedDocument,
        setSharedDocument,
        sharedFolder,
        setSharedFolder,
        saveShare,
        removeShare
    };
}