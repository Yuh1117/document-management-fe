import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import { authApis, endpoints } from "@/config/Api";
import type { IDocument, IDocumentSummarize } from "@/types/type";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";

type Props = {
    data: IDocument | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

const DocumentSummarizeModal = ({ data, open, onOpenChange }: Props) => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<IDocumentSummarize | null>(null);

    useEffect(() => {
        if (open) {
            setResult(null);
        }
    }, [open, data?.id]);

    const runSummarize = async () => {
        if (!data) return;
        try {
            setLoading(true);
            
            const res = await authApis().get(endpoints["document-summarize"](data.id));
            setResult(res.data.data as IDocumentSummarize);
        } catch (error: unknown) {
            console.error("Lỗi khi tóm tắt tài liệu", error);
            toast.error("Tóm tắt thất bại", { duration: 3000 });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg" aria-describedby={undefined}>
                <DialogHeader>
                    <DialogTitle>Tóm tắt tài liệu</DialogTitle>
                    <DialogDescription className="sr-only">
                        Tạo tóm tắt nội dung bằng AI cho tài liệu đã chọn.
                    </DialogDescription>
                </DialogHeader>
                {data && (
                    <p className="text-sm text-muted-foreground truncate" title={data.name}>
                        {data.name}
                    </p>
                )}
                {result ? (
                    <ScrollArea className="max-h-[min(360px,50vh)] rounded-md border p-3">
                        <p className="text-sm whitespace-pre-wrap">{result.summaryText}</p>
                    </ScrollArea>
                ) : (
                    <div className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
                        Nhấn &quot;Tạo tóm tắt&quot; để tạo nội dung tóm tắt.
                    </div>
                )}
                {result && (() => {
                    const meta: string[] = [];
                    if (result.modelName) meta.push(`Mô hình: ${result.modelName}`);
                    return meta.length > 0 ? (
                        <p className="text-xs text-muted-foreground">{meta.join(" · ")}</p>
                    ) : null;
                })()}
                <DialogFooter className="gap-2">
                    {result && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setResult(null)}
                            disabled={loading}
                        >
                            Xoá kết quả
                        </Button>
                    )}
                    <Button type="button" onClick={runSummarize} disabled={loading || !data}>
                        {loading ? (
                            <>
                                <Spinner size={16} className="me-2" />
                                Đang tóm tắt…
                            </>
                        ) : (
                            <>
                                <Sparkles className="size-4 me-2" />
                                {result ? "Tạo lại" : "Tạo tóm tắt"}
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DocumentSummarizeModal;
