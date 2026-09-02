import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MentorLayout from '../../../layouts/MentorLayout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { getMyStudents } from '../../../services/mentorService';
import { fetchMyFeedback, submitFeedback } from '../../../store/mentorSlice';

const SESSION_TYPES = ['1:1 session', 'Code review', 'Pairing check-in'];

function formatDate(isoString) {
  if (!isoString) return '';
  return new Date(isoString).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export default function MentorFeedbackPage() {
  const dispatch = useDispatch();
  const feedback = useSelector((state) => state.mentor.feedback);
  const feedbackStatus = useSelector((state) => state.mentor.status);
  const submitStatus = useSelector((state) => state.mentor.submitStatus);

  const [students, setStudents] = useState([]);
  const [studentsStatus, setStudentsStatus] = useState('loading');
  const [studentId, setStudentId] = useState('');
  const [type, setType] = useState(SESSION_TYPES[0]);
  const [note, setNote] = useState('');
  const [filterStudent, setFilterStudent] = useState('All Students');

  useEffect(() => {
    dispatch(fetchMyFeedback());

    let cancelled = false;
    getMyStudents()
      .then((data) => {
        if (!cancelled) {
          setStudents(data);
          setStudentId(data[0]?.id ?? '');
          setStudentsStatus('succeeded');
        }
      })
      .catch(() => {
        if (!cancelled) setStudentsStatus('failed');
      });
    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!note.trim() || !studentId) return;

    dispatch(
      submitFeedback({ studentId: Number(studentId), sessionType: type, note: note.trim() })
    ).then((action) => {
      if (!action.error) setNote('');
    });
  };

  const visibleFeedback = feedback.filter(
    (entry) => filterStudent === 'All Students' || entry.student_name === filterStudent
  );

  return (
    <MentorLayout eyebrow="Mentor" title="Feedback Log" description="Log session notes and review what you've told each student.">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-lg p-5 sticky top-6">
            <h2 className="font-semibold text-foreground mb-4">New feedback</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="student">Student</Label>
                <select
                  id="student"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  disabled={studentsStatus !== 'succeeded' || students.length === 0}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                >
                  {studentsStatus === 'loading' && <option>Loading…</option>}
                  {studentsStatus === 'succeeded' && students.length === 0 && <option>No students assigned</option>}
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>Session type</Label>
                <div className="flex flex-wrap gap-2">
                  {SESSION_TYPES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setType(t)}
                      className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
                        type === t ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground hover:border-primary hover:text-primary'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="note">Notes</Label>
                <Textarea id="note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="What did you cover? Any follow-ups for next time?" className="min-h-[140px]" />
              </div>
              <Button type="submit" className="w-full" disabled={!note.trim() || !studentId || submitStatus === 'loading'}>
                {submitStatus === 'loading' ? 'Saving…' : 'Log feedback'}
              </Button>
            </form>
          </div>
        </div>
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground">History</h2>
            <select value={filterStudent} onChange={(e) => setFilterStudent(e.target.value)} className="px-3 py-2 rounded-md border border-border bg-background text-sm text-muted-foreground">
              <option>All Students</option>
              {students.map((s) => (
                <option key={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-3">
            {feedbackStatus === 'loading' && (
              <div className="bg-card border border-border rounded-lg px-5 py-8 text-center text-sm text-muted-foreground">
                Loading feedback…
              </div>
            )}
            {visibleFeedback.map((entry) => (
              <div key={entry.id} className="bg-card border border-border rounded-lg px-5 py-4">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="font-medium text-foreground">{entry.student_name}</p>
                  <span className="text-xs text-muted-foreground">{formatDate(entry.created_at)}</span>
                </div>
                <span className="inline-block mb-2 rounded-full bg-primary/10 text-primary text-[11px] font-medium px-2 py-0.5">{entry.session_type}</span>
                <p className="text-sm text-muted-foreground">{entry.note}</p>
              </div>
            ))}
            {feedbackStatus === 'succeeded' && visibleFeedback.length === 0 && (
              <div className="bg-card border border-border rounded-lg px-5 py-8 text-center text-sm text-muted-foreground">
                No feedback logged for this student yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </MentorLayout>
  );
}
