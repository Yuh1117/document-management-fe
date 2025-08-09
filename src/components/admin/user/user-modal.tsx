import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import type { IRole, IUser } from "@/types/type";
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

const fieldNames: { [key: string]: string } = {
    firstName: "Họ",
    lastName: "Tên",
    email: "Email",
    password: "Mật khẩu",
    avatar: "Avatar",
    role: "Vai trò"
};

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    isEditing: boolean;
    data: IUser | null | undefined
    loadUsers: () => void
};

const UserModal = ({
    open,
    onOpenChange,
    isEditing,
    data,
    loadUsers
}: Props) => {
    const form = useForm<IUser>();
    const [loading, setLoading] = useState<boolean>(false)
    const [msg, setMsg] = useState<string>("")
    const [roles, setRoles] = useState<IRole[]>([])

    const setError = (field: keyof IUser, message: string): void => {
        form.setError(field, { type: "manual", message: message })
    }

    const validateEmpty = (field: keyof IUser, value: string): boolean => {
        form.clearErrors(field)
        if (!value) {
            setError(field, `${fieldNames[field]} không được để trống`);
            return false;
        }
        return true
    }

    const validateEmail = (value: string): boolean => {
        if (validateEmpty('email', value) === false) return false;

        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(value)) {
            setError("email", "Email không hợp lệ")
            return false
        }
        return true
    }

    const validatePassword = (value: string): boolean => {
        if (validateEmpty('password', value) === false) return false;

        return true
    }

    const validateImage = (file: File): boolean => {
        form.clearErrors('avatar')
        if (!file) return true;

        const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!validImageTypes.includes(file.type)) {
            setError("avatar", "Vui lòng chọn một hình ảnh hợp lệ");
            return false;
        }
        return true;
    };

    const validate = (data: IUser): boolean => {
        let flag = true;

        if (!validateEmpty("lastName", data.lastName)) {
            flag = false;
        }
        if (!validateEmpty("firstName", data.firstName)) {
            flag = false;
        }
        if (!validateEmpty("role", data?.role?.id.toString() || "")) {
            flag = false;
        }
        if (!validateEmail(data.email)) {
            flag = false
        }
        if (!validatePassword(data.password)) {
            flag = false
        }
        if (data.avatar && data.avatar instanceof File) {
            if (!validateImage(data.avatar)) {
                flag = false;
            }
        }

        return flag;
    }

    const loadRoles = async () => {
        try {
            const res = await authApis().get(endpoints["roles"]);
            setRoles(res.data.data.result);
        } catch (error) {
            console.log(error)
        }
    }

    const onSubmit = async (data: IUser) => {
        form.clearErrors()
        setMsg("")

        if (validate(data) === true) {
            try {
                setLoading(true);

                let form = new FormData();
                Object.entries(data).forEach(([key, value]) => {
                    if (key === "avatar" && value instanceof File) {
                        form.append("file", value);
                    } else if (key === "role" && value?.id) {
                        form.append("role.id", value.id);
                    } else if (value !== undefined && value !== null) {
                        form.append(key, value);
                    }
                });

                if (isEditing) {
                    await authApis().patch(endpoints["users-detail"](data.id), form)
                    onOpenChange(false)
                    loadUsers()
                } else {
                    await authApis().post(endpoints["users"], form)
                    onOpenChange(false)
                    loadUsers()
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
                form.unregister();
            }
            form.clearErrors();
            setMsg("");
        }
    }, [open]);

    useEffect(() => {
        loadRoles();
    }, [])


    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-full md:max-w-2xl" aria-describedby={undefined}>
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Chỉnh sửa người dùng" : "Thêm mới người dùng"}</DialogTitle>
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
                                    name="lastName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Họ</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    value={field.value || ""}
                                                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                        form.setValue("lastName", e.target.value);
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="firstName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tên</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    value={field.value || ""}
                                                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                        form.setValue("firstName", e.target.value);
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    value={field.value || ""}
                                                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                        form.setValue("email", e.target.value);
                                                    }}
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
                                            <FormLabel>Mật khẩu</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="password"
                                                    {...field}
                                                    value={field.value || ""}
                                                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                        form.setValue("password", e.target.value);
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="role"
                                    render={({ field }) => (
                                        <FormItem  >
                                            <FormLabel>Vai trò</FormLabel>
                                            <Select
                                                value={field.value?.id.toString() || ""}
                                                onValueChange={(v: string) => {
                                                    const selectedRole = roles?.find(r => r.id === parseInt(v));
                                                    if (selectedRole) {
                                                        form.setValue("role", selectedRole);
                                                    }
                                                }}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className={`w-full ${form.formState.errors.role ? "border-red-500" : ""}`}>
                                                        <SelectValue placeholder="Chọn vai trò">
                                                            {field.value?.name || ""}
                                                        </SelectValue>
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Vai trò</SelectLabel>
                                                        {roles &&
                                                            roles.map(role => (
                                                                <SelectItem key={role.id} value={role.id.toString()}>
                                                                    {role.name}
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
                                    name="avatar"
                                    render={() => (
                                        <FormItem>
                                            <FormLabel>Avatar</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            form.setValue("avatar", file);
                                                        }
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
        </Dialog>
    );
};

export default UserModal;