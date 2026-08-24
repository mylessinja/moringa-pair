import { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useDispatch } from 'react-redux'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import Logo from '@/components/Logo'
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
  GitBranch,
  ScrollText,
  LogOut,
  FileBarChart,
  Menu,
  PanelLeftClose,
  CheckCheck,
} from 'lucide-react'
import { logout } from '../store/authSlice'

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/cohorts', label: 'Cohorts', icon: GraduationCap },
  { to: '/admin/mentors', label: 'Mentors', icon: UserCog },
  { to: '/admin/students', label: 'Students', icon: Users },
  { to: '/admin/pairing-logic', label: 'Pairing Logic', icon: GitBranch },
  { to: '/admin/audit-logs', label: 'Audit Logs', icon: ScrollText },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
]

const initialNotifications = [
  {
    id: 1,
    title: 'New mentor application',
    body: 'Caleb Kiprotich submitted a mentor application for review.',
    time: '12 min ago',
    read: false,
  },
  {
    id: 2,
    title: 'Weekly pairing published',
    body: 'SE-Cohort 34 pairings for this week are live.',
    time: '1 hour ago',
    read: false,
  },
  {
    id: 3,
    title: 'Cohort created',
    body: "Spring 2024 – Full Stack was initialized with 32 students.",
    time: 'Yesterday',
    read: true,
  },
]

export default function AdminLayout({ children, pageTitle, pageDescription }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notifications, setNotifications] = useState(initialNotifications)

  const unreadCount = notifications.filter((n) => !n.read).length

  useEffect(() => {
    const EDGE = 10
    const onMove = (e) => {
      if (e.clientX <= EDGE) setSidebarOpen(true)
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const markRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  return (
    <div className="relative min-h-screen bg-[#f8f9fb]">
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
        className={`fixed inset-y-0 left-0 z-50 flex w-60 flex-col border-r border-zinc-200 bg-white transition-transform duration-300 ease-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        onMouseLeave={() => setSidebarOpen(false)}
      >
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-xs font-bold text-white">
              M
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-900">System Admin</p>
              <p className="text-[11px] text-zinc-400">Institutional Access</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setSidebarOpen(false)}
          >
            <PanelLeftClose className="h-4 w-4 text-zinc-400" />
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
                      : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
                  }`
                }
              >
                <Icon className="h-4 w-4 shrink-0 opacity-70" strokeWidth={1.75} />
                {item.label}
              </NavLink>
            )
          })}
        </nav>

        <div className="space-y-2 border-t border-zinc-100 p-3">
          <Button className="w-full bg-primary hover:bg-primary/90" size="sm">
            <FileBarChart className="mr-2 h-3.5 w-3.5" />
            Generate Reports
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-zinc-500"
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
        <header className="flex h-14 items-center gap-4 border-b border-zinc-200 bg-white px-5">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5 text-zinc-600" strokeWidth={1.75} />
          </Button>

          <Logo />

          <div className="relative mx-auto hidden w-full max-w-sm md:block">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
              strokeWidth={1.75}
            />
            <Input
              type="search"
              placeholder="Search students, mentors, cohorts…"
              className="h-9 border-zinc-200 bg-zinc-50 pl-9 text-sm shadow-none focus-visible:ring-1 focus-visible:ring-primary/40"
            />
          </div>

          <div className="ml-auto flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative h-9 w-9 text-zinc-600"
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
                <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">Notifications</p>
                    <p className="text-xs text-zinc-500">
                      {unreadCount === 0 ? 'You are all caught up' : `${unreadCount} unread`}
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
                  {notifications.map((n) => (
                    <button
                      key={n.id}
                      type="button"
                      onClick={() => markRead(n.id)}
                      className={`flex w-full gap-3 border-b border-zinc-50 px-4 py-3 text-left transition-colors hover:bg-zinc-50 ${
                        !n.read ? 'bg-primary/10' : ''
                      }`}
                    >
                      <span
                        className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                          n.read ? 'bg-transparent' : 'bg-primary'
                        }`}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-zinc-900">{n.title}</p>
                        <p className="mt-0.5 line-clamp-2 text-xs text-zinc-500">{n.body}</p>
                        <p className="mt-1 text-[11px] text-zinc-400">{n.time}</p>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="border-t border-zinc-100 p-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-xs text-zinc-600"
                    onClick={() => navigate('/admin/audit-logs')}
                  >
                    View all activity
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" size="icon" className="h-9 w-9 text-zinc-600" aria-label="Help">
              <HelpCircle className="h-4 w-4" strokeWidth={1.75} />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-zinc-600"
              aria-label="Settings"
              onClick={() => navigate('/admin/settings')}
            >
              <Settings className="h-4 w-4" strokeWidth={1.75} />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="ml-1 h-9 w-9 rounded-full p-0">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-zinc-100 text-xs font-medium text-zinc-600">
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
                  onClick={() => navigate('/login')}
                >
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 px-8 py-8">
          <div className="mb-8">
            <h1 className="text-xl font-semibold tracking-tight text-zinc-900">{pageTitle}</h1>
            {pageDescription && (
              <p className="mt-1 text-sm text-zinc-500">{pageDescription}</p>
            )}
          </div>
          {children}
        </main>
      </div>
    </div>
  )
}