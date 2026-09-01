import { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import MentorLayout from '../../../layouts/MentorLayout';
import ProgressBar from '../../admin/components/ProgressBar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import FeedbackPanel from '../components/FeedbackPanel';
import { mockMentorStudents } from '../data/mockMentorStudents';
import { addFeedback } from '../../../store/mentorSlice';

function initials(name) {
  return name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();
}

export default function MentorStudentsPage() {
  const dispatch = useDispatch();
  const [students] = useState(mockMentorStudents);
  const [search, setSearch] = useState('');
  const [cohortFilter, setCohortFilter] = useState('All Cohorts');
  const [activeStudent, setActiveStudent] = useState(null);

  const cohorts = useMemo(() => ['All Cohorts', ...new Set(students.map((s) => s.cohort))], [students]);

  const visibleStudents = students.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchesCohort = cohortFilter === 'All Cohorts' || s.cohort === cohortFilter;
    return matchesSearch && matchesCohort;
  });

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
    <MentorLayout eyebrow="Mentor" title="My Students" description="Everyone assigned to you across your active cohorts.">
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <select value={cohortFilter} onChange={(e) => setCohortFilter(e.target.value)} className="px-3 py-2 rounded-md border border-border text-sm text-muted-foreground">
          {cohorts.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Search students by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="ml-auto w-72 px-4 py-2 rounded-md border border-border text-sm"
        />
      </div>
      <div className="bg-card border border-border rounded-lg px-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-muted-foreground border-b border-border">
              <th className="py-3 font-medium">Student</th>
              <th className="py-3 font-medium">Cohort</th>
              <th className="py-3 font-medium">Focus area</th>
              <th className="py-3 font-medium">Mastery</th>
              <th className="py-3 font-medium">Status</th>
              <th className="py-3 font-medium">Last Active</th>
              <th className="py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {visibleStudents.map((student) => (
              <tr key={student.id} className="border-b border-border">
                <td className="py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-zinc-700 dark:bg-zinc-700 flex items-center justify-center text-xs font-semibold text-muted-foreground">{initials(student.name)}</div>
                    <div>
                      <p className="font-medium text-foreground">{student.name}</p>
                      <p className="text-muted-foreground text-xs">{student.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 text-muted-foreground">{student.cohort}</td>
                <td className="py-3 text-muted-foreground">{student.focusArea}</td>
                <td className="py-3">
                  <ProgressBar value={student.mastery} />
                </td>
                <td className="py-3">
                  <Badge variant="outline" className={student.status === 'On track' ? 'border-green-200 bg-green-50 dark:bg-green-500/15 text-green-700 dark:text-green-400' : 'border-amber-200 bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400'}>
                    {student.status}
                  </Badge>
                </td>
                <td className="py-3 text-muted-foreground">{student.lastActive}</td>
                <td className="py-3">
                  <Button size="sm" variant="secondary" onClick={() => setActiveStudent(student)}>
                    Leave feedback
                  </Button>
                </td>
              </tr>
            ))}
            {visibleStudents.length === 0 && (
              <tr>
                <td colSpan={7} className="py-8 text-center text-muted-foreground">
                  No students match that search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="flex justify-between items-center py-3 text-sm text-muted-foreground">
          <span>Showing {visibleStudents.length} of {students.length} students</span>
        </div>
      </div>
      <FeedbackPanel student={activeStudent} onClose={() => setActiveStudent(null)} onSubmit={handleFeedbackSubmit} />
    </MentorLayout>
  );
}
