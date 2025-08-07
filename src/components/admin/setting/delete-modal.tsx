import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";
import { authApis, endpoints } from "@/config/Api";

type Props = {
    open: boolean;
    deletingId: number | null;
    onCancel: () => void;
    loadSettings: () => void
};

const DeleteModal = ({ open, deletingId, onCancel, loadSettings }: Props) => {
    const [loading, setLoading] = useState<boolean>(false);

    const onConfirm = async () => {
        try {
            setLoading(true);
            if (deletingId !== null) {
                await authApis().delete(endpoints["settings-detail"](deletingId));
                onCancel()
                loadSettings()
            }
        } catch (error) {
            console.log(error);
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
                <p>Bạn có chắc chắn muốn xoá cài đặt này không?</p>
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
