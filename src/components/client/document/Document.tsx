import { Fragment, type ReactNode, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import type { IDocument } from "@/types/type";
import { authApis, endpoints } from "@/config/api";
import { Checkbox } from "@/components/ui/checkbox";
import EllipsisDropDown from "../EllipsisDropdown";
import { toast } from "sonner";
import { useAppDispatch } from "@/redux/hooks";
import { openShareModal, openTransferModal, setPermission, triggerReload } from "@/redux/reducers/filesSlice";
import { cn } from "@/lib/utils";
import EllipsisDropDownDeleted from "../EllipsisDropdownDeleted";
import { Spinner } from "@/components/ui/spinner";
import { getIconComponentByMimeType } from "@/config/fileIcons";
import { openDocumentDetail, openDocumentModal, openPreviewModal, openShareUrlModal, openSummarizeModal, openVersionModal } from "@/redux/reducers/documentSlice";
import { truncateFileName } from "@/config/utils";

type Props = {
    data: IDocument,
    permission: string,
    isMultiSelectMode?: boolean;
    selectedDocs?: number[];
    setSelectedDocs?: (data: number[]) => void;
    showSnippet?: boolean;
};

const renderSnippet = (snippet: string) => {
    return snippet.split(/(<mark>|<\/mark>)/g).reduce<ReactNode[]>((nodes, part, index, parts) => {
        if (part === "<mark>" || part === "</mark>") return nodes;

        const isMarked = parts[index - 1] === "<mark>" && parts[index + 1] === "</mark>";
        nodes.push(
            isMarked ? (
                <mark key={index} className="rounded bg-yellow-200 px-0.5 text-foreground dark:bg-yellow-500/40">
                    {part}
                </mark>
            ) : (
                <Fragment key={index}>{part}</Fragment>
            )
        );
        return nodes;
    }, []);
};

const Document = ({
    data,
    permission,
    isMultiSelectMode,
    selectedDocs,
    setSelectedDocs,
    showSnippet = false
}: Props) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const [, setDownloading] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false)
    const dispatch = useAppDispatch();
    const { icon: Icon, color } = getIconComponentByMimeType(data.mimeType);
    const snippet = showSnippet ? data.snippet : null;
    const fileNameMaxLength = snippet ? 32 : 12;

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

    const handleOpenSummarize = () => {
        dispatch(openSummarizeModal({ data }))
    }

    return (
        <Card
            onDoubleClick={() => { if (!isMultiSelectMode) handlePreview() }}
            onClick={handleToggleCheck}
            className={cn("bg-background hover:bg-input/50 py-4 rounded-xl border-1 transition-all duration-200", snippet && "h-[280px]", isDropdownOpen && "bg-input/50")}
        >
            <CardHeader className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Icon size={20} color={color} />
                    <Label className="whitespace-nowrap">{truncateFileName(data.name, fileNameMaxLength)}</Label>
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
                                handleOpenSummarize={handleOpenSummarize}
                            />
                        ))
                    }
                </div>
            </CardHeader>
            <CardContent>
                {snippet ? (
                    <div className="flex h-[160px] gap-3">
                        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-muted">
                            <Icon size={40} color={color} />
                        </div>
                        <p className="min-w-0 flex-1 overflow-y-auto whitespace-normal break-words rounded-md border bg-muted/50 p-3 text-xs leading-5 text-muted-foreground select-text [scrollbar-color:transparent_transparent] [scrollbar-gutter:stable] [scrollbar-width:thin] hover:[scrollbar-color:hsl(var(--muted-foreground)/0.3)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-transparent hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/30">
                            {renderSnippet(snippet)}
                        </p>
                    </div>
                ) : (
                    <div className="flex h-[150px] items-center justify-center rounded-xl bg-muted">
                        <Icon size={50} color={color} />
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default Document;
