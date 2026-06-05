import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ScanPage from './pages/ScanPage';
import TrackerPage from './pages/TrackerPage'; 
import ProfilePage from './pages/ProfilePage';
import LandingPage from './pages/LandingPage';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/scan" element={
          <ProtectedRoute>
            <ScanPage />
          </ProtectedRoute>
        } />
        <Route path="/tracker" element={
          <ProtectedRoute>
            <TrackerPage />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}