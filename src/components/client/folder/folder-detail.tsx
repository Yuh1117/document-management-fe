import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import { authApis, endpoints } from "@/config/Api";
import { formatTime } from "@/config/utils";
import { useAppSelector } from "@/redux/hooks";
import type { IFolder } from "@/types/type";
import { useEffect, useState } from "react";

type Props = {
    data: IFolder | null;
    isSheetOpen: boolean,
    setIsSheetOpen: (open: boolean) => void
}

const FolderDetail = ({ isSheetOpen, setIsSheetOpen, data }: Props) => {
    const userId = useAppSelector(state => state.users.user?.id)
    const [loadingDetail, setLoadingDetail] = useState<boolean>(false)
    const [folderDetail, setFolderDetail] = useState<IFolder | null>(null)

    const loadViewDetail = async () => {
        if (!data) return
        try {
            setLoadingDetail?.(true);
            const res = await authApis().get(endpoints["folder-detail"](data.id));

            setFolderDetail?.(res.data.data);
            setIsSheetOpen?.(true);
        } catch (error) {
            console.error("Lỗi khi tải chi tiết thư mục", error);
        } finally {
            setLoadingDetail?.(false);
        }
    };

    useEffect(() => {
        if (isSheetOpen) {
            loadViewDetail()
        }
    }, [isSheetOpen])

    return (
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetContent className="rounded-l-xl" aria-describedby={undefined}>
                <SheetHeader>
                    <SheetTitle className="text-lg mb-2">Chi tiết thư mục</SheetTitle>
                    <div>
                        {loadingDetail ? (
                            <Spinner />
                        ) : folderDetail ? (
                            <div className="space-y-3">
                                <div className="space-y-2">
                                    <div className="flex items-center">
                                        <Label className="me-2 medium text-md">Tên:</Label>
                                        <span>{folderDetail.name}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Label className="me-2 medium text-md">Loại:</Label>
                                        <span>Thư mục</span>
                                    </div>
                                </div>
                                <Separator />
                                <div className="space-y-2">
                                    <div className="flex items-center">
                                        <Label className="me-2 medium text-md">Tạo bởi:</Label>
                                        <Badge variant="secondary">{folderDetail.createdBy?.id === userId ? "Tôi" : folderDetail.createdBy?.email}</Badge>
                                    </div>
                                    <div className="flex items-center">
                                        <Label className="me-2 medium text-md">Cập nhật bởi:</Label>
                                        <Badge variant="secondary">{folderDetail.updatedBy?.id === userId ? "Tôi" : folderDetail.updatedBy?.email}</Badge>
                                    </div>
                                    <div className="flex items-center">
                                        <Label className="me-2 medium text-md">Tạo lúc:</Label>
                                        <Badge variant="secondary">{formatTime(folderDetail?.createdAt)}</Badge>
                                    </div>
                                    <div className="flex items-center">
                                        <Label className="me-2 medium text-md">Cập nhật lúc:</Label>
                                        <Badge variant="secondary">{formatTime(folderDetail?.updatedAt)}</Badge>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p>Không tìm thấy chi tiết.</p>
                        )}
                    </div>
                </SheetHeader>
            </SheetContent>
        </Sheet>

    )
}

export default FolderDetail;