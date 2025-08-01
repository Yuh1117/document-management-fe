import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router";
import cookies from "react-cookies";
import { useAppDispatch } from "@/redux/hooks";
import Api, { endpoints } from "@/config/Api";
import type { Dispatch, SetStateAction } from "react";
import { login } from "@/redux/reducers/UserReducer";
import { Button } from "./ui/button";
import { useTranslation } from "react-i18next";
import { FcGoogle } from "react-icons/fc";

const GoogleLoginButton = ({ setMsg }: { setMsg: Dispatch<SetStateAction<string>> }) => {
    const dispatch = useAppDispatch()
    const nav = useNavigate();
    const { t } = useTranslation();

    const handleLoginGoogle = useGoogleLogin({
        onSuccess: async (response: any) => {
            try {
                const res = await Api.post(endpoints["google-login"], {
                    code: response.code,
                });

                if (res.data.data.accessToken) {
                    cookies.save('token', res.data.data.accessToken, { path: "/" });

                    dispatch(login(res.data.data.user))
                    nav("/");
                } else {
                    nav("/signup", { state: { newUser: res.data.data } });
                }
            } catch (error: any) {
                if (error.response?.status === 401) {
                    setMsg(error.response.data);
                } else {
                    setMsg("Lỗi hệ thống hoặc kết nối.");
                }
            }
        },
        onError: () => setMsg("Đăng nhập thất bại."),
        flow: "auth-code"
    })

    return (
        <Button variant="outline" type="button" className="w-full" onClick={handleLoginGoogle}>
            <FcGoogle />
            {t('login.google')}
        </Button>
    );
};

export default GoogleLoginButton