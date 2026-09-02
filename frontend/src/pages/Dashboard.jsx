import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import StudentLayout from '../layouts/StudentLayout';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { X, Circle } from 'lucide-react';
import {
  getMe,
  getPairingHistory,
  mapCurrentPairing,
} from '../services/studentService';
import { listMyResources } from '../services/resourceService';

function initials(name = '') {
  return (
    name
      .split(' ')
      .filter(Boolean)
      .map((p) => p[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || '?'
  );
}

function Dashboard() {
  const authUser = useSelector((s) => s.auth.user);
  const [me, setMe] = useState(null);
  const [history, setHistory] = useState([]);
  const [resources, setResources] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    getMe()
      .then(async (data) => {
        if (cancelled) return;
        setMe(data);
        const id = data.user?.id;
        if (id) {
          const hist = await getPairingHistory(id);
          if (!cancelled) setHistory(hist);
        }
        try {
          const res = await listMyResources();
          if (!cancelled) setResources(res);
        } catch {
          if (!cancelled) setResources([]);
        }
        setStatus('succeeded');
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.response?.data?.error || err.message || 'Failed to load');
        setStatus('failed');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const user = me?.user || authUser;
  const pairing = mapCurrentPairing(me?.currentPairing);
  const primaryCohort = me?.cohorts?.[0];
  const avatarInitials = initials(user?.name);

  return (
    <StudentLayout
      eyebrow="Student workspace"
      title={`Welcome, ${user?.name || 'there'}`}
      avatarInitials={avatarInitials}
    >
      {primaryCohort && (
        <p className="mb-4 text-sm text-muted-foreground">
          {primaryCohort.name}
          {primaryCohort.mastery != null ? ` · Mastery ${primaryCohort.mastery}%` : ''}
        </p>
      )}

      {showBanner && pairing && (
        <div className="mb-6 flex items-center gap-3 border-l-2 border-primary bg-muted px-4 py-3">
          <p className="flex-1 text-sm text-foreground">
            Your pairing for this week is live.
          </p>
          <button
            type="button"
            onClick={() => setShowBanner(false)}
            aria-label="Dismiss"
            className="text-muted-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <section className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-primary">
              This week
            </p>
            <h2 className="text-lg font-bold text-foreground">My pairing</h2>
          </div>
          {pairing ? (
            <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 dark:bg-green-500/15 dark:text-green-400">
              Live
            </span>
          ) : (
            <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800">
              Pending
            </span>
          )}
        </div>

        {status === 'loading' && (
          <p className="text-sm text-muted-foreground">Loading…</p>
        )}
        {status === 'failed' && <p className="text-sm text-red-600">{error}</p>}

        {status === 'succeeded' && pairing && (
          <Card>
            <CardContent className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
                {initials(pairing.partner)}
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">You are paired with</p>
                <h3 className="text-lg font-bold">{pairing.partner}</h3>
                <p className="text-sm font-medium text-primary">{pairing.focus}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {pairing.week ? `Week of ${pairing.week}` : ''}
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link to="/pairing">Open pairing</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {status === 'succeeded' && !pairing && (
          <Card className="border-dashed">
            <CardContent className="py-10 text-center">
              <Circle className="mx-auto mb-2 h-6 w-6 text-zinc-300" />
              <h3 className="mb-1 font-bold">No pairing yet</h3>
              <p className="text-sm text-muted-foreground">
                Your mentor hasn&apos;t published this week&apos;s pairs yet.
              </p>
            </CardContent>
          </Card>
        )}
      </section>

      <section className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">Recent pairings</h2>
          <Button variant="outline" size="sm" asChild>
            <Link to="/pairing/history">Full history</Link>
          </Button>
        </div>
        {history.length === 0 && status === 'succeeded' && (
          <p className="text-sm text-muted-foreground">No history yet.</p>
        )}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {history.slice(0, 6).map((p) => (
            <Card key={p.id}>
              <CardContent className="py-4">
                <p className="text-xs text-muted-foreground">{p.week}</p>
                <p className="font-semibold">{p.partner}</p>
                <p className="text-sm text-muted-foreground">{p.focus}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-bold">Study resources</h2>
        {resources.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Your mentor hasn&apos;t published materials for your cohort yet.
          </p>
        ) : (
          <ul className="space-y-2">
            {resources.map((r) => (
              <li key={r.id} className="rounded-lg border bg-card px-4 py-3">
                <a
                  href={r.url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-primary hover:underline"
                >
                  {r.title}
                </a>
                <p className="text-xs text-muted-foreground">
                  {r.cohort_name || 'Cohort'} · {r.resource_type}
                  {r.week_label ? ` · ${r.week_label}` : ''}
                </p>
                {r.description && (
                  <p className="mt-1 text-sm text-muted-foreground">{r.description}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </StudentLayout>
  );
}

export default Dashboard;
