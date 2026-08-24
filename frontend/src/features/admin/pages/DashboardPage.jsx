import { useEffect, useState } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import StatCard from '../components/StatCard';
import { Link } from 'react-router-dom';
import { getDemoStudents } from '../../../services/dummyJsonService';
import { getPairingHistory } from '../../../services/pairingService';

const topMentors = [
  { initials: 'AB', color: 'bg-purple-100 text-purple-700', name: 'Lorenah Njeri', dept: 'Data Science', score: 98 },
  { initials: 'CK', color: 'bg-green-100 text-green-700', name: 'James Osire', dept: 'UX Design', score: 95 },
  { initials: 'MN', color: 'bg-blue-100 text-primary', name: 'Rita Wambui', dept: 'Software Eng.', score: 92 },
];


const recentActivity = [
  {
    title: 'New Cohort Created',
    time: '10:42 AM',
    description: "Cohort 'Spring 2024 - Full Stack' initialized with 32 students.",
  },
  {
    title: 'Mentor Approved',
    time: '9:15 AM',
    description: "Caleb Kiprotich's mentor application was approved.",
  },
  {
    title: 'Pairing Generated',
    time: 'Yesterday',
    description: 'Weekly pairing for SE-Cohort 34 was generated and published.',
  },
];

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
  const stats = [
    {
      label: 'Total Active Users',
      value: students.length || '—',
      trend: students.length ? 'Current data' : 'Loading',
      trendTone: 'neutral',
    },
    {
      label: 'New Pairings (This Week)',
      value: pairings.length || '—',
      trend: pairings.length ? 'Published' : 'Loading',
      trendTone: 'neutral',
    },
    {
      label: 'Platform Mastery Avg.',
      value: averageMastery ? `${averageMastery}%` : '—',
      trend: averageMastery ? 'Current data' : 'Loading',
      trendTone: 'neutral',
    },
  ];

  return (
    <AdminLayout
      pageTitle="Dashboard Overview"
      pageDescription="Monitor platform health, pairing metrics, and recent administrative activity."
    >
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
        <Link to="/admin/students" className="text-sm font-medium text-primary hover:underline">
          View students
        </Link>
      </div>

      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-gray-900">Recent students</h2>
            <p className="mt-1 text-sm text-gray-500">Students loaded from the shared directory.</p>
          </div>
          <Link to="/admin/students" className="text-sm font-medium text-primary hover:underline">
            View all
          </Link>
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
            <span className="text-xs px-2 py-1 rounded-md border border-gray-200 text-gray-500">
              Last 30 Days
            </span>
          </div>
      
          <div className="relative h-48 flex items-end gap-3">
            {[40, 60, 35, 55, 90, 70, 100].map((height, i) => (
              <div key={i} className="flex-1 bg-blue-100 rounded-t" style={{ height: `${height}%` }} />
            ))}
            <span className="absolute top-1/3 left-1/3 bg-white border border-gray-200 rounded-full px-3 py-1 text-xs text-gray-500 shadow-sm">
              Chart Visualization Area
            </span>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">Top Mentors</h2>
            <Link to="/admin/mentors" className="text-xs text-primary font-medium">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {topMentors.map((mentor) => (
              <div key={mentor.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${mentor.color}`}
                  >
                    {mentor.initials}
                  </span>
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

      <div className="border border-gray-200 rounded-lg bg-white p-5">
        <h2 className="font-bold text-gray-900 mb-4">Recent System Activity</h2>
        <div className="space-y-3">
          {recentActivity.map((item) => (
            <div key={item.title} className="flex items-start gap-3 text-sm">
              <span className="w-2 h-2 rounded-full bg-primary mt-1.5" />
              <div>
                <p className="font-medium text-gray-900">
                  {item.title} <span className="text-gray-400 font-normal">· {item.time}</span>
                </p>
                <p className="text-gray-500">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
