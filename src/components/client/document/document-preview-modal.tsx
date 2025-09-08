import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { IDocument } from "@/types/type";
import { toast } from "sonner";
import { authApis, endpoints } from "@/config/Api";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";

interface Props {
    data: IDocument | null,
    open: boolean,
    onOpenChange: (open: boolean) => void,
}

const DocumentPreviewModal = ({ data, open, onOpenChange }: Props) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const loadPreview = async () => {
        if (!data) return;

        try {
            setLoading(true);

            const res = await authApis().get(endpoints["document-preview"](data.id), {
                responseType: "blob",
            });

            const url = window.URL.createObjectURL(res.data);
            setPreviewUrl(url);
        } catch (err) {
            toast.error("Không thể xem trước tài liệu");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open) {
            loadPreview();
        } else {
            if (previewUrl) {
                window.URL.revokeObjectURL(previewUrl);
                setPreviewUrl(null);
            }
        }
    }, [open]);

    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex justify-center items-center h-full">
                    <Spinner />
                </div>
            );
        }

        if (!previewUrl) {
            return (
                <div className="flex justify-center items-center h-full text-muted-foreground">
                    Không có dữ liệu để hiển thị
                </div>
            );
        }

        if (data?.mimeType.startsWith("image/")) {
            return (
                <div className="flex justify-center items-center h-full">
                    <img
                        src={previewUrl}
                        alt={data?.name}
                        className="max-h-full max-w-full rounded-xl shadow"
                    />
                </div>
            );
        }

        if (data?.mimeType === "application/pdf") {
            return (
                <iframe
                    src={previewUrl}
                    className="w-full h-[80vh] rounded-xl"
                    title={data?.name}
                />
            );
        }

        if (data?.mimeType.startsWith("text/")) {
            return (
                <iframe
                    src={previewUrl}
                    className="w-full h-[80vh]"
                    title={data?.name}
                />
            );
        }

        if (data?.mimeType.startsWith("video/")) {
            return (
                <div className="flex justify-center items-center h-full">
                    <video controls className="w-full h-[80vh] rounded-xl shadow-md">
                        <source src={previewUrl} type={data?.mimeType} />
                    </video>
                </div>
            );
        }

        if (data?.mimeType.startsWith("audio/")) {
            return (
                <div className="flex justify-center items-center h-full">
                    <audio controls className="w-full h-full">
                        <source src={previewUrl} type={data?.mimeType} />
                    </audio>
                </div>
            );
        }

        return (
            <div className="flex flex-col justify-center items-center h-full text-muted-foreground">
                Không hỗ trợ xem cho loại file này.
            </div>
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-full md:max-w-2xl flex flex-col" aria-describedby={undefined}>
                <DialogHeader>
                    <DialogTitle>{data?.name}</DialogTitle>
                </DialogHeader>
                <div className="flex-1 mt-2">{renderContent()}</div>
            </DialogContent>
        </Dialog>
    );
};

export default DocumentPreviewModal;