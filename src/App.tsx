import { createBrowserRouter, Outlet, RouterProvider } from 'react-router'
import Home from './pages/client/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Header from './components/client/layout/Header'
import { SidebarInset, SidebarProvider } from './components/ui/Sidebar'
import { AdminRoute, AuthRoute, ProtectedRoute } from './components/protected-route/ProtectedRoute'
import { useAppDispatch } from './redux/hooks'
import { useEffect } from 'react'
import { getProfile } from './redux/reducers/userSlice'
import { AppSidebar } from './components/client/layout/AppSidebar'
import DashBoard from './pages/admin/Dashboard'
import SummaryFeedbackAdminPage from './pages/admin/SummaryFeedback'
import { ThemeProvider } from './components/shared/settings/ThemeProvider'
import { AdminSidebar } from './components/admin/layout/AdminSidebar'
import SettingAdminPage from './pages/admin/Setting'
import UserAdminPage from './pages/admin/User'
import PermissionAdminPage from './pages/admin/Permission'
import RoleAdminPage from './pages/admin/Role'
import Files from './pages/client/Files'

const homeLoader = async () => {
    return { message: "Trang chủ" };
};

const MainLayout = () => (
    <>
        <Header />
        <SidebarProvider className="min-h-0">
            <AppSidebar className="border-none pt-18" />
            <SidebarInset className="pe-2">
                <Outlet />
            </SidebarInset>
        </SidebarProvider>
    </>
);

const AdminLayout = () => (
    <>
        <SidebarProvider>
            <AdminSidebar />
            <SidebarInset>
                <Outlet />
            </SidebarInset>
        </SidebarProvider>
    </>
);

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <ProtectedRoute>
                <MainLayout />
            </ProtectedRoute>
        ),
        children: [
            {
                index: true,
                Component: Home,
                loader: homeLoader,
            },
            {
                path: "/my-files",
                element: <Files mode="my-files" />,
            },
            {
                path: "/search",
                element: <Files mode="search" />,
            },
            {
                path: "/advanced-search",
                element: <Files mode="search" />,
            },
            {
                path: "/folders/:id",
                element: <Files mode="folder" />,
            },
            {
                path: "/recent",
                element: <Files mode="recent" />,
            },
            {
                path: "/shared",
                element: <Files mode="shared" />,
            },
            {
                path: "/trash",
                element: <Files mode="trash" />,
            }
        ],
    },
    {
        path: "/admin",
        element: (
            <AdminRoute>
                <AdminLayout />
            </AdminRoute>
        ),
        children: [
            {
                index: true,
                Component: DashBoard,
                loader: homeLoader,
            },
            {
                path: "settings",
                Component: SettingAdminPage,
            },
            {
                path: "users",
                Component: UserAdminPage,
            },
            {
                path: "roles",
                Component: RoleAdminPage,
            },
            {
                path: "permissions",
                Component: PermissionAdminPage,
            },
            {
                path: "summary-feedback",
                Component: SummaryFeedbackAdminPage,
            },
        ],
    },
    {
        path: "/login",
        element: (
            <AuthRoute>
                <Login />
            </AuthRoute>
        ),
    },
    {
        path: "/signup",
        element: (
            <AuthRoute>
                <Signup />
            </AuthRoute>
        ),
    },
]);

function App() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(getProfile())
    }, [])

    return (
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
            <RouterProvider router={router} />
        </ThemeProvider>
    );
}

export default App
