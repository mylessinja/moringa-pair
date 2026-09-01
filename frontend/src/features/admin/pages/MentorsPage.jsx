import { useEffect, useState } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { Button } from '../../../components/ui/button';
import MentorStats from '../components/MentorStats';
import MentorsTable from '../components/MentorsTable';
import { getMentors, updateMentorStatus } from '../../../services/adminService';

export default function MentorsPage() {
  const [search, setSearch] = useState('');
  const [mentors, setMentors] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    loadMentors();
  }, []);

  function loadMentors() {
    getMentors()
      .then((data) => {
        setMentors(data);
        setStatus('succeeded');
      })
      .catch((err) => {
        setError(err.response?.data?.error || 'Could not load mentors.');
        setStatus('failed');
      });
  }

  async function handleStatusChange(mentorId, newStatus) {
    const previous = mentors;
    setMentors((current) => current.map((m) => (m.id === mentorId ? { ...m, status: newStatus } : m)));
    try {
      await updateMentorStatus(mentorId, newStatus);
    } catch (err) {
      setMentors(previous);
      setError(err.response?.data?.error || 'Could not update mentor status.');
    }
  }

  const filteredMentors = mentors.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  const total = mentors.length;
  const active = mentors.filter((m) => m.status === 'approved').length;
  const pending = mentors.filter((m) => m.status === 'pending').length;

  return (
    <AdminLayout pageTitle="Mentors" pageDescription="Manage and assign mentors across cohorts.">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-[280px]">
          <input
            type="text"
            placeholder="Search mentors by name or expertise"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-72 px-4 py-2 rounded-md border border-border text-sm"
          />
          <select className="px-3 py-2 rounded-md border border-border text-sm text-muted-foreground">
            <option>All Statuses</option>
            <option>Approved</option>
            <option>Pending</option>
            <option>Suspended</option>
          </select>
          <select className="px-3 py-2 rounded-md border border-border text-sm text-muted-foreground">
            <option>All Departments</option>
          </select>
        </div>
        <MentorStats total={total} active={active} pending={pending} />
      </div>

      <div className="flex justify-end gap-2 mb-4">
        <Button variant="secondary">Export</Button>
      </div>

      {status === 'loading' && <p className="text-sm text-muted-foreground py-6">Loading mentors...</p>}
      {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

      {status === 'succeeded' && (
        <div className="bg-card border border-border rounded-lg px-4">
          <MentorsTable mentors={filteredMentors} onStatusChange={handleStatusChange} />
          <div className="flex justify-between items-center py-3 text-sm text-muted-foreground">
            <span>
              Showing 1 to {filteredMentors.length} of {total} entries
            </span>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
