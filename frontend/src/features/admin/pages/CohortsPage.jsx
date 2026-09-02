import { useCallback, useEffect, useMemo, useState } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import CohortCard from '../components/CohortCard';
import CreateCohortDialog from '../components/CreateCohortDialog';
import { getCohorts } from '../../../services/adminService';

const tabs = [
  { id: 'active', label: 'Active' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'archived', label: 'Archived' },
];

function toCard(c) {
  const track = c.track || '';
  return {
    id: c.id,
    name: c.name,
    track,
    trackColor: track.includes('Data') ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    students: c.students ?? 0,
    avgMastery: c.avg_mastery ?? c.avgMastery ?? 0,
    mentors: c.mentors ?? 0,
    weekOfSyllabus: c.week_of_syllabus ?? 1,
    totalWeeks: c.total_weeks ?? 12,
    leadMentor: c.lead_mentor || 'Unassigned',
    status: (c.status || 'active').toLowerCase(),
  };
}

export default function CohortsPage() {
  const [activeTab, setActiveTab] = useState('active');
  const [search, setSearch] = useState('');
  const [cohorts, setCohorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    setError('');
    getCohorts()
      .then((data) => setCohorts((data || []).map(toCard)))
      .catch((err) => setError(err.response?.data?.error || err.message || 'Failed to load cohorts'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    return cohorts.filter((c) => {
      if (c.status !== activeTab) return false;
      if (!search.trim()) return true;
      return c.name.toLowerCase().includes(search.toLowerCase());
    });
  }, [cohorts, activeTab, search]);

  return (
    <AdminLayout
      pageTitle="Cohorts Management"
      pageDescription="Oversee and manage active learning groups and their progress."
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-1 gap-6 border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`-mb-px border-b-2 pb-2 text-sm font-medium ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex gap-3">
          <input
            type="search"
            placeholder="Search cohorts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-56 rounded-md border border-border px-3 py-2 text-sm"
          />
          <Button onClick={() => setDialogOpen(true)}>+ Create New Cohort</Button>
        </div>
      </div>

      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground">No cohorts in this tab.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filtered.map((c) => (
            <CohortCard key={c.id} cohort={c} />
          ))}
        </div>
      )}

      <CreateCohortDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onCreated={() => load()}
      />
    </AdminLayout>
  );
}
