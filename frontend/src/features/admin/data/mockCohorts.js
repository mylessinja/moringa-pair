// Stand-in data until GET /cohorts exists on the backend.
export const mockCohorts = [
  {
    id: 1,
    track: 'Software Engineering',
    trackColor: 'bg-blue-100 text-blue-700',
    name: 'Spring 2024 Alpha',
    students: 42,
    avgMastery: 87,
    mentors: 4,
    weekOfSyllabus: 6,
    totalWeeks: 12,
    leadMentor: 'Albert Byrone',
  },
  {
    id: 2,
    track: 'Data Science',
    trackColor: 'bg-green-100 text-green-700',
    name: 'Winter 2024 Core',
    students: 28,
    avgMastery: 92,
    mentors: 3,
    weekOfSyllabus: 10,
    totalWeeks: 12,
    leadMentor: 'Caleb Kiprotich',
  },
];
