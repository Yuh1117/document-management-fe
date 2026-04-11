import { BrushCleaning, EllipsisVertical, History } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";

type Props = {
    handleDropdownToggle: (open: boolean) => void,
    handleRestore: () => Promise<void>
    handleHardDelete: () => Promise<void>
}

const EllipsisDropDownDeleted = ({ handleDropdownToggle, handleRestore, handleHardDelete }: Props) => {
    return (
        <DropdownMenu onOpenChange={handleDropdownToggle}>
            <DropdownMenuTrigger asChild>
                <div className="cursor-pointer hover:bg-background/90 p-1 rounded-xl">
                    <EllipsisVertical size={16} />
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={handleRestore}>
                        <History className="text-black-900" />
                        Khôi phục
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleHardDelete}>
                        <BrushCleaning className="text-red-500" />
                        <span className="text-red-500">Xoá vĩnh viễn</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default EllipsisDropDownDeleted;