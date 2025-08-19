import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './components/theme-provider'
import { CommandPalette } from './components/command-palette'
import { useKeyboardShortcuts } from './hooks/use-keyboard-shortcuts'
import { Toaster } from '@/components/ui/sonner'
import PWAInstallPrompt from './components/PWAInstallPrompt'
import ServiceWorkerStatus from './components/ServiceWorkerStatus'

// Pages
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import DashboardLayout from './layouts/DashboardLayout'
import Dashboard from './pages/Dashboard'
import LicensesPage from './pages/LicensesPage'
import ProjectsPage from './pages/ProjectsPage'
import InspectionsPage from './pages/InspectionsPage'
import CommitmentsPage from './pages/CommitmentsPage'
import WaterMonitoringPage from './pages/WaterMonitoringPage'
import WastePage from './pages/WastePage'
import ReportsPage from './pages/ReportsPage'
import DocumentationPage from './pages/DocumentationPage'
import ProfilePage from './pages/ProfilePage'
import SettingsPage from './pages/SettingsPage'
import SupportPage from './pages/SupportPage'

import './App.css'

// Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
})

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // Simple auth check - in production this would check actual auth state
  const isAuthenticated = localStorage.getItem('user')
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />
}

// App Content with Keyboard Shortcuts
const AppContent = () => {
  useKeyboardShortcuts()
  
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/licenses" element={
          <ProtectedRoute>
            <DashboardLayout>
              <LicensesPage />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/projects" element={
          <ProtectedRoute>
            <DashboardLayout>
              <ProjectsPage />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/inspections" element={
          <ProtectedRoute>
            <DashboardLayout>
              <InspectionsPage />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/monitoring" element={
          <ProtectedRoute>
            <DashboardLayout>
              <WaterMonitoringPage />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/waste" element={
          <ProtectedRoute>
            <DashboardLayout>
              <WastePage />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/commitments" element={
          <ProtectedRoute>
            <DashboardLayout>
              <CommitmentsPage />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/reports" element={
          <ProtectedRoute>
            <DashboardLayout>
              <ReportsPage />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        {/* New Pages (FASE 4.1) */}
        <Route path="/documentation" element={
          <ProtectedRoute>
            <DashboardLayout>
              <DocumentationPage />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/profile" element={
          <ProtectedRoute>
            <DashboardLayout>
              <ProfilePage />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/settings" element={
          <ProtectedRoute>
            <DashboardLayout>
              <SettingsPage />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/support" element={
          <ProtectedRoute>
            <DashboardLayout>
              <SupportPage />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        
        {/* Catch all - redirect to dashboard if authenticated, login if not */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      
      {/* Global Components */}
      <CommandPalette />
      <PWAInstallPrompt />
      <ServiceWorkerStatus />
      <Toaster />
    </>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="gaia-ui-theme">
        <BrowserRouter>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App