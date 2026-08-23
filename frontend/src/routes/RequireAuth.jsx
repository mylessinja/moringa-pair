import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

// Blocks access when nobody is logged in.
// TODO: once the backend returns `role` on login, upgrade this to
// RequireRole(allowedRoles) and gate /admin/* to role === 'admin'
// specifically, redirecting mismatched roles to /dashboard instead
// of /login.
export default function RequireAuth({ children }) {
  const { user } = useSelector((state) => state.auth);
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
