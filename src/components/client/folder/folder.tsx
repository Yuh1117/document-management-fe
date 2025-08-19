import { useState } from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Folder as FolderIcon } from "lucide-react";
import type { IFolder } from "@/types/type";
import { authApis, endpoints } from "@/config/Api";
import { useNavigate } from "react-router";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import EllipsisDropDown from "../ellipsis-dropdown";
import { useAppDispatch } from "@/redux/hooks";
import { openFolderModal } from "@/redux/reducers/filesSlice";

type Props = {
    data: IFolder,
    setLoadingDetail: (loading: boolean) => void,
    setFolderDetail: (data: IFolder) => void,
    setIsSheetOpen: (open: boolean) => void,
    isMultiSelectMode?: boolean;
    selectedFolders?: number[];
    setSelectedFolders?: (data: number[]) => void;
}

const Folder = ({
    data,
    setLoadingDetail,
    setFolderDetail,
    setIsSheetOpen,
    isMultiSelectMode,
    selectedFolders,
    setSelectedFolders
}: Props) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const nav = useNavigate();
    const [downloading, setDownloading] = useState<boolean>(false);
    const dispatch = useAppDispatch()

    const handleDropdownToggle = (open: boolean) => {
        setIsDropdownOpen(open);
    };

    const handleToggleCheck = () => {
        if (isMultiSelectMode && selectedFolders && setSelectedFolders) {
            if (selectedFolders?.includes(data.id)) {
                setSelectedFolders(selectedFolders.filter((id) => id !== data.id));
            } else {
                setSelectedFolders([...selectedFolders, data.id]);
            }
        }
    };

    const handleViewDetail = async () => {
        try {
            setLoadingDetail(true);
            const res = await authApis().get(endpoints["folder-detail"](data.id));

            setFolderDetail(res.data.data);
            setIsSheetOpen(true);
        } catch (error) {
            console.error("Lỗi khi tải chi tiết thư mục", error);
        } finally {
            setLoadingDetail(false);
        }
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

    return (
        <Card
            onDoubleClick={() => { if (!isMultiSelectMode) nav(`/folders/${data.id}`) }}
            onClick={handleToggleCheck}
            className={cn("bg-background hover:bg-input/50 py-4 rounded-xl border-1 transition-all duration-200", isDropdownOpen && "bg-input/50")}
        >
            <CardHeader className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <FolderIcon />
                    <Label className="truncate max-w-[110px]">{data.name}</Label>
                </div>
                <div>
                    {isMultiSelectMode && selectedFolders && setSelectedFolders ? (
                        <Checkbox
                            className="border-2 border-black dark:border-white"
                            checked={selectedFolders.includes(data.id)}
                            onCheckedChange={handleToggleCheck}
                        />
                    ) : <EllipsisDropDown
                        handleDropdownToggle={handleDropdownToggle}
                        handleDownload={handleDownload}
                        handleViewDetail={handleViewDetail}
                        handleOpenEdit={handleOpenEdit}
                    />}
                </div>
            </CardHeader>
        </Card>
    );
};

export default Folder;
