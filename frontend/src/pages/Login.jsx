import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearError, loginUser } from '../store/authSlice';
import AuthLayout from '../layouts/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [selectedRole, setSelectedRole] = useState('student');
  const [formError, setFormError] = useState('');

  const demoAccounts = {
    admin: { email: 'admin@moringapair.com', password: 'Admin123!' },
    student: { email: 'student@moringapair.com', password: 'Student123!' },
  };

  const chooseRole = (role) => {
    setSelectedRole(role);
    setCredentials(demoAccounts[role]);
    setFormError('');
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
      const loggedUser = result.payload;
      const destinations = {
        admin: '/admin/dashboard',
        student: '/dashboard',
      };
      navigate(destinations[loggedUser?.role] || destinations[selectedRole]);
    }
  };

  return (
    <AuthLayout
      eyebrow="Welcome back"
      title="Log in to MoringaPair"
      subtitle="Check your weekly pairing and continue your assessment."
      asideQuote="Students are paired weekly based on skill level and learning goals."
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="space-y-2">
          <Label>Enter as</Label>
          <div className="grid grid-cols-3 gap-2" role="group" aria-label="Choose account type">
            {Object.keys(demoAccounts).map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => chooseRole(role)}
                className={`rounded-md border px-3 py-2 text-sm font-medium capitalize transition-colors ${
                  selectedRole === role
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-gray-200 text-gray-600 hover:border-primary hover:text-primary'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={credentials.email}
            onChange={(event) => setCredentials({ ...credentials, email: event.target.value })}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={credentials.password}
            onChange={(event) => setCredentials({ ...credentials, password: event.target.value })}
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
        New to MoringaPair?{' '}
        <Link to="/signup" className="text-primary font-medium hover:underline">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Login;
