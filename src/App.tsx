import { createBrowserRouter, Outlet, RouterProvider } from 'react-router'
import Home from './pages/client/home'
import Login from './pages/login'
import Signup from './pages/signup'
import Header from './components/client/layout/header'
import { SidebarInset, SidebarProvider } from './components/ui/sidebar'
import { AdminRoute, AuthRoute, ProtectedRoute } from './components/protected-route/protected-route'
import { useAppDispatch } from './redux/hooks'
import { useEffect } from 'react'
import { getProfile } from './redux/reducers/userSlide'
import { AppSidebar } from './components/client/layout/app-sidebar'
import DashBoard from './pages/admin/dashboard'
import AdminSettingPage from './pages/admin/setting'
import { ThemeProvider } from './components/shared/settings/theme-provider'
import { AdminSidebar } from './components/admin/layout/admin-sidebar'

const homeLoader = async () => {
  return { message: "Home page hehe" };
};

const MainLayout = () => (
  <>
    <Header />
    <SidebarProvider>
      <AppSidebar className="border-none pt-17" />
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
        Component: AdminSettingPage,
      },
      {
        path: "users",
        Component: null,
      },
      {
        path: "roles",
        Component: null,
      },
      {
        path: "permissions",
        Component: null,
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
