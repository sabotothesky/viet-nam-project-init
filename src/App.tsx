
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/hooks/useAuth";
import SimpleDashboard from "./pages/SimpleDashboard";
import SimpleBookingPage from "./pages/SimpleBookingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import AuthCallbackPage from "./pages/AuthCallbackPage";
import SimpleClubHomePage from "./pages/SimpleClubHomePage";
import SimpleClubBookingPage from "./pages/SimpleClubBookingPage";
import SimpleClubAboutPage from "./pages/SimpleClubAboutPage";
import SimpleClubContactPage from "./pages/SimpleClubContactPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <TooltipProvider>
          <AuthProvider>
            <BrowserRouter>
              <Routes>
                {/* Main Complex Platform Routes */}
                <Route path="/" element={<SimpleDashboard />} />
                <Route path="/booking" element={<SimpleBookingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/auth/callback" element={<AuthCallbackPage />} />
                
                {/* Simple Club Website Routes */}
                <Route path="/simple-club" element={<SimpleClubHomePage />} />
                <Route path="/simple-booking" element={<SimpleClubBookingPage />} />
                <Route path="/simple-about" element={<SimpleClubAboutPage />} />
                <Route path="/simple-contact" element={<SimpleClubContactPage />} />
              </Routes>
              <Toaster />
              <Sonner />
            </BrowserRouter>
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
