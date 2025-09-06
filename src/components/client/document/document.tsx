import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import type { IDocument } from "@/types/type";
import { authApis, endpoints } from "@/config/Api";
import { Checkbox } from "@/components/ui/checkbox";
import EllipsisDropDown from "../ellipsis-dropdown";
import { toast } from "sonner";
import { useAppDispatch } from "@/redux/hooks";
import { openShareModal, openTransferModal, setPermission, triggerReload } from "@/redux/reducers/filesSlice";
import { cn } from "@/lib/utils";
import EllipsisDropDownDeleted from "../ellipsis-dropdown-deleted";
import { Spinner } from "@/components/ui/spinner";
import { getIconComponentByMimeType } from "@/config/file-icons";
import { openDocumentDetail, openDocumentModal, openPreviewModal, openShareUrlModal, openVersionModal } from "@/redux/reducers/documentSlice";
import { truncateFileName } from "@/config/utils";

type Props = {
    data: IDocument,
    permission: string,
    isMultiSelectMode?: boolean;
    selectedDocs?: number[];
    setSelectedDocs?: (data: number[]) => void;
};

const Document = ({
    data,
    permission,
    isMultiSelectMode,
    selectedDocs,
    setSelectedDocs
}: Props) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const [downloading, setDownloading] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false)
    const dispatch = useAppDispatch();
    const { icon: Icon, color } = getIconComponentByMimeType(data.mimeType);

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

    const handleViewDetail = () => {
        dispatch(openDocumentDetail({ data: data }))
    };

    const handlePreview = () => {
        dispatch(openPreviewModal({ data: data }))
    }

    const handleDownload = async () => {
        try {
            setDownloading(true)

            const res = await authApis().get(endpoints["download-single-document"](data.id), {
                responseType: "blob",
            });

            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement("a");

            link.href = url;
            link.setAttribute("download", data.name);
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
            setDownloading(false)
        }
    };

    const handleOpenEdit = () => {
        dispatch(openDocumentModal({ data: data }))
    }

    const handleSoftDelete = async () => {
        try {
            setLoading(true);

            const req: number[] = [data.id]
            await authApis().patch(endpoints["documents"], req);

            dispatch(triggerReload())
            toast.success("Đã chuyển vào thùng rác", {
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

    const handleOpenShareUrl = () => {
        dispatch(openShareUrlModal({ data: data }))
    }

    const handleOpenShare = () => {
        dispatch(openShareModal({ data: data }))
        dispatch(setPermission(permission))
    }

    const handleOpenTransfer = (mode: "copy" | "move") => {
        dispatch(openTransferModal({ data: data, mode: mode }))
    }

    const handleOpenVersion = () => {
        dispatch(openVersionModal({ data: data }))
    }

    return (
        <Card
            onDoubleClick={() => { if (!isMultiSelectMode) handlePreview() }}
            onClick={handleToggleCheck}
            className={cn("bg-background hover:bg-input/50 py-4 rounded-xl border-1 transition-all duration-200", isDropdownOpen && "bg-input/50")}
        >
            <CardHeader className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Icon size={20} color={color} />
                    <Label className="whitespace-nowrap">{truncateFileName(data.name)}</Label>
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
                                type={"document"}
                                permission={permission}
                                handleDropdownToggle={handleDropdownToggle}
                                handleDownload={handleDownload}
                                handleViewDetail={handleViewDetail}
                                handleOpenEdit={handleOpenEdit}
                                handleSoftDelete={handleSoftDelete}
                                handleOpenShareUrl={handleOpenShareUrl}
                                handleOpenTransfer={handleOpenTransfer}
                                handleOpenShare={handleOpenShare}
                                handleOpenVersion={handleOpenVersion}
                                handlePreview={handlePreview}
                            />
                        ))
                    }
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex justify-center items-center h-[150px] bg-muted rounded-xl">
                    <Icon size={50} color={color} />
                </div>
            </CardContent>
        </Card>
    );
};

export default Document;
