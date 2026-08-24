import { useEffect, useMemo, useState } from 'react';
import './Dashboard.css';
import StudentLayout from '../layouts/StudentLayout';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { X, Circle } from 'lucide-react';

const MODULES = ['React & UI', 'Data Structures', 'Python Backend'];
const STATUSES = ['Active Pair', 'Unpaired', 'At-Risk'];
const TONES = ['green', 'blue', 'orange'];

const pairings = [
  {
    week: 'week-1',
    date: 'Week 1',
    partner: 'Ariel Njeri',
    initials: 'AN',
    focus: 'Frontend architecture',
  },
  {
    week: 'week-2',
    date: 'Week 2',
    partner: 'Samuel Otieno',
    initials: 'SO',
    focus: 'API integration',
  },
  {
    week: 'week-3',
    date: 'Week 3',
    partner: 'Maya Kibet',
    initials: 'MK',
    focus: 'Debugging workflows',
  },
];

const weeks = [
  { label: 'Week 1', value: 'week-1' },
  { label: 'Week 2', value: 'week-2' },
  { label: 'Week 3', value: 'week-3' },
];

const mapUserToStudent = (user, index) => ({
  id: user.id,
  name: `${user.firstName} ${user.lastName}`,
  email: user.email,
  initials: `${user.firstName[0]}${user.lastName[0]}`,
  cohort: `SDF-${index % 2 ? 'PT' : 'FT'}-${String((index % 5) + 1).padStart(2, '0')}`,
  module: MODULES[index % MODULES.length],
  status: STATUSES[index % STATUSES.length],
  score: `${60 + ((user.id * 7) % 36)}%`,
  change: `${index % 3 === 0 ? '+' : index % 3 === 1 ? '' : '-'}${(index % 5) + 1}%`,
  partner: index % 3 === 0 ? 'Assigned mentor' : undefined,
  tone: TONES[index % TONES.length],
  image: user.image,
});

function Dashboard() {
  const [search, setSearch] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [students, setStudents] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [showBanner, setShowBanner] = useState(true);
  const [selectedWeek, setSelectedWeek] = useState('all');

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const response = await fetch('https://dummyjson.com/users?limit=30');
        if (!response.ok) throw new Error('Unable to load students');
        const data = await response.json();
        setStudents(data.users.map(mapUserToStudent));
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

  const visiblePairings =
    selectedWeek === 'all' ? pairings : pairings.filter((pairing) => pairing.week === selectedWeek);

  const currentPair = pairings[0];

  const handleWeekChange = (event) => {
    setSelectedWeek(event.target.value);
  };

  return (
    <StudentLayout eyebrow="Student workspace" title="Good morning, Ariel">
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

      <section id="pairing-history" className="mb-8">
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
                          type="button"
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

      <section className="directory-section" id="students">
        <div className="toolbar">
          <label className="search-field">
            <span className="sr-only">Search</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name or email..."
              aria-label="Search by name or email"
            />
          </label>
          <select aria-label="Filter by cohort"><option>All Cohorts</option></select>
          <select aria-label="Filter by module"><option>All Modules</option></select>
          <select aria-label="Filter by status"><option>Any Status</option></select>
        </div>

        <div className="directory-heading">
          <div>
            <h2>
              Students <span>{students.length}</span>
            </h2>
            <p>Showing students across all active cohorts</p>
          </div>
          <div className="view-toggle">
            <button className="view-active" aria-label="Card view" type="button">Grid</button>
            <button aria-label="List view" type="button">List</button>
          </div>
        </div>

        {status === 'loading' && <p className="directory-message">Loading students...</p>}
        {status === 'failed' && <p className="directory-message directory-message-error">{error}</p>}

        <div className="student-grid">
          {filteredStudents.map((student) => (
            <article className="student-card" key={student.id}>
              <div className="student-card-top">
                <input
                  type="checkbox"
                  checked={selectedStudents.includes(student.name)}
                  onChange={() => toggleStudent(student.name)}
                  aria-label={`Select ${student.name}`}
                />
                <button className="more-button" aria-label={`More options for ${student.name}`} type="button">
                  More
                </button>
              </div>
              <div className={`student-avatar avatar-${student.tone}`}>{student.initials}</div>
              <h3>{student.name}</h3>
              <p className="student-email">{student.email}</p>
              <div className="student-tags">
                <span>{student.cohort}</span>
                <span>{student.status}</span>
              </div>
              <div className="score-row">
                <div>
                  <span className="metric-label">Focus</span>
                  <strong>{student.module}</strong>
                </div>
                <div className="score">
                  <span className="metric-label">Latest Score</span>
                  <strong>{student.score}</strong>
                  <small className={student.change.startsWith('-') ? 'score-down' : 'score-up'}>
                    {student.change}
                  </small>
                </div>
              </div>
              <div className="student-card-footer">
                {student.partner ? <span>Paired w/ {student.partner}</span> : <span className="unpaired">Unpaired</span>}
                <button type="button">View Profile</button>
              </div>
            </article>
          ))}
        </div>

        {visibleCount < students.length && (
          <button className="load-more" type="button" onClick={() => setVisibleCount((count) => count + 6)}>
            {students.length - visibleCount} <span>Load More Students</span>
          </button>
        )}
      </section>
    </StudentLayout>
  );
}

export default Dashboard;
