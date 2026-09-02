import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearError, loginUser } from '../store/authSlice';
import AuthLayout from '../layouts/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const destinations = {
  admin: '/admin/dashboard',
  mentor: '/mentor/dashboard',
  student: '/dashboard',
};

const AdminLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [formError, setFormError] = useState('');

  const goAfterAuth = (user) => {
    navigate(destinations[user?.role] || '/admin/dashboard');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    dispatch(clearError());
    if (!credentials.email || !credentials.password) {
      setFormError('Enter your email and password to continue.');
      return;
    }
    setFormError('');
    const result = await dispatch(loginUser(credentials));
    if (loginUser.fulfilled.match(result)) {
      goAfterAuth(result.payload);
    }
  };

  return (
    <AuthLayout
      eyebrow="Admin access"
      title="Admin Log in"
      subtitle="Manage cohorts, pairings, mentors, and platform settings."
      asideQuote="Admins keep the platform running smoothly for students and mentors."
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@moringapair.com"
            value={credentials.email}
            onChange={(event) =>
              setCredentials({ ...credentials, email: event.target.value })
            }
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={credentials.password}
            onChange={(event) =>
              setCredentials({ ...credentials, password: event.target.value })
            }
          />
        </div>

        {(formError || error) && (
          <p className="text-sm text-red-600">{formError || error}</p>
        )}

        <Button type="submit" className="w-full" disabled={status === 'loading'}>
          {status === 'loading' ? 'Signing in...' : 'Log in'}
        </Button>
      </form>

      <p className="text-sm text-gray-500 mt-6">
        Not an admin?{' '}
        <Link to="/login" className="text-primary font-medium hover:underline">
          Student login
        </Link>
      </p>
    </AuthLayout>
  );
};

export default AdminLogin;
