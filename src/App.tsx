
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Toaster } from './components/ui/sonner';

import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Settings from './pages/Settings';
import Index from './pages/Index';
import { AuthProvider, AuthNavigation } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Tasks from './pages/Tasks';
import Customers from './pages/Customers';
import Invoices from './pages/Invoices';
import Projects from './pages/Projects';
import Team from './pages/Team';
import Meetings from './pages/Meetings';
import Analytics from './pages/Analytics';
import { AppSettingsProvider } from './contexts/AppSettingsContext';
import { LanguageProvider } from './contexts/LanguageContext';
import Trash from './pages/Trash';
import Leads from './pages/Leads';
import Payments from './pages/Payments';
import TodayOverview from './pages/TodayOverview';
import PublicInvoiceView from './components/invoices/PublicInvoiceView';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" attribute="class">
        <LanguageProvider>
          <Router>
            <AuthProvider>
              <AppSettingsProvider>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/" element={<Index />} />
                  <Route
                    path="/today"
                    element={
                      <ProtectedRoute>
                        <TodayOverview />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/leads"
                    element={
                      <ProtectedRoute>
                        <Leads />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/tasks"
                    element={
                      <ProtectedRoute>
                        <Tasks />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/meetings"
                    element={
                      <ProtectedRoute>
                        <Meetings />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/customers"
                    element={
                      <ProtectedRoute>
                        <Customers />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/invoices"
                    element={
                      <ProtectedRoute>
                        <Invoices />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/invoice/:id"
                    element={
                      <InvoicePublicView />
                    }
                  />
                  <Route
                    path="/projects"
                    element={
                      <ProtectedRoute>
                        <Projects />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/payments"
                    element={
                      <ProtectedRoute>
                        <Payments />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/team"
                    element={
                      <ProtectedRoute>
                        <Team />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/analytics"
                    element={
                      <ProtectedRoute>
                        <Analytics />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/trash"
                    element={
                      <ProtectedRoute>
                        <Trash />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/settings"
                    element={
                      <ProtectedRoute>
                        <Settings />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/404" element={<NotFound />} />
                  <Route path="*" element={<Navigate to="/404" replace />} />
                </Routes>
                <Toaster position="top-right" />
              </AppSettingsProvider>
            </AuthProvider>
          </Router>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

// Public invoice view component
const InvoicePublicView = () => {
  const { id } = useParams();
  // Simple component to display the invoice for public sharing
  return (
    <div className="container mx-auto p-6">
      <PublicInvoiceView invoiceId={id} />
    </div>
  );
};

export default App;
