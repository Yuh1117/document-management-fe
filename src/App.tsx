import { BrowserRouter, Outlet, Route, Routes } from 'react-router'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import { ThemeProvider } from './components/settings/ThemeProvider'
import Header from './components/layout/Header'
import { SidebarInset, SidebarProvider } from './components/ui/sidebar'
import { AppSidebar } from './components/AppSideBar'

const MainLayout = () => (
  <>
    <Header />
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
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

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Routes>

          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
          </Route>

          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App
