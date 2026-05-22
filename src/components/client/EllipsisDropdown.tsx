import { Copy, Download, EllipsisVertical, Eye, FolderOpen, FolderSymlink, History, Info, Link2, PenLine, Sparkles, Trash, UserRoundPlus } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { useTranslation } from "react-i18next";

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
    handlePreview?: () => void,
    handleOpenSummarize?: () => void,
}

const EllipsisDropDown = ({ type, permission, handleDropdownToggle, handleDownload, handleViewDetail,
    handleOpenEdit, handleSoftDelete, handleOpenShareUrl, handleOpenTransfer, handleOpenShare, handleOpenVersion, handlePreview, handleOpenSummarize }: Props) => {
    const { t } = useTranslation();

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
                            {t('dropdown.preview')}
                        </DropdownMenuItem>
                        {handleOpenSummarize && (
                            <DropdownMenuItem onClick={handleOpenSummarize}>
                                <Sparkles className="text-black-900" />
                                {t('dropdown.summarize')}
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                    </>}
                    <DropdownMenuItem onClick={handleDownload}>
                        <Download className="text-black-900" />
                        {t('dropdown.download')}
                    </DropdownMenuItem>
                    {(permission === "OWNER" || permission === "EDIT") && (
                        <DropdownMenuItem onClick={handleOpenEdit}>
                            <PenLine className="text-black-900" />
                            {t('dropdown.edit')}
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => handleOpenTransfer?.("copy")}>
                        <Copy className="text-black-900" />
                        {t('dropdown.copy')}
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                            <UserRoundPlus className="size-4 me-2" />
                            {t('dropdown.share')}
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                                <DropdownMenuItem onClick={handleOpenShare}>
                                    <UserRoundPlus className="text-black-900" />
                                    {t('dropdown.share')}
                                </DropdownMenuItem>
                                {type === "document" && <DropdownMenuItem onClick={handleOpenShareUrl}>
                                    <Link2 className="text-black-900" />
                                    {t('dropdown.share_url')}
                                </DropdownMenuItem>}
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>
                    {(permission === "OWNER") && (
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                                <FolderOpen className="size-4 me-2" />
                                {t('dropdown.arrange')}
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                    <DropdownMenuItem onClick={() => handleOpenTransfer?.("move")}>
                                        <FolderSymlink className="text-black-900" />
                                        {t('dropdown.move')}
                                    </DropdownMenuItem>
                                </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                        </DropdownMenuSub>
                    )}
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                            <Info className="size-4 me-2" />
                            {t('dropdown.info')}
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                                <DropdownMenuItem onClick={handleViewDetail}>
                                    <Info className="text-black-900" />
                                    {t('dropdown.details')}
                                </DropdownMenuItem>
                                {type === "document" && <DropdownMenuItem onClick={handleOpenVersion}>
                                    <History className="text-black-900" />
                                    {t('dropdown.version_manage')}
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
                            <span className="text-red-500">{t('dropdown.move_to_trash')}</span>
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default EllipsisDropDown;
