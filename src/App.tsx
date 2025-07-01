
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from "next-themes";
import { Suspense } from "react";
import ErrorBoundary from "@/components/ErrorBoundary";
import { AuthProvider } from "@/hooks/useAuth";

// Import components directly instead of lazy loading to avoid loading issues
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
import SystemAuditPage from "./pages/SystemAuditPage";
import TestPage from "./pages/TestPage";

// Simple loading fallback
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-green-900">
    <div className="text-center text-white">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto mb-4"></div>
      <p>Đang tải trang...</p>
    </div>
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  console.log("App component is loading...");

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            <TooltipProvider>
              <AuthProvider>
                <BrowserRouter>
                  <Suspense fallback={<LoadingFallback />}>
                    <Routes>
                      <Route path="/" element={<SimpleDashboard />} />
                      <Route path="/test" element={<TestPage />} />
                      <Route path="/booking" element={<SimpleBookingPage />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/register" element={<RegisterPage />} />
                      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                      <Route path="/auth/callback" element={<AuthCallbackPage />} />
                      <Route path="/simple-club" element={<SimpleClubHomePage />} />
                      <Route path="/simple-booking" element={<SimpleClubBookingPage />} />
                      <Route path="/simple-about" element={<SimpleClubAboutPage />} />
                      <Route path="/simple-contact" element={<SimpleClubContactPage />} />
                      <Route path="/system-audit" element={<SystemAuditPage />} />
                      
                      <Route path="*" element={
                        <div className="min-h-screen flex items-center justify-center bg-green-900 text-white">
                          <div className="text-center">
                            <h1 className="text-2xl mb-4">Trang không tìm thấy</h1>
                            <a href="/" className="text-yellow-400 hover:underline">Về trang chủ</a>
                          </div>
                        </div>
                      } />
                    </Routes>
                  </Suspense>
                  <Toaster />
                  <Sonner />
                </BrowserRouter>
              </AuthProvider>
            </TooltipProvider>
          </ThemeProvider>
        </HelmetProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
