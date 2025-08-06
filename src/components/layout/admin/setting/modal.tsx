import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import type { ISetting } from "@/types/type";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useEffect, useState, type ChangeEvent } from "react";
import { authApis, endpoints } from "@/config/Api";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

const fieldNames: { [key: string]: string } = {
    key: "Key",
    value: "Value",
    description: "Mô tả"
};

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    isEditing: boolean;
    data: ISetting | null | undefined
    loadSettings: () => void
};

const SettingFormModal = ({
    open,
    onOpenChange,
    isEditing,
    data,
    loadSettings
}: Props) => {
    const form = useForm<ISetting>();
    const [loading, setLoading] = useState<boolean>(false)
    const [msg, setMsg] = useState<string>("")

    const setError = (field: keyof ISetting, message: string): void => {
        form.setError(field, { type: "manual", message: message })
    }

    const validateEmpty = (field: keyof ISetting, value: string): boolean => {
        form.clearErrors(field)
        if (!value) {
            setError(field, `${fieldNames[field]} không được để trống`);
            return false;
        }
        return true
    }

    const validate = (data: ISetting): boolean => {
        let flag = true;
        if (!validateEmpty("key", data.key)) {
            flag = false;
        }

        if (!validateEmpty("value", data.value)) {
            flag = false;
        }

        return flag;
    }

    const onSubmit = async (data: ISetting) => {
        form.clearErrors()
        setMsg("")

        if (validate(data) === true) {
            try {
                setLoading(true);
                if (isEditing) {
                    await authApis().patch(endpoints["settings-details"](data.id), data);
                    onOpenChange(false)
                    loadSettings()
                } else {
                    await authApis().post(endpoints["settings"], data);
                    onOpenChange(false)
                    loadSettings()
                }

            } catch (error: any) {
                if (error.response?.status === 400 && Array.isArray(error.response.data.error)) {
                    const errors = error.response.data.error;
                    errors.forEach((err: any) => {
                        setError(err.field, err.message);
                    });
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
                form.reset({ key: "", value: "", description: "" });
            }
            form.clearErrors();
            setMsg("");
        }
    }, [open]);


    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent aria-describedby={undefined}>
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Chỉnh sửa cài đặt" : "Thêm mới cài đặt"}</DialogTitle>
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
                    <form className="p-1">
                        <div className="flex flex-col gap-6">
                            <FormField
                                control={form.control}
                                name="key"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Key</FormLabel>
                                        <FormControl>
                                            <Input {...field}
                                                value={field.value || ""}
                                                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                    form.setValue('key', e.target.value)
                                                }} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="value"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Value</FormLabel>
                                        <FormControl>
                                            <Textarea {...field}
                                                value={field.value || ""}
                                                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                                                    form.setValue('value', e.target.value)
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

                            {isEditing && <>
                                <div className="flex items-center">
                                    <Label className="me-2">Tạo bởi</Label>
                                    <Badge variant="secondary">{data?.createdBy?.email}</Badge>
                                </div>

                                <div className="flex items-center">
                                    <Label className="me-2">Cập nhật bởi</Label>
                                    <Badge variant="secondary">{data?.updatedBy?.email}</Badge>
                                </div>
                            </>}
                        </div>
                    </form>
                </Form>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Hủy</Button>
                    <Button onClick={() => form.handleSubmit(onSubmit)()}
                        className={isEditing ? "bg-yellow-500 dark:bg-yellow-500 hover:bg-yellow-500/90 dark:hover:bg-yellow-500/90"
                            : "bg-blue-500 dark:bg-blue-500 hover:bg-blue-500/90 dark:hover:bg-blue-500/90"} disabled={loading}>
                        {loading ? <Spinner size={16} /> : "Lưu"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default SettingFormModal;