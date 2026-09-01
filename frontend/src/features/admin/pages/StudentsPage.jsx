import { useEffect, useMemo, useState } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import StudentStats from '../components/StudentStats';
import StudentsTable from '../components/StudentsTable';
import { adminApi } from '@/services/adminApi';

export default function StudentsPage() {
  const [search, setSearch] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    adminApi
      .students()
      .then((data) => {
        if (!cancelled) setStudents(data.students || []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Failed to load students');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const visible = useMemo(() => {
    const q = search.toLowerCase();
    return students.filter(
      (s) =>
        !q ||
        (s.name || '').toLowerCase().includes(q) ||
        (s.email || '').toLowerCase().includes(q)
    );
  }, [students, search]);

  const totalStudents = students.length;
  const avgMastery = Math.round(
    students.reduce((sum, s) => sum + (s.mastery || 0), 0) / (students.length || 1)
  );

  return (
    <AdminLayout
      pageTitle="Student Management"
      pageDescription="View and manage all students across cohorts."
    >
      <StudentStats
        totalStudents={totalStudents}
        avgMastery={avgMastery}
        activeToday={students.filter((s) => s.status === 'active').length}
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          type="search"
          placeholder="Search students by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="ml-auto w-72 rounded-md border border-gray-200 px-4 py-2 text-sm"
        />
      </div>

      {error && (
        <p className="mb-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      )}
      {loading ? (
        <p className="text-sm text-gray-500">Loading students…</p>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-white px-4">
          <StudentsTable students={visible} />
          <div className="flex items-center justify-between py-3 text-sm text-gray-500">
            <span>
              Showing {visible.length} of {totalStudents} students
            </span>
            <Button variant="secondary" onClick={() => window.location.reload()}>
              Refresh
            </Button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
