import apiClient from './apiClient';

function mapPairing(p, studentId) {
  const sid = Number(studentId);
  const isA = p.student_a_id === sid;
  return {
    id: p.id,
    week: p.week_start,
    partner: isA ? p.student_b : p.student_a,
    partnerEmail: null,
    cohort: p.cohort_name || String(p.cohort_id ?? ''),
    focus: p.focus || '—',
    publishedAt: p.week_start,
    student_a_id: p.student_a_id,
    student_b_id: p.student_b_id,
  };
}

const getCurrentPairing = async (studentId) => {
  if (!studentId) return null;
  try {
    const { data } = await apiClient.get(`/pairings/student/${studentId}`);
    const list = data.pairings || [];
    if (!list.length) return null;
    return mapPairing(list[0], studentId);
  } catch {
    return null;
  }
};

const getPairingHistory = async (studentId) => {
  if (!studentId) return [];
  try {
    const { data } = await apiClient.get(`/pairings/student/${studentId}`);
    return (data.pairings || []).map((p) => mapPairing(p, studentId));
  } catch {
    return [];
  }
};

export { getCurrentPairing, getPairingHistory };
