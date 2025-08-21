import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { authApis, endpoints } from "@/config/Api";
import { useAppDispatch } from "@/redux/hooks";
import { closeDocumentModal, triggerReload } from "@/redux/reducers/filesSlice";
import type { IDocument } from "@/types/type";
import { AlertCircleIcon } from "lucide-react";
import { useEffect, useState, type ChangeEvent } from "react";
import { useForm } from "react-hook-form";

const fieldNames: { [key: string]: string } = {
    name: "Tên"
};

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    data: IDocument | null | undefined
};

const DocumentModal = ({
    open,
    onOpenChange,
    data
}: Props) => {
    const form = useForm<IDocument>();
    const [loading, setLoading] = useState<boolean>(false)
    const [msg, setMsg] = useState<string>("")
    const dispatch = useAppDispatch()

    const setError = (field: keyof IDocument, message: string): void => {
        form.setError(field, { type: "manual", message: message })
    }

    const validateEmpty = (field: keyof IDocument, value: string): boolean => {
        form.clearErrors(field)
        if (!value) {
            setError(field, `${fieldNames[field]} không được để trống`);
            return false;
        }
        return true
    }

    const validate = (data: IDocument): boolean => {
        let flag = true;
        if (!validateEmpty("name", data.name)) {
            flag = false;
        }

        return flag;
    }

    const onSubmit = async (data: IDocument) => {
        form.clearErrors()
        setMsg("")

        if (validate(data) === true) {
            try {
                setLoading(true);

                await authApis().patch(endpoints["document-detail"](data.id), data);
                dispatch(closeDocumentModal())
                dispatch(triggerReload())
            } catch (error: any) {
                const errors = error.response.data.error;
                if (error.response?.status === 400) {
                    if (Array.isArray(errors)) {
                        errors.forEach((err: any) => {
                            setError(err.field, err.message);
                        });
                    } else {
                        setMsg(errors)
                    }
                } else {
                    setMsg("Lỗi hệ thống hoặc kết nối.");
                }
            } finally {
                setLoading(false);
            }
        }
    }

    useEffect(() => {
        if (open) {
            if (data) {
                form.reset(data);
            } else {
                form.unregister();
            }
            form.clearErrors();
            setMsg("");
        }
    }, [open]);


    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent aria-describedby={undefined}>
                <DialogHeader>
                    <DialogTitle>Đổi tên tài liệu</DialogTitle>
                </DialogHeader>
                {msg &&
                    <Alert className="border-red-500" variant="destructive">
                        <AlertCircleIcon />
                        <AlertDescription>
                            {msg}
                        </AlertDescription>
                    </Alert>
                }
                <Form {...form}>
                    <form className="p-1" onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="flex flex-col gap-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tên</FormLabel>
                                        <FormControl>
                                            <Input {...field}
                                                value={field.value || ""}
                                                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                    form.setValue('name', e.target.value)
                                                }} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mô tả</FormLabel>
                                        <FormControl>
                                            <Textarea {...field}
                                                value={field.value || ""}
                                                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                                                    form.setValue('description', e.target.value)
                                                }} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                        </div>
                    </form>
                </Form>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Hủy</Button>
                    <Button onClick={() => form.handleSubmit(onSubmit)()} disabled={loading}>
                        {loading ? <Spinner size={16} /> : "Lưu"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DocumentModal;