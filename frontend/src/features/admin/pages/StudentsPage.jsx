import { useState } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { Button } from '../../../components/ui/button';
import StudentStats from '../components/StudentStats';
import StudentsTable from '../components/StudentsTable';
import { mockStudents } from '../data/mockStudents';

export default function StudentsPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  // TODO: replace mockStudents + this filter with an RTK Query fetch
  // once GET /students exists on the backend.
  const students = mockStudents.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalStudents = mockStudents.length;
  const avgMastery = Math.round(
    mockStudents.reduce((sum, s) => sum + s.mastery, 0) / mockStudents.length
  );
  const activeToday = mockStudents.length; // placeholder until "last active" is real

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
        <select className="px-3 py-2 rounded-md border border-gray-200 text-sm text-gray-600">
          <option>All Cohorts</option>
        </select>
        <select className="px-3 py-2 rounded-md border border-gray-200 text-sm text-gray-600">
          <option>All Mastery Levels</option>
        </select>
        <select className="px-3 py-2 rounded-md border border-gray-200 text-sm text-gray-600">
          <option>Status: Active</option>
        </select>
        <input
          type="text"
          placeholder="Search students by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="ml-auto w-72 px-4 py-2 rounded-md border border-gray-200 text-sm"
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-lg px-4">
        <StudentsTable students={students} />
        <div className="flex justify-between items-center py-3 text-sm text-gray-500">
          <span>
            Showing 1 to {students.length} of {totalStudents} students
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
    </AdminLayout>
  );
}
