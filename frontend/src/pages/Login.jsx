import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearError, loginUser, googleLoginUser } from '../store/authSlice';
import AuthLayout from '../layouts/AuthLayout';
import GoogleSignInButton from '../components/GoogleSignInButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const destinations = {
  admin: '/admin/dashboard',
  mentor: '/mentor/dashboard',
  student: '/dashboard',
};

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [formError, setFormError] = useState('');

  const goAfterAuth = (user) => {
    navigate(destinations[user?.role] || '/dashboard');
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

  const handleGoogle = async (idToken) => {
    dispatch(clearError());
    setFormError('');
    const result = await dispatch(googleLoginUser(idToken));
    if (googleLoginUser.fulfilled.match(result)) {
      goAfterAuth(result.payload);
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
        <div className="space-y-1.5">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
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

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-zinc-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-zinc-500">Or</span>
        </div>
      </div>

      <GoogleSignInButton onCredential={handleGoogle} />

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
