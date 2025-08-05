import { useAppSelector } from "@/redux/hooks";
import NotLogin from "./not-login";
import NotPermitted from "./not-permitted";
import { Navigate } from "react-router";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const user = useAppSelector(state => state.users.user);

    return user ? <>{children}</> : <NotLogin />;
};

export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
    const user = useAppSelector(state => state.users.user);

    return user ? user?.role === "ADMIN" ? <>{children}</> : <NotPermitted /> : <NotLogin />;
};

export const AuthRoute = ({ children }: { children: React.ReactNode }) => {
    const user = useAppSelector(state => state.users.user);

    return user ? <Navigate to="/" replace /> : <>{children}</>;
};