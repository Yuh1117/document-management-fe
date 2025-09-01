import { Copy, Download, EllipsisVertical, Eye, FolderOpen, FolderSymlink, History, Info, Link2, PenLine, Trash, UserRoundPlus } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "../ui/dropdown-menu";

type Props = {
    type: string,
    permission: string,
    handleDropdownToggle: (open: boolean) => void,
    handleDownload: () => Promise<void>,
    handleViewDetail: () => void,
    handleOpenEdit: () => void,
    handleSoftDelete: () => Promise<void>,
    handleOpenShareUrl?: () => void
    handleOpenTransfer?: (mode: "copy" | "move") => void,
    handleOpenShare?: () => void,
    handleOpenVersion?: () => void,
    handlePreview?: () => void
}

const EllipsisDropDown = ({ type, permission, handleDropdownToggle, handleDownload, handleViewDetail,
    handleOpenEdit, handleSoftDelete, handleOpenShareUrl, handleOpenTransfer, handleOpenShare, handleOpenVersion, handlePreview }: Props) => {
    return (
        <DropdownMenu onOpenChange={handleDropdownToggle}>
            <DropdownMenuTrigger asChild>
                <div className="cursor-pointer hover:bg-background/90 p-1 rounded-xl">
                    <EllipsisVertical size={16} />
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
                <DropdownMenuGroup>
                    {type === "document" && <>
                        <DropdownMenuItem onClick={handlePreview}>
                            <Eye className="text-black-900" />
                            Xem
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                    </>}
                    <DropdownMenuItem onClick={handleDownload}>
                        <Download className="text-black-900" />
                        Tải xuống
                    </DropdownMenuItem>
                    {(permission === "OWNER" || permission === "EDIT") && (
                        <DropdownMenuItem onClick={handleOpenEdit}>
                            <PenLine className="text-black-900" />
                            Chỉnh sửa
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => handleOpenTransfer?.("copy")}>
                        <Copy className="text-black-900" />
                        Sao chép
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                            <UserRoundPlus className="size-4 me-2" />
                            Chia sẻ
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                                <DropdownMenuItem onClick={handleOpenShare}>
                                    <UserRoundPlus className="text-black-900" />
                                    Chia sẻ
                                </DropdownMenuItem>
                                {type === "document" && <DropdownMenuItem onClick={handleOpenShareUrl}>
                                    <Link2 className="text-black-900" />
                                    URL
                                </DropdownMenuItem>}
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                            <FolderOpen className="size-4 me-2" />
                            Sắp xếp
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                                {(permission === "OWNER") && (
                                    <DropdownMenuItem onClick={() => handleOpenTransfer?.("move")}>
                                        <FolderSymlink className="text-black-900" />
                                        Di chuyển
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuItem>...</DropdownMenuItem>
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                            <Info className="size-4 me-2" />
                            Thông tin
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                                <DropdownMenuItem onClick={handleViewDetail}>
                                    <Info className="text-black-900" />
                                    Chi tiết
                                </DropdownMenuItem>
                                {type === "document" && <DropdownMenuItem onClick={handleOpenVersion}>
                                    <History className="text-black-900" />
                                    Quản lý phiên bản
                                </DropdownMenuItem>}
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>
                </DropdownMenuGroup>
                {(permission === "OWNER") && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleSoftDelete}>
                            <Trash className="text-red-500" />
                            <span className="text-red-500">Chuyển vào thùng rác</span>
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default EllipsisDropDown;