import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StudentLayout from '../layouts/StudentLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Circle } from 'lucide-react';
import { getMe, mapCurrentPairing } from '../services/studentService';

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

export default function Pairing() {
  const [me, setMe] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    getMe()
      .then((data) => {
        if (cancelled) return;
        setMe(data);
        setStatus('succeeded');
      })
      .catch((err) => {
        if (cancelled) return;
        const code = err.response?.status;
        setError(
          code === 401
            ? 'Session expired. Please log out and log in again.'
            : err.response?.data?.error || err.message || 'Could not load pairing'
        );
        setStatus('failed');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const user = me?.user;
  const pairing = mapCurrentPairing(me?.currentPairing);
  const cohort = me?.cohorts?.[0];

  return (
    <StudentLayout
      eyebrow="This week"
      title="My Pairing"
      avatarInitials={initials(user?.name)}
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Your learning partner for this week
          {cohort ? ` · ${cohort.name}` : ''}.
        </p>
        <Button variant="outline" size="sm" asChild>
          <Link to="/pairing/history">View history →</Link>
        </Button>
      </div>

      {status === 'loading' && (
        <p className="text-sm text-muted-foreground">Loading your pairing…</p>
      )}

      {status === 'failed' && (
        <Card className="border-red-200">
          <CardContent className="py-8 text-center">
            <p className="text-sm text-red-600">{error}</p>
            <Button className="mt-4" variant="outline" asChild>
              <Link to="/login">Go to login</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {status === 'succeeded' && pairing && (
        <Card>
          <CardContent className="flex flex-col gap-5 py-8 sm:flex-row sm:items-center">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xl font-semibold text-primary">
              {initials(pairing.partner)}
            </div>
            <div className="flex-1">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                You are paired with
              </p>
              <h2 className="text-2xl font-bold text-foreground">{pairing.partner}</h2>
              <p className="mt-1 text-sm font-medium text-primary">
                {pairing.focus || 'Weekly pairing'}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {pairing.week ? `Week of ${pairing.week}` : 'Current week'}
                {cohort ? ` · ${cohort.name}` : ''}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <span className="inline-flex items-center justify-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-500/15 dark:text-green-400">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                Live
              </span>
              <Button variant="outline" asChild>
                <Link to="/dashboard">Back to dashboard</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {status === 'succeeded' && !pairing && (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <Circle className="mx-auto mb-3 h-8 w-8 text-zinc-300" />
            <h2 className="mb-2 text-lg font-bold text-foreground">No pairing yet</h2>
            <p className="mx-auto max-w-md text-sm text-muted-foreground">
              No published pairing is linked to your account yet. After an admin
              generates and <strong>publishes</strong> pairs for your cohort, your
              partner will show up here and on the dashboard.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <Button variant="outline" asChild>
                <Link to="/dashboard">Dashboard</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/pairing/history">History</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </StudentLayout>
  );
}
