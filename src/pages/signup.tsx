import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link, useLocation, useNavigate } from "react-router";
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useEffect, useState, type ChangeEvent } from "react";
import { AlertCircleIcon, Loader2Icon } from "lucide-react"
import { useTranslation } from "react-i18next";
import type { LoginFormValues } from "./login";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Api, { endpoints } from "@/config/Api";
import { toast, Toaster } from "sonner";
import GoogleLoginButton from "@/components/client/google-login-button";
import { ChangeLanguage } from "@/components/shared/settings/change-language";
import { ModeToggle } from "@/components/shared/settings/theme-toggle";

interface SignupFormValues extends LoginFormValues {
    confirmPassword: string,
    firstName: string,
    lastName: string,
    avatar: File | null | undefined
}

const fieldNames: { [key: string]: string } = {
    firstName: "Tên",
    lastName: "Họ",
    email: "Email",
    password: "Mật khẩu",
    confirmPassword: "Xác nhận mật khẩu",
    avatar: "Avatar"
};

const Signup = () => {
    const form = useForm<SignupFormValues>();
    const [loading, setLoading] = useState<boolean>(false)
    const { t } = useTranslation()
    const [msg, setMsg] = useState<string>("")
    const nav = useNavigate()
    const location = useLocation()
    const isGoogleAuth = !!location.state?.newUser;

    const setError = (field: keyof SignupFormValues, message: string): void => {
        form.setError(field, { type: "manual", message: message })
    }

    const validateEmpty = (field: keyof SignupFormValues, value: string): boolean => {
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

    const validateConfirmPassword = (value: string): boolean => {
        if (validateEmpty("confirmPassword", value) === false) return false;

        if (value !== form.getValues("password")) {
            setError("confirmPassword", "Mật khẩu không khớp");
            return false;
        }
        return true;
    }

    const validateImage = (file: File | null | undefined): boolean => {
        form.clearErrors('avatar')
        if (!file) return true;

        const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!validImageTypes.includes(file.type)) {
            setError("avatar", "Vui lòng chọn một hình ảnh hợp lệ");
            return false;
        }
        return true;
    };


    const validate = (data: SignupFormValues): boolean => {
        let flag: boolean = true;
        if (!validateEmpty("lastName", data.lastName)) {
            flag = false;
        }
        if (!validateEmpty("firstName", data.firstName)) {
            flag = false;
        }
        if (!validateEmail(data.email)) {
            flag = false
        }
        if (!validatePassword(data.password)) {
            flag = false
        }
        if (!validateConfirmPassword(data.confirmPassword)) {
            flag = false
        }
        if (data.avatar) {
            if (!validateImage(data.avatar)) {
                flag = false;
            }
        }
        return flag
    }

    const onSubmit = async (data: SignupFormValues) => {
        form.clearErrors()
        setMsg("")

        if (validate(data) === true) {
            try {
                setLoading(true);

                let form = new FormData();
                Object.entries(data).forEach(([key, value]) => {
                    if (key !== "confirmPassword" && value != null) {
                        if (value instanceof File) {
                            form.append("file", value);
                        } else {
                            form.append(key, value);
                        }
                    }
                });

                await Api.post(endpoints["signup"], form, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                nav("/login", {
                    state: {
                        success: "Đăng ký tài khoản thành công."
                    }
                })

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
    };

    useEffect(() => {
        if (location.state?.newUser) {
            const user = location.state.newUser
            form.setValue("email", user.email)
            form.setValue("firstName", user.firstName)
            form.setValue("lastName", user.lastName)
            toast("Cần đăng ký tài khoản để dự phòng.", { duration: 5000 })
        }
    }, [location.state?.newUser]);

    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
            <Toaster position="top-center" />

            <Card className="w-full md:max-w-sm">
                <CardContent >
                    <Form {...form}>
                        <form className="p-1" onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-col items-center text-center gap-1">
                                    <h1 className="text-2xl font-bold">DMS</h1>
                                    <p className="text-muted-foreground text-balance">
                                        {isGoogleAuth ? "Hoàn tất đăng nhập bằng Google" : t('signup.title')}
                                    </p>
                                </div>

                                {msg &&
                                    <Alert className="border-red-500" variant="destructive">
                                        <AlertCircleIcon />
                                        <AlertDescription>
                                            {msg}
                                        </AlertDescription>
                                    </Alert>
                                }

                                <FormField
                                    control={form.control}
                                    name="lastName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t('signup.last_name')}</FormLabel>
                                            <FormControl>
                                                <Input placeholder={t('signup.last_name_placeholder')} {...field}
                                                    value={field.value || ""}
                                                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                        form.setValue('lastName', e.target.value)
                                                        validateEmpty('lastName', e.target.value)
                                                    }} />
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
                                            <FormLabel>{t('signup.first_name')}</FormLabel>
                                            <FormControl>
                                                <Input placeholder={t('signup.first_name_placeholder')} {...field}
                                                    value={field.value || ""}
                                                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                        form.setValue('firstName', e.target.value)
                                                        validateEmpty('firstName', e.target.value)
                                                    }} />
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
                                                <Input placeholder={t('login.email_placeholder')} {...field}
                                                    value={field.value || ""}
                                                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                        form.setValue('email', e.target.value)
                                                        validateEmail(e.target.value)
                                                    }}
                                                    disabled={isGoogleAuth} />
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
                                            <FormLabel>{t('login.password')}</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="password"
                                                    placeholder={t('login.password_placeholder')}
                                                    {...field}
                                                    value={field.value || ""}
                                                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                        form.setValue('password', e.target.value);
                                                        validatePassword(e.target.value);

                                                        const confirmPassword = form.getValues("confirmPassword");
                                                        if (confirmPassword) {
                                                            validateConfirmPassword(confirmPassword);
                                                        }
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t('signup.confirm_password')}</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="password"
                                                    placeholder={t('signup.confirm_password')}
                                                    {...field}
                                                    value={field.value || ""}
                                                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                        form.setValue('confirmPassword', e.target.value);
                                                        validateConfirmPassword(e.target.value);
                                                    }}
                                                />
                                            </FormControl>
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
                                                <Input type="file" accept="image/*"
                                                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                        const file = e.target.files?.[0];
                                                        form.setValue('avatar', file)
                                                        validateImage(e.target.files?.[0]);
                                                    }} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? <Loader2Icon className="animate-spin" /> : t('signup.label')}
                                </Button>

                                {!isGoogleAuth && <>
                                    <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                                        <span className="bg-card text-muted-foreground relative z-10 px-2">
                                            {t('login.or_continue')}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4">
                                        <GoogleLoginButton setMsg={setMsg} />
                                    </div>

                                    <div className="text-center text-sm">
                                        {t('signup.already_account') + " "}
                                        <Link to={"/login"}><span className="underline underline-offset-4">{t('login.label')}</span></Link>
                                    </div>
                                </>}
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            <div className="flex p-3 gap-2">
                <ChangeLanguage />
                <ModeToggle />
            </div>
        </div>
    )
}

export default Signup;