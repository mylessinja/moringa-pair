import apiClient from './apiClient';

const DEMO_HISTORY = [
  {
    id: 'pair-demo',
    week: '2026-08-17',
    partner: 'Sarah Kim',
    partnerEmail: 'sarah.kim@moringa.school',
    cohort: 'SDF-FT-05',
    focus: 'React & UI',
    publishedAt: 'Aug 17, 2026',
  },
];

const getCurrentPairing = async () => DEMO_HISTORY[0];

const getPairingHistory = async (studentId) => {
  const token = localStorage.getItem('moringaPairToken');
  if (!token || !studentId) return DEMO_HISTORY;

  try {
    const { data } = await apiClient.get(`/pairings/student/${studentId}`);
    return (data.pairings || []).map((p) => ({
      id: p.id,
      week: p.week_start,
      partner: p.student_a_id === Number(studentId) ? p.student_b : p.student_a,
      partnerEmail: null,
      cohort: p.cohort_name || p.cohort_id,
      focus: p.focus,
      publishedAt: p.week_start,
      ...p,
    }));
  } catch {
    return DEMO_HISTORY;
  }
};

export { getCurrentPairing, getPairingHistory };
