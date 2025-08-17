import { useState } from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Download, EllipsisVertical, Folder as FolderIcon, FolderOpen, FolderSymlink, Info, Link2, PenLine, Trash, UserRoundPlus } from "lucide-react";
import type { IFolder } from "@/types/type";

type Props = {
    data: IFolder
}

const Folder = ({ data }: Props) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

    const handleDropdownToggle = (open: boolean) => {
        setIsDropdownOpen(open);
    };

    return (
        <Card
            className={`bg-background hover:bg-input/50 py-4 rounded-xl border-1 transition-all duration-200 ${isDropdownOpen ? "bg-input/50" : ""
                }`}
        >
            <CardHeader className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <FolderIcon />
                    <Label>{data.name}</Label>
                </div>
                <div>
                    <DropdownMenu onOpenChange={handleDropdownToggle}>
                        <DropdownMenuTrigger asChild>
                            <div className="cursor-pointer hover:bg-background/90 p-1 rounded-xl">
                                <EllipsisVertical size={16} />
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                            <DropdownMenuGroup>
                                <DropdownMenuItem>
                                    <Download className="text-black-900" />
                                    Tải xuống
                                </DropdownMenuItem>
                                <DropdownMenuItem>
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
                                <DropdownMenuItem>
                                    <Info className="text-black-900" />
                                    Chi tiết
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <Trash className="text-black-900" />
                                Chuyển vào thùng rác
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>
        </Card>
    );
};

export default Folder;
