import { Navigate, Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import SignUp from '../pages/SignUp';
import Profile from '../pages/profile';
import Dashboard from '../pages/Dashboard';
import Assessment from '../pages/Assessment';
import DashboardPage from '../features/admin/pages/DashboardPage';
import CohortsPage from '../features/admin/pages/CohortsPage';
import MentorsPage from '../features/admin/pages/MentorsPage';
import StudentsPage from '../features/admin/pages/StudentsPage';
import SettingsPage from '../features/admin/pages/SettingsPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/assessment" element={<Assessment />} />

      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/admin/dashboard" element={<DashboardPage />} />
      <Route path="/admin/cohorts" element={<CohortsPage />} />
      <Route path="/admin/mentors" element={<MentorsPage />} />
      <Route path="/admin/students" element={<StudentsPage />} />
      <Route path="/admin/settings" element={<SettingsPage />} />
      <Route
        path="/admin/pairing-logic"
        element={<div>Pairing Logic — no design yet, placeholder</div>}
      />
      <Route
        path="/admin/audit-logs"
        element={<div>Audit Logs — no design yet, placeholder</div>}
      />
    </Routes>
  );
};

export default AppRoutes;