import { NavLink } from 'react-router-dom';
import Button from '../components/ui/Button';

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/cohorts', label: 'Cohorts' },
  { to: '/admin/mentors', label: 'Mentors' },
  { to: '/admin/students', label: 'Students' },
  { to: '/admin/pairing-logic', label: 'Pairing Logic' },
  { to: '/admin/audit-logs', label: 'Audit Logs' },
  { to: '/admin/settings', label: 'Settings' },
];

export default function AdminLayout({ children, pageTitle, pageDescription }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 px-6 py-5">
            <div className="w-8 h-8 rounded-md bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
              M
            </div>
            <div>
              <p className="font-semibold text-gray-900 leading-tight text-sm">System Admin</p>
              <p className="text-xs text-gray-500 leading-tight">Institutional Access</p>
            </div>
          </div>

          <nav className="mt-2 px-3 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-sm font-medium ${
                    isActive ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-600 hover:bg-gray-100'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="p-4">
          <Button variant="primary" className="w-full mb-3">
            Generate Reports
          </Button>
          <div className="border-t border-gray-100 pt-3 space-y-1 text-sm text-gray-500">
            <button className="w-full text-left px-3 py-1.5 rounded-md hover:bg-gray-100">Support</button>
            <button className="w-full text-left px-3 py-1.5 rounded-md hover:bg-gray-100">Sign Out</button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between px-8 py-4 bg-gray-50 border-b border-gray-100">
          <p className="font-bold text-lg whitespace-nowrap">
            <span className="text-blue-700">MoringaPair</span> <span className="text-gray-900">Admin</span>
          </p>
          <input
            type="text"
            placeholder="Search..."
            className="w-72 px-4 py-2 rounded-md border border-gray-200 text-sm bg-white mx-6"
          />
          <div className="flex items-center gap-4 text-gray-500">
            <span aria-label="Notifications">🔔</span>
            <span aria-label="Settings">⚙️</span>
            <span aria-label="Help">❓</span>
            <span className="w-8 h-8 rounded-full bg-gray-300" aria-label="Profile" />
          </div>
        </header>

        <main className="flex-1 px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900">{pageTitle}</h1>
          {pageDescription && <p className="text-gray-500 mt-1 mb-6">{pageDescription}</p>}
          {children}
        </main>
      </div>
    </div>
  );
}
