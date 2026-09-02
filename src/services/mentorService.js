import apiClient from './apiClient';

export async function getMyCohorts() {
  const { data } = await apiClient.get('/mentors/cohorts');
  return data.cohorts;
}

export async function getCohortStudents(cohortId) {
  const { data } = await apiClient.get(`/mentors/cohorts/${cohortId}/students`);
  return data.students;
}

export async function getCohortPairings(cohortId) {
  const { data } = await apiClient.get(`/mentors/cohorts/${cohortId}/pairings`);
  return data.pairings;
}

export async function updateMastery(cohortId, studentId, mastery) {
  const { data } = await apiClient.patch(
    `/mentors/cohorts/${cohortId}/students/${studentId}/mastery`,
    { mastery }
  );
  return data;
}

export async function getMyMentorProfile() {
  const { data } = await apiClient.get('/mentors/me');
  return data;
}

/**
 * Aggregates every student across every cohort the current mentor
 * belongs to (mentors can be attached to more than one cohort), and
 * attaches each student's most recent pairing focus so the UI has
 * something real to show in the "Focus area" column instead of a
 * fabricated value.
 */
export async function getMyStudents() {
  const cohorts = await getMyCohorts();

  const perCohort = await Promise.all(
    cohorts.map(async (cohort) => {
      const [students, pairings] = await Promise.all([
        getCohortStudents(cohort.id),
        getCohortPairings(cohort.id),
      ]);

      return students.map((student) => {
        const latestPairing = pairings.find(
          (p) => p.student_a_id === student.id || p.student_b_id === student.id
        );

        return {
          id: student.id,
          name: student.name,
          email: student.email,
          cohort: cohort.name,
          cohortId: cohort.id,
          mastery: student.mastery ?? 0,
          status: (student.mastery ?? 0) < 65 ? 'Needs check-in' : 'On track',
          lastActive: student.lastActive,
          focusArea: latestPairing?.focus || '—',
        };
      });
    })
  );

  return perCohort.flat();
}
