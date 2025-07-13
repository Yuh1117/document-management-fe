import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "react-router";
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useState, type ChangeEvent } from "react";
import { Loader2Icon } from "lucide-react"
import { FcGoogle } from "react-icons/fc";
import { ChangeLanguage } from "@/components/settings/change-language";
import { useTranslation } from "react-i18next";
import { ModeToggle } from "@/components/settings/theme-toggle";

const fieldNames: { [key: string]: string } = {
    firstName: "Tên",
    lastName: "Họ",
    email: "Email",
    password: "Mật khẩu",
    avatar: "Avatar"
};

const Signup = () => {
    const form = useForm();
    const [loading, setLoading] = useState<boolean>(false)
    const [avatar, setAvatar] = useState<File | null | undefined>(null)
    const { t } = useTranslation()

    const setError = (field: string, message: string): void => {
        form.setError(field, { type: "manual", message: message })
    }

    const validateEmpty = (field: string, value: string): boolean => {
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


    const validate = (data: any): boolean => {
        let flag: boolean = true;
        if (!validateEmpty("lastName", data['lastName'])) {
            flag = false;
        }
        if (!validateEmpty("firstName", data['firstName'])) {
            flag = false;
        }
        if (!validateEmail(data['email'])) {
            flag = false
        }
        if (!validatePassword(data['password'])) {
            flag = false
        }
        if (avatar) {
            if (!validateImage(avatar)) {
                flag = false;
            }
        }
        return flag
    }

    const onSubmit = async (data: any) => {
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
                                    <h1 className="text-2xl font-bold">DMS</h1>
                                    <p className="text-muted-foreground text-balance">
                                        {t('signup.title')}
                                    </p>
                                </div>

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
                                                <Input type="password" placeholder={t('login.password_placeholder')} {...field}
                                                    value={field.value || ""}
                                                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                        form.setValue('password', e.target.value)
                                                        validatePassword(e.target.value)
                                                    }} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="avatar"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Avatar</FormLabel>
                                            <FormControl>
                                                <Input type="file" accept="image/*" {...field}
                                                    value={field.value || ""}
                                                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                        form.setValue('avatar', e.target.value)
                                                        setAvatar(e.target.files?.[0])
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
                                    {t('signup.already_account') + " "}
                                    <Link to={"/login"}><span className="underline underline-offset-4">{t('login.label')}</span></Link>
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

export default Signup;