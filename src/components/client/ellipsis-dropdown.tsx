import { Download, EllipsisVertical, FolderOpen, FolderSymlink, Info, Link2, PenLine, Trash, UserRoundPlus } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "../ui/dropdown-menu";

type Props = {
    handleDropdownToggle: (open: boolean) => void,
    handleDownload: () => Promise<void>,
    handleViewDetail: () => Promise<void>,
    handleOpenEdit: () => void,
    handleSoftDelete: () => Promise<void>
}

const EllipsisDropDown = ({ handleDropdownToggle, handleDownload, handleViewDetail, handleOpenEdit, handleSoftDelete }: Props) => {
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
                    <DropdownMenuItem onClick={handleOpenEdit}>
                        <PenLine className="text-black-900" />
                        Đổi tên
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
                                <DropdownMenuItem>
                                    <UserRoundPlus className="text-black-900" />
                                    Chia sẻ
                                </DropdownMenuItem>
                                <DropdownMenuItem>
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
                                <DropdownMenuItem>
                                    <FolderSymlink className="text-black-900" />
                                    Di chuyển
                                </DropdownMenuItem>
                                <DropdownMenuItem>...</DropdownMenuItem>
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DropdownMenuItem onClick={handleViewDetail}>
                        <Info className="text-black-900" />
                        Chi tiết
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSoftDelete}>
                    <Trash className="text-black-900" />
                    Chuyển vào thùng rác
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default EllipsisDropDown;