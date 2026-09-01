import { Activity, GraduationCap, TrendingUp } from 'lucide-react';

function StatBox({ icon, label, value }) {
  return (
    <div className="flex-1 border border-border rounded-lg bg-card px-5 py-4 flex items-center justify-between">
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">{label}</p>
        <p className="text-2xl font-bold text-foreground">{value}</p>
      </div>
      <span className="text-xl text-muted-foreground">{icon}</span>
    </div>
  );
}

export default function StudentStats({ totalStudents, avgMastery, activeToday }) {
  return (
    <div className="flex gap-4 mb-6">
      <StatBox icon={<GraduationCap className="w-4 h-4" />} label="Total Students" value={totalStudents} />
      <StatBox icon={<TrendingUp className="w-4 h-4" />} label="Avg. Mastery" value={`${avgMastery}%`} />
      <StatBox icon={<Activity className="w-4 h-4" />} label="Active Today" value={activeToday} />
    </div>
  );
}
