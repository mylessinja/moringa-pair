import { api } from './api';

export const adminApi = {
  stats: () => api('/api/admin/stats'),
  students: (search = '') =>
    api(`/api/admin/students${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  mentors: (search = '') =>
    api(`/api/admin/mentors${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  cohorts: () => api('/api/admin/cohorts'),
  createCohort: (body) =>
    api('/api/admin/cohorts', { method: 'POST', body: JSON.stringify(body) }),
  updateMentorStatus: (id, status) =>
    api(`/api/admin/mentors/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
};

export const pairingsApi = {
  preview: (body) =>
    api('/api/pairings/preview', { method: 'POST', body: JSON.stringify(body) }),
  publish: (body) =>
    api('/api/pairings/publish', { method: 'POST', body: JSON.stringify(body) }),
  byCohort: (id) => api(`/api/pairings/cohort/${id}`),
};
