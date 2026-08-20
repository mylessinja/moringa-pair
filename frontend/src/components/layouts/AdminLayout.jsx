import { NavLink } from 'react-router-dom';
import Button from '../Button';

const navItems = [
  { to: '/admin/overview', label: 'Overview' },
  { to: '/admin/cohorts', label: 'Cohorts' },
  { to: '/admin/mentors', label: 'Mentors' },
  { to: '/admin/students', label: 'Students' },
  { to: '/admin/settings', label: 'Settings' },
];

// Shared shell for every Admin screen — sidebar + top bar.
// Wrap each admin page:
//   <AdminLayout pageTitle="Mentors" pageDescription="Manage and assign mentors across cohorts.">
//     <MentorsTable />
//   </AdminLayout>
export default function AdminLayout({ children, pageTitle, pageDescription }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 px-6 py-5">
            <div className="w-8 h-8 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold">
              M
            </div>
            <div>
              <p className="font-semibold text-gray-900 leading-tight">MoringaPair</p>
              <p className="text-xs text-gray-500 leading-tight">Admin Dashboard</p>
            </div>
          </div>

          <nav className="mt-2 px-3 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-sm font-medium ${
                    isActive ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="p-4">
          <Button variant="primary" className="w-full">
            + Add New Cohort
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="flex items-center justify-between px-8 py-4 bg-gray-50">
          <input
            type="text"
            placeholder="Search..."
            className="w-72 px-4 py-2 rounded-md border border-gray-200 text-sm bg-white"
          />
          <div className="flex items-center gap-4 text-gray-500">
            <span aria-label="Notifications">🔔</span>
            <span aria-label="Help">❓</span>
            <span className="w-8 h-8 rounded-full bg-gray-300" aria-label="Profile" />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900">{pageTitle}</h1>
          {pageDescription && <p className="text-gray-500 mt-1 mb-6">{pageDescription}</p>}
          {children}
        </main>
      </div>
    </div>
  );
}
