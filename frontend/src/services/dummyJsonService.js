import { mockStudents } from '../features/admin/data/mockStudents';

const USERS_URL = 'https://dummyjson.com/users?limit=30';

const mapUserToStudent = (user, index) => ({
  id: user.id,
  name: `${user.firstName} ${user.lastName}`,
  email: user.email,
  cohort: `SDF-${index % 2 ? 'PT' : 'FT'}-${String((index % 5) + 1).padStart(2, '0')}`,
  mastery: 60 + ((user.id * 7) % 36),
  lastActive: index % 3 === 0 ? 'Just now' : `${index + 1} hours ago`,
  image: user.image,
});

export async function getDemoStudents() {
  try {
    const response = await fetch(USERS_URL);
    if (!response.ok) throw new Error('Unable to load demo students');
    const data = await response.json();
    return data.users.map(mapUserToStudent);
  } catch {
    return mockStudents;
  }
}