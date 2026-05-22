import { useEffect, useState } from "react";
import api, { endpoints } from "@/config/api";
import type { ISummarizeModel, ISummaryFeedbackModelStats } from "@/types/type";
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
import { Button } from "@/components/ui/button";
import { ThumbsDown, ThumbsUp, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const SummaryFeedbackAdminPage = () => {
    const { t } = useTranslation();
    const [stats, setStats] = useState<ISummaryFeedbackModelStats[]>([]);
    const [models, setModels] = useState<ISummarizeModel[]>([]);
    const [loading, setLoading] = useState(false);
    const [modelsLoading, setModelsLoading] = useState(false);
    const [reloading, setReloading] = useState(false);

    const load = async () => {
        try {
            setLoading(true);
            const res = await api.get(endpoints["summary-feedback-stats"]);
            setStats(res.data.data as ISummaryFeedbackModelStats[]);
        } catch (err) {
            console.error("Failed to load feedback stats", err);
        } finally {
            setLoading(false);
        }
    };

    const loadModels = async () => {
        try {
            setModelsLoading(true);
            const res = await api.get(endpoints["summarize-models"]);
            setModels(res.data.data.models as ISummarizeModel[]);
        } catch (err) {
            console.error("Failed to load models", err);
        } finally {
            setModelsLoading(false);
        }
    };

    const handleReloadModel = async () => {
        try {
            setReloading(true);
            await api.post(endpoints["summarize-models-reload"]);
            toast.success(t('admin.reload_model_success'));
            await loadModels();
        } catch (err) {
            console.error("Failed to reload model", err);
            toast.error(t('admin.reload_model_failed'));
        } finally {
            setReloading(false);
        }
    };

    useEffect(() => {
        load();
        loadModels();
    }, []);

    return (
        <>
            <header className="flex h-16 shrink-0 items-center gap-2">
                <div className="flex items-center justify-between gap-2 px-4 w-full">
                    <span>{t('admin.feedback_page_title')}</span>
                    <Button variant="outline" onClick={handleReloadModel} disabled={reloading}>
                        <RefreshCw className={reloading ? "animate-spin" : ""} />
                        {t('admin.reload_model')}
                    </Button>
                </div>
            </header>
            <div className="p-4 space-y-6">
                <div className="border rounded-xl p-5 shadow-xs">
                    <div className="flex items-center justify-between mb-3">
                        <span className="font-medium">{t('admin.model_list')}</span>
                        {modelsLoading && <Spinner size={18} />}
                    </div>
                    {models.length === 0 && !modelsLoading ? (
                        <p className="text-sm text-muted-foreground text-center py-4">{t('admin.no_models')}</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Version</TableHead>
                                    <TableHead>{t('admin.model_name')}</TableHead>
                                    <TableHead>{t('admin.created_at')}</TableHead>
                                    <TableHead className="text-center">{t('admin.status')}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {models.map((m) => (
                                    <TableRow key={m.version}>
                                        <TableCell className="font-medium">v{m.version}</TableCell>
                                        <TableCell>{m.modelName || "—"}</TableCell>
                                        <TableCell>{m.createdAt}</TableCell>
                                        <TableCell className="text-center">
                                            {m.isActive ? (
                                                <Badge className="bg-green-600">{t('admin.active')}</Badge>
                                            ) : (
                                                <Badge variant="secondary">{t('admin.inactive')}</Badge>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </div>

                <div className="border rounded-xl p-5 shadow-xs">
                    <div className="mb-3">
                        <span className="font-medium">{t('admin.feedback_stats')}</span>
                    </div>
                    {loading ? (
                        <div className="flex justify-center py-10">
                            <Spinner />
                        </div>
                    ) : stats.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-10">{t('admin.no_feedback')}</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{t('admin.model_name')}</TableHead>
                                    <TableHead className="text-center">{t('admin.total_feedback')}</TableHead>
                                    <TableHead className="text-center">{t('admin.helpful')}</TableHead>
                                    <TableHead className="text-center">{t('admin.not_helpful')}</TableHead>
                                    <TableHead className="text-center">{t('admin.helpful_rate')}</TableHead>
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
            </div>
        </>
    );
};

export default SummaryFeedbackAdminPage;
