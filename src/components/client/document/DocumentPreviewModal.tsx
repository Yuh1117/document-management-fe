import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { IDocument } from "@/types/type";
import { toast } from "sonner";
import { authApis, endpoints } from "@/config/api";
import { useEffect, useRef, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { renderAsync } from "docx-preview";
import * as XLSX from "xlsx";

interface Props {
    data: IDocument | null,
    open: boolean,
    onOpenChange: (open: boolean) => void,
}

const DOCX_MIME = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const XLSX_MIME = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

const DocumentPreviewModal = ({ data, open, onOpenChange }: Props) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [xlsxHtml, setXlsxHtml] = useState<string | null>(null);
    const [xlsxSheets, setXlsxSheets] = useState<string[]>([]);
    const [activeSheet, setActiveSheet] = useState<string>("");
    const docxContainerRef = useRef<HTMLDivElement>(null);
    const xlsxWorkbookRef = useRef<XLSX.WorkBook | null>(null);

    const renderSheet = (workbook: XLSX.WorkBook, sheetName: string) => {
        const sheet = workbook.Sheets[sheetName];
        const html = XLSX.utils.sheet_to_html(sheet, { header: "", footer: "" });
        setXlsxHtml(html);
        setActiveSheet(sheetName);
    };

    const loadPreview = async () => {
        if (!data) return;

        try {
            setLoading(true);

            const res = await authApis().get(endpoints["document-preview"](data.id), {
                responseType: "blob",
            });

            if (data.mimeType === DOCX_MIME) {
                setPreviewUrl("docx-blob");
                await renderAsync(res.data, docxContainerRef.current!, undefined, {
                    inWrapper: false,
                    ignoreWidth: true,
                });
            } else if (data.mimeType === XLSX_MIME) {
                const arrayBuffer = await res.data.arrayBuffer();
                const workbook = XLSX.read(arrayBuffer, { type: "array" });
                xlsxWorkbookRef.current = workbook;
                setXlsxSheets(workbook.SheetNames);
                renderSheet(workbook, workbook.SheetNames[0]);
                setPreviewUrl("xlsx-blob");
            } else {
                const url = window.URL.createObjectURL(res.data);
                setPreviewUrl(url);
            }
        } catch (err) {
            toast.error("Không thể xem trước tài liệu");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open) {
            loadPreview();
        } else {
            if (previewUrl) {
                if (previewUrl !== "docx-blob") window.URL.revokeObjectURL(previewUrl);
                setPreviewUrl(null);
            }
            if (docxContainerRef.current) {
                docxContainerRef.current.innerHTML = "";
            }
            setXlsxHtml(null);
            setXlsxSheets([]);
            setActiveSheet("");
            xlsxWorkbookRef.current = null;
        }
    }, [open]);

    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex justify-center items-center h-full">
                    <Spinner />
                </div>
            );
        }

        if (!previewUrl) {
            return (
                <div className="flex justify-center items-center h-full text-muted-foreground">
                    Không có dữ liệu để hiển thị
                </div>
            );
        }

        if (data?.mimeType.startsWith("image/")) {
            return (
                <div className="flex justify-center items-center h-full">
                    <img
                        src={previewUrl}
                        alt={data?.name}
                        className="max-h-full max-w-full rounded-xl shadow"
                    />
                </div>
            );
        }

        if (data?.mimeType === "application/pdf") {
            return (
                <iframe
                    src={previewUrl}
                    className="w-full h-[80vh] rounded-xl"
                    title={data?.name}
                />
            );
        }

        if (data?.mimeType.startsWith("text/")) {
            return (
                <iframe
                    src={previewUrl}
                    className="w-full h-[80vh]"
                    title={data?.name}
                />
            );
        }

        if (data?.mimeType.startsWith("video/")) {
            return (
                <div className="flex justify-center items-center h-full">
                    <video controls className="w-full h-[80vh] rounded-xl shadow-md">
                        <source src={previewUrl} type={data?.mimeType} />
                    </video>
                </div>
            );
        }

        if (data?.mimeType.startsWith("audio/")) {
            return (
                <div className="flex justify-center items-center h-full">
                    <audio controls className="w-full h-full">
                        <source src={previewUrl} type={data?.mimeType} />
                    </audio>
                </div>
            );
        }

        return (
            <div className="flex flex-col justify-center items-center h-full text-muted-foreground">
                Không hỗ trợ xem cho loại file này.
            </div>
        );
    };

    const isDocx = data?.mimeType === DOCX_MIME;
    const isXlsx = data?.mimeType === XLSX_MIME;
    const isWide = isDocx || isXlsx;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={`w-full flex flex-col ${isWide ? "sm:max-w-5xl" : "sm:max-w-2xl"}`} aria-describedby={undefined}>
                <DialogHeader>
                    <DialogTitle>{data?.name}</DialogTitle>
                </DialogHeader>
                <div className="flex-1 mt-2">
                    <div
                        ref={docxContainerRef}
                        className={`w-full h-[80vh] overflow-y-auto rounded-xl border bg-white p-6 text-black ${isDocx && !loading ? "block" : "hidden"}`}
                    />
                    {isXlsx && !loading && xlsxHtml && (
                        <div className="flex flex-col h-[80vh]">
                            {xlsxSheets.length > 1 && (
                                <div className="flex gap-1 mb-2 flex-wrap">
                                    {xlsxSheets.map((name) => (
                                        <button
                                            key={name}
                                            onClick={() => renderSheet(xlsxWorkbookRef.current!, name)}
                                            className={`px-3 py-1 text-sm rounded border ${activeSheet === name ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-accent"}`}
                                        >
                                            {name}
                                        </button>
                                    ))}
                                </div>
                            )}
                            <div
                                className="flex-1 overflow-auto rounded-xl border bg-white text-black text-sm [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-gray-300 [&_td]:px-2 [&_td]:py-1 [&_th]:border [&_th]:border-gray-300 [&_th]:px-2 [&_th]:py-1 [&_th]:bg-gray-100"
                                dangerouslySetInnerHTML={{ __html: xlsxHtml }}
                            />
                        </div>
                    )}
                    {(!isDocx && !isXlsx || loading) && renderContent()}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default DocumentPreviewModal;