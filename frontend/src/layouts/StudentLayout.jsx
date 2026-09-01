import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { LayoutDashboard, ClipboardList, History, CircleUserRound, LogOut, Menu, PanelLeftClose } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Logo from '../components/Logo';
import SidebarThemeToggle from '../components/SidebarThemeToggle';
import { logout } from '../store/authSlice';

const navItems = [
  { to: '/dashboard', label: 'My Pairing', icon: LayoutDashboard },
  { to: '/assessment', label: 'Assessment', icon: ClipboardList },
  { to: '/pairing/history', label: 'Pairing History', icon: History },
];

export default function StudentLayout({ children, eyebrow, title, avatarInitials = 'AM' }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const EDGE = 10;
    const onMove = (e) => {
      if (e.clientX <= EDGE) setSidebarOpen(true);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-zinc-950">
      <div className="fixed inset-y-0 left-0 z-40 w-2" onMouseEnter={() => setSidebarOpen(true)} aria-hidden />

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/20" onClick={() => setSidebarOpen(false)} aria-hidden />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col justify-between border-r border-gray-200 bg-white transition-transform duration-300 ease-out dark:border-zinc-800 dark:bg-zinc-900 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        onMouseLeave={() => setSidebarOpen(false)}
      >
        <div>
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-xs font-bold text-white">
                S
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Student</p>
                <p className="text-[11px] text-zinc-400 dark:text-zinc-500">Learner Access</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSidebarOpen(false)}>
              <PanelLeftClose className="h-4 w-4 text-gray-400 dark:text-zinc-500" />
            </Button>
          </div>

          <nav className="mt-2 px-3 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${
                    isActive
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'text-gray-600 hover:bg-gray-100 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100'
                  }`
                }
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="p-3 space-y-1 border-t border-gray-100 dark:border-zinc-800">
          <NavLink
            to="/profile"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${
                isActive
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100'
              }`
            }
          >
            <CircleUserRound className="w-4 h-4" />
            Profile
          </NavLink>
          <SidebarThemeToggle className="text-gray-600 dark:text-zinc-400" />
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          >
            <LogOut className="w-4 h-4" />
            Log out
          </button>
        </div>
      </aside>

      <div className="flex min-h-screen flex-col">
        <header className="flex items-center gap-4 px-6 py-4 bg-gray-50 border-b border-gray-100 dark:bg-zinc-950 dark:border-zinc-800">
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
              <p className="text-xs font-medium uppercase tracking-wide text-primary mb-1 text-right">{eyebrow}</p>
            )}
          </div>

          <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground text-sm font-semibold flex items-center justify-center">
            {avatarInitials}
          </div>
        </header>

        <main className="flex-1 px-8 py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-100">{title}</h1>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
