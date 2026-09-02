import apiClient from './apiClient';

export async function getStudents(search = '') {
  const { data } = await apiClient.get('/admin/students', { params: search ? { search } : {} });
  return data.students;
}

export async function getMentors(search = '') {
  const { data } = await apiClient.get('/admin/mentors', { params: search ? { search } : {} });
  return data.mentors;
}

export async function updateMentorStatus(mentorId, status) {
  const { data } = await apiClient.patch(`/admin/mentors/${mentorId}/status`, { status });
  return data;
}

export async function getCohorts() {
  const { data } = await apiClient.get('/admin/cohorts');
  return data.cohorts;
}

export async function getCohort(cohortId) {
  const { data } = await apiClient.get(`/admin/cohorts/${cohortId}`);
  return data;
}

export async function createCohort(payload) {
  const { data } = await apiClient.post('/admin/cohorts', payload);
  return data;
}

export async function updateCohort(cohortId, payload) {
  const { data } = await apiClient.patch(`/admin/cohorts/${cohortId}`, payload);
  return data;
}

export async function archiveCohort(cohortId) {
  const { data } = await apiClient.post(`/admin/cohorts/${cohortId}/archive`);
  return data;
}

export async function getAuditLogs(limit = 10) {
  const { data } = await apiClient.get('/admin/audit-logs', { params: { limit } });
  return data.logs;
}

export async function getStats() {
  const { data } = await apiClient.get('/admin/stats');
  return data;
}

export async function getUsers(role) {
  const { data } = await apiClient.get('/admin/users', { params: role ? { role } : {} });
  return data.users;
}

export async function updateUser(userId, payload) {
  const { data } = await apiClient.patch(`/admin/users/${userId}`, payload);
  return data;
}

export async function updateUserRole(userId, role) {
  const { data } = await apiClient.patch(`/admin/users/${userId}/role`, { role });
  return data;
}

export async function updateUserStatus(userId, status) {
  const { data } = await apiClient.patch(`/admin/users/${userId}/status`, { status });
  return data;
}

export async function deleteUser(userId) {
  const { data } = await apiClient.delete(`/admin/users/${userId}`);
  return data;
}

export async function previewPairings(payload) {
  const { data } = await apiClient.post('/pairings/preview', payload);
  return data;
}

export async function publishPairings(payload) {
  const { data } = await apiClient.post('/pairings/publish', payload);
  return data;
}

export async function generatePairingsApi(payload) {
  const { data } = await apiClient.post('/pairings/generate', payload);
  return data;
}

export async function getCohortPairings(cohortId) {
  const { data } = await apiClient.get(`/pairings/cohort/${cohortId}`);
  return data;
}
