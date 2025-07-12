import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "react-router";
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useState } from "react";
import { Loader2Icon } from "lucide-react"
import { FcGoogle } from "react-icons/fc";

const fieldNames: { [key: string]: string } = {
    firstName: "Tên",
    lastName: "Họ",
    email: "Email",
    password: "Mật khẩu",
    avatar: "Avatar"
};

const Signup = () => {
    const form = useForm();
    const [loading, setLoading] = useState(false)

    const setError = (field: string, message: string): void => {
        form.setError(field, { type: "manual", message: message })
    }

    const validateEmpty = (field: string, value: string): boolean => {
        if (!value) {
            setError(field, `${fieldNames[field]} không được để trống`);
            return false;
        }
        return true
    }

    const validateEmail = (value: string): boolean => {
        form.clearErrors('email')
        if (validateEmpty('email', value) === false) return false;

        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(value)) {
            setError("email", "Email không hợp lệ")
            return false
        }
        return true
    }

    const validatePassword = (value: string): boolean => {
        form.clearErrors('password')
        if (validateEmpty('password', value) === false) return false;

        return true
    }

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

            <Card className="w-full md:max-w-md">
                <CardContent >
                    <Form {...form}>
                        <form className="p-2" onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-col items-center text-center gap-1">
                                    <h1 className="text-2xl font-bold">DMS</h1>
                                    <p className="text-muted-foreground text-balance">
                                        Đăng ký tài khoản
                                    </p>
                                </div>

                                <FormField
                                    control={form.control}
                                    name="lastName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Họ</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Nhập họ" {...field}
                                                    value={field.value || ""}
                                                    onBlur={() => validateEmpty("lastName", field.value)} />
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
                                                <Input placeholder="Nhập tên" {...field}
                                                    value={field.value || ""}
                                                    onBlur={() => validateEmpty("firstName", field.value)} />
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
                                                <Input placeholder="Nhập email" {...field}
                                                    value={field.value || ""}
                                                    onBlur={() => validateEmail(field.value)} />
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
                                                <Input type="password" placeholder="Nhập mật khẩu" {...field}
                                                    value={field.value || ""}
                                                    onBlur={() => validatePassword(field.value)} />
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
                                                    value={field.value || ""} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? <Loader2Icon className="animate-spin" /> : "Đăng ký"}
                                </Button>

                                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                                    <span className="bg-card text-muted-foreground relative z-10 px-2">
                                        Hoặc tiếp tục với
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <Button variant="outline" type="button" className="w-full">
                                        <FcGoogle />
                                        Đăng nhập với Google
                                    </Button>
                                </div>

                                <div className="text-center text-sm">
                                    Đã có tài khoản?{" "}
                                    <Link to={"/login"}><span className="underline underline-offset-4">Đăng nhập</span></Link>
                                </div>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}

export default Signup;