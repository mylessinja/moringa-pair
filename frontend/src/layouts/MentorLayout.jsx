import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LayoutDashboard, Users, MessageSquareText, CircleUserRound, LogOut, Menu, PanelLeftClose } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Logo from '../components/Logo';
import { logout } from '../store/authSlice';

const navItems = [
  { to: '/mentor/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/mentor/students', label: 'My Students', icon: Users },
  { to: '/mentor/feedback', label: 'Feedback Log', icon: MessageSquareText },
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
    <div className="relative min-h-screen bg-gray-50">
      <div className="fixed inset-y-0 left-0 z-40 w-2" onMouseEnter={() => setSidebarOpen(true)} aria-hidden />

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/20" onClick={() => setSidebarOpen(false)} aria-hidden />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col justify-between border-r border-gray-200 bg-white transition-transform duration-300 ease-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        onMouseLeave={() => setSidebarOpen(false)}
      >
        <div>
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-xs font-bold text-white">
                M
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-900">Mentor</p>
                <p className="text-[11px] text-zinc-400">Cohort Mentor Access</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSidebarOpen(false)}>
              <PanelLeftClose className="h-4 w-4 text-gray-400" />
            </Button>
          </div>

          <nav className="mt-2 px-3 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${
                    isActive ? 'bg-primary/10 text-primary font-semibold' : 'text-gray-600 hover:bg-gray-100'
                  }`
                }
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="p-3 space-y-1 border-t border-gray-100">
          <NavLink
            to="/mentor/profile"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${
                isActive ? 'bg-primary/10 text-primary font-semibold' : 'text-gray-600 hover:bg-gray-100'
              }`
            }
          >
            <CircleUserRound className="w-4 h-4" />
            Profile
          </NavLink>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100"
          >
            <LogOut className="w-4 h-4" />
            Log out
          </button>
        </div>
      </aside>

      <div className="flex min-h-screen flex-col">
        <header className="flex items-center gap-4 px-6 py-4 bg-gray-50 border-b border-gray-100">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5 text-gray-600" strokeWidth={1.75} />
          </Button>

          <Logo />

          <div className="ml-auto">
            {eyebrow && (
              <p className="text-xs font-medium uppercase tracking-wide text-primary mb-1 text-right">{eyebrow}</p>
            )}
          </div>

          <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground text-sm font-semibold flex items-center justify-center">
            {initials}
          </div>
        </header>

        <main className="flex-1 px-8 py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
