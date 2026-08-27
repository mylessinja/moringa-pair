import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MentorLayout from '../../../layouts/MentorLayout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { mockMentorStudents } from '../data/mockMentorStudents';
import { addFeedback } from '../../../store/mentorSlice';

const SESSION_TYPES = ['1:1 session', 'Code review', 'Pairing check-in'];

export default function MentorFeedbackPage() {
  const dispatch = useDispatch();
  const feedback = useSelector((state) => state.mentor.feedback);
  const [studentId, setStudentId] = useState(mockMentorStudents[0]?.id ?? '');
  const [type, setType] = useState(SESSION_TYPES[0]);
  const [note, setNote] = useState('');
  const [filterStudent, setFilterStudent] = useState('All Students');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!note.trim()) return;
    const student = mockMentorStudents.find((s) => s.id === Number(studentId));
    if (!student) return;
    dispatch(
      addFeedback({
        id: Date.now(),
        studentId: student.id,
        studentName: student.name,
        type,
        note: note.trim(),
        date: 'Just now',
      })
    );
    setNote('');
  };

  const visibleFeedback = feedback.filter((entry) => filterStudent === 'All Students' || entry.studentName === filterStudent);

  return (
    <MentorLayout eyebrow="Mentor" title="Feedback Log" description="Log session notes and review what you've told each student.">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg p-5 sticky top-6">
            <h2 className="font-semibold text-gray-900 mb-4">New feedback</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="student">Student</Label>
                <select id="student" value={studentId} onChange={(e) => setStudentId(e.target.value)} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm">
                  {mockMentorStudents.map((s) => (
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
                        type === t ? 'border-primary bg-primary text-primary-foreground' : 'border-gray-200 text-gray-600 hover:border-primary hover:text-primary'
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
              <Button type="submit" className="w-full" disabled={!note.trim()}>
                Log feedback
              </Button>
            </form>
          </div>
        </div>
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">History</h2>
            <select value={filterStudent} onChange={(e) => setFilterStudent(e.target.value)} className="px-3 py-2 rounded-md border border-gray-200 text-sm text-gray-600">
              <option>All Students</option>
              {mockMentorStudents.map((s) => (
                <option key={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-3">
            {visibleFeedback.map((entry) => (
              <div key={entry.id} className="bg-white border border-gray-200 rounded-lg px-5 py-4">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="font-medium text-gray-900">{entry.studentName}</p>
                  <span className="text-xs text-gray-400">{entry.date}</span>
                </div>
                <span className="inline-block mb-2 rounded-full bg-primary/10 text-primary text-[11px] font-medium px-2 py-0.5">{entry.type}</span>
                <p className="text-sm text-gray-600">{entry.note}</p>
              </div>
            ))}
            {visibleFeedback.length === 0 && (
              <div className="bg-white border border-gray-200 rounded-lg px-5 py-8 text-center text-sm text-gray-500">
                No feedback logged for this student yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </MentorLayout>
  );
}
