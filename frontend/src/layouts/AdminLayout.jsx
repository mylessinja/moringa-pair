import { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useDispatch } from 'react-redux'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import Logo from '@/components/Logo'
import SidebarThemeToggle from '@/components/SidebarThemeToggle'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Search,
  Bell,
  Settings,
  HelpCircle,
  LayoutDashboard,
  Users,
  GraduationCap,
  UserCog,
  LogOut,
  FileBarChart,
  Menu,
  PanelLeftClose,
  CheckCheck,
} from 'lucide-react'
import { logout } from '../store/authSlice'
import {
  listNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from '../services/notificationService'

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/cohorts', label: 'Cohorts', icon: GraduationCap },
  { to: '/admin/mentors', label: 'Mentors', icon: UserCog },
  { to: '/admin/students', label: 'Students', icon: Users },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
  { to: '/admin/pairings', label: 'Pairings', icon: FileBarChart },
  { to: '/admin/audit-logs', label: 'Audit Logs', icon: FileBarChart },
]

export default function AdminLayout({ children, pageTitle, pageDescription }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [notifLoading, setNotifLoading] = useState(false)

  const unreadCount = notifications.filter((n) => !n.read).length

  const loadNotifications = () => {
    setNotifLoading(true)
    listNotifications()
      .then(setNotifications)
      .catch(() => setNotifications([]))
      .finally(() => setNotifLoading(false))
  }

  useEffect(() => {
    loadNotifications()
  }, [])

  useEffect(() => {
    const EDGE = 10
    const onMove = (e) => {
      if (e.clientX <= EDGE) setSidebarOpen(true)
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  const markAllRead = () => {
    markAllNotificationsRead()
      .then(() => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
      })
      .catch(() => {})
  }

  const markRead = (id) => {
    markNotificationRead(id)
      .then(() => {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        )
      })
      .catch(() => {})
  }

  return (
    <div className="relative min-h-screen bg-[#f8f9fb] dark:bg-zinc-950">
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
        className={`fixed inset-y-0 left-0 z-50 flex w-60 flex-col border-r border-zinc-200 bg-white transition-transform duration-300 ease-out dark:border-zinc-800 dark:bg-zinc-900 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        onMouseLeave={() => setSidebarOpen(false)}
      >
        <div className="flex items-center justify-between px-4 py-4">
          <Logo label="System Admin" subtitle="Institutional Access" />
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setSidebarOpen(false)}
          >
            <PanelLeftClose className="h-4 w-4 text-zinc-400 dark:text-zinc-500" />
          </Button>
        </div>

        <nav className="flex-1 space-y-0.5 px-2">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100'
                  }`
                }
              >
                <Icon className="h-4 w-4 shrink-0 opacity-70" strokeWidth={1.75} />
                {item.label}
              </NavLink>
            )
          })}
        </nav>

        <div className="space-y-2 border-t border-zinc-100 p-3 dark:border-zinc-800">
          <Button className="w-full bg-primary hover:bg-primary/90" size="sm">
            <FileBarChart className="mr-2 h-3.5 w-3.5" />
            Generate Reports
          </Button>
          <SidebarThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-zinc-500 dark:text-zinc-400"
            onClick={() => {
              dispatch(logout())
              navigate('/login')
            }}
          >
            <LogOut className="mr-2 h-3.5 w-3.5" />
            Sign out
          </Button>
        </div>
      </aside>

      <div className="flex min-h-screen flex-col">
        <header className="flex h-14 items-center gap-4 border-b border-zinc-200 bg-white px-5 dark:border-zinc-800 dark:bg-zinc-900">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5 text-zinc-600 dark:text-zinc-400" strokeWidth={1.75} />
          </Button>

          <Logo />

          <div className="relative mx-auto hidden w-full max-w-sm md:block">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 dark:text-zinc-500"
              strokeWidth={1.75}
            />
            <Input
              type="search"
              placeholder="Search students, mentors, cohorts…"
              className="h-9 border-zinc-200 bg-zinc-50 pl-9 text-sm shadow-none focus-visible:ring-1 focus-visible:ring-primary/40 dark:border-zinc-700 dark:bg-zinc-800"
            />
          </div>

          <div className="ml-auto flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative h-9 w-9 text-zinc-600 dark:text-zinc-400"
                  aria-label="Notifications"
                >
                  <Bell className="h-4 w-4" strokeWidth={1.75} />
                  {unreadCount > 0 && (
                    <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[360px] p-0">
                <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3 dark:border-zinc-800">
                  <div>
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      Notifications
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {notifLoading
                        ? 'Loading…'
                        : unreadCount === 0
                          ? 'You are all caught up'
                          : `${unreadCount} unread`}
                    </p>
                  </div>
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 gap-1.5 text-xs text-primary"
                      onClick={markAllRead}
                    >
                      <CheckCheck className="h-3.5 w-3.5" />
                      Mark all read
                    </Button>
                  )}
                </div>

                <div className="max-h-[320px] overflow-y-auto">
                  {notifLoading && (
                    <p className="px-4 py-6 text-sm text-zinc-500">Loading…</p>
                  )}
                  {!notifLoading && notifications.length === 0 && (
                    <p className="px-4 py-6 text-sm text-zinc-500">No notifications yet.</p>
                  )}
                  {notifications.map((n) => (
                    <button
                      key={n.id}
                      type="button"
                      onClick={() => markRead(n.id)}
                      className={`flex w-full gap-3 border-b border-zinc-50 px-4 py-3 text-left transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800 ${
                        !n.read ? 'bg-primary/10' : ''
                      }`}
                    >
                      <span
                        className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                          n.read ? 'bg-transparent' : 'bg-primary'
                        }`}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                          {n.title}
                        </p>
                        <p className="mt-0.5 line-clamp-2 text-xs text-zinc-500 dark:text-zinc-400">
                          {n.body}
                        </p>
                        <p className="mt-1 text-[11px] text-zinc-400 dark:text-zinc-500">
                          {n.time}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-zinc-600 dark:text-zinc-400"
              aria-label="Help"
            >
              <HelpCircle className="h-4 w-4" strokeWidth={1.75} />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-zinc-600 dark:text-zinc-400"
              aria-label="Settings"
              onClick={() => navigate('/admin/settings')}
            >
              <Settings className="h-4 w-4" strokeWidth={1.75} />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="ml-1 h-9 w-9 rounded-full p-0">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-zinc-100 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                      AD
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel className="font-normal">
                  <p className="text-sm font-medium">Admin</p>
                  <p className="text-xs text-muted-foreground">admin@moringapair.com</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/admin/settings')}>
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600"
                  onClick={() => {
                    dispatch(logout())
                    navigate('/login')
                  }}
                >
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 px-8 py-8">
          <div className="mb-8">
            <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              {pageTitle}
            </h1>
            {pageDescription && (
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                {pageDescription}
              </p>
            )}
          </div>
          {children}
        </main>
      </div>
    </div>
  )
}
