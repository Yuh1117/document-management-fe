import { useEffect, useState } from "react";
import { authApis, endpoints } from "@/config/Api";
import type { ISummaryFeedbackModelStats } from "@/types/type";
import { Spinner } from "@/components/ui/spinner";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ThumbsDown, ThumbsUp } from "lucide-react";

const SummaryFeedbackAdminPage = () => {
    const [stats, setStats] = useState<ISummaryFeedbackModelStats[]>([]);
    const [loading, setLoading] = useState(false);

    const load = async () => {
        try {
            setLoading(true);
            const res = await authApis().get(endpoints["summary-feedback-stats"]);
            setStats(res.data.data as ISummaryFeedbackModelStats[]);
        } catch (err) {
            console.error("Lỗi khi tải thống kê phản hồi", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    return (
        <>
            <header className="flex h-16 shrink-0 items-center gap-2">
                <div className="flex items-center gap-2 px-4">
                    <span>Thống kê phản hồi tóm tắt AI</span>
                </div>
            </header>
            <div className="p-4">
                {loading ? (
                    <div className="flex justify-center py-10">
                        <Spinner />
                    </div>
                ) : stats.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-10">Chưa có dữ liệu phản hồi.</p>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Mô hình</TableHead>
                                <TableHead className="text-center">Tổng phản hồi</TableHead>
                                <TableHead className="text-center">Hữu ích</TableHead>
                                <TableHead className="text-center">Không hữu ích</TableHead>
                                <TableHead className="text-center">Tỉ lệ hữu ích</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {stats.map((row) => {
                                const rate = row.totalCount > 0
                                    ? Math.round((row.helpfulCount / row.totalCount) * 100)
                                    : 0;
                                return (
                                    <TableRow key={row.modelName}>
                                        <TableCell className="font-medium">{row.modelName || "—"}</TableCell>
                                        <TableCell className="text-center">{row.totalCount}</TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant="secondary" className="gap-1">
                                                <ThumbsUp className="size-3" />
                                                {row.helpfulCount}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant="secondary" className="gap-1">
                                                <ThumbsDown className="size-3" />
                                                {row.notHelpfulCount}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant={rate >= 70 ? "default" : rate >= 40 ? "secondary" : "destructive"}>
                                                {rate}%
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                )}
            </div>
        </>
    );
};

export default SummaryFeedbackAdminPage;
