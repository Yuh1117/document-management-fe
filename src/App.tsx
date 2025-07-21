import { createBrowserRouter, Outlet, RouterProvider } from 'react-router'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import { ThemeProvider } from './components/settings/ThemeProvider'
import Header from './components/layout/Header'
import { SidebarInset, SidebarProvider } from './components/ui/sidebar'
import { AppSidebar } from './components/AppSideBar'

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

const AuthLayout = () => (
  <>
    <Outlet />
  </>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
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
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <Login />,
      },
    ],
  },
  {
    path: "/signup",
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <Signup />,
      },
    ],
  },
]);

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App
