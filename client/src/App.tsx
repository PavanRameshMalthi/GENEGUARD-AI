import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuthContext } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { SidebarProvider } from './context/SidebarContext';
import Toast from './components/ui/Toast';
import LoadingScreen from './components/ui/LoadingScreen';

const LandingPage = lazy(() => import('./pages/Landing/LandingPage'));
const LoginPage = lazy(() => import('./pages/Auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/Auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/Auth/ForgotPasswordPage'));
const DashboardPage = lazy(() => import('./pages/Dashboard/DashboardPage'));
const GeneticsPage = lazy(() => import('./pages/Genetics/GeneticsPage'));
const AnalysisPage = lazy(() => import('./pages/Analysis/AnalysisPage'));
const AssessmentPage = lazy(() => import('./pages/Assessment/AssessmentPage'));
const AssessmentResultPage = lazy(() => import('./pages/Assessment/AssessmentResultPage'));
const DailyTrackingPage = lazy(() => import('./pages/Tracking/DailyTrackingPage'));
const TimelinePage = lazy(() => import('./pages/Timeline/TimelinePage'));
const GoalsPage = lazy(() => import('./pages/Goals/GoalsPage'));
const ReportsPage = lazy(() => import('./pages/Reports/ReportsPage'));
const ReportComparisonPage = lazy(() => import('./pages/Reports/ReportComparisonPage'));
const WeeklyReportPage = lazy(() => import('./pages/WeeklyReport/WeeklyReportPage'));
const ChatPage = lazy(() => import('./pages/Chat/ChatPage'));
const CopilotPage = lazy(() => import('./pages/Copilot/CopilotPage'));
const PreventiveCalendarPage = lazy(() => import('./pages/Calendar/PreventiveCalendarPage'));
const FamilyHealthPage = lazy(() => import('./pages/Family/FamilyHealthPage'));
const AchievementsPage = lazy(() => import('./pages/Achievements/AchievementsPage'));
const RecommendationsPage = lazy(() => import('./pages/Recommendations/RecommendationsPage'));
const ProfilePage = lazy(() => import('./pages/Profile/ProfilePage'));
const SettingsPage = lazy(() => import('./pages/Settings/SettingsPage'));
const AdminDashboardPage = lazy(() => import('./pages/Admin/AdminDashboardPage'));
const NotFoundPage = lazy(() => import('./pages/NotFound/NotFoundPage'));

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuthContext();
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuthContext();
  if (loading) return <LoadingScreen />;
  if (user) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuthContext();
  if (loading) return <LoadingScreen />;
  if (!user || user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};

const AppRoutes = () => (
  <Suspense fallback={<LoadingScreen />}>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
      <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
      
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/genetics" element={<ProtectedRoute><GeneticsPage /></ProtectedRoute>} />
      <Route path="/analysis" element={<ProtectedRoute><AnalysisPage /></ProtectedRoute>} />
      <Route path="/copilot" element={<ProtectedRoute><CopilotPage /></ProtectedRoute>} />
      <Route path="/calendar" element={<ProtectedRoute><PreventiveCalendarPage /></ProtectedRoute>} />
      <Route path="/family" element={<ProtectedRoute><FamilyHealthPage /></ProtectedRoute>} />
      <Route path="/achievements" element={<ProtectedRoute><AchievementsPage /></ProtectedRoute>} />
      <Route path="/tracking" element={<ProtectedRoute><DailyTrackingPage /></ProtectedRoute>} />
      <Route path="/timeline" element={<ProtectedRoute><TimelinePage /></ProtectedRoute>} />
      <Route path="/goals" element={<ProtectedRoute><GoalsPage /></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
      <Route path="/reports/compare" element={<ProtectedRoute><ReportComparisonPage /></ProtectedRoute>} />
      <Route path="/weekly-reports" element={<ProtectedRoute><WeeklyReportPage /></ProtectedRoute>} />
      <Route path="/assessment" element={<ProtectedRoute><AssessmentPage /></ProtectedRoute>} />
      <Route path="/assessment/:id" element={<ProtectedRoute><AssessmentResultPage /></ProtectedRoute>} />
      <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
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
          <SidebarProvider>
            <BrowserRouter>
              <AppRoutes />
              <Toast />
            </BrowserRouter>
          </SidebarProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
