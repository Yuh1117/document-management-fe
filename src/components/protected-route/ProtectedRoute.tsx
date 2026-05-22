import { useAppSelector } from "@/redux/hooks";
import NotLogin from "./NotLogin";
import NotPermitted from "./NotPermitted";
import { Navigate } from "react-router";
import LoadingScreen from "@/components/shared/LoadingScreen";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, loading } = useAppSelector(state => state.users);
    if (loading) return <LoadingScreen />;
    return user ? <>{children}</> : <NotLogin />;
};

export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, loading } = useAppSelector(state => state.users);
    if (loading) return <LoadingScreen />;
    return user ? user?.role.name.startsWith("ROLE_ADMIN") ? <>{children}</> : <NotPermitted /> : <NotLogin />;
};

export const AuthRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, loading } = useAppSelector(state => state.users);
    if (loading) return <LoadingScreen />;
    return user ? <Navigate to="/" replace /> : <>{children}</>;
};
