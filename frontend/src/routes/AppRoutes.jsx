import { Navigate, Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import SignUp from '../pages/SignUp';
import Profile from '../pages/profile';
import Dashboard from '../pages/Dashboard';
import Pairing from '../pages/Pairing';
import PairingHistory from '../pages/PairingHistory';
import Assessment from '../pages/Assessment';
import RequireAuth from './RequireAuth';
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
      <Route path="/pairing" element={<Pairing />} />
      <Route path="/pairing/history" element={<PairingHistory />} />
      <Route path="/assessment" element={<Assessment />} />

      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      <Route
        path="/admin/dashboard"
        element={<RequireAuth><DashboardPage /></RequireAuth>}
      />
      <Route
        path="/admin/cohorts"
        element={<RequireAuth><CohortsPage /></RequireAuth>}
      />
      <Route
        path="/admin/mentors"
        element={<RequireAuth><MentorsPage /></RequireAuth>}
      />
      <Route
        path="/admin/students"
        element={<RequireAuth><StudentsPage /></RequireAuth>}
      />
      <Route
        path="/admin/settings"
        element={<RequireAuth><SettingsPage /></RequireAuth>}
      />
      <Route
        path="/admin/pairing-logic"
        element={<RequireAuth><div>Pairing Logic — no design yet, placeholder</div></RequireAuth>}
      />
      <Route
        path="/admin/audit-logs"
        element={<RequireAuth><div>Audit Logs — no design yet, placeholder</div></RequireAuth>}
      />
    </Routes>
  );
};

export default AppRoutes;
