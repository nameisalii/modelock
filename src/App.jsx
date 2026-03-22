import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ModesProvider } from './contexts/ModesContext';
import PrivateRoute from './components/PrivateRoute';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardOverview from './pages/DashboardOverview';
import ModesPage from './pages/ModesPage';
import ModeEditor from './pages/ModeEditor';
import AnalyticsPage from './pages/AnalyticsPage';
import ExtensionPage from './pages/ExtensionPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ModesProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Protected Dashboard Routes */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardLayout />
                </PrivateRoute>
              }
            >
              <Route index element={<DashboardOverview />} />
              <Route path="modes" element={<ModesPage />} />
              <Route path="modes/new" element={<ModeEditor />} />
              <Route path="modes/:modeId" element={<ModeEditor />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="extension" element={<ExtensionPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ModesProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
