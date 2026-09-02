import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  LayoutDashboard,
  Users,
  MessageSquareText,
  CircleUserRound,
  LogOut,
  Menu,
  PanelLeftClose,
  BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Logo from '../components/Logo';
import SidebarThemeToggle from '../components/SidebarThemeToggle';
import { logout } from '../store/authSlice';

const navItems = [
  { to: '/mentor/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/mentor/students', label: 'My Students', icon: Users },
  { to: '/mentor/feedback', label: 'Feedback Log', icon: MessageSquareText },
  { to: '/mentor/resources', label: 'Resources', icon: BookOpen },
];

export default function MentorLayout({ children, eyebrow, title, description }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const EDGE = 10;
    const onMove = (e) => {
      if (e.clientX <= EDGE) setSidebarOpen(true);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  const initials = (user?.name || 'Mentor')
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-zinc-950">
      <div
        className="fixed inset-y-0 left-0 z-40 w-2"
        onMouseEnter={() => setSidebarOpen(true)}
        aria-hidden
      />

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col justify-between border-r border-gray-200 bg-white transition-transform duration-300 ease-out dark:border-zinc-800 dark:bg-zinc-900 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        onMouseLeave={() => setSidebarOpen(false)}
      >
        <div>
          <div className="flex items-center justify-between px-4 py-4">
            <Logo label="Mentor" subtitle="Cohort Mentor Access" />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setSidebarOpen(false)}
            >
              <PanelLeftClose className="h-4 w-4 text-gray-400 dark:text-zinc-500" />
            </Button>
          </div>

          <nav className="mt-2 space-y-1 px-3">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${
                    isActive
                      ? 'bg-primary/10 font-semibold text-primary'
                      : 'text-gray-600 hover:bg-gray-100 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100'
                  }`
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="space-y-1 border-t border-gray-100 p-3 dark:border-zinc-800">
          <NavLink
            to="/mentor/profile"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${
                isActive
                  ? 'bg-primary/10 font-semibold text-primary'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100'
              }`
            }
          >
            <CircleUserRound className="h-4 w-4" />
            Profile
          </NavLink>
          <SidebarThemeToggle className="text-gray-600 dark:text-zinc-400" />
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      </aside>

      <div className="flex min-h-screen flex-col">
        <header className="flex items-center gap-4 border-b border-gray-100 bg-gray-50 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-950">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5 text-gray-600 dark:text-zinc-400" strokeWidth={1.75} />
          </Button>

          <Logo />

          <div className="ml-auto">
            {eyebrow && (
              <p className="mb-1 text-right text-xs font-medium uppercase tracking-wide text-primary">
                {eyebrow}
              </p>
            )}
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
            {initials}
          </div>
        </header>

        <main className="flex-1 px-8 py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-100">{title}</h1>
            {description && (
              <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400">{description}</p>
            )}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
