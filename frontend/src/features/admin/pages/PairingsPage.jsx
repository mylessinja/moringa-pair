import { useState } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import PairingPreviewList from '../components/PairingPreviewList';
import PairingHistoryTable from '../components/PairingHistoryTable';
import { mockPairingRoster } from '../data/mockPairingRoster';
import { mockPairingHistory } from '../data/mockPairingHistory';
import { generatePairings } from '../utils/generatePairings';
import { toCsv, downloadCsv } from '../utils/exportCsv';

export default function PairingsPage() {
  const [tab, setTab] = useState('generate');

  // TODO: replace mockPairingRoster / mockPairingHistory with real
  // backend data (GET /students/active, GET/POST /pairings) once
  // those endpoints exist. Local state exists purely so Generate /
  // Swap / Publish / Search / Export all work end-to-end in the UI.
  const [preview, setPreview] = useState(null);
  const [history, setHistory] = useState(mockPairingHistory);
  const [search, setSearch] = useState('');

  const handleGenerate = () => {
    const names = mockPairingRoster.map((s) => s.name);
    setPreview(generatePairings(names));
  };

  const handleSwap = (indexA, indexB) => {
    setPreview((current) => {
      const next = current.map((pair) => ({ ...pair, members: [...pair.members] }));
      const temp = next[indexA].members[1];
      next[indexA].members[1] = next[indexB].members[1];
      next[indexB].members[1] = temp;
      return next;
    });
  };

  const handlePublish = () => {
    const nextWeekNumber = history.length + 5; // seed data starts at Week 5
    const entry = {
      id: history.length + 1,
      week: `Week ${nextWeekNumber}`,
      publishedAt: new Date().toISOString().slice(0, 10),
      pairs: preview,
    };
    setHistory((current) => [...current, entry]);
    setPreview(null);
    setTab('history');
  };

  const filteredHistory = history.filter((entry) => {
    const query = search.toLowerCase();
    if (!query) return true;
    const inWeek = entry.week.toLowerCase().includes(query);
    const inMembers = entry.pairs.some((pair) =>
      pair.members.some((name) => name.toLowerCase().includes(query))
    );
    return inWeek || inMembers;
  });

  const handleExport = () => {
    const rows = filteredHistory.flatMap((entry) =>
      entry.pairs.map((pair) => ({
        week: entry.week,
        publishedAt: entry.publishedAt,
        pair: pair.members.join(' & '),
      }))
    );
    const csv = toCsv(rows, [
      { key: 'week', label: 'Week' },
      { key: 'publishedAt', label: 'Published' },
      { key: 'pair', label: 'Pair' },
    ]);
    downloadCsv('pairing-history.csv', csv);
  };

  return (
    <AdminLayout
      pageTitle="Pairing Logic"
      pageDescription="Generate weekly pairings, review pairing history, and export records."
    >
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
                  Generate a new weekly pairing from the active student roster
                  ({mockPairingRoster.length} students).
                </p>
                <Button onClick={handleGenerate}>Generate Pairings</Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-foreground">Preview</h3>
                    <p className="text-xs text-muted-foreground">
                      Review the pairing below. Swap members if needed before publishing.
                    </p>
                  </div>
                  <Button variant="secondary" onClick={handleGenerate}>
                    Regenerate
                  </Button>
                </div>

                <PairingPreviewList pairs={preview} onSwap={handleSwap} />

                <div className="flex justify-end gap-2 mt-5">
                  <Button variant="secondary" onClick={() => setPreview(null)}>
                    Discard
                  </Button>
                  <Button onClick={handlePublish}>Publish Pairing</Button>
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
              {filteredHistory.length > 0 ? (
                <PairingHistoryTable history={filteredHistory} />
              ) : (
                <div className="text-center py-10 text-muted-foreground text-sm">
                  No pairing history matches your search.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}
