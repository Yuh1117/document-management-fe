import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import type { IPermission } from "@/types/type";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useEffect, useState, type ChangeEvent } from "react";
import { authApis, endpoints } from "@/config/Api";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatTime } from "@/config/utils";
import { ALL_METHODS, ALL_MODULES } from "@/config/permissions";

const fieldNames: { [key: string]: string } = {
    name: "Tên",
    module: "Module",
    method: "Method",
    apiPath: "Api path"
};

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    isEditing: boolean;
    data: IPermission | null | undefined
    loadPermissions: () => void
};

const PermissionModal = ({
    open,
    onOpenChange,
    isEditing,
    data,
    loadPermissions
}: Props) => {
    const form = useForm<IPermission>();
    const [loading, setLoading] = useState<boolean>(false)
    const [msg, setMsg] = useState<string>("")

    const setError = (field: keyof IPermission, message: string): void => {
        form.setError(field, { type: "manual", message: message })
    }

    const validateEmpty = (field: keyof IPermission, value: string): boolean => {
        form.clearErrors(field)
        if (!value) {
            setError(field, `${fieldNames[field]} không được để trống`);
            return false;
        }
        return true
    }


    const validate = (data: IPermission): boolean => {
        let flag = true;
        for (let key in data) {
            if (key !== 'createdAt' && key !== 'updatedAt') {
                if (!validateEmpty(key as keyof IPermission, data[key as keyof IPermission] as string)) {
                    flag = false;
                }
            }
        }

        return flag;
    }

    const onSubmit = async (data: IPermission) => {
        form.clearErrors()
        setMsg("")

        if (validate(data) === true) {
            try {
                setLoading(true);

                if (isEditing) {
                    await authApis().patch(endpoints["permissions-detail"](data.id), data)
                    onOpenChange(false)
                    loadPermissions()
                } else {
                    await authApis().post(endpoints["permissions"], data)
                    onOpenChange(false)
                    loadPermissions()
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
                form.reset();
            }
            form.clearErrors();
            setMsg("");
        }
    }, [open]);


    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-full md:max-w-2xl" aria-describedby={undefined}>
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Chỉnh sửa quyền" : "Thêm mới quyền"}</DialogTitle>
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
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tên</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    value={field.value || ""}
                                                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                        form.setValue("name", e.target.value);
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="module"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Module</FormLabel>
                                            <Select
                                                value={field.value || ""}
                                                onValueChange={(v: string) => {
                                                    form.setValue("module", v);
                                                }}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className={`w-full ${form.formState.errors.module ? "border-red-500" : ""}`}>
                                                        <SelectValue placeholder="Chọn module">
                                                            {field.value || ""}
                                                        </SelectValue>
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Module</SelectLabel>
                                                        {Object.entries(ALL_MODULES).map(([key, value]) => (
                                                            <SelectItem key={key} value={value}>
                                                                {value}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="method"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Method</FormLabel>
                                            <Select
                                                value={field.value || ""}
                                                onValueChange={(v: string) => {
                                                    form.setValue("method", v);
                                                }}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className={`w-full ${form.formState.errors.method ? "border-red-500" : ""}`}>
                                                        <SelectValue placeholder="Chọn method">
                                                            {field.value || ""}
                                                        </SelectValue>
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Method</SelectLabel>
                                                        {Object.entries(ALL_METHODS).map(([key, value]) => (
                                                            <SelectItem key={key} value={value}>
                                                                {value}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="apiPath"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Api path</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    value={field.value || ""}
                                                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                        form.setValue("apiPath", e.target.value);
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                            </div>

                            {isEditing && <>
                                <div className="flex items-center">
                                    <Label className="me-2">Tạo lúc</Label>
                                    <Badge variant="secondary">{formatTime(data?.createdAt)}</Badge>
                                </div>

                                <div className="flex items-center">
                                    <Label className="me-2">Cập nhật lúc</Label>
                                    <Badge variant="secondary">{formatTime(data?.updatedAt)}</Badge>
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
        </Dialog >
    );
};

export default PermissionModal;