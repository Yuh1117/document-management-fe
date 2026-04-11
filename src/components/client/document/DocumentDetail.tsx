import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/Sheet";
import { Spinner } from "@/components/ui/Spinner";
import { Badge } from "@/components/ui/Badge";
import { Label } from "@/components/ui/Label";
import type { IDocument } from "@/types/type";
import { formatFileSize, formatTime } from "@/config/utils";
import { Separator } from "@/components/ui/Separator";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Textarea } from "@/components/ui/Textarea";
import { useEffect, useState } from "react";
import { authApis, endpoints } from "@/config/api";
import { Button } from "@/components/ui/Button";
import { Sparkles } from "lucide-react";
import { openSummarizeModal } from "@/redux/reducers/documentSlice";

type Props = {
    data: IDocument | null;
    isSheetOpen: boolean;
    setIsSheetOpen: (open: boolean) => void;
};

const DocumentDetail = ({ isSheetOpen, setIsSheetOpen, data }: Props) => {
    const dispatch = useAppDispatch();
    const userId = useAppSelector(state => state.users.user?.id);
    const [loadingDetail, setLoadingDetail] = useState<boolean>(false);
    const [documentDetail, setDocumentDetail] = useState<IDocument | null>(null);

    const loadViewDetail = async () => {
        if (!data) return;

        try {
            setLoadingDetail(true);
            const res = await authApis().get(endpoints["document-detail"](data.id));
            setDocumentDetail(res.data.data);
        } catch (error) {
            console.error("Lỗi khi tải chi tiết tài liệu", error);
        } finally {
            setLoadingDetail(false);
        }
    };

    const handleOpenSummarize = () => {
        const doc = documentDetail ?? data;
        if (doc) {
            dispatch(openSummarizeModal({ data: doc }));
        }
    };

    useEffect(() => {
        if (isSheetOpen && data) {
            loadViewDetail();
        }
    }, [isSheetOpen, data?.id]);

    return (
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetContent className="rounded-l-xl p-1" aria-describedby={undefined}>
                <SheetHeader>
                    <SheetTitle className="text-lg mb-2">Chi tiết tài liệu</SheetTitle>
                    <div>
                        {loadingDetail ? (
                            <Spinner />
                        ) : documentDetail ? (
                            <div className="space-y-3">
                                <div className="space-y-2">
                                    <div className="flex items-center">
                                        <Label className="me-2 medium text-md">Tên:</Label>
                                        <span>{documentDetail.name}</span>
                                    </div>
                                    <div>
                                        <Label className="me-2 medium text-md">Mô tả:</Label>
                                        <Textarea readOnly tabIndex={-1} value={documentDetail.description || ""} />
                                    </div>
                                    <div className="flex flex-wrap items-center">
                                        <Label className="me-2 medium text-md">Loại:</Label>
                                        <span>{documentDetail.mimeType}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Label className="me-2 medium text-md">Kích thước:</Label>
                                        <span>{formatFileSize(documentDetail.fileSize)}</span>
                                    </div>
                                </div>
                                <Separator />
                                <div className="space-y-2">
                                    <div className="flex items-center">
                                        <Label className="me-2 medium text-md">Tạo bởi:</Label>
                                        <Badge variant="secondary">{documentDetail.createdBy?.id === userId ? "Tôi" : documentDetail.createdBy?.email}</Badge>
                                    </div>
                                    <div className="flex items-center">
                                        <Label className="me-2 medium text-md">Cập nhật bởi:</Label>
                                        <Badge variant="secondary">{documentDetail.updatedBy?.id === userId ? "Tôi" : documentDetail.updatedBy?.email}</Badge>
                                    </div>
                                    <div className="flex items-center">
                                        <Label className="me-2 medium text-md">Tạo lúc:</Label>
                                        <Badge variant="secondary">{formatTime(documentDetail?.createdAt)}</Badge>
                                    </div>
                                    <div className="flex items-center">
                                        <Label className="me-2 medium text-md">Cập nhật lúc:</Label>
                                        <Badge variant="secondary">{formatTime(documentDetail?.updatedAt)}</Badge>
                                    </div></div>
                                <Separator />
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <Label className="medium text-md">Tóm tắt (AI)</Label>
                                    <Button type="button" variant="secondary" size="sm" onClick={handleOpenSummarize}>
                                        <Sparkles className="size-4 me-1.5" />
                                        Tóm tắt
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <p>Không tìm thấy chi tiết.</p>
                        )}
                    </div>
                </SheetHeader>
            </SheetContent>
        </Sheet>
    );
};

export default DocumentDetail;
