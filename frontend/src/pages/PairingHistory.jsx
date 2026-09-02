import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import StudentLayout from '../layouts/StudentLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getPairingHistory } from '../services/pairingService';
import { filterHistoryByWeek } from '../services/pairingUtils';

const PairingHistory = () => {
  const user = useSelector((s) => s.auth.user);
  const studentId = user?.id;
  const [history, setHistory] = useState([]);
  const [week, setWeek] = useState('all');
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    if (!studentId) {
      setStatus('failed');
      return;
    }
    setStatus('loading');
    getPairingHistory(studentId)
      .then((pairings) => {
        setHistory(pairings);
        setStatus('succeeded');
      })
      .catch(() => setStatus('failed'));
  }, [studentId]);

  const weeks = useMemo(
    () => [...new Set(history.map((p) => p.week).filter(Boolean))],
    [history]
  );
  const visibleHistory = filterHistoryByWeek(history, week);

  return (
    <StudentLayout eyebrow="Your past connections" title="Pairing History">
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Review every learning partner you&apos;ve been matched with.
        </p>
        <Button asChild variant="outline">
          <Link to="/pairing">Current pairing →</Link>
        </Button>
      </div>

      {status === 'loading' && (
        <p className="py-10 text-center text-sm text-muted-foreground">
          Loading pairing history...
        </p>
      )}

      {status === 'failed' && (
        <p className="py-10 text-center text-sm text-red-600 dark:text-red-400">
          We couldn&apos;t load your pairing history. Please try again.
        </p>
      )}

      {status === 'succeeded' && history.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="py-10 text-center">
            <h2 className="mb-1 font-bold text-foreground">No history yet</h2>
            <p className="text-sm text-muted-foreground">
              Your past pairings will appear here after your first weekly match.
            </p>
          </CardContent>
        </Card>
      )}

      {status === 'succeeded' && history.length > 0 && (
        <Card>
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div>
              <h2 className="font-semibold text-foreground">Past pairings</h2>
              <p className="text-sm text-muted-foreground">
                {visibleHistory.length} pairing
                {visibleHistory.length === 1 ? '' : 's'} shown
              </p>
            </div>
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              Week
              <select
                aria-label="Filter pairing history by week"
                value={week}
                onChange={(e) => setWeek(e.target.value)}
                className="rounded-md border border-border px-3 py-2 text-sm text-muted-foreground"
              >
                <option value="all">All weeks</option>
                {weeks.map((w) => (
                  <option key={w} value={w}>
                    Week of {w}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Week</th>
                  <th className="px-5 py-3 font-medium">Partner</th>
                  <th className="px-5 py-3 font-medium">Focus</th>
                  <th className="px-5 py-3 font-medium">Cohort</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {visibleHistory.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-gray-50 last:border-0 dark:border-zinc-800"
                  >
                    <td className="px-5 py-3 text-muted-foreground">
                      {p.publishedAt}
                    </td>
                    <td className="px-5 py-3">
                      <p className="font-medium text-foreground">{p.partner}</p>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">{p.focus}</td>
                    <td className="px-5 py-3 text-muted-foreground">
                      {p.cohort}
                    </td>
                    <td className="px-5 py-3">
                      <Badge
                        variant="outline"
                        className="border-green-200 bg-green-50 text-green-700 dark:bg-green-500/15 dark:text-green-400"
                      >
                        Assigned
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </StudentLayout>
  );
};

export default PairingHistory;
