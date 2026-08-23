import { useState } from 'react';
import StudentLayout from '../layouts/StudentLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Sparkles, Circle } from 'lucide-react';

const weeks = [
  { value: '2026-08-17', label: 'Week of Aug 17, 2026' },
  { value: '2026-08-10', label: 'Week of Aug 10, 2026' },
  { value: '2026-08-03', label: 'Week of Aug 3, 2026' },
];

const pairings = [
  { week: '2026-08-17', partner: 'Amina Wanjiku', initials: 'AW', focus: 'Frontend foundations', date: 'Aug 17, 2026' },
  { week: '2026-08-10', partner: 'Brian Otieno', initials: 'BO', focus: 'Career preparation', date: 'Aug 10, 2026' },
  { week: '2026-08-03', partner: 'Nia Kamau', initials: 'NK', focus: 'Product thinking', date: 'Aug 3, 2026' },
];

function Dashboard() {
  const [selectedWeek, setSelectedWeek] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  const currentPair = pairings[0];

  const handleWeekChange = (event) => {
    setIsLoading(true);
    setSelectedWeek(event.target.value);
    window.setTimeout(() => setIsLoading(false), 350);
  };

  const visiblePairings =
    selectedWeek === 'all' ? pairings : pairings.filter((pairing) => pairing.week === selectedWeek);

  return (
    <StudentLayout eyebrow="Student workspace" title="Good morning, Ariel">
      {showBanner && (
        <div className="flex items-center gap-3 bg-primary/10 border border-primary/20 text-primary rounded-md px-4 py-3 mb-6">
          <Sparkles className="w-4 h-4 flex-shrink-0" />
          <p className="text-sm flex-1">
            <strong>New pairing, new perspective.</strong> Your pairing for this week is live.
          </p>
          <button
            onClick={() => setShowBanner(false)}
            aria-label="Dismiss notification"
            className="text-primary/60 hover:text-primary"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <section id="current-pairing" className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-primary mb-1">This week</p>
            <h2 className="text-lg font-bold text-gray-900">My pairing</h2>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-50 px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            Live
          </span>
        </div>

        {isLoading ? (
          <Card>
            <CardContent className="flex items-center justify-center gap-2 py-10 text-gray-400 text-sm">
              <span className="w-4 h-4 border-2 border-gray-300 border-t-primary rounded-full animate-spin" />
              Loading pairing...
            </CardContent>
          </Card>
        ) : currentPair ? (
          <Card>
            <CardContent className="flex items-center gap-5 py-6">
              <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center text-lg font-semibold flex-shrink-0">
                {currentPair.initials}
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">You are paired with</p>
                <h3 className="text-lg font-bold text-gray-900">{currentPair.partner}</h3>
                <p className="text-sm text-primary font-medium">{currentPair.focus}</p>
                <p className="text-sm text-gray-500 mt-1">
                  A chance to learn, share ideas, and make progress together.
                </p>
              </div>
              <Button variant="outline">View profile</Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-dashed">
            <CardContent className="text-center py-10">
              <Circle className="w-6 h-6 mx-auto text-gray-300 mb-2" />
              <h3 className="font-bold text-gray-900 mb-1">No pairing yet</h3>
              <p className="text-sm text-gray-500">
                The TM has not published a pairing for this week. Check back soon.
              </p>
            </CardContent>
          </Card>
        )}
      </section>

      <section id="pairing-history">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-primary mb-1">Look back</p>
            <h2 className="text-lg font-bold text-gray-900">Pairing history</h2>
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <span>Filter by week</span>
            <select
              value={selectedWeek}
              onChange={handleWeekChange}
              aria-label="Filter pairing history by week"
              className="px-3 py-2 rounded-md border border-gray-200 text-sm"
            >
              <option value="all">All weeks</option>
              {weeks.map((week) => (
                <option key={week.value} value={week.value}>
                  {week.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <Card className="px-4">
          <CardContent className="p-0">
            {visiblePairings.length > 0 ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-200">
                    <th className="py-3 font-medium">Week</th>
                    <th className="py-3 font-medium">Paired with</th>
                    <th className="py-3 font-medium">Focus</th>
                    <th className="py-3 font-medium" />
                  </tr>
                </thead>
                <tbody>
                  {visiblePairings.map((pairing) => (
                    <tr key={pairing.week} className="border-b border-gray-100">
                      <td className="py-3 text-gray-600">{pairing.date}</td>
                      <td className="py-3">
                        <span className="flex items-center gap-2 font-medium text-gray-900">
                          <span className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600">
                            {pairing.initials}
                          </span>
                          {pairing.partner}
                        </span>
                      </td>
                      <td className="py-3 text-gray-600">{pairing.focus}</td>
                      <td className="py-3">
                        <button
                          aria-label={`View ${pairing.partner}'s profile`}
                          className="text-primary text-xs font-medium hover:underline"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-10 text-gray-400 text-sm">No history yet</div>
            )}
          </CardContent>
        </Card>
      </section>
    </StudentLayout>
  );
}

export default Dashboard;
