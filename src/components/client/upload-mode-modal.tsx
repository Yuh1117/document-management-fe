import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { useParams } from "react-router";
import { authApis, endpoints } from "@/config/Api";
import { toast } from "sonner";
import { useAppDispatch } from "@/redux/hooks";
import { triggerReload } from "@/redux/reducers/filesSlice";
import { Spinner } from "../ui/spinner";

type Props = {
    files: File[] | null
    open: boolean,
    onOpenChange: (open: boolean) => void,
}

const UploadModeModal = ({ open, onOpenChange, files }: Props) => {
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

            toast.success("Tải lên thành công", {
                duration: 2000
            })
            onOpenChange(false);
        } catch (err) {
            console.error("Upload conflict files failed: ", err);
            toast.error("Tải lên thất bại", {
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
                    <DialogTitle>Chọn chế độ tải lên</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Đã có tệp ở vị trí này, hãy chọn chế độ tải lên.
                </DialogDescription>
                <div className="flex items-center p-2">
                    <RadioGroup defaultValue={mode} onValueChange={(value: string) => setMode(value)}>
                        <div className="flex items-center gap-3 mb-1">
                            <RadioGroupItem value="replace" id="r1" />
                            <Label htmlFor="r1">Thay thế</Label>
                        </div>
                        <div className="flex items-center gap-3">
                            <RadioGroupItem value="keep" id="r2" />
                            <Label htmlFor="r2">Giữ tất cả</Label>
                        </div>
                    </RadioGroup>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange?.(false)}>Hủy</Button>
                    <Button onClick={handleUpload} disabled={isUploading}>
                        {isUploading ? <Spinner size={16} /> : "Xác nhận"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default UploadModeModal;