
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from "next-themes";
import { Suspense } from "react";
import ErrorBoundary from "@/components/ErrorBoundary";

// Lazy load components to prevent blocking errors
import { lazy } from "react";

const SimpleDashboard = lazy(() => import("./pages/SimpleDashboard"));
const SimpleBookingPage = lazy(() => import("./pages/SimpleBookingPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage"));
const AuthCallbackPage = lazy(() => import("./pages/AuthCallbackPage"));
const SimpleClubHomePage = lazy(() => import("./pages/SimpleClubHomePage"));
const SimpleClubBookingPage = lazy(() => import("./pages/SimpleClubBookingPage"));
const SimpleClubAboutPage = lazy(() => import("./pages/SimpleClubAboutPage"));
const SimpleClubContactPage = lazy(() => import("./pages/SimpleClubContactPage"));

// Fallback component for loading
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
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false, // Prevent unnecessary refetches
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
              <BrowserRouter>
                <Suspense fallback={<LoadingFallback />}>
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
                    
                    {/* Fallback route */}
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
            </TooltipProvider>
          </ThemeProvider>
        </HelmetProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
