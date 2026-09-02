import { mockStudents } from '../../admin/data/mockStudents';
import { mockMentors } from '../../admin/data/mockMentors';

// The demo mentor account (mentor@moringapair.com) is Albert Byrone —
// see ../../admin/data/mockMentors.js. His assigned students are derived
// from the same canonical mockStudents list (../../admin/data/mockStudents.js)
// by matching cohort, rather than maintaining a separate duplicate list,
// so the same students show up consistently across admin, mentor, and
// student views.
const currentMentor = mockMentors.find((mentor) => mentor.name === 'Albert Byrone');
const mentorCohorts = currentMentor.activeCohorts.split(', ');

const FOCUS_AREAS = ['React & state management', 'Testing and debugging', 'API integration', 'Data structures', 'System design'];

export const mockMentorStudents = mockStudents
  .filter((student) => mentorCohorts.includes(student.cohort))
  .map((student, index) => ({
    ...student,
    focusArea: FOCUS_AREAS[index % FOCUS_AREAS.length],
    status: student.mastery < 65 ? 'Needs check-in' : 'On track',
  }));

// Stand-in data until GET /mentors/:id/feedback exists on the backend.
export const initialMentorFeedback = [
  { id: 1, studentId: 1, studentName: 'Victor Sinja', type: '1:1 session', note: 'Walked through component composition patterns. Confident with hooks now — ready to pair on the assessment project.', date: '2 days ago' },
  { id: 2, studentId: 6, studentName: 'Brian Otieno', type: 'Code review', note: 'Struggling with recursion in the binary tree exercise. Recommended two extra practice sets before next check-in.', date: '3 days ago' },
  { id: 3, studentId: 7, studentName: 'Faith Chebet', type: 'Pairing check-in', note: 'Great progress on the system design mock interview. Encouraged her to mentor a peer next week.', date: '5 days ago' },
];
