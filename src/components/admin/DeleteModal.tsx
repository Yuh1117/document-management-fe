import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useEffect, useState } from "react";
import api from "@/config/api";
import { useTranslation } from "react-i18next";
import { Alert, AlertDescription } from "../ui/alert";
import { AlertCircleIcon } from "lucide-react";

type Props = {
    open: boolean,
    deletingId: number | null,
    onCancel: () => void,
    name: string,
    load: () => void,
    endpoint: (id: number) => string
};

const DeleteModal = ({ open, deletingId, onCancel, name, load, endpoint }: Props) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [msg, setMsg] = useState<string>("")
    const { t } = useTranslation();

    const onConfirm = async () => {
        try {
            setLoading(true);
            if (deletingId !== null) {
                await api.delete(endpoint(deletingId));
                onCancel()
                load()
            }
        } catch (error: any) {
            if (error.response?.status === 409) {
                setMsg(error.response.data.error)
            } else {
                setMsg(t('validation.system_error'));
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (open) {
            setMsg("");
        }
    }, [open]);

    return (
        <Dialog open={open} onOpenChange={onCancel}>
            <DialogContent aria-describedby={undefined}>
                <DialogHeader>
                    <DialogTitle>{t('admin.delete_confirm_title')}</DialogTitle>
                </DialogHeader>
                {msg &&
                    <Alert className="border-red-500" variant="destructive">
                        <AlertCircleIcon />
                        <AlertDescription>
                            {msg}
                        </AlertDescription>
                    </Alert>
                }
                <div>{t('admin.delete_confirm_desc', { name })}</div>
                <DialogFooter>
                    <Button variant="outline" onClick={onCancel}>{t('common.cancel')}</Button>
                    <Button className="bg-red-500 dark:bg-red-500 hover:bg-red-500/90 dark:hover:bg-red-500/90"
                        onClick={onConfirm} disabled={loading}>
                        {loading ? <Spinner size={16} /> : t('admin.delete')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteModal;
