import { Copy, Download, EllipsisVertical, FolderOpen, FolderSymlink, Info, Link2, PenLine, Trash, UserRoundPlus } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "../ui/dropdown-menu";

type Props = {
    permission: string,
    handleDropdownToggle: (open: boolean) => void,
    handleDownload: () => Promise<void>,
    handleViewDetail: () => void,
    handleOpenEdit: () => void,
    handleSoftDelete: () => Promise<void>,
    handleOpenShareUrl?: () => void
    handleOpenTransfer?: (mode: "copy" | "move") => void,
    handleOpenShare?: () => void
}

const EllipsisDropDown = ({ permission, handleDropdownToggle, handleDownload, handleViewDetail,
    handleOpenEdit, handleSoftDelete, handleOpenShareUrl, handleOpenTransfer, handleOpenShare }: Props) => {
    return (
        <DropdownMenu onOpenChange={handleDropdownToggle}>
            <DropdownMenuTrigger asChild>
                <div className="cursor-pointer hover:bg-background/90 p-1 rounded-xl">
                    <EllipsisVertical size={16} />
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
                <DropdownMenuGroup>
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
                                <DropdownMenuItem onClick={handleOpenShareUrl}>
                                    <Link2 className="text-black-900" />
                                    URL
                                </DropdownMenuItem>
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
                    <DropdownMenuItem onClick={handleViewDetail}>
                        <Info className="text-black-900" />
                        Chi tiết
                    </DropdownMenuItem>
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