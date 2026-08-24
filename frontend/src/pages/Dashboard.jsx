import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import './Dashboard.css';
import StudentLayout from '../layouts/StudentLayout';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { X, Circle } from 'lucide-react';
import { getDemoStudents } from '../services/dummyJsonService';

const MODULES = ['React & UI', 'Data Structures', 'Python Backend'];
const STATUSES = ['Active Pair', 'Unpaired', 'At-Risk'];
const TONES = ['green', 'blue', 'orange'];

const pairings = [
  {
    week: 'week-1',
    date: 'Week 1',
    partner: 'Sarah Kim',
    initials: 'SK',
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
        setStudents(demoStudents.map((student, index) => ({
          ...student,
          initials: student.name.split(' ').map((part) => part[0]).join(''),
          module: MODULES[index % MODULES.length],
          status: STATUSES[index % STATUSES.length],
          score: `${student.mastery}%`,
          change: `${index % 3 === 0 ? '+' : index % 3 === 1 ? '' : '-'}${(index % 5) + 1}%`,
          partner: index % 3 === 0 ? 'Assigned mentor' : undefined,
          tone: TONES[index % TONES.length],
        })));
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
