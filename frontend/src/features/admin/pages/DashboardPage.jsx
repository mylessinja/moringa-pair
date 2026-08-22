import AdminLayout from '../../../layouts/AdminLayout';
import StatCard from '../components/StatCard';

const stats = [
  {
    label: 'Total Active Users',
    value: '4,829',
    trend: '↑ 12%',
    trendTone: 'positive',
  },
  {
    
    label: 'New Pairings (This Week)',
    value: '342',
    trend: '↑ 8%',
    trendTone: 'positive',
  },
  {
    label: 'Platform Mastery Avg.',
    value: '87%',
    trend: 'Stable',
    trendTone: 'neutral',
  },
];

const topMentors = [
  { initials: 'AB', color: 'bg-purple-100 text-purple-700', name: 'Lorenah Njeri', dept: 'Data Science', score: 98 },
  { initials: 'CK', color: 'bg-green-100 text-green-700', name: 'James Osire', dept: 'UX Design', score: 95 },
  { initials: 'MN', color: 'bg-blue-100 text-blue-700', name: 'Rita Wambui', dept: 'Software Eng.', score: 92 },
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
            <a href="#" className="text-xs text-blue-600 font-medium">
              View All
            </a>
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
              <span className="w-2 h-2 rounded-full bg-blue-600 mt-1.5" />
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
