import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import StudentLayout from '../layouts/StudentLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getPairingHistory } from '../services/pairingService';
import { filterHistoryByWeek } from '../services/pairingUtils';

const PairingHistory = () => {
  const [history, setHistory] = useState([]);
  const [week, setWeek] = useState('all');
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    getPairingHistory()
      .then((pairings) => {
        setHistory(pairings);
        setStatus('succeeded');
      })
      .catch(() => setStatus('failed'));
  }, []);

  const weeks = useMemo(() => [...new Set(history.map((pairing) => pairing.week))], [history]);
  const visibleHistory = filterHistoryByWeek(history, week);

  return (
    <StudentLayout eyebrow="Your past connections" title="Pairing History">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500">Review every learning partner you've been matched with.</p>
        <Button asChild variant="outline">
          <Link to="/pairing">Current pairing →</Link>
        </Button>
      </div>

      {status === 'loading' && <p className="text-sm text-gray-500 py-10 text-center">Loading pairing history...</p>}

      {status === 'failed' && (
        <p className="text-sm text-red-600 py-10 text-center">
          We couldn't load your pairing history. Please try again.
        </p>
      )}

      {status === 'succeeded' && history.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="text-center py-10">
            <h2 className="font-bold text-gray-900 mb-1">No history yet</h2>
            <p className="text-sm text-gray-500">Your past pairings will appear here after your first weekly match.</p>
          </CardContent>
        </Card>
      )}

      {status === 'succeeded' && history.length > 0 && (
        <Card>
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div>
              <h2 className="font-semibold text-gray-900">Past pairings</h2>
              <p className="text-sm text-gray-500">
                {visibleHistory.length} pairing{visibleHistory.length === 1 ? '' : 's'} shown
              </p>
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-600">
              Week
              <select
                aria-label="Filter pairing history by week"
                value={week}
                onChange={(event) => setWeek(event.target.value)}
                className="px-3 py-2 rounded-md border border-gray-200 text-sm text-gray-600"
              >
                <option value="all">All weeks</option>
                {weeks.map((weekValue) => (
                  <option key={weekValue} value={weekValue}>
                    Week of {weekValue}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100">
                  <th className="px-5 py-3 font-medium">Week</th>
                  <th className="px-5 py-3 font-medium">Partner</th>
                  <th className="px-5 py-3 font-medium">Focus</th>
                  <th className="px-5 py-3 font-medium">Cohort</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {visibleHistory.map((pairing) => (
                  <tr key={pairing.id} className="border-b border-gray-50 last:border-0">
                    <td className="px-5 py-3 text-gray-600">{pairing.publishedAt}</td>
                    <td className="px-5 py-3">
                      <p className="font-medium text-gray-900">{pairing.partner}</p>
                      <p className="text-xs text-gray-500">{pairing.partnerEmail}</p>
                    </td>
                    <td className="px-5 py-3 text-gray-600">{pairing.focus}</td>
                    <td className="px-5 py-3 text-gray-600">{pairing.cohort}</td>
                    <td className="px-5 py-3">
                      <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">
                        Completed
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
