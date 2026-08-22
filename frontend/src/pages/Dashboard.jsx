import { useEffect, useMemo, useState } from 'react';
import './Dashboard.css';

const MODULES = ['React & UI', 'Data Structures', 'Python Backend'];
const STATUSES = ['Active Pair', 'Unpaired', 'At-Risk'];
const TONES = ['green', 'blue', 'orange'];

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

  const filteredStudents = useMemo(() => students
    .filter((student) => `${student.name} ${student.email}`.toLowerCase().includes(search.toLowerCase()))
    .slice(0, visibleCount), [search, students, visibleCount]);
  const toggleStudent = (name) => setSelectedStudents((current) => current.includes(name) ? current.filter((student) => student !== name) : [...current, name]);

  return (
    <div className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <a className="brand" href="/dashboard" aria-label="MoringaPair home"><span className="brand-mark">m</span><span>Moringa<span className="brand-accent">Pair</span></span></a>
        <p className="sidebar-label">Mentorship Platform</p>
        <button className="sidebar-pairing-button" type="button">+ <span>New Pairing</span></button>
        <nav className="dashboard-nav" aria-label="Main navigation">
          <a className="nav-item" href="#overview"><span className="nav-icon">⌂</span>Overview</a>
          <a className="nav-item nav-item-active" href="#students"><span className="nav-icon">♧</span>Student Directory</a>
          <a className="nav-item" href="/pairing"><span className="nav-icon">↔</span>Pairings</a>
          <a className="nav-item" href="#assessments"><span className="nav-icon">▥</span>Assessments</a>
          <a className="nav-item" href="#reports"><span className="nav-icon">▤</span>Reports</a>
        </nav>
        <div className="sidebar-bottom">
          <a className="nav-item" href="#settings"><span className="nav-icon">⚙</span>Settings</a>
          <a className="nav-item" href="#help"><span className="nav-icon">?</span>Help</a>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header" id="overview">
          <div>
            <p className="eyebrow">Student List</p>
            <h1>Student Directory</h1>
            <p className="header-copy">Manage, filter, and track student pairings across all cohorts.</p>
          </div>
          <div className="header-actions"><button className="button button-quiet" type="button">⇩ <span>Export List</span></button><button className="button button-quiet" type="button" disabled={!selectedStudents.length}>✉ <span>Message Selected</span></button><button className="button button-primary" type="button">＋ <span>New Pairing</span></button><button className="avatar-button" aria-label="Open profile">AM</button></div>
        </header>
        <section className="directory-section" id="students">
          <div className="toolbar"><label className="search-field"><span>⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by name or email..." aria-label="Search by name or email" /></label><select aria-label="Filter by cohort"><option>All Cohorts</option></select><select aria-label="Filter by module"><option>All Modules</option></select><select aria-label="Filter by status"><option>Any Status</option></select></div>
          <div className="directory-heading"><div><h2>Students <span>{students.length}</span></h2><p>Showing students across all active cohorts</p></div><div className="view-toggle"><button className="view-active" aria-label="Card view">▦</button><button aria-label="List view">☷</button></div></div>
          {status === 'loading' && <p className="directory-message">Loading students...</p>}
          {status === 'failed' && <p className="directory-message directory-message-error">{error}</p>}
          <div className="student-grid">
            {filteredStudents.map((student) => <article className="student-card" key={student.id}><div className="student-card-top"><input type="checkbox" checked={selectedStudents.includes(student.name)} onChange={() => toggleStudent(student.name)} aria-label={`Select ${student.name}`} /><button className="more-button" aria-label={`More options for ${student.name}`}>•••</button></div><div className={`student-avatar avatar-${student.tone}`}>{student.initials}</div><h3>{student.name}</h3><p className="student-email">{student.email}</p><div className="student-tags"><span>{student.cohort}</span><span>{student.status}</span></div><div className="score-row"><div><span className="metric-label">Focus</span><strong>{student.module}</strong></div><div className="score"><span className="metric-label">Latest Score</span><strong>{student.score}</strong><small className={student.change.startsWith('-') ? 'score-down' : 'score-up'}>{student.change}</small></div></div><div className="student-card-footer">{student.partner ? <span>Paired w/ {student.partner}</span> : <span className="unpaired">Unpaired</span>}<button type="button">View Profile <span>→</span></button></div></article>)}
          </div>
          {visibleCount < students.length && <button className="load-more" type="button" onClick={() => setVisibleCount((count) => count + 6)}>{students.length - visibleCount} <span>Load More Students</span> ↓</button>}
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
