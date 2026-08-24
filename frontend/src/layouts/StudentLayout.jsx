import { NavLink, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { LayoutDashboard, ClipboardList, History, CircleUserRound, LogOut } from 'lucide-react';
import Logo from '../components/Logo';
import { logout } from '../store/authSlice';

const navItems = [
  { to: '/dashboard', label: 'My Pairing', icon: LayoutDashboard },
  { to: '/assessment', label: 'Assessment', icon: ClipboardList },
  { to: '/dashboard#pairing-history', label: 'Pairing History', icon: History },
];

export default function StudentLayout({ children, eyebrow, title, avatarInitials = 'AM' }) {
  const dispatch = useDispatch();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between">
        <div>
          <Link to="/dashboard" className="flex items-center gap-2 px-6 py-5">
            <Logo />
          </Link>

          <nav className="mt-2 px-3 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
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
            to="/profile"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${
                isActive ? 'bg-primary/10 text-primary font-semibold' : 'text-gray-600 hover:bg-gray-100'
              }`
            }
          >
            <CircleUserRound className="w-4 h-4" />
            Profile
          </NavLink>
          <Link
            to="/login"
            onClick={() => dispatch(logout())}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100"
          >
            <LogOut className="w-4 h-4" />
            Log out
          </Link>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between px-8 py-4 bg-gray-50 border-b border-gray-100">
          <div>
            {eyebrow && (
              <p className="text-xs font-medium uppercase tracking-wide text-primary mb-1">{eyebrow}</p>
            )}
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          </div>
          <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground text-sm font-semibold flex items-center justify-center">
            {avatarInitials}
          </div>
        </header>

        <main className="flex-1 px-8 py-6">{children}</main>
      </div>
    </div>
  );
}
