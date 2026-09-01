import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { adminApi } from '@/services/adminApi';

const TRACKS = ['Software Engineering', 'Data Science', 'Cybersecurity', 'UI/UX Design'];

export default function CreateCohortDialog({ open, onClose, onCreated }) {
  const [name, setName] = useState('');
  const [track, setTrack] = useState(TRACKS[0]);
  const [status, setStatus] = useState('active');
  const [totalWeeks, setTotalWeeks] = useState(12);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const cohort = await adminApi.createCohort({
        name: name.trim(),
        track,
        status,
        total_weeks: Number(totalWeeks) || 12,
        week_of_syllabus: 1,
      });
      onCreated?.(cohort);
      setName('');
      onClose?.();
    } catch (err) {
      setError(err.message || 'Create failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden />
      <div className="relative z-10 w-full max-w-md rounded-xl border bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold">Create New Cohort</h2>
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div className="space-y-1">
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} required placeholder="SE-Cohort 36" />
          </div>
          <div className="space-y-1">
            <Label>Track</Label>
            <select
              className="flex h-9 w-full rounded-md border px-3 text-sm"
              value={track}
              onChange={(e) => setTrack(e.target.value)}
            >
              {TRACKS.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Status</Label>
              <select
                className="flex h-9 w-full rounded-md border px-3 text-sm"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="active">Active</option>
                <option value="upcoming">Upcoming</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div className="space-y-1">
              <Label>Total weeks</Label>
              <Input type="number" min={1} value={totalWeeks} onChange={(e) => setTotalWeeks(e.target.value)} />
            </div>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={loading || !name.trim()}>
              {loading ? 'Creating…' : 'Create'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
