import { useEffect, useMemo, useState } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import MentorStats from '../components/MentorStats';
import MentorsTable from '../components/MentorsTable';
import { adminApi } from '@/services/adminApi';

export default function MentorsPage() {
  const [search, setSearch] = useState('');
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    setError('');
    adminApi
      .mentors()
      .then((data) => setMentors(data.mentors || []))
      .catch((err) => setError(err.message || 'Failed to load mentors'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return mentors.filter(
      (m) =>
        !q ||
        (m.name || '').toLowerCase().includes(q) ||
        (m.email || '').toLowerCase().includes(q) ||
        (m.expertise || []).join(' ').toLowerCase().includes(q)
    );
  }, [mentors, search]);

  const total = mentors.length;
  const active = mentors.filter((m) => m.status === 'approved').length;
  const pending = mentors.filter((m) => m.status === 'pending').length;

  return (
    <AdminLayout pageTitle="Mentors" pageDescription="Manage and assign mentors across cohorts.">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <input
          type="search"
          placeholder="Search mentors by name or expertise"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-72 rounded-md border border-gray-200 px-4 py-2 text-sm"
        />
        <MentorStats total={total} active={active} pending={pending} />
      </div>

      {error && (
        <p className="mb-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      )}
      {loading ? (
        <p className="text-sm text-gray-500">Loading mentors…</p>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-white px-4">
          <MentorsTable mentors={filtered} />
          <div className="py-3 text-sm text-gray-500">
            Showing {filtered.length} of {total} mentors
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
