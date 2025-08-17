import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import type { IDocument } from "@/types/type";
import { formatFileSize, formatTime } from "@/config/utils";
import { Separator } from "@/components/ui/separator";

type Props = {
    isSheetOpen: boolean;
    setIsSheetOpen: (open: boolean) => void;
    documentDetail: IDocument | null;
    loadingDetail: boolean;
};

const DocumentDetail = ({ isSheetOpen, setIsSheetOpen, documentDetail, loadingDetail }: Props) => {
    return (
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetContent className="rounded-l-2xl">
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
                                    <div className="flex items-center">
                                        <Label className="me-2 medium text-md">Mô tả:</Label>
                                        <span>{documentDetail.description}</span>
                                    </div>
                                    <div className="flex items-center">
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
                                        <Badge variant="secondary">{documentDetail.createdBy?.email}</Badge>
                                    </div>
                                    <div className="flex items-center">
                                        <Label className="me-2 medium text-md">Cập nhật bởi:</Label>
                                        <Badge variant="secondary">{documentDetail.updatedBy?.email}</Badge>
                                    </div>
                                    <div className="flex items-center">
                                        <Label className="me-2 medium text-md">Tạo lúc:</Label>
                                        <Badge variant="secondary">{formatTime(documentDetail?.createdAt)}</Badge>
                                    </div>
                                    <div className="flex items-center">
                                        <Label className="me-2 medium text-md">Cập nhật lúc:</Label>
                                        <Badge variant="secondary">{formatTime(documentDetail?.updatedAt)}</Badge>
                                    </div></div>
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
