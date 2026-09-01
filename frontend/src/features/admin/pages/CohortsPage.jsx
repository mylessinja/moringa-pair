import { useEffect, useState } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { Button } from '../../../components/ui/button';
import CohortCard from '../components/CohortCard';
import { getCohorts } from '../../../services/adminService';

const tabs = [
  { label: 'Active', value: 'active' },
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'Archived', value: 'archived' },
];

const TRACK_COLORS = {
  'Software Engineering': 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  'Data Science': 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  'UX Design': 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
};
const DEFAULT_TRACK_COLOR = 'bg-muted text-muted-foreground';

function toCardShape(cohort) {
  return {
    id: cohort.id,
    track: cohort.track,
    trackColor: TRACK_COLORS[cohort.track] || DEFAULT_TRACK_COLOR,
    name: cohort.name,
    students: cohort.students,
    avgMastery: cohort.avg_mastery,
    mentors: cohort.mentors,
    weekOfSyllabus: cohort.week_of_syllabus,
    totalWeeks: cohort.total_weeks,
    leadMentor: cohort.lead_mentor || 'Unassigned',
  };
}

export default function CohortsPage() {
  const [activeTab, setActiveTab] = useState('active');
  const [search, setSearch] = useState('');
  const [cohorts, setCohorts] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    getCohorts()
      .then((data) => {
        setCohorts(data);
        setStatus('succeeded');
      })
      .catch((err) => {
        setError(err.response?.data?.error || 'Could not load cohorts.');
        setStatus('failed');
      });
  }, []);

  const visibleCohorts = cohorts
    .filter((c) => c.status === activeTab)
    .filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
    .map(toCardShape);

  return (
    <AdminLayout
      pageTitle="Cohorts Management"
      pageDescription="Oversee and manage active learning groups and their progress."
    >
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex gap-6 border-b border-border flex-1">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`pb-2 text-sm font-medium border-b-2 -mb-px ${
                activeTab === tab.value
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search cohorts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-56 px-4 py-2 rounded-md border border-border text-sm"
          />
          <Button variant="primary" icon="+">
            Create New Cohort
          </Button>
        </div>
      </div>

      {status === 'loading' && <p className="text-sm text-muted-foreground py-6">Loading cohorts...</p>}
      {status === 'failed' && <p className="text-sm text-red-600 py-6">{error}</p>}

      {status === 'succeeded' && (
        <div className="grid grid-cols-2 gap-4 mt-4">
          {visibleCohorts.length === 0 && (
            <p className="text-sm text-muted-foreground col-span-2 py-6">No {activeTab} cohorts yet.</p>
          )}
          {visibleCohorts.map((cohort) => (
            <CohortCard key={cohort.id} cohort={cohort} />
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
