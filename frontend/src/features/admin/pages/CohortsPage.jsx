import { useState } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { Button } from '../../../components/ui/button';
import CohortCard from '../components/CohortCard';
import { mockCohorts } from '../data/mockCohorts';

const tabs = ['Active', 'Upcoming', 'Archived'];

export default function CohortsPage() {
  const [activeTab, setActiveTab] = useState('Active');
  const [search, setSearch] = useState('');

  // TODO: replace mockCohorts with an RTK Query fetch once GET /cohorts
  // exists, and actually filter by tab once the backend tracks cohort
  // status (Active/Upcoming/Archived isn't wired up yet — all mock data
  // is shown regardless of the selected tab for now).
  const cohorts = mockCohorts.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout
      pageTitle="Cohorts Management"
      pageDescription="Oversee and manage active learning groups and their progress."
    >
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex gap-6 border-b border-gray-200 flex-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 text-sm font-medium border-b-2 -mb-px ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search cohorts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-56 px-4 py-2 rounded-md border border-gray-200 text-sm"
          />
          <Button variant="primary" icon="+">
            Create New Cohort
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        {cohorts.map((cohort) => (
          <CohortCard key={cohort.id} cohort={cohort} />
        ))}
      </div>
    </AdminLayout>
  );
}
