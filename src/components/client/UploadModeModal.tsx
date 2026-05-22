import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { useParams } from "react-router";
import { authApis, endpoints } from "@/config/api";
import { toast } from "sonner";
import { useAppDispatch } from "@/redux/hooks";
import { triggerReload } from "@/redux/reducers/filesSlice";
import { Spinner } from "../ui/spinner";
import { useTranslation } from "react-i18next";

type Props = {
    files: File[] | null
    open: boolean,
    onOpenChange: (open: boolean) => void,
}

const UploadModeModal = ({ open, onOpenChange, files }: Props) => {
    const { t } = useTranslation();
    const [mode, setMode] = useState<string>("replace")
    const { id } = useParams<{ id: string }>()
    const dispatch = useAppDispatch()
    const [isUploading, setIsUploading] = useState<boolean>(false)

    const handleUpload = async () => {
        if (!files) return;

        try {
            setIsUploading(true)

            const formData = new FormData();
            for (let i = 0; i < files.length; i++) {
                formData.append("files", files[i]);
            }

            if (id) {
                formData.append("folderId", id);
            }

            if (mode === "replace") {
                await authApis().post(endpoints["upload-replace-doc"], formData);
            } else {
                await authApis().post(endpoints["upload-keep-doc"], formData);
            }

            toast.success(t('upload.upload_success'), {
                duration: 2000
            })
            onOpenChange(false);
        } catch (err) {
            console.error("Upload conflict files failed: ", err);
            toast.error(t('upload.upload_failed'), {
                duration: 2000
            });
        } finally {
            setIsUploading(false)
            dispatch(triggerReload());
        }
    };

    useEffect(() => {
        if (open) {
            setMode("replace")
        }
    }, [open]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent aria-describedby={undefined}>
                <DialogHeader>
                    <DialogTitle>{t('upload.conflict_mode_title')}</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    {t('upload.conflict_exists')}
                </DialogDescription>
                <div className="flex items-center p-2">
                    <RadioGroup defaultValue={mode} onValueChange={(value: string) => setMode(value)}>
                        <div className="flex items-center gap-3 mb-1">
                            <RadioGroupItem value="replace" id="r1" />
                            <Label htmlFor="r1">{t('upload.mode_replace')}</Label>
                        </div>
                        <div className="flex items-center gap-3">
                            <RadioGroupItem value="keep" id="r2" />
                            <Label htmlFor="r2">{t('upload.mode_keep')}</Label>
                        </div>
                    </RadioGroup>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange?.(false)}>{t('common.cancel')}</Button>
                    <Button onClick={handleUpload} disabled={isUploading}>
                        {isUploading ? <Spinner size={16} /> : t('common.confirm')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default UploadModeModal;
