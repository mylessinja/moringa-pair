import { useEffect, useMemo, useState } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import StatCard from '../components/StatCard';
import { Link } from 'react-router-dom';
import { getDemoStudents } from '../../../services/dummyJsonService';
import { getPairingHistory } from '../../../services/pairingService';
import { pairingVolumeTrend } from '../data/mockAnalytics';
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

const topMentors = [
  { initials: 'AB', color: 'bg-purple-100 text-purple-700', name: 'Lorenah Njeri', dept: 'Data Science', score: 98 },
  { initials: 'CK', color: 'bg-green-100 text-green-700', name: 'James Osire', dept: 'UX Design', score: 95 },
  { initials: 'MN', color: 'bg-blue-100 text-primary', name: 'Rita Wambui', dept: 'Software Eng.', score: 92 },
];

const recentActivity = [
  { title: 'New Cohort Created', time: '10:42 AM', description: "Cohort 'Spring 2024 - Full Stack' initialized with 32 students." },
  { title: 'Mentor Approved', time: '9:15 AM', description: "Caleb Kiprotich's mentor application was approved." },
  { title: 'Pairing Generated', time: 'Yesterday', description: 'Weekly pairing for SE-Cohort 34 was generated and published.' },
];

const MASTERY_BUCKETS = [
  { label: '0-59%', min: 0, max: 59 },
  { label: '60-74%', min: 60, max: 74 },
  { label: '75-89%', min: 75, max: 89 },
  { label: '90-100%', min: 90, max: 100 },
];

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-gray-200 bg-white px-3 py-2 text-xs shadow-sm">
      <p className="font-medium text-gray-900 mb-0.5">{label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} style={{ color: entry.color }}>
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const [students, setStudents] = useState([]);
  const [pairings, setPairings] = useState([]);

  useEffect(() => {
    Promise.all([getDemoStudents(), getPairingHistory()]).then(([loadedStudents, loadedPairings]) => {
      setStudents(loadedStudents);
      setPairings(loadedPairings);
    });
  }, []);

  const averageMastery = students.length
    ? Math.round(students.reduce((total, student) => total + student.mastery, 0) / students.length)
    : null;

  const masteryDistribution = useMemo(
    () =>
      MASTERY_BUCKETS.map((bucket) => ({
        label: bucket.label,
        students: students.filter((s) => s.mastery >= bucket.min && s.mastery <= bucket.max).length,
      })),
    [students]
  );

  const stats = [
    { label: 'Total Active Users', value: students.length || '—', trend: students.length ? 'Current data' : 'Loading', trendTone: 'neutral' },
    { label: 'New Pairings (This Week)', value: pairings.length || '—', trend: pairings.length ? 'Published' : 'Loading', trendTone: 'neutral' },
    { label: 'Platform Mastery Avg.', value: averageMastery ? `${averageMastery}%` : '—', trend: averageMastery ? 'Current data' : 'Loading', trendTone: 'neutral' },
  ];

  return (
    <AdminLayout pageTitle="Dashboard Overview" pageDescription="Monitor platform health, pairing metrics, and recent administrative activity.">
      <div className="grid grid-cols-3 gap-4 mb-6">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="mb-6 flex items-center justify-between rounded-lg border border-gray-200 bg-white p-5">
        <div>
          <h2 className="font-bold text-gray-900">Student directory</h2>
          <p className="mt-1 text-sm text-gray-500">View student profiles, cohorts, progress, and activity.</p>
        </div>
        <Link to="/admin/students" className="text-sm font-medium text-primary hover:underline">View students</Link>
      </div>

      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-gray-900">Recent students</h2>
            <p className="mt-1 text-sm text-gray-500">Students loaded from the shared directory.</p>
          </div>
          <Link to="/admin/students" className="text-sm font-medium text-primary hover:underline">View all</Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {students.slice(0, 5).map((student) => (
            <div key={student.id} className="rounded-md border border-gray-100 p-3">
              <p className="truncate text-sm font-medium text-gray-900">{student.name}</p>
              <p className="mt-1 truncate text-xs text-gray-500">{student.email}</p>
              <p className="mt-3 text-xs text-gray-500">{student.mastery}% mastery</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="col-span-2 border border-gray-200 rounded-lg bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">Pairing Volume Trends</h2>
            <span className="text-xs px-2 py-1 rounded-md border border-gray-200 text-gray-500">Last 30 Days</span>
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
        </div>

        <div className="border border-gray-200 rounded-lg bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">Top Mentors</h2>
            <Link to="/admin/mentors" className="text-xs text-primary font-medium">View All</Link>
          </div>
          <div className="space-y-3">
            {topMentors.map((mentor) => (
              <div key={mentor.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${mentor.color}`}>{mentor.initials}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{mentor.name}</p>
                    <p className="text-xs text-gray-500">{mentor.dept}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{mentor.score}%</p>
                  <p className="text-xs text-gray-400">Score</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-6 border border-gray-200 rounded-lg bg-white p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-bold text-gray-900">Mastery Distribution</h2>
            <p className="mt-1 text-sm text-gray-500">How students in the shared directory are spread across mastery bands.</p>
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

      <div className="border border-gray-200 rounded-lg bg-white p-5">
        <h2 className="font-bold text-gray-900 mb-4">Recent System Activity</h2>
        <div className="space-y-3">
          {recentActivity.map((item) => (
            <div key={item.title} className="flex items-start gap-3 text-sm">
              <span className="w-2 h-2 rounded-full bg-primary mt-1.5" />
              <div>
                <p className="font-medium text-gray-900">{item.title} <span className="text-gray-400 font-normal">· {item.time}</span></p>
                <p className="text-gray-500">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
