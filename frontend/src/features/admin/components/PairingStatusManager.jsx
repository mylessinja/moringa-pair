import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  getAllPairings,
  updatePairingStatus,
  autoPairStudents,
} from '../../../services/pairingService';

const statusVariant = {
  active: 'default',
  completed: 'secondary',
  cancelled: 'destructive',
};

export default function PairingStatusManager() {
  const [pairings, setPairings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [week, setWeek] = useState('');
  const [cohort, setCohort] = useState('');
  const [autoGenLoading, setAutoGenLoading] = useState(false);

  useEffect(() => {
    loadPairings();
  }, [week, cohort]);

  const loadPairings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllPairings(week || null, cohort || null);
      setPairings(data);
    } catch (err) {
      setError('Failed to load pairings: ' + err.message);
      setPairings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (pairingId, newStatus) => {
    try {
      setUpdatingId(pairingId);
      await updatePairingStatus(pairingId, newStatus);

      setPairings((current) =>
        current.map((p) =>
          p.id === pairingId ? { ...p, status: newStatus } : p
        )
      );
    } catch (err) {
      setError('Failed to update status: ' + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleAutoGenerate = async () => {
    try {
      setAutoGenLoading(true);
      setError(null);
      const today = new Date();
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      const weekStr = weekStart.toISOString().split('T')[0];

      const result = await autoPairStudents(weekStr, cohort || null);

      await loadPairings();
      setError(null);
      alert(
        `Auto-pairing completed!\n` +
        `Paired: ${result.stats.paired_students} students\n` +
        `Pairings created: ${result.stats.pairings_created}\n` +
        `Unpaired: ${result.stats.unpaired_students}`
      );
    } catch (err) {
      setError('Failed to auto-generate pairings: ' + err.message);
    } finally {
      setAutoGenLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-end">
        <div>
          <label className="block text-sm font-medium mb-1 text-foreground">Week</label>
          <input
            type="date"
            value={week}
            onChange={(e) => setWeek(e.target.value)}
            className="w-48 px-4 py-2 border border-border rounded-md text-sm bg-card text-foreground"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-foreground">Cohort</label>
          <input
            type="text"
            placeholder="e.g., SDF-FT-05"
            value={cohort}
            onChange={(e) => setCohort(e.target.value)}
            className="w-48 px-4 py-2 border border-border rounded-md text-sm bg-card text-foreground"
          />
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleAutoGenerate}
            disabled={autoGenLoading || loading}
            size="sm"
          >
            {autoGenLoading ? 'Generating...' : 'Auto-Generate'}
          </Button>
          <Button onClick={loadPairings} disabled={loading} variant="outline" size="sm">
            {loading ? 'Loading...' : 'Refresh'}
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="rounded-lg border border-border bg-card">
        <div className="px-4 py-3 border-b border-border">
          <h3 className="font-medium text-foreground">
            Pairings {pairings.length > 0 && `(${pairings.length})`}
          </h3>
        </div>

        {loading ? (
          <div className="px-4 py-8 text-center text-sm text-muted-foreground">
            Loading pairings…
          </div>
        ) : pairings.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-muted-foreground">
            No pairings found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground border-b border-border">
                  <th className="py-3 px-4 font-medium">Week</th>
                  <th className="py-3 px-4 font-medium">Student</th>
                  <th className="py-3 px-4 font-medium">Partner</th>
                  <th className="py-3 px-4 font-medium">Cohort</th>
                  <th className="py-3 px-4 font-medium">Focus</th>
                  <th className="py-3 px-4 font-medium">Status</th>
                  <th className="py-3 px-4 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {pairings.map((pairing) => (
                  <tr key={pairing.id} className="border-b border-border">
                    <td className="py-3 px-4 text-foreground">{pairing.week}</td>
                    <td className="py-3 px-4 text-foreground">
                      {pairing.student_name}
                    </td>
                    <td className="py-3 px-4 text-foreground">
                      {pairing.partner_name}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground text-xs">
                      {pairing.cohort || '—'}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground text-xs">
                      {pairing.focus || '—'}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={statusVariant[pairing.status] || 'secondary'}>
                        {pairing.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={pairing.status}
                        onChange={(e) =>
                          handleStatusChange(pairing.id, e.target.value)
                        }
                        disabled={updatingId === pairing.id}
                        className="text-xs px-2 py-1 border border-border rounded bg-card text-foreground cursor-pointer"
                      >
                        <option value="active">active</option>
                        <option value="completed">completed</option>
                        <option value="cancelled">cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-4 py-3 text-sm text-muted-foreground border-t border-border">
              Showing {pairings.length} pairing{pairings.length === 1 ? '' : 's'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
