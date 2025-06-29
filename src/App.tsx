import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Toaster } from './components/ui/toaster';

// Layout Components
import { AuthLayout } from './components/AuthLayout';
import { DashboardLayout } from './components/DashboardLayout';
import { AdminLayout } from './components/AdminLayout';

// Auth Pages
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { AuthCallbackPage } from './pages/AuthCallbackPage';

// Main Pages
import Index from './pages/Index';
import { Dashboard } from './pages/Dashboard';
import { ProfilePage } from './pages/ProfilePage';
import { ChallengesPage } from './pages/ChallengesPage';
import { TournamentsPage } from './pages/TournamentsPage';
import { DiscoveryPage } from './pages/DiscoveryPage';
import { ChatPage } from './pages/ChatPage';
import { WalletPage } from './pages/WalletPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { LiveStreamPage } from './pages/LiveStreamPage';
import { SecurityPage } from './pages/SecurityPage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminTournaments } from './pages/admin/AdminTournaments';
import { AdminTransactions } from './pages/admin/AdminTransactions';

// Other Pages
import { AboutPage } from './pages/AboutPage';
import { BlogPage } from './pages/BlogPage';
import { FAQPage } from './pages/FAQPage';
import { HelpPage } from './pages/HelpPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { NotFound } from './pages/NotFound';

// PWA Components
import { PWAInstallPrompt } from './components/pwa/PWAInstallPrompt';
import { OfflineIndicator } from './components/pwa/OfflineIndicator';

// Notification Components
import { RealtimeNotificationBanner } from './components/notifications/RealtimeNotificationBanner';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-background">
            {/* PWA Components */}
            <PWAInstallPrompt />
            <OfflineIndicator />
            
            {/* Real-time Notifications */}
            <RealtimeNotificationBanner />
            
            {/* Main App Routes */}
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/help" element={<HelpPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              
              {/* Auth Routes */}
              <Route path="/auth" element={<AuthLayout />}>
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
                <Route path="forgot-password" element={<ForgotPasswordPage />} />
                <Route path="reset-password" element={<ResetPasswordPage />} />
                <Route path="callback" element={<AuthCallbackPage />} />
              </Route>
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="profile/:username" element={<ProfilePage />} />
                <Route path="challenges" element={<ChallengesPage />} />
                <Route path="tournaments" element={<TournamentsPage />} />
                <Route path="discovery" element={<DiscoveryPage />} />
                <Route path="chat" element={<ChatPage />} />
                <Route path="wallet" element={<WalletPage />} />
                <Route path="analytics" element={<AnalyticsPage />} />
                <Route path="live-stream" element={<LiveStreamPage />} />
                <Route path="security" element={<SecurityPage />} />
              </Route>
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="tournaments" element={<AdminTournaments />} />
                <Route path="transactions" element={<AdminTransactions />} />
              </Route>
              
              {/* Live Stream Route */}
              <Route path="/live/:streamId" element={<LiveStreamPage />} />
              
              {/* Catch all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            
            {/* Toast Notifications */}
            <Toaster />
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
