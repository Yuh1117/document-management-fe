import { BrushCleaning, EllipsisVertical, History } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";

type Props = {
    handleDropdownToggle: (open: boolean) => void
}

const EllipsisDropDownDeleted = ({ handleDropdownToggle }: Props) => {
    return (
        <DropdownMenu onOpenChange={handleDropdownToggle}>
            <DropdownMenuTrigger asChild>
                <div className="cursor-pointer hover:bg-background/90 p-1 rounded-xl">
                    <EllipsisVertical size={16} />
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <History  className="text-black-900" />
                        Khôi phục
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <BrushCleaning className="text-black-900" />
                        Xoá vĩnh viễn
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default EllipsisDropDownDeleted;