// Stand-in data until GET /mentors exists on the backend.
export const mockMentors = [
  {
    id: 1,
    name: 'Albert Byrone',
    email: 'a.byrone@moringapair.com',
    expertise: ['React', 'Node.js'],
    activeCohorts: 'SE-Cohort 34, SE-Cohort 35',
    status: 'approved',
  },
  {
    id: 2,
    name: 'Caleb Kiprotich',
    email: 'c.kiprotich@moringapair.com',
    expertise: ['UX Research', 'Figma'],
    activeCohorts: 'Unassigned',
    status: 'pending',
  },
  {
    id: 3,
    name: 'David Omondi',
    email: 'd.omondi@moringapair.com',
    expertise: ['Python', 'Machine Learning'],
    activeCohorts: 'DS-Cohort 12',
    status: 'approved',
  },
  {
    id: 4,
    name: 'Mercy Nzau',
    email: 'm.nzau@moringapair.com',
    expertise: ['DevOps'],
    activeCohorts: '-',
    status: 'suspended',
  },
];
