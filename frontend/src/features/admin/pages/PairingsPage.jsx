import { useEffect, useState } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import PairingPreviewList from '../components/PairingPreviewList';
import PairingHistoryTable from '../components/PairingHistoryTable';
import {
  getCohorts,
  previewPairings,
  publishPairings,
  getCohortPairings,
} from '../../../services/adminService';
import { toCsv, downloadCsv } from '../utils/exportCsv';

function mondayOfThisWeek() {
  const d = new Date();
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d.toISOString().slice(0, 10);
}

function toUiPairs(apiPairs) {
  return (apiPairs || []).map((p, index) => ({
    id: p.id || `preview-${index}`,
    members: [p.student_a, p.student_b].filter(Boolean),
    student_a_id: p.student_a_id,
    student_b_id: p.student_b_id,
    is_repeat: p.is_repeat,
  }));
}

function groupHistory(pairings) {
  const byWeek = {};
  for (const p of pairings || []) {
    const key = p.week_start;
    if (!byWeek[key]) {
      byWeek[key] = { id: key, week: key, publishedAt: key, pairs: [] };
    }
    byWeek[key].pairs.push({
      id: p.id,
      members: [p.student_a, p.student_b].filter(Boolean),
    });
  }
  return Object.values(byWeek).sort((a, b) => (a.week < b.week ? 1 : -1));
}

export default function PairingsPage() {
  const [tab, setTab] = useState('generate');
  const [cohorts, setCohorts] = useState([]);
  const [cohortId, setCohortId] = useState('');
  const [weekStart, setWeekStart] = useState(mondayOfThisWeek());
  const [focus, setFocus] = useState('');
  const [preview, setPreview] = useState(null);
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    getCohorts()
      .then((list) => {
        setCohorts(list || []);
        if (list?.length) setCohortId(String(list[0].id));
      })
      .catch((err) => setError(err.response?.data?.error || 'Could not load cohorts.'));
  }, []);

  useEffect(() => {
    if (!cohortId) return;
    setStatus('loading');
    getCohortPairings(cohortId)
      .then((data) => {
        setHistory(groupHistory(data.pairings));
        setStatus('succeeded');
      })
      .catch(() => {
        setHistory([]);
        setStatus('failed');
      });
  }, [cohortId]);

  const handleGenerate = async () => {
    if (!cohortId || !weekStart) {
      setError('Select a cohort and week start date.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const result = await previewPairings({
        cohort_id: Number(cohortId),
        week_start: weekStart,
        focus: focus || undefined,
        mode: 'balanced',
      });
      setPreview(result);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Preview failed.');
      setPreview(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSwap = (indexA, indexB) => {
    setPreview((current) => {
      if (!current?.pairs) return current;
      const pairs = current.pairs.map((p) => ({ ...p }));
      const a = pairs[indexA];
      const b = pairs[indexB];
      const tmpId = a.student_b_id;
      const tmpName = a.student_b;
      a.student_b_id = b.student_b_id;
      a.student_b = b.student_b;
      b.student_b_id = tmpId;
      b.student_b = tmpName;
      return { ...current, pairs };
    });
  };

  const handlePublish = async () => {
    if (!preview?.pairs?.length) return;
    setLoading(true);
    setError('');
    try {
      await publishPairings({
        cohort_id: Number(cohortId),
        week_start: weekStart,
        focus: focus || undefined,
        pairs: preview.pairs.map((p) => ({
          student_a_id: p.student_a_id,
          student_b_id: p.student_b_id,
        })),
      });
      const data = await getCohortPairings(cohortId);
      setHistory(groupHistory(data.pairings));
      setPreview(null);
      setTab('history');
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Publish failed.');
    } finally {
      setLoading(false);
    }
  };

  const uiPairs = toUiPairs(preview?.pairs);

  const filteredHistory = history.filter((entry) => {
    const query = search.toLowerCase();
    if (!query) return true;
    return (
      entry.week.toLowerCase().includes(query) ||
      entry.pairs.some((pair) =>
        pair.members.some((name) => (name || '').toLowerCase().includes(query))
      )
    );
  });

  const handleExport = () => {
    const rows = filteredHistory.flatMap((entry) =>
      entry.pairs.map((pair) => ({
        week: entry.week,
        publishedAt: entry.publishedAt,
        pair: pair.members.join(' & '),
      }))
    );
    downloadCsv(
      'pairing-history.csv',
      toCsv(rows, [
        { key: 'week', label: 'Week' },
        { key: 'publishedAt', label: 'Published' },
        { key: 'pair', label: 'Pair' },
      ])
    );
  };

  return (
    <AdminLayout
      pageTitle="Pairing Logic"
      pageDescription="Generate weekly pairings, review pairing history, and export records."
    >
      <div className="flex flex-wrap items-end gap-3 mb-4">
        <div>
          <label className="block text-xs text-muted-foreground mb-1">Cohort</label>
          <select
            value={cohortId}
            onChange={(e) => {
              setCohortId(e.target.value);
              setPreview(null);
            }}
            className="px-3 py-2 rounded-md border border-border text-sm min-w-[180px]"
          >
            {cohorts.length === 0 && <option value="">No cohorts</option>}
            {cohorts.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-muted-foreground mb-1">Week start</label>
          <input
            type="date"
            value={weekStart}
            onChange={(e) => setWeekStart(e.target.value)}
            className="px-3 py-2 rounded-md border border-border text-sm"
          />
        </div>
        <div className="flex-1 min-w-[160px]">
          <label className="block text-xs text-muted-foreground mb-1">Focus (optional)</label>
          <input
            type="text"
            value={focus}
            onChange={(e) => setFocus(e.target.value)}
            placeholder="e.g. React & UI"
            className="w-full px-3 py-2 rounded-md border border-border text-sm"
          />
        </div>
      </div>

      {error && (
        <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
          {error}
        </p>
      )}

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="generate">Generate</TabsTrigger>
          <TabsTrigger value="history">Pairing History</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="mt-4">
          {!preview ? (
            <Card className="border-dashed">
              <CardContent className="text-center py-10">
                <p className="text-sm text-muted-foreground mb-4">
                  Generate a balanced weekly pairing for the selected cohort.
                </p>
                <Button onClick={handleGenerate} disabled={loading || !cohortId}>
                  {loading ? 'Generating…' : 'Generate Pairings'}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent>
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                  <div>
                    <h3 className="font-bold">Preview</h3>
                    <p className="text-xs text-muted-foreground">
                      {preview.pairs?.length || 0} pair(s)
                      {preview.repeat_count ? ` · ${preview.repeat_count} repeat(s)` : ' · no repeats'}
                      {preview.unpaired_student ? ` · unpaired: ${preview.unpaired_student}` : ''}
                    </p>
                  </div>
                  <Button variant="secondary" onClick={handleGenerate} disabled={loading}>
                    Regenerate
                  </Button>
                </div>

                <PairingPreviewList pairs={uiPairs} onSwap={handleSwap} />

                <div className="flex justify-end gap-2 mt-5">
                  <Button variant="secondary" onClick={() => setPreview(null)}>
                    Discard
                  </Button>
                  <Button onClick={handlePublish} disabled={loading}>
                    {loading ? 'Publishing…' : 'Publish Pairing'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <input
              type="text"
              placeholder="Search by week or student name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-72 px-4 py-2 rounded-md border border-border text-sm"
            />
            <Button variant="secondary" onClick={handleExport}>
              Export CSV
            </Button>
          </div>

          <Card className="px-4">
            <CardContent className="p-0">
              {status === 'loading' && (
                <div className="text-center py-10 text-muted-foreground text-sm">Loading…</div>
              )}
              {status !== 'loading' && filteredHistory.length > 0 ? (
                <PairingHistoryTable history={filteredHistory} />
              ) : (
                status !== 'loading' && (
                  <div className="text-center py-10 text-muted-foreground text-sm">
                    No pairing history for this cohort yet.
                  </div>
                )
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}
