const pairingHistory = [
  {
    id: 'pair-2026-08-17',
    week: '2026-08-17',
    partner: 'Sarah Kim',
    partnerEmail: 'sarah.kim@moringa.school',
    cohort: 'SDF-FT-05',
    focus: 'React & UI',
    publishedAt: 'Aug 17, 2026',
  },
  {
    id: 'pair-2026-08-10',
    week: '2026-08-10',
    partner: 'David Turner',
    partnerEmail: 'david.turner@moringa.school',
    cohort: 'SDF-FT-05',
    focus: 'Data Structures',
    publishedAt: 'Aug 10, 2026',
  },
  {
    id: 'pair-2026-08-03',
    week: '2026-08-03',
    partner: 'Maya Okafor',
    partnerEmail: 'maya.okafor@moringa.school',
    cohort: 'SDF-FT-05',
    focus: 'Python Backend',
    publishedAt: 'Aug 3, 2026',
  },
];

const wait = (value) => new Promise((resolve) => {
  setTimeout(() => resolve(value), 350);
});

const getCurrentPairing = async () => wait(pairingHistory[0]);
const getPairingHistory = async () => wait(pairingHistory);

export { getCurrentPairing, getPairingHistory };
