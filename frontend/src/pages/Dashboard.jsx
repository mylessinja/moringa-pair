import { useState } from 'react';
import './Dashboard.css';

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

  return (
    <div className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <a className="brand" href="/dashboard" aria-label="Moringa Pair home">
          <span className="brand-mark">m</span>
          <span>Moringa<span className="brand-accent">Pair</span></span>
        </a>
        <nav className="dashboard-nav" aria-label="Main navigation">
          <a className="nav-item nav-item-active" href="#current-pairing"><span className="nav-icon">◆</span>My pairing</a>
          <a className="nav-item" href="#pairing-history"><span className="nav-icon">▤</span>Pairing history</a>
        </nav>
        <div className="sidebar-bottom">
          <a className="nav-item" href="/profile"><span className="nav-icon">◯</span>Profile</a>
          <a className="nav-item" href="/login"><span className="nav-icon">↪</span>Log out</a>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <p className="eyebrow">Student workspace</p>
            <h1>Good morning, Ariel</h1>
          </div>
          <button className="avatar-button" aria-label="Open Ariel's profile">AM</button>
        </header>

        {showBanner && (
          <div className="notice-banner" role="status">
            <span className="notice-icon">✦</span>
            <p><strong>New pairing, new perspective.</strong> Your pairing for this week is live.</p>
            <button className="dismiss-button" onClick={() => setShowBanner(false)} aria-label="Dismiss notification">×</button>
          </div>
        )}

        <section className="section-block" id="current-pairing">
          <div className="section-heading">
            <div>
              <p className="eyebrow">This week</p>
              <h2>My pairing</h2>
            </div>
            <span className="live-pill"><span />Live</span>
          </div>
          {isLoading ? (
            <div className="pairing-card pairing-empty" role="status"><span className="spinner" />Loading pairing...</div>
          ) : currentPair ? (
            <article className="pairing-card">
              <div className="pairing-avatar">{currentPair.initials}</div>
              <div className="pairing-details">
                <p className="card-kicker">You are paired with</p>
                <h3>{currentPair.partner}</h3>
                <p className="pair-focus">{currentPair.focus}</p>
                <p className="pair-description">A chance to learn, share ideas, and make progress together.</p>
              </div>
              <button className="primary-button" type="button">View profile <span>→</span></button>
            </article>
          ) : (
            <div className="pairing-card pairing-empty">
              <span className="empty-symbol">○</span>
              <h3>No pairing yet</h3>
              <p>The TM has not published a pairing for this week. Check back soon.</p>
            </div>
          )}
        </section>

        <section className="section-block history-section" id="pairing-history">
          <div className="section-heading history-heading">
            <div>
              <p className="eyebrow">Look back</p>
              <h2>Pairing history</h2>
            </div>
            <label className="week-filter">
              <span>Filter by week</span>
              <select value={selectedWeek} onChange={handleWeekChange} aria-label="Filter pairing history by week">
                <option value="all">All weeks</option>
                {weeks.map((week) => <option key={week.value} value={week.value}>{week.label}</option>)}
              </select>
            </label>
          </div>
          <div className="history-table-wrap">
            <table>
              <thead><tr><th>Week</th><th>Paired with</th><th>Focus</th><th /></tr></thead>
              <tbody>
                {(selectedWeek === 'all' ? pairings : pairings.filter((pairing) => pairing.week === selectedWeek)).map((pairing) => (
                  <tr key={pairing.week}>
                    <td>{pairing.date}</td>
                    <td><span className="table-person"><span className="table-avatar">{pairing.initials}</span>{pairing.partner}</span></td>
                    <td>{pairing.focus}</td>
                    <td><button className="table-action" aria-label={`View ${pairing.partner}'s profile`}>View <span>→</span></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="no-history" hidden={pairings.length > 0}><span>◇</span><p>No history yet</p></div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
