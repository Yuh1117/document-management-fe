import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Folder as FolderIcon } from "lucide-react";
import type { IFolder } from "@/types/type";
import { authApis, endpoints } from "@/config/Api";
import { useNavigate } from "react-router";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import EllipsisDropDown from "../ellipsis-dropdown";
import { useAppDispatch } from "@/redux/hooks";
import { openShareModal, openTransferModal, setPermission, triggerReload } from "@/redux/reducers/filesSlice";
import EllipsisDropDownDeleted from "../ellipsis-dropdown-deleted";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { openFolderDetail, openFolderModal } from "@/redux/reducers/folderSlice";

type Props = {
    data: IFolder,
    permission: string,
    isMultiSelectMode?: boolean;
    selectedFolders?: number[];
    setSelectedFolders?: (data: number[]) => void;
    withCardContent?: boolean
}

const Folder = ({
    data,
    permission,
    isMultiSelectMode,
    selectedFolders,
    setSelectedFolders,
    withCardContent = false
}: Props) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const nav = useNavigate();
    const [downloading, setDownloading] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false)
    const dispatch = useAppDispatch()

    const handleDropdownToggle = (open: boolean) => {
        setIsDropdownOpen(open);
    };

    const handleToggleCheck = () => {
        if (isMultiSelectMode && selectedFolders && setSelectedFolders) {
            if (selectedFolders.includes(data.id)) {
                setSelectedFolders(selectedFolders.filter((id) => id !== data.id));
            } else {
                setSelectedFolders([...selectedFolders, data.id]);
            }
        }
    };

    const handleViewDetail = () => {
        dispatch(openFolderDetail({ data: data }))
    };

    const handleDownload = async () => {
        try {
            setDownloading(true)

            const res = await authApis().get(endpoints["download-single-folder"](data.id), {
                responseType: "blob",
            });

            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement("a");

            link.href = url;
            link.setAttribute("download", `${data.name}.zip`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Tải xuống thất bại:", error);
        } finally {
            setDownloading(false)
        }
    };

    const handleOpenEdit = () => {
        dispatch(openFolderModal({ isEditing: true, data: data }))
    }

    const handleSoftDelete = async () => {
        try {
            setLoading(true);

            const req: number[] = [data.id]
            await authApis().patch(endpoints["folders"], req);

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
            await authApis().patch(endpoints["folder-restore"], req);

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
            await authApis().delete(endpoints["folder-delete-permanent"], {
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

    const handleOpenShare = () => {
        dispatch(openShareModal({ data: data }))
        dispatch(setPermission(permission))
    }

    const handleOpenTransfer = (mode: "copy" | "move") => {
        dispatch(openTransferModal({ data: data, mode: mode }))
    }

    return (
        <Card
            onDoubleClick={() => { if (!isMultiSelectMode) nav(`/folders/${data.id}`) }}
            onClick={handleToggleCheck}
            className={cn("bg-background hover:bg-input/50 py-4 rounded-xl border-1 transition-all duration-200", isDropdownOpen && "bg-input/50")}
        >
            <CardHeader className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <FolderIcon size={20} />
                    <Label className="truncate max-w-[110px]">{data.name}</Label>
                </div>
                <div>
                    {loading ? <Spinner /> : (
                        data.deleted ? <EllipsisDropDownDeleted
                            handleDropdownToggle={handleDropdownToggle}
                            handleRestore={handleRestore}
                            handleHardDelete={handleHardDelete}
                        /> : (
                            isMultiSelectMode && selectedFolders && setSelectedFolders ? (
                                <Checkbox
                                    className="border-2 border-black dark:border-white"
                                    checked={selectedFolders.includes(data.id)}
                                    onCheckedChange={handleToggleCheck}
                                />
                            ) : <EllipsisDropDown
                                permission={permission}
                                handleDropdownToggle={handleDropdownToggle}
                                handleDownload={handleDownload}
                                handleViewDetail={handleViewDetail}
                                handleOpenEdit={handleOpenEdit}
                                handleSoftDelete={handleSoftDelete}
                                handleOpenTransfer={handleOpenTransfer}
                                handleOpenShare={handleOpenShare}
                            />
                        ))
                    }
                </div>
            </CardHeader>
            {withCardContent && <CardContent>
                <div className="flex justify-center items-center h-[150px] bg-muted rounded-xl">
                    <FolderIcon size={50} />
                </div>
            </CardContent>}
        </Card>
    );
};

export default Folder;
