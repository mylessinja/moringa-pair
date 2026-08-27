import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import StudentLayout from '../layouts/StudentLayout';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { X, Circle, Search } from 'lucide-react';
import { getDemoStudents } from '../services/dummyJsonService';

const MODULES = ['React & UI', 'Data Structures', 'Python Backend'];
const STATUSES = ['Active Pair', 'Unpaired', 'At-Risk'];
const TONES = ['green', 'blue', 'orange'];

const TONE_STYLES = {
  green: 'bg-green-100 text-green-700',
  blue: 'bg-blue-100 text-blue-700',
  orange: 'bg-orange-100 text-orange-700',
};

const STATUS_STYLES = {
  'Active Pair': 'border-green-200 bg-green-50 text-green-700',
  Unpaired: 'border-amber-200 bg-amber-50 text-amber-700',
  'At-Risk': 'border-red-200 bg-red-50 text-red-700',
};

const pairings = [
  { week: 'week-1', date: 'Week 1', partner: 'Sarah Kim', initials: 'SK', focus: 'Frontend architecture' },
  { week: 'week-2', date: 'Week 2', partner: 'Samuel Otieno', initials: 'SO', focus: 'API integration' },
  { week: 'week-3', date: 'Week 3', partner: 'Maya Kibet', initials: 'MK', focus: 'Debugging workflows' },
];

function Dashboard() {
  const user = useSelector((state) => state.auth.user);
  const [search, setSearch] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [students, setStudents] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const demoStudents = await getDemoStudents();
        setStudents(
          demoStudents.map((student, index) => ({
            ...student,
            initials: student.name.split(' ').map((part) => part[0]).join(''),
            module: MODULES[index % MODULES.length],
            status: STATUSES[index % STATUSES.length],
            score: `${student.mastery}%`,
            change: `${index % 3 === 0 ? '+' : index % 3 === 1 ? '' : '-'}${(index % 5) + 1}%`,
            partner: index % 3 === 0 ? 'Assigned mentor' : undefined,
            tone: TONES[index % TONES.length],
          }))
        );
        setStatus('succeeded');
      } catch (requestError) {
        setError(requestError.message);
        setStatus('failed');
      }
    };

    loadStudents();
  }, []);

  const filteredStudents = useMemo(
    () =>
      students
        .filter((student) => `${student.name} ${student.email}`.toLowerCase().includes(search.toLowerCase()))
        .slice(0, visibleCount),
    [search, students, visibleCount]
  );

  const toggleStudent = (name) =>
    setSelectedStudents((current) =>
      current.includes(name) ? current.filter((student) => student !== name) : [...current, name]
    );

  const currentPair = pairings[0];

  return (
    <StudentLayout eyebrow="Student workspace" title={`Welcome, ${user?.name || 'there'}`}>
      {showBanner && (
        <div className="flex items-center gap-3 border-l-2 border-primary bg-gray-50 px-4 py-3 mb-6">
          <p className="text-sm text-gray-700 flex-1">Your pairing for this week is live.</p>
          <button
            onClick={() => setShowBanner(false)}
            aria-label="Dismiss notification"
            className="text-gray-400 hover:text-gray-600"
            type="button"
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

        {currentPair ? (
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

      <section id="students">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <div className="relative flex-1 min-w-[220px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name or email..."
              aria-label="Search by name or email"
              className="pl-9"
            />
          </div>
          <select aria-label="Filter by cohort" className="px-3 py-2 rounded-md border border-gray-200 text-sm text-gray-600">
            <option>All Cohorts</option>
          </select>
          <select aria-label="Filter by module" className="px-3 py-2 rounded-md border border-gray-200 text-sm text-gray-600">
            <option>All Modules</option>
          </select>
          <select aria-label="Filter by status" className="px-3 py-2 rounded-md border border-gray-200 text-sm text-gray-600">
            <option>Any Status</option>
          </select>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              Students
              <span className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold">
                {students.length}
              </span>
            </h2>
            <p className="text-sm text-gray-500">Showing students across all active cohorts</p>
          </div>
        </div>

        {status === 'loading' && <p className="text-sm text-gray-500 py-6">Loading students...</p>}
        {status === 'failed' && <p className="text-sm text-red-600 py-6">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStudents.map((student) => (
            <Card key={student.id}>
              <CardContent className="pt-5">
                <div className="flex items-center justify-between mb-3">
                  <input
                    type="checkbox"
                    checked={selectedStudents.includes(student.name)}
                    onChange={() => toggleStudent(student.name)}
                    aria-label={`Select ${student.name}`}
                    className="w-3.5 h-3.5 accent-primary"
                  />
                  <button
                    type="button"
                    aria-label={`More options for ${student.name}`}
                    className="text-gray-400 hover:text-gray-600 text-xs font-medium"
                  >
                    More
                  </button>
                </div>

                <div className="flex flex-col items-center text-center mb-3">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold mb-2 ${TONE_STYLES[student.tone]}`}
                  >
                    {student.initials}
                  </div>
                  <h3 className="font-bold text-gray-900">{student.name}</h3>
                  <p className="text-xs text-gray-500">{student.email}</p>
                </div>

                <div className="flex items-center justify-center gap-2 mb-4">
                  <Badge variant="outline" className="border-gray-200 bg-gray-50 text-gray-600">
                    {student.cohort}
                  </Badge>
                  <Badge variant="outline" className={STATUS_STYLES[student.status]}>
                    {student.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-3 py-3 border-t border-gray-100 text-sm">
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Focus</p>
                    <p className="font-medium text-gray-800 truncate">{student.module}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400 mb-0.5">Latest Score</p>
                    <p className="font-semibold text-gray-900">
                      {student.score}{' '}
                      <span className={student.change.startsWith('-') ? 'text-red-600 text-xs font-semibold' : 'text-green-600 text-xs font-semibold'}>
                        {student.change}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-sm">
                  {student.partner ? (
                    <span className="text-gray-500">Paired w/ {student.partner}</span>
                  ) : (
                    <span className="text-amber-600">Unpaired</span>
                  )}
                  <button type="button" className="text-primary font-medium hover:underline">
                    View Profile
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {visibleCount < students.length && (
          <div className="text-center mt-6">
            <Button variant="outline" onClick={() => setVisibleCount((count) => count + 6)}>
              Load {students.length - visibleCount} More Students
            </Button>
          </div>
        )}
      </section>
    </StudentLayout>
  );
}

export default Dashboard;
