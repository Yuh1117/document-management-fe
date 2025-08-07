import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";
import { authApis } from "@/config/Api";
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

    const onConfirm = async () => {
        try {
            setLoading(true);
            if (deletingId !== null) {
                await authApis().delete(endpoint(deletingId));
                onCancel()
                load()
            }
        } catch (error: any) {
            if (error.response?.status === 409) {
                setMsg(error.response.data.error)
            } else {
                setMsg("Lỗi hệ thống hoặc kết nối.");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onCancel}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Xác nhận xoá</DialogTitle>
                </DialogHeader>
                {msg &&
                    <DialogDescription>
                        <Alert className="border-red-500" variant="destructive">
                            <AlertCircleIcon />
                            <AlertDescription>
                                {msg}
                            </AlertDescription>
                        </Alert>
                    </DialogDescription>
                }
                <p>Bạn có chắc chắn muốn xoá {name} này không?</p>
                <DialogFooter>
                    <Button variant="outline" onClick={onCancel}>Hủy</Button>
                    <Button className="bg-red-500 dark:bg-red-500 hover:bg-red-500/90 dark:hover:bg-red-500/90"
                        onClick={onConfirm} disabled={loading}>
                        {loading ? <Spinner size={16} /> : "Xoá"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteModal;
