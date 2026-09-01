import { useEffect, useMemo, useState } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import StatCard from '../components/StatCard';
import { Link } from 'react-router-dom';
import { getStudents, getMentors, getAuditLogs, getStats } from '../../../services/adminService';
import { pairingVolumeTrend } from '../data/mockAnalytics';
import { Users, Layers, TrendingUp } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

const MASTERY_BUCKETS = [
  { label: '0-59%', min: 0, max: 59 },
  { label: '60-74%', min: 60, max: 74 },
  { label: '75-89%', min: 75, max: 89 },
  { label: '90-100%', min: 90, max: 100 },
];

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-border bg-card px-3 py-2 text-xs shadow-sm">
      <p className="font-medium text-foreground mb-0.5">{label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} style={{ color: entry.color }}>
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
}

function timeAgo(isoString) {
  if (!isoString) return '';
  const diffMs = Date.now() - new Date(isoString).getTime();
  const minutes = Math.round(diffMs / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}
export default function DashboardPage() {
  const [students, setStudents] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([getStudents(), getMentors(), getAuditLogs(5), getStats()])
      .then(([loadedStudents, loadedMentors, loadedLogs, loadedStats]) => {
        setStudents(loadedStudents);
        setMentors(loadedMentors);
        setAuditLogs(loadedLogs);
        setStats(loadedStats);
        setStatus('succeeded');
      })
      .catch((err) => {
        setError(err.response?.data?.error || 'Could not load dashboard data.');
        setStatus('failed');
      });
  }, []);

  const masteryDistribution = useMemo(
    () =>
      MASTERY_BUCKETS.map((bucket) => ({
        label: bucket.label,
        students: students.filter((s) => s.mastery >= bucket.min && s.mastery <= bucket.max).length,
      })),
    [students]
  );

  const approvedMentors = mentors.filter((m) => m.status === 'approved').slice(0, 3);

  return (
    <AdminLayout
      pageTitle="Dashboard Overview"
      pageDescription="Monitor platform health, pairing metrics, and recent administrative activity."
    >
      {status === 'loading' && <p className="text-sm text-muted-foreground py-6">Loading dashboard...</p>}
      {status === 'failed' && <p className="text-sm text-red-600 dark:text-red-400 py-6">{error}</p>}

      {status === 'succeeded' && (
        <>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <StatCard
              icon={<Users className="w-4 h-4" />}
              iconBg="bg-blue-100 dark:bg-blue-500/15 text-blue-700 dark:text-blue-400"
              label="Total Active Users"
              value={stats.totalActiveUsers}
              trend="Current data"
              trendTone="neutral"
            />
            <StatCard
              icon={<Layers className="w-4 h-4" />}
              iconBg="bg-purple-100 dark:bg-purple-500/15 text-purple-700 dark:text-purple-400"
              label="Active Cohorts"
              value={stats.activeCohorts}
              trend="Current data"
              trendTone="neutral"
            />
            <StatCard
              icon={<TrendingUp className="w-4 h-4" />}
              iconBg="bg-green-100 dark:bg-green-500/15 text-green-700 dark:text-green-400"
              label="Platform Mastery Avg."
              value={`${stats.avgMastery}%`}
              trend="Current data"
              trendTone="neutral"
            />
          </div>

          <div className="mb-6 flex items-center justify-between rounded-lg border border-border bg-card p-5">
            <div>
              <h2 className="font-bold text-foreground">Student directory</h2>
              <p className="mt-1 text-sm text-muted-foreground">View student profiles, cohorts, progress, and activity.</p>
            </div>
            <Link to="/admin/students" className="text-sm font-medium text-primary hover:underline">
              View students
            </Link>
          </div>

          <div className="mb-6 rounded-lg border border-border bg-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-foreground">Recent students</h2>
                <p className="mt-1 text-sm text-muted-foreground">Students loaded from the shared directory.</p>
              </div>
              <Link to="/admin/students" className="text-sm font-medium text-primary hover:underline">
                View all
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {students.slice(0, 5).map((student) => (
                <div key={student.id} className="rounded-md border border-border p-3">
                  <p className="truncate text-sm font-medium text-foreground">{student.name}</p>
                  <p className="mt-1 truncate text-xs text-muted-foreground">{student.email}</p>
                  <p className="mt-3 text-xs text-muted-foreground">{student.mastery}% mastery</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="col-span-2 border border-border rounded-lg bg-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-foreground">Pairing Volume Trends</h2>
                <span className="text-xs px-2 py-1 rounded-md border border-border text-muted-foreground">
                  Last 30 Days (sample data)
                </span>
              </div>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={pairingVolumeTrend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="pairingFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(214 82% 51%)" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="hsl(214 82% 51%)" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} interval={4} axisLine={{ stroke: '#e5e7eb' }} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={28} />
                    <Tooltip content={<ChartTooltip />} />
                    <Area type="monotone" dataKey="pairings" name="Pairings" stroke="hsl(214 82% 51%)" strokeWidth={2} fill="url(#pairingFill)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Sample data — a real daily pairing-count endpoint isn't built yet.
              </p>
            </div>

            <div className="border border-border rounded-lg bg-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-foreground">Approved Mentors</h2>
                <Link to="/admin/mentors" className="text-xs text-primary font-medium">
                  View All
                </Link>
              </div>
              <div className="space-y-3">
                {approvedMentors.length === 0 && <p className="text-sm text-muted-foreground">No approved mentors yet.</p>}
                {approvedMentors.map((mentor) => (
                  <div key={mentor.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">{mentor.name}</p>
                      <p className="text-xs text-muted-foreground">{mentor.activeCohorts}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-6 border border-border rounded-lg bg-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-bold text-foreground">Mastery Distribution</h2>
                <p className="mt-1 text-sm text-muted-foreground">How students in the shared directory are spread across mastery bands.</p>
              </div>
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={masteryDistribution} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={{ stroke: '#e5e7eb' }} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={28} allowDecimals={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="students" name="Students" fill="hsl(214 82% 51%)" radius={[4, 4, 0, 0]} maxBarSize={56} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="border border-border rounded-lg bg-card p-5">
            <h2 className="font-bold text-foreground mb-4">Recent System Activity</h2>
            <div className="space-y-3">
              {auditLogs.length === 0 && <p className="text-sm text-muted-foreground">No activity logged yet.</p>}
              {auditLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-3 text-sm">
                  <span className="w-2 h-2 rounded-full bg-primary mt-1.5" />
                  <div>
                    <p className="font-medium text-foreground">
                      {log.action} <span className="text-muted-foreground font-normal">· {timeAgo(log.timestamp)}</span>
                    </p>
                    <p className="text-muted-foreground">{log.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}
