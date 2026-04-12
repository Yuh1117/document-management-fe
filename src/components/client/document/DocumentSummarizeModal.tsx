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
import { Textarea } from "@/components/ui/textarea";
import { authApis, endpoints } from "@/config/api";
import type { IDocument, IDocumentSummarize, ISummaryFeedbackDocumentStats, ISummaryFeedbackRes } from "@/types/type";
import { Sparkles, ThumbsDown, ThumbsUp } from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

type Props = {
    data: IDocument | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

const DocumentSummarizeModal = ({ data, open, onOpenChange }: Props) => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<IDocumentSummarize | null>(null);
    const [feedbackStats, setFeedbackStats] = useState<ISummaryFeedbackDocumentStats | null>(null);
    const [myFeedback, setMyFeedback] = useState<ISummaryFeedbackRes | null>(null);
    const [submittingFeedback, setSubmittingFeedback] = useState(false);
    const [showCommentBox, setShowCommentBox] = useState(false);
    const [comment, setComment] = useState("");
    const [pendingVote, setPendingVote] = useState<boolean | null>(null);

    useEffect(() => {
        if (open) {
            setResult(null);
            setFeedbackStats(null);
            setMyFeedback(null);
            setShowCommentBox(false);
            setComment("");
            setPendingVote(null);
        }
    }, [open, data?.id]);

    const loadFeedbackStats = async () => {
        if (!data) return;
        try {
            const res = await authApis().get(endpoints["document-summary-feedback"](data.id));
            setFeedbackStats(res.data.data as ISummaryFeedbackDocumentStats);
        } catch (err) {
            console.error(err);
        }
    };

    const runSummarize = async () => {
        if (!data) return;
        try {
            setLoading(true);
            const res = await authApis().get(endpoints["document-summarize"](data.id));
            setResult(res.data.data as IDocumentSummarize);
            await loadFeedbackStats();
            setMyFeedback(null);
        } catch (error: unknown) {
            console.error("Lỗi khi tóm tắt tài liệu", error);
            toast.error("Tóm tắt thất bại", { duration: 3000 });
        } finally {
            setLoading(false);
        }
    };

    const handleVote = (isHelpful: boolean) => {
        if (myFeedback) return;
        setPendingVote(isHelpful);
        setShowCommentBox(true);
        setComment("");
    };

    const submitFeedback = async () => {
        if (!data || pendingVote === null || !result) return;
        try {
            setSubmittingFeedback(true);
            const res = await authApis().post(endpoints["document-summary-feedback"](data.id), {
                summaryId: result.id,
                isHelpful: pendingVote,
                comment: comment.trim() || undefined,
            });
            setMyFeedback(res.data.data as ISummaryFeedbackRes);
            setShowCommentBox(false);
            toast.success("Đã gửi phản hồi");
            await loadFeedbackStats();
        } catch {
            toast.error("Gửi phản hồi thất bại");
        } finally {
            setSubmittingFeedback(false);
        }
    };

    const cancelFeedback = () => {
        setShowCommentBox(false);
        setPendingVote(null);
        setComment("");
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
                    <ScrollArea className="max-h-[min(360px,50vh)] rounded-xl border p-3">
                        <p className="text-sm whitespace-pre-wrap">{result.summaryText}</p>
                    </ScrollArea>
                ) : (
                    <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
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

                {result && (
                    <>
                        <Separator />
                        <div className="space-y-2">
                            <p className="text-xs text-muted-foreground">Tóm tắt này có hữu ích không?</p>
                            {myFeedback ? (
                                <p className="text-xs text-green-600">
                                    Bạn đã đánh giá: {myFeedback.isHelpful ? "Hữu ích" : "Không hữu ích"}
                                </p>
                            ) : showCommentBox ? (
                                <div className="space-y-2">
                                    <p className="text-xs text-muted-foreground">
                                        {pendingVote ? "Hữu ích" : "Không hữu ích"} — thêm nhận xét (tuỳ chọn):
                                    </p>
                                    <Textarea
                                        placeholder="Nhận xét..."
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        rows={2}
                                        className="text-sm"
                                    />
                                    <div className="flex gap-2">
                                        <Button size="sm" onClick={submitFeedback} disabled={submittingFeedback}>
                                            {submittingFeedback ? <Spinner size={14} className="me-1.5" /> : null}
                                            Gửi
                                        </Button>
                                        <Button size="sm" variant="ghost" onClick={cancelFeedback} disabled={submittingFeedback}>
                                            Huỷ
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleVote(true)}
                                    >
                                        <ThumbsUp className="size-3.5 me-1" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleVote(false)}
                                    >
                                        <ThumbsDown className="size-3.5 me-1" />
                                    </Button>
                                </div>
                            )}
                            {feedbackStats && feedbackStats.totalCount > 0 && (
                                <p className="text-xs text-muted-foreground">
                                    {feedbackStats.helpfulCount}/{feedbackStats.totalCount} đánh giá hữu ích
                                </p>
                            )}
                        </div>
                    </>
                )}

                <DialogFooter className="gap-2">
                    {result && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => { setResult(null); setFeedbackStats(null); setMyFeedback(null); setShowCommentBox(false); setPendingVote(null); }}
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
