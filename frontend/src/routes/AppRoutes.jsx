import { Navigate, Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import SignUp from '../pages/SignUp';
import Profile from '../pages/profile';
import Dashboard from '../pages/Dashboard';
import Pairing from '../pages/Pairing';
import PairingHistory from '../pages/PairingHistory';
import StudentResourcesPage from '../pages/StudentResourcesPage';
import PairingsPage from '../features/admin/pages/PairingsPage';
import AuditLogsPage from '../features/admin/pages/AuditLogsPage';
import Assessment from '../pages/Assessment';
import RequireAuth from './RequireAuth';
import DashboardPage from '../features/admin/pages/DashboardPage';
import CohortsPage from '../features/admin/pages/CohortsPage';
import MentorsPage from '../features/admin/pages/MentorsPage';
import StudentsPage from '../features/admin/pages/StudentsPage';
import SettingsPage from '../features/admin/pages/SettingsPage';
import MentorDashboardPage from '../features/mentor/pages/MentorDashboardPage';
import MentorStudentsPage from '../features/mentor/pages/MentorStudentsPage';
import MentorFeedbackPage from '../features/mentor/pages/MentorFeedbackPage';
import MentorProfilePage from '../features/mentor/pages/MentorProfilePage';
import MentorResourcesPage from '../features/mentor/pages/MentorResourcesPage';
import LandingPage from '../pages/LandingPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <RequireAuth allowedRoles={['student']}>
            <Dashboard />
          </RequireAuth>
        }
      />
      <Route
        path="/profile"
        element={
          <RequireAuth allowedRoles={['student']}>
            <Profile />
          </RequireAuth>
        }
      />
      <Route
        path="/pairing"
        element={
          <RequireAuth allowedRoles={['student']}>
            <Pairing />
          </RequireAuth>
        }
      />
      <Route
        path="/pairing/history"
        element={
          <RequireAuth allowedRoles={['student']}>
            <PairingHistory />
          </RequireAuth>
        }
      />
      <Route
        path="/resources"
        element={
          <RequireAuth allowedRoles={['student']}>
            <StudentResourcesPage />
          </RequireAuth>
        }
      />
      <Route
        path="/assessment"
        element={
          <RequireAuth allowedRoles={['student']}>
            <Assessment />
          </RequireAuth>
        }
      />

      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      <Route
        path="/admin/dashboard"
        element={
          <RequireAuth allowedRoles={['admin']}>
            <DashboardPage />
          </RequireAuth>
        }
      />
      <Route
        path="/admin/cohorts"
        element={
          <RequireAuth allowedRoles={['admin']}>
            <CohortsPage />
          </RequireAuth>
        }
      />
      <Route
        path="/admin/mentors"
        element={
          <RequireAuth allowedRoles={['admin']}>
            <MentorsPage />
          </RequireAuth>
        }
      />
      <Route
        path="/admin/students"
        element={
          <RequireAuth allowedRoles={['admin']}>
            <StudentsPage />
          </RequireAuth>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <RequireAuth allowedRoles={['admin']}>
            <SettingsPage />
          </RequireAuth>
        }
      />
      <Route
        path="/admin/pairings"
        element={
          <RequireAuth allowedRoles={['admin']}>
            <PairingsPage />
          </RequireAuth>
        }
      />
      <Route
        path="/admin/audit-logs"
        element={
          <RequireAuth allowedRoles={['admin']}>
            <AuditLogsPage />
          </RequireAuth>
        }
      />

      <Route path="/mentor" element={<Navigate to="/mentor/dashboard" replace />} />
      <Route
        path="/mentor/dashboard"
        element={
          <RequireAuth allowedRoles={['mentor']}>
            <MentorDashboardPage />
          </RequireAuth>
        }
      />
      <Route
        path="/mentor/students"
        element={
          <RequireAuth allowedRoles={['mentor']}>
            <MentorStudentsPage />
          </RequireAuth>
        }
      />
      <Route
        path="/mentor/feedback"
        element={
          <RequireAuth allowedRoles={['mentor']}>
            <MentorFeedbackPage />
          </RequireAuth>
        }
      />
      <Route
        path="/mentor/resources"
        element={
          <RequireAuth allowedRoles={['mentor']}>
            <MentorResourcesPage />
          </RequireAuth>
        }
      />
      <Route
        path="/mentor/profile"
        element={
          <RequireAuth allowedRoles={['mentor']}>
            <MentorProfilePage />
          </RequireAuth>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
