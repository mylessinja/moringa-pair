import { useEffect, useState } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { Button } from '../../../components/ui/button';
import StudentStats from '../components/StudentStats';
import StudentsTable from '../components/StudentsTable';
import { getStudents } from '../../../services/adminService';

export default function StudentsPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [students, setStudents] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    getStudents()
      .then((data) => {
        setStudents(data);
        setStatus('succeeded');
      })
      .catch((err) => {
        setError(err.response?.data?.error || 'Could not load students.');
        setStatus('failed');
      });
  }, []);

  const visibleStudents = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalStudents = students.length;
  const avgMastery = totalStudents
    ? Math.round(students.reduce((sum, s) => sum + (s.mastery || 0), 0) / totalStudents)
    : 0;
  const activeToday = students.filter((s) => s.status === 'active').length;

  return (
    <AdminLayout
      pageTitle="Student Management"
      pageDescription="View and manage all students across cohorts."
    >
      <StudentStats
        totalStudents={totalStudents}
        avgMastery={avgMastery}
        activeToday={activeToday}
      />

      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <select className="px-3 py-2 rounded-md border border-border text-sm text-muted-foreground">
          <option>All Cohorts</option>
        </select>
        <select className="px-3 py-2 rounded-md border border-border text-sm text-muted-foreground">
          <option>All Mastery Levels</option>
        </select>
        <select className="px-3 py-2 rounded-md border border-border text-sm text-muted-foreground">
          <option>Status: Active</option>
        </select>
        <input
          type="text"
          placeholder="Search students by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="ml-auto w-72 px-4 py-2 rounded-md border border-border text-sm"
        />
      </div>

      {status === 'loading' && <p className="text-sm text-muted-foreground py-6">Loading students...</p>}
      {status === 'failed' && <p className="text-sm text-red-600 py-6">{error}</p>}

      {status === 'succeeded' && (
        <div className="bg-card border border-border rounded-lg px-4">
          <StudentsTable students={visibleStudents} />
          <div className="flex justify-between items-center py-3 text-sm text-muted-foreground">
            <span>
              Showing 1 to {visibleStudents.length} of {totalStudents} students
            </span>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => setPage((p) => Math.max(1, p - 1))}>
                Previous
              </Button>
              <Button variant="secondary" onClick={() => setPage((p) => p + 1)}>
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
