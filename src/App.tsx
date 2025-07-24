import { createBrowserRouter, Outlet, RouterProvider } from 'react-router'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import { ThemeProvider } from './components/settings/ThemeProvider'
import Header from './components/layout/Header'
import { SidebarInset, SidebarProvider } from './components/ui/sidebar'
import { AppSidebar } from './components/AppSideBar'
import { AuthRoute, ProtectedRoute } from './components/protected-route/ProtectedRoute'
import { useAppDispatch } from './redux/hooks'
import { useEffect } from 'react'
import { getProfile } from './redux/reducers/UserReducer'

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
    element: <ProtectedRoute>
      <MainLayout />
    </ProtectedRoute>,
    children: [
      {
        index: true,
        element: <Home />,
        loader: homeLoader,
      },
    ],
  },
  {
    path: "/login",
    element: <AuthRoute>
      <Login />
    </AuthRoute>,
  },
  {
    path: "/signup",
    element: <AuthRoute>
      <Signup />
    </AuthRoute>,
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
