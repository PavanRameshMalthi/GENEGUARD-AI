import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { DisclaimerBanner } from './components/layout/DisclaimerBanner';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { AssessmentPage } from './pages/AssessmentPage';
import { AnalysisPage } from './pages/AnalysisPage';
import { AssistantPage } from './pages/AssistantPage';
import { RecommendationsPage } from './pages/RecommendationsPage';
import { ProfilePage } from './pages/ProfilePage';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const AppContent = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-slate-800 dark:bg-slate-950 dark:text-slate-200 transition-colors">
      <DisclaimerBanner />
      <Navbar />
      <main className="flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/assessment" element={<ProtectedRoute><AssessmentPage /></ProtectedRoute>} />
          <Route path="/analysis/:id" element={<ProtectedRoute><AnalysisPage /></ProtectedRoute>} />
          <Route path="/assistant" element={<ProtectedRoute><AssistantPage /></ProtectedRoute>} />
          <Route path="/recommendations" element={<ProtectedRoute><RecommendationsPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
