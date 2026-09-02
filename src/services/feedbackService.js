import apiClient from './apiClient';

export async function createFeedback({ studentId, sessionType, note }) {
  const { data } = await apiClient.post('/feedback', {
    student_id: studentId,
    session_type: sessionType,
    note,
  });
  return data;
}

export async function getStudentFeedback(studentId) {
  const { data } = await apiClient.get(`/feedback/student/${studentId}`);
  return data.feedback;
}

export async function getMyGivenFeedback() {
  const { data } = await apiClient.get('/feedback/mentor/me');
  return data.feedback;
}
