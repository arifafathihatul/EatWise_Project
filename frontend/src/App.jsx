import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ScanPage from './pages/ScanPage';
import TrackerPage from './pages/TrackerPage'; 
import ProfilePage from './pages/ProfilePage';
import LandingPage from './pages/LandingPage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/scan" element={<ScanPage />} />
        <Route path="/tracker" element={<TrackerPage />} /> 
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
}