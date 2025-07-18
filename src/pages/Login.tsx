import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "react-router";
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useState, type ChangeEvent } from "react";
import { Loader2Icon } from "lucide-react"
import { FcGoogle } from "react-icons/fc";
import { useTranslation } from "react-i18next";
import { ChangeLanguage } from "@/components/settings/ChangeLanguage";
import { ModeToggle } from "@/components/settings/ThemeToggle";

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
        if (validate(data) === true) {
            try {
                setLoading(true);

                console.log(data)
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">

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
                                    <Button variant="outline" type="button" className="w-full">
                                        <FcGoogle />
                                        {t('login.google')}
                                    </Button>
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