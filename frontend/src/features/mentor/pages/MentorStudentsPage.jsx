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
        <select value={cohortFilter} onChange={(e) => setCohortFilter(e.target.value)} className="px-3 py-2 rounded-md border border-gray-200 text-sm text-gray-600">
          {cohorts.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Search students by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="ml-auto w-72 px-4 py-2 rounded-md border border-gray-200 text-sm"
        />
      </div>
      <div className="bg-white border border-gray-200 rounded-lg px-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-200">
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
              <tr key={student.id} className="border-b border-gray-100">
                <td className="py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600">{initials(student.name)}</div>
                    <div>
                      <p className="font-medium text-gray-900">{student.name}</p>
                      <p className="text-gray-500 text-xs">{student.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 text-gray-600">{student.cohort}</td>
                <td className="py-3 text-gray-600">{student.focusArea}</td>
                <td className="py-3">
                  <ProgressBar value={student.mastery} />
                </td>
                <td className="py-3">
                  <Badge variant="outline" className={student.status === 'On track' ? 'border-green-200 bg-green-50 text-green-700' : 'border-amber-200 bg-amber-50 text-amber-700'}>
                    {student.status}
                  </Badge>
                </td>
                <td className="py-3 text-gray-600">{student.lastActive}</td>
                <td className="py-3">
                  <Button size="sm" variant="secondary" onClick={() => setActiveStudent(student)}>
                    Leave feedback
                  </Button>
                </td>
              </tr>
            ))}
            {visibleStudents.length === 0 && (
              <tr>
                <td colSpan={7} className="py-8 text-center text-gray-500">
                  No students match that search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="flex justify-between items-center py-3 text-sm text-gray-500">
          <span>Showing {visibleStudents.length} of {students.length} students</span>
        </div>
      </div>
      <FeedbackPanel student={activeStudent} onClose={() => setActiveStudent(null)} onSubmit={handleFeedbackSubmit} />
    </MentorLayout>
  );
}
