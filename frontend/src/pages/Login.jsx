import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearError, loginUser } from '../store/authSlice';
import './Auth.css';

const Login = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { status, error } = useSelector((state) => state.auth);
	const [credentials, setCredentials] = useState({ email: '', password: '' });
	const [formError, setFormError] = useState('');

	const handleSubmit = async (event) => {
		event.preventDefault();
		dispatch(clearError());
		if (!credentials.email || !credentials.password) {
			setFormError('Enter your email and password to continue.');
			return;
		}
		setFormError('');
		const result = await dispatch(loginUser(credentials));
		if (loginUser.fulfilled.match(result)) navigate('/dashboard');
	};

	return <div className="auth-page"><div className="auth-panel"><a className="auth-brand" href="/login"><span className="brand-mark">m</span><span>Moringa<span className="brand-accent">Pair</span></span></a><div className="auth-copy"><p className="eyebrow">Welcome back</p><h1>Make this week a good one.</h1><p>Find your pairing, keep learning, and make meaningful progress together.</p></div><form className="auth-form" onSubmit={handleSubmit} noValidate><label htmlFor="email">Email address<input id="email" type="email" value={credentials.email} onChange={(event) => setCredentials({ ...credentials, email: event.target.value })} placeholder="you@example.com" /></label><label htmlFor="password">Password<input id="password" type="password" value={credentials.password} onChange={(event) => setCredentials({ ...credentials, password: event.target.value })} placeholder="Enter your password" /></label>{(formError || error) && <p className="field-error">{formError || error}</p>}<button className="auth-submit" type="submit" disabled={status === 'loading'}>{status === 'loading' ? 'Signing in...' : 'Log in'} <span>→</span></button></form><p className="auth-switch">New to MoringaPair? <Link to="/signup">Create an account</Link></p></div><div className="auth-aside"><span className="aside-mark">✦</span><p>Good pairings create room for better questions.</p><span className="aside-caption">A student collaboration workspace</span></div></div>;
};

export default Login;