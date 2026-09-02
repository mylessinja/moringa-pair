import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  getAllPairings,
  updatePairingStatus,
  autoPairStudents,
} from '../../../services/pairingService';

const VALID_STATUSES = ['active', 'completed', 'cancelled'];

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
      
      // Update local state
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
      
      // Reload pairings
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Pairing Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Week</label>
              <input
                type="date"
                value={week}
                onChange={(e) => setWeek(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Cohort</label>
              <input
                type="text"
                placeholder="e.g., SDF-FT-05"
                value={cohort}
                onChange={(e) => setCohort(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex items-end gap-2">
              <Button
                onClick={handleAutoGenerate}
                disabled={autoGenLoading || loading}
                className="w-full"
              >
                {autoGenLoading ? 'Generating...' : 'Auto-Generate Pairings'}
              </Button>
            </div>
          </div>
          <Button onClick={loadPairings} disabled={loading} variant="outline" className="w-full">
            {loading ? 'Loading...' : 'Refresh Pairings'}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-800">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>
            Pairings
            {pairings.length > 0 && ` (${pairings.length})`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-8 text-gray-500">Loading pairings...</p>
          ) : pairings.length === 0 ? (
            <p className="text-center py-8 text-gray-500">No pairings found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-200">
                    <th className="py-3 font-medium">Week</th>
                    <th className="py-3 font-medium">Student</th>
                    <th className="py-3 font-medium">Partner</th>
                    <th className="py-3 font-medium">Cohort</th>
                    <th className="py-3 font-medium">Focus</th>
                    <th className="py-3 font-medium">Status</th>
                    <th className="py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pairings.map((pairing) => (
                    <tr key={pairing.id} className="border-b border-gray-100">
                      <td className="py-3 text-gray-900">{pairing.week}</td>
                      <td className="py-3 text-gray-700">
                        {pairing.student_name}
                      </td>
                      <td className="py-3 text-gray-700">
                        {pairing.partner_name}
                      </td>
                      <td className="py-3 text-gray-600 text-xs">
                        {pairing.cohort || '—'}
                      </td>
                      <td className="py-3 text-gray-600 text-xs">
                        {pairing.focus || '—'}
                      </td>
                      <td className="py-3">
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded-full ${
                            pairing.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : pairing.status === 'completed'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {pairing.status}
                        </span>
                      </td>
                      <td className="py-3">
                        <select
                          value={pairing.status}
                          onChange={(e) =>
                            handleStatusChange(pairing.id, e.target.value)
                          }
                          disabled={updatingId === pairing.id}
                          className="text-xs px-2 py-1 border border-gray-300 rounded bg-white cursor-pointer"
                        >
                          {VALID_STATUSES.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
