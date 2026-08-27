import { useState } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { Button } from '../../../components/ui/button';
import MentorStats from '../components/MentorStats';
import MentorsTable from '../components/MentorsTable';
import { mockMentors } from '../data/mockMentors';

export default function MentorsPage() {
  const [search, setSearch] = useState('');

  // TODO: replace mockMentors + this filter with an RTK Query fetch
  // once GET /mentors exists on the backend.
  const mentors = mockMentors.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  const total = mockMentors.length;
  const active = mockMentors.filter((m) => m.status === 'approved').length;
  const pending = mockMentors.filter((m) => m.status === 'pending').length;

  return (
    <AdminLayout pageTitle="Mentors" pageDescription="Manage and assign mentors across cohorts.">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-[280px]">
          <input
            type="text"
            placeholder="Search mentors by name or expertise"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-72 px-4 py-2 rounded-md border border-gray-200 text-sm"
          />
          <select className="px-3 py-2 rounded-md border border-gray-200 text-sm text-gray-600">
            <option>All Statuses</option>
            <option>Approved</option>
            <option>Pending</option>
            <option>Suspended</option>
          </select>
          <select className="px-3 py-2 rounded-md border border-gray-200 text-sm text-gray-600">
            <option>All Departments</option>
          </select>
        </div>
        <MentorStats total={total} active={active} pending={pending} />
      </div>

      <div className="flex justify-end gap-2 mb-4">
        <Button variant="secondary">Export</Button>
        <Button variant="primary">Bulk Invite Mentors</Button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg px-4">
        <MentorsTable mentors={mentors} />
        <div className="flex justify-between items-center py-3 text-sm text-gray-500">
          <span>
            Showing 1 to {mentors.length} of {total} entries
          </span>
        </div>
      </div>
    </AdminLayout>
  );
}
