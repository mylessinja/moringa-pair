// Stand-in data until GET /audit-logs exists on the backend.
export const mockAuditLogs = [
  { id: 1, actor: 'Jairus (Admin)', action: 'Published pairing', detail: 'Week 7 pairing published', timestamp: '2026-08-13 09:12 AM' },
  { id: 2, actor: 'Jairus (Admin)', action: 'Added student', detail: 'Diana Achieng added to roster', timestamp: '2026-08-12 04:47 PM' },
  { id: 3, actor: 'Charity (Admin)', action: 'Approved mentor', detail: "Caleb Kiprotich's application approved", timestamp: '2026-08-12 11:03 AM' },
  { id: 4, actor: 'Jairus (Admin)', action: 'Edited student', detail: "Updated Victor Sinja's mastery score", timestamp: '2026-08-11 02:20 PM' },
  { id: 5, actor: 'Jairus (Admin)', action: 'Created cohort', detail: "Cohort 'Spring 2024 - Full Stack' created", timestamp: '2026-08-10 10:42 AM' },
  { id: 6, actor: 'Charity (Admin)', action: 'Published pairing', detail: 'Week 6 pairing published', timestamp: '2026-08-06 09:05 AM' },
];
