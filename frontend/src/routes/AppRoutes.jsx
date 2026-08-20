import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import SignUp from '../pages/SignUp';
import Profile from '../pages/profile';
import Dashboard from '../pages/Dashboard';
import Assessment from '../pages/Assessment';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/assessment" element={<Assessment />} />
    </Routes>
  );
};

export default AppRoutes;