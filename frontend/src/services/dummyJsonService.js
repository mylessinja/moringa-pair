import { mockStudents } from '../features/admin/data/mockStudents';

// Stand-in until GET /students exists on the backend. Every screen that
// lists students (admin Students table, student Dashboard directory,
// mentor's assigned students) reads from the same mockStudents list so
// the same people show up everywhere instead of unrelated random data.
export async function getDemoStudents() {
  return mockStudents;
}
