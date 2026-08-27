// Stand-in data until GET /pairings/history exists on the backend.
export const mockPairingHistory = [
  {
    id: 1,
    week: 'Week 5',
    publishedAt: '2026-07-30',
    pairs: [
      { id: 1, members: ['Victor Sinja', 'Ariel Muhuri'] },
      { id: 2, members: ['Charity Kiharu', 'Brian Otieno'] },
      { id: 3, members: ['Amina Wanjiku', 'Kevin Mwangi'] },
      { id: 4, members: ['Faith Njeri', 'Diana Achieng'] },
    ],
  },
  {
    id: 2,
    week: 'Week 6',
    publishedAt: '2026-08-06',
    pairs: [
      { id: 1, members: ['Victor Sinja', 'Charity Kiharu'] },
      { id: 2, members: ['Ariel Muhuri', 'Faith Njeri'] },
      { id: 3, members: ['Brian Otieno', 'Diana Achieng'] },
      { id: 4, members: ['Amina Wanjiku', 'Kevin Mwangi'] },
    ],
  },
  {
    id: 3,
    week: 'Week 7',
    publishedAt: '2026-08-13',
    pairs: [
      { id: 1, members: ['Victor Sinja', 'Faith Njeri'] },
      { id: 2, members: ['Ariel Muhuri', 'Brian Otieno'] },
      { id: 3, members: ['Charity Kiharu', 'Diana Achieng'] },
      { id: 4, members: ['Amina Wanjiku', 'Kevin Mwangi'] },
    ],
  },
];
