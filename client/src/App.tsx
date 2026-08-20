import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuthContext } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

const LandingPage = lazy(() => import('./pages/Landing/LandingPage').catch(() => ({ default: () => <div>LandingPage</div> })));
const LoginPage = lazy(() => import('./pages/Auth/LoginPage').catch(() => ({ default: () => <div>LoginPage</div> })));
const RegisterPage = lazy(() => import('./pages/Auth/RegisterPage').catch(() => ({ default: () => <div>RegisterPage</div> })));
const ForgotPasswordPage = lazy(() => import('./pages/Auth/ForgotPasswordPage').catch(() => ({ default: () => <div>ForgotPasswordPage</div> })));
const DashboardPage = lazy(() => import('./pages/Dashboard/DashboardPage').catch(() => ({ default: () => <div>DashboardPage</div> })));
const AssessmentPage = lazy(() => import('./pages/Assessment/AssessmentPage').catch(() => ({ default: () => <div>AssessmentPage</div> })));
const AssessmentResultPage = lazy(() => import('./pages/Assessment/AssessmentResultPage').catch(() => ({ default: () => <div>AssessmentResultPage</div> })));
const ChatPage = lazy(() => import('./pages/Chat/ChatPage').catch(() => ({ default: () => <div>ChatPage</div> })));
const ReportsPage = lazy(() => import('./pages/Reports/ReportsPage').catch(() => ({ default: () => <div>ReportsPage</div> })));
const RecommendationsPage = lazy(() => import('./pages/Recommendations/RecommendationsPage').catch(() => ({ default: () => <div>RecommendationsPage</div> })));
const ProfilePage = lazy(() => import('./pages/Profile/ProfilePage').catch(() => ({ default: () => <div>ProfilePage</div> })));
const SettingsPage = lazy(() => import('./pages/Settings/SettingsPage').catch(() => ({ default: () => <div>SettingsPage</div> })));
const AdminDashboardPage = lazy(() => import('./pages/Admin/AdminDashboardPage').catch(() => ({ default: () => <div>AdminDashboardPage</div> })));
const NotFoundPage = lazy(() => import('./pages/NotFound/NotFoundPage').catch(() => ({ default: () => <div>NotFoundPage</div> })));

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuthContext();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuthContext();
  if (loading) return <div>Loading...</div>;
  if (!user || user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};

const AppRoutes = () => (
  <Suspense fallback={<div>Loading Page...</div>}>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/assessment" element={<ProtectedRoute><AssessmentPage /></ProtectedRoute>} />
      <Route path="/assessment/:id" element={<ProtectedRoute><AssessmentResultPage /></ProtectedRoute>} />
      <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
      <Route path="/recommendations" element={<ProtectedRoute><RecommendationsPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      
      <Route path="/admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
      
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </Suspense>
);

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
