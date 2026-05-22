import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";

import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

import PublicLayout from "./components/layout/PublicLayout";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import LeadersPage from "./pages/LeadersPage";
import NewsPage from "./pages/NewsPage";
import JoinPage from "./pages/JoinPage";
import ContactPage from "./pages/ContactPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";

function ProtectedAdmin({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-bharat-cream text-bharat-ink/60">Loading...</div>;
  if (!user) return <Navigate to="/admin/login" replace />;
  return children;
}

function App() {
  return (
    <div className="App">
      <LanguageProvider>
        <AuthProvider>
          <BrowserRouter>
            <Toaster position="top-right" richColors closeButton />
            <Routes>
              <Route path="/" element={<PublicLayout />}>
                <Route index element={<HomePage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="leaders" element={<LeadersPage />} />
                <Route path="news" element={<NewsPage />} />
                <Route path="news/:id" element={<NewsPage />} />
                <Route path="join" element={<JoinPage />} />
                <Route path="contact" element={<ContactPage />} />
              </Route>
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin" element={<ProtectedAdmin><AdminDashboardPage /></ProtectedAdmin>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </div>
  );
}

export default App;
