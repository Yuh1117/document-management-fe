import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router";
import cookies from "react-cookies";
import { useAppDispatch } from "@/redux/hooks";
import Api, { endpoints } from "@/config/Api";
import type { Dispatch, SetStateAction } from "react";
import { login } from "@/redux/reducers/UserReducer";

const GoogleLoginButton = ({ setMsg }: { setMsg: Dispatch<SetStateAction<string>> }) => {
    const dispatch = useAppDispatch()
    const nav = useNavigate();

    const handleLoginGoogle = async (credentialResponse: any) => {
        try {
            const res = await Api.post(endpoints["google-login"], {
                token: credentialResponse.credential,
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
    };

    return (
        <GoogleLogin
            onSuccess={handleLoginGoogle}
            onError={() => setMsg("Login Failed")}
            logo_alignment="center"
            shape="circle"
        />
    );
};

export default GoogleLoginButton