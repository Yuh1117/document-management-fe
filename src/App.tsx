import { createBrowserRouter, Outlet, RouterProvider } from 'react-router'
import Home from './pages/home'
import Login from './pages/login'
import Signup from './pages/signup'
import { ThemeProvider } from './components/settings/theme-provider'
import Header from './components/layout/header'
import { SidebarInset, SidebarProvider } from './components/ui/sidebar'
import { AuthRoute, ProtectedRoute } from './components/protected-route/protected-route'
import { useAppDispatch } from './redux/hooks'
import { useEffect } from 'react'
import { getProfile } from './redux/reducers/userSlide'
import { AppSidebar } from './components/layout/app-sidebar'

const homeLoader = async () => {
  return { message: "Home page hehe" };
};

const MainLayout = () => (
  <>
    <Header />
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="px-2">
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
