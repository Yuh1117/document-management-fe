import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState, type ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authApis, endpoints } from "@/config/Api";
import { toast } from "sonner";

interface IForm {
    content: string;
    password?: string,
    file: File
}

const fieldNames: { [key: string]: string } = {
    content: "Nội dung",
    password: "Mật khẩu (tùy chọn)",
    file: "Tệp"
};

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

const HideDataModal = ({ open, onOpenChange }: Props) => {
    const form = useForm<IForm>();
    const [loading, setLoading] = useState<boolean>(false);
    const [decryptedData, setDecryptedData] = useState<string | null>(null);
    const [currentTab, setCurrentTab] = useState<string>("hide");

    const setError = (field: keyof IForm, message: string): void => {
        form.setError(field, { type: "manual", message: message });
    };

    const validateEmpty = (field: keyof IForm, value: string): boolean => {
        form.clearErrors(field);
        if (!value) {
            setError(field, `${fieldNames[field]} không được để trống`);
            return false;
        }
        return true;
    };

    const validateImage = (file: File): boolean => {
        form.clearErrors('file')
        if (!file) {
            setError("file", "File không được để trống")
            return false;
        }

        const validImageTypes = ["application/pdf"]
        if (!validImageTypes.includes(file.type)) {
            setError("file", "Vui lòng chọn một file hợp lệ");
            return false;
        }
        return true;
    };

    const validate = (data: IForm): boolean => {
        let flag = true;
        if (!validateEmpty("content", data.content)) {
            flag = false;
        }

        if (!validateImage(data.file)) {
            flag = false;
        }
        return flag;
    };

    const onSubmit = async (data: IForm) => {
        form.clearErrors();
        setDecryptedData("")

        if (currentTab === "hide") {
            if (validate(data)) {
                try {
                    setLoading(true);

                    let form = new FormData();
                    Object.entries(data).forEach(([key, value]) => {
                        form.append(key, value);
                    });

                    const res = await authApis().post(endpoints["hide-data"], form, {
                        responseType: "blob"
                    });

                    const url = window.URL.createObjectURL(new Blob([res.data]));
                    const link = document.createElement("a");

                    link.href = url;
                    link.setAttribute("download", data.file.name);
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                    window.URL.revokeObjectURL(url);

                    toast.success("Thành công", {
                        duration: 2000
                    })
                    onOpenChange(false)
                } catch (error) {
                    console.error("Lỗi", error);
                    toast.error("Thất bại", {
                        duration: 2000
                    })
                } finally {
                    setLoading(false);
                }
            }
        } else {
            if (validateImage(data.file)) {
                try {
                    setLoading(true);

                    let form = new FormData();
                    Object.entries(data).forEach(([key, value]) => {
                        form.append(key, value);
                    });

                    const res: any = await authApis().post(endpoints["extract-data"], form);
                    setDecryptedData(res.data.data)

                    toast.success("Thành công", {
                        duration: 2000
                    })
                } catch (error) {
                    console.error("Lỗi:", error);
                    toast.error("Thất bại", {
                        duration: 2000
                    })
                } finally {
                    setLoading(false);
                }
            }
        }

    };

    useEffect(() => {
        if (open) {
            form.reset()
            setDecryptedData("")
        }
    }, [open, currentTab])

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent aria-describedby={undefined}>
                <DialogHeader>
                    <DialogTitle>Ẩn Dữ Liệu</DialogTitle>
                </DialogHeader>

                <Tabs defaultValue="hide" value={currentTab} onValueChange={(value) => setCurrentTab(value)}>
                    <TabsList className="mb-1">
                        <TabsTrigger value="hide">Ẩn</TabsTrigger>
                        <TabsTrigger value="extract">Trích xuất</TabsTrigger>
                    </TabsList>

                    <TabsContent value="hide">
                        <Form {...form}>
                            <form className="p-1" onSubmit={form.handleSubmit(onSubmit)}>
                                <div className="flex flex-col gap-6">
                                    <FormField
                                        control={form.control}
                                        name="file"
                                        render={() => (
                                            <FormItem>
                                                <FormLabel>{fieldNames.file}</FormLabel>
                                                <FormControl>
                                                    <Input type="file" accept="application/pdf"
                                                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                            const file = e.target.files?.[0];
                                                            form.setValue("file", file!);
                                                            validateImage(file!);
                                                        }} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="content"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{fieldNames.content}</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        {...field}
                                                        value={field.value || ""}
                                                        onChange={(e) => form.setValue("content", e.target.value)}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{fieldNames.password}</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="password"
                                                        {...field}
                                                        value={field.value || ""}
                                                        onChange={(e) => form.setValue("password", e.target.value)}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </form>
                        </Form>

                    </TabsContent>

                    <TabsContent value="extract">
                        <Form {...form}>
                            <form className="p-1" onSubmit={form.handleSubmit(onSubmit)}>
                                <div className="flex flex-col gap-6">
                                    <FormField
                                        control={form.control}
                                        name="file"
                                        render={() => (
                                            <FormItem>
                                                <FormLabel>{fieldNames.file}</FormLabel>
                                                <FormControl>
                                                    <Input type="file" accept="application/pdf"
                                                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                            const file = e.target.files?.[0];
                                                            form.setValue("file", file!);
                                                            validateImage(file!);
                                                        }} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{fieldNames.password}</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="password"
                                                        {...field}
                                                        value={field.value || ""}
                                                        onChange={(e) => form.setValue("password", e.target.value)}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </form>
                        </Form>

                        {decryptedData && (
                            <div className="mt-4 p-2 border rounded-xl bg-gray-100">
                                <h3 className="font-semibold">Dữ liệu giải mã:</h3>
                                <p>{decryptedData}</p>
                            </div>
                        )}

                    </TabsContent>
                </Tabs>

                <DialogFooter className="mt-5">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Hủy
                    </Button>
                    <Button onClick={() => form.handleSubmit(onSubmit)()} disabled={loading}>
                        {loading ? <Spinner size={16} /> : "Xác nhận"}
                    </Button>
                </DialogFooter>

            </DialogContent>
        </Dialog>
    );
};

export default HideDataModal;