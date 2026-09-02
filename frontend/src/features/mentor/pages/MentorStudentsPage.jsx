import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import MentorLayout from '../../../layouts/MentorLayout';
import ProgressBar from '../../admin/components/ProgressBar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import FeedbackPanel from '../components/FeedbackPanel';
import { getMyStudents } from '../../../services/mentorService';
import { submitFeedback } from '../../../store/mentorSlice';

function initials(name) {
  return name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();
}

export default function MentorStudentsPage() {
  const dispatch = useDispatch();
  const [students, setStudents] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [cohortFilter, setCohortFilter] = useState('All Cohorts');
  const [activeStudent, setActiveStudent] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    getMyStudents()
      .then((data) => {
        if (!cancelled) {
          setStudents(data);
          setStatus('succeeded');
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.response?.data?.error || err.message || 'Could not load students');
          setStatus('failed');
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const cohorts = useMemo(
    () => ['All Cohorts', ...new Set(students.map((s) => s.cohort))],
    [students]
  );

  const visibleStudents = students.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchesCohort = cohortFilter === 'All Cohorts' || s.cohort === cohortFilter;
    return matchesSearch && matchesCohort;
  });

  const handleFeedbackSubmit = ({ type, note }) => {
    dispatch(
      submitFeedback({ studentId: activeStudent.id, sessionType: type, note })
    ).then((action) => {
      if (!action.error) setActiveStudent(null);
    });
  };

  return (
    <MentorLayout eyebrow="Mentor" title="My Students" description="Everyone assigned to you across your active cohorts.">
      {status === 'failed' && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 dark:bg-red-500/10 dark:border-red-900 px-4 py-3 text-sm text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <select value={cohortFilter} onChange={(e) => setCohortFilter(e.target.value)} className="px-3 py-2 rounded-md border border-border bg-background text-sm text-muted-foreground">
          {cohorts.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Search students by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="ml-auto w-72 px-4 py-2 rounded-md border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground"
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
            {status === 'loading' && (
              <tr>
                <td colSpan={7} className="py-8 text-center text-muted-foreground">
                  Loading students…
                </td>
              </tr>
            )}
            {status === 'succeeded' && visibleStudents.map((student) => (
              <tr key={student.id} className="border-b border-border">
                <td className="py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-zinc-700 flex items-center justify-center text-xs font-semibold text-muted-foreground">{initials(student.name)}</div>
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
                <td className="py-3 text-muted-foreground">{student.lastActive || '—'}</td>
                <td className="py-3">
                  <Button size="sm" variant="secondary" onClick={() => setActiveStudent(student)}>
                    Leave feedback
                  </Button>
                </td>
              </tr>
            ))}
            {status === 'succeeded' && visibleStudents.length === 0 && (
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
