export const mockMentorStudents = [
  { id: 1, name: 'Victor Sinja', email: 'v.sinja@moringapair.com', cohort: 'SE-Cohort 34', mastery: 85, lastActive: '2 hours ago', focusArea: 'React & state management', status: 'On track' },
  { id: 2, name: 'Ariel Muhuri', email: 'a.muhuri@moringapair.com', cohort: 'SE-Cohort 35', mastery: 60, lastActive: '1 day ago', focusArea: 'Testing and debugging', status: 'Needs check-in' },
  { id: 5, name: 'Naomi Wanjiru', email: 'n.wanjiru@moringapair.com', cohort: 'SE-Cohort 34', mastery: 72, lastActive: '5 hours ago', focusArea: 'API integration', status: 'On track' },
  { id: 6, name: 'Brian Otieno', email: 'b.otieno@moringapair.com', cohort: 'SE-Cohort 35', mastery: 48, lastActive: '3 days ago', focusArea: 'Data structures', status: 'Needs check-in' },
  { id: 7, name: 'Faith Chebet', email: 'f.chebet@moringapair.com', cohort: 'SE-Cohort 34', mastery: 91, lastActive: 'Just now', focusArea: 'System design', status: 'On track' },
];

export const initialMentorFeedback = [
  { id: 1, studentId: 1, studentName: 'Victor Sinja', type: '1:1 session', note: 'Walked through component composition patterns. Confident with hooks now — ready to pair on the assessment project.', date: '2 days ago' },
  { id: 2, studentId: 6, studentName: 'Brian Otieno', type: 'Code review', note: 'Struggling with recursion in the binary tree exercise. Recommended two extra practice sets before next check-in.', date: '3 days ago' },
  { id: 3, studentId: 7, studentName: 'Faith Chebet', type: 'Pairing check-in', note: 'Great progress on the system design mock interview. Encouraged her to mentor a peer next week.', date: '5 days ago' },
];
