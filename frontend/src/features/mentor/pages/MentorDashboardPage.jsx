import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Users, TrendingUp, AlertCircle, MessageSquareText } from 'lucide-react';
import MentorLayout from '../../../layouts/MentorLayout';
import StatCard from '../../admin/components/StatCard';
import ProgressBar from '../../admin/components/ProgressBar';
import { Button } from '@/components/ui/button';
import FeedbackPanel from '../components/FeedbackPanel';
import { mockMentorStudents } from '../data/mockMentorStudents';
import { addFeedback } from '../../../store/mentorSlice';

export default function MentorDashboardPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const feedback = useSelector((state) => state.mentor.feedback);
  const [students] = useState(mockMentorStudents);
  const [activeStudent, setActiveStudent] = useState(null);

  const stats = useMemo(() => {
    const total = students.length;
    const avgMastery = Math.round(students.reduce((sum, s) => sum + s.mastery, 0) / (total || 1));
    const needsAttention = students.filter((s) => s.status === 'Needs check-in').length;
    return { total, avgMastery, needsAttention, sessionsThisWeek: feedback.length };
  }, [students, feedback]);

  const attentionList = students.filter((s) => s.status === 'Needs check-in');
  const recentFeedback = feedback.slice(0, 3);

  const handleFeedbackSubmit = ({ type, note }) => {
    dispatch(
      addFeedback({
        id: Date.now(),
        studentId: activeStudent.id,
        studentName: activeStudent.name,
        type,
        note,
        date: 'Just now',
      })
    );
    setActiveStudent(null);
  };

  return (
    <MentorLayout
      eyebrow="Mentor"
      title={`Welcome back${user?.name ? `, ${user.name.split(' ')[0]}` : ''}`}
      description="Here's how your students are doing this week."
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={<Users className="w-4 h-4" />} iconBg="bg-blue-100 dark:bg-blue-500/15 text-blue-700 dark:text-blue-400" label="Assigned Students" value={stats.total} />
        <StatCard icon={<TrendingUp className="w-4 h-4" />} iconBg="bg-green-100 dark:bg-green-500/15 text-green-700 dark:text-green-400" label="Avg. Mastery" value={`${stats.avgMastery}%`} />
        <StatCard icon={<AlertCircle className="w-4 h-4" />} iconBg="bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400" label="Needs Check-in" value={stats.needsAttention} trend={stats.needsAttention > 0 ? 'Review soon' : undefined} trendTone="neutral" />
        <StatCard icon={<MessageSquareText className="w-4 h-4" />} iconBg="bg-purple-100 dark:bg-purple-500/15 text-purple-700 dark:text-purple-400" label="Feedback Logged" value={stats.sessionsThisWeek} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-lg">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="font-semibold text-foreground">Students needing attention</h2>
            <p className="text-sm text-muted-foreground">Lower mastery or inactive recently.</p>
          </div>
          <div className="divide-y divide-gray-100">
            {attentionList.length === 0 && <p className="px-5 py-6 text-sm text-muted-foreground">Everyone's on track — nice work.</p>}
            {attentionList.map((student) => (
              <div key={student.id} className="flex items-center justify-between px-5 py-4 gap-4">
                <div className="min-w-0">
                  <p className="font-medium text-foreground truncate">{student.name}</p>
                  <p className="text-xs text-muted-foreground">{student.cohort} · {student.lastActive}</p>
                  <div className="mt-2">
                    <ProgressBar value={student.mastery} />
                  </div>
                </div>
                <Button size="sm" variant="secondary" onClick={() => setActiveStudent(student)}>
                  Leave feedback
                </Button>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="font-semibold text-foreground">Recent feedback</h2>
            <p className="text-sm text-muted-foreground">Your latest notes across students.</p>
          </div>
          <div className="divide-y divide-gray-100">
            {recentFeedback.map((entry) => (
              <div key={entry.id} className="px-5 py-4">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-foreground">{entry.studentName}</p>
                  <span className="text-xs text-muted-foreground">{entry.date}</span>
                </div>
                <span className="inline-block mb-1.5 rounded-full bg-primary/10 text-primary text-[11px] font-medium px-2 py-0.5">{entry.type}</span>
                <p className="text-sm text-muted-foreground line-clamp-2">{entry.note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <FeedbackPanel student={activeStudent} onClose={() => setActiveStudent(null)} onSubmit={handleFeedbackSubmit} />
    </MentorLayout>
  );
}
