// Stand-in data until GET /students exists on the backend.
// This is the single canonical student list — the admin Students table,
// the student directory on the student Dashboard, and each mentor's
// assigned students (see ../../mentor/data/mockMentorStudents.js) all
// read from this same list so names/cohorts stay in sync across roles.
export const mockStudents = [
  { id: 1, name: 'Victor Sinja', email: 'v.sinja@moringapair.com', cohort: 'SE-Cohort 34', mastery: 85, lastActive: '2 hours ago' },
  { id: 2, name: 'Ariel Muhuri', email: 'a.muhuri@moringapair.com', cohort: 'SE-Cohort 35', mastery: 60, lastActive: '1 day ago' },
  { id: 3, name: 'Charity Kiharu', email: 'c.kiharu@moringapair.com', cohort: 'DS-Cohort 12', mastery: 90, lastActive: 'Just now' },
  { id: 5, name: 'Naomi Wanjiru', email: 'n.wanjiru@moringapair.com', cohort: 'SE-Cohort 34', mastery: 72, lastActive: '5 hours ago' },
  { id: 6, name: 'Brian Otieno', email: 'b.otieno@moringapair.com', cohort: 'SE-Cohort 35', mastery: 48, lastActive: '3 days ago' },
  { id: 7, name: 'Faith Chebet', email: 'f.chebet@moringapair.com', cohort: 'SE-Cohort 34', mastery: 91, lastActive: 'Just now' },
];
