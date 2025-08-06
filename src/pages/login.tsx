import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link, useLocation, useNavigate } from "react-router";
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useEffect, useState, type ChangeEvent } from "react";
import { AlertCircleIcon, CircleCheck, Loader2Icon } from "lucide-react"
import { useTranslation } from "react-i18next";
import { ChangeLanguage } from "@/components/settings/change-language";
import { ModeToggle } from "@/components/settings/theme-toggle";
import Api, { endpoints } from "@/config/Api";
import { Alert, AlertDescription } from "@/components/ui/alert";
import cookies from 'react-cookies';
import { useAppDispatch } from "@/redux/hooks";
import { login } from "@/redux/reducers/userSlide";
import { toast, Toaster } from "sonner";
import GoogleLoginButton from "@/components/layout/client/google-login-button";

export interface LoginFormValues {
    email: string;
    password: string;
}

const fieldNames: { [key: string]: string } = {
    email: "Email",
    password: "Mật khẩu",
};

const Login = () => {
    const form = useForm<LoginFormValues>();
    const [loading, setLoading] = useState<boolean>(false)
    const { t } = useTranslation()
    const [msg, setMsg] = useState<string>("");
    const nav = useNavigate();
    const dispatch = useAppDispatch();
    const location = useLocation();
    const successMsg = location.state?.success;

    const setError = (field: keyof LoginFormValues, message: string): void => {
        form.setError(field, { type: "manual", message: message })
    }

    const validateEmpty = (field: keyof LoginFormValues, value: string): boolean => {
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

    const validate = (data: LoginFormValues): boolean => {
        let flag: boolean = true;
        if (!validateEmail(data.email)) {
            flag = false
        }
        if (!validatePassword(data.password)) {
            flag = false
        }
        return flag
    }


    const onSubmit = async (data: LoginFormValues) => {
        form.clearErrors()
        setMsg("")

        if (validate(data) === true) {
            try {
                setLoading(true);
                const res = await Api.post(endpoints["login"], data)
                cookies.save('token', res.data.data.accessToken, { path: "/" });

                dispatch(login(res.data.data.user))
                nav("/")
            } catch (error: any) {
                if (error.response?.status === 401) {
                    setMsg("Tài khoản hoặc mật khẩu không chính xác");
                } else {
                    setMsg("Lỗi hệ thống hoặc kết nối.");
                }
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        if (successMsg) {
            toast(successMsg, {
                duration: 3000,
                icon: <CircleCheck />
            })
        }
    }, [successMsg])

    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
            <Toaster position="top-center" />

            <Card className="w-full md:max-w-sm">
                <CardContent >
                    <Form {...form}>
                        <form className="p-1" onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-col items-center text-center gap-1">
                                    <h1 className="text-2xl font-bold">{t('welcome')}</h1>
                                    <p className="text-muted-foreground text-balance">
                                        {t('login.title')}
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
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? <Loader2Icon className="animate-spin" /> : t('login.label')}
                                </Button>

                                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                                    <span className="bg-card text-muted-foreground relative z-10 px-2">
                                        {t('login.or_continue')}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <GoogleLoginButton setMsg={setMsg} />
                                </div>

                                <div className="text-center text-sm">
                                    {t('login.no_account') + " "}
                                    <Link to={"/signup"}><span className="underline underline-offset-4">{t('login.signup')}</span></Link>
                                </div>
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

export default Login;