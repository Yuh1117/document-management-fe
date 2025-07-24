import { useAppSelector } from "@/redux/hooks";
import NotLogin from "./NotLogin";
import NotPermitted from "./NotPermitted";
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