import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { FileText } from "lucide-react";
import type { IDocument } from "@/types/type";
import { authApis, endpoints } from "@/config/Api";
import { Checkbox } from "@/components/ui/checkbox";
import EllipsisDropDown from "../ellipsis-dropdown";
import { toast } from "sonner";
import { useAppDispatch } from "@/redux/hooks";
import { openDocumentModal, triggerReload } from "@/redux/reducers/filesSlice";
import { cn } from "@/lib/utils";
import EllipsisDropDownDeleted from "../ellipsis-dropdown-deleted";
import { Spinner } from "@/components/ui/spinner";

type Props = {
    data: IDocument;
    setLoadingDetail: (loading: boolean) => void;
    setDocumentDetail: (doc: IDocument) => void;
    setIsSheetOpen: (open: boolean) => void;
    isMultiSelectMode?: boolean;
    selectedDocs?: number[];
    setSelectedDocs?: (data: number[]) => void;
};

const Document = ({
    data,
    setLoadingDetail,
    setDocumentDetail,
    setIsSheetOpen,
    isMultiSelectMode,
    selectedDocs,
    setSelectedDocs
}: Props) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const [downloading, setDownloading] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false)
    const dispatch = useAppDispatch();

    const handleDropdownToggle = (open: boolean) => {
        setIsDropdownOpen(open);
    };

    const handleToggleCheck = () => {
        if (isMultiSelectMode && selectedDocs && setSelectedDocs) {
            if (selectedDocs.includes(data.id)) {
                setSelectedDocs(selectedDocs.filter((id) => id !== data.id));
            } else {
                setSelectedDocs([...selectedDocs, data.id]);
            }
        }
    };

    const handleViewDetail = async () => {
        try {
            setLoadingDetail(true);
            const res = await authApis().get(endpoints["document-detail"](data.id));
            setDocumentDetail(res.data.data);
            setIsSheetOpen(true);
        } catch (error) {
            console.error("Lỗi khi tải chi tiết tài liệu", error);
        } finally {
            setLoadingDetail(false);
        }
    };

    const handleDownload = async () => {
        try {
            setDownloading(true)

            const res = await authApis().get(endpoints["download-single-document"](data.id), {
                responseType: "blob",
            });

            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement("a");

            link.href = url;
            link.setAttribute("download", data.originalFilename || data.name);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            toast.success("Tải về thành công", {
                duration: 2000
            })
        } catch (error) {
            console.error("Tải xuống thất bại:", error);
            toast.error("Tải về thất bại", {
                duration: 2000
            })
        } finally {
            setDownloading(true)
        }
    };

    const handleOpenEdit = () => {
        dispatch(openDocumentModal({ data: data }))
    }

    const handleSoftDelete = async () => {
        try {
            setLoading(true);

            const req: number[] = [data.id]
            await authApis().delete(endpoints["documents"], {
                data: req
            });

            dispatch(triggerReload())
            toast.success("Đã chuyền vào thùng rác", {
                duration: 2000
            })
        } catch (error) {
            console.error("Lỗi khi xoá", error);
            toast.error("Chuyển vào thùng rác thất bại", {
                duration: 2000
            })
        } finally {
            setLoading(false);
        }
    }

    const handleRestore = async () => {
        try {
            setLoading(true);

            const req: number[] = [data.id]
            await authApis().patch(endpoints["document-restore"], req);

            dispatch(triggerReload())
            toast.success("Đã khôi phục", {
                duration: 2000
            })
        } catch (error) {
            console.error("Lỗi khi khôi phục", error);
            toast.error("Khôi phục thất bại", {
                duration: 2000
            })
        } finally {
            setLoading(false);
        }
    }

    const handleHardDelete = async () => {
        try {
            setLoading(true);

            const req: number[] = [data.id]
            await authApis().delete(endpoints["document-delete-permanent"], {
                data: req
            });
            
            dispatch(triggerReload())
            toast.success("Đã xoá vĩnh viễn thành công", {
                duration: 2000
            })
        } catch (error) {
            console.error("Lỗi khi xoá", error);
            toast.error("Xoá vĩnh viễn thất bại", {
                duration: 2000
            })
        } finally {
            setLoading(false);
        }
    }

    return (
        <Card
            onClick={handleToggleCheck}
            className={cn("bg-background hover:bg-input/50 py-4 rounded-xl border-1 transition-all duration-200", isDropdownOpen && "bg-input/50")}
        >
            <CardHeader className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <FileText />
                    <Label className="truncate max-w-[110px]">{data.name}</Label>
                </div>
                <div>
                    {loading ? <Spinner /> : (
                        data.deleted ? <EllipsisDropDownDeleted
                            handleDropdownToggle={handleDropdownToggle}
                            handleRestore={handleRestore}
                            handleHardDelete={handleHardDelete}
                        /> : (
                            isMultiSelectMode && selectedDocs && setSelectedDocs ? (
                                <Checkbox
                                    className="border-2 border-black dark:border-white"
                                    checked={selectedDocs.includes(data.id)}
                                    onCheckedChange={handleToggleCheck}
                                />
                            ) : <EllipsisDropDown
                                handleDropdownToggle={handleDropdownToggle}
                                handleDownload={handleDownload}
                                handleViewDetail={handleViewDetail}
                                handleOpenEdit={handleOpenEdit}
                                handleSoftDelete={handleSoftDelete}
                            />
                        ))
                    }
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex justify-center items-center h-[150px] bg-muted rounded-xl ">
                    <FileText />
                </div>
            </CardContent>
        </Card>
    );
};

export default Document;
