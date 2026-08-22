import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import SignUp from '../pages/SignUp';
import Profile from '../pages/profile';
import Dashboard from '../pages/Dashboard';
import Pairing from '../pages/Pairing';
import PairingHistory from '../pages/PairingHistory';

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
    </Routes>
  );
};

export default AppRoutes;