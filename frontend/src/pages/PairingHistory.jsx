import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPairingHistory } from '../services/pairingService';
import { filterHistoryByWeek } from '../services/pairingUtils';
import './Pairing.css';

const PairingHistory = () => {
  const [history, setHistory] = useState([]);
  const [week, setWeek] = useState('all');
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    getPairingHistory()
      .then((pairings) => {
        setHistory(pairings);
        setStatus('succeeded');
      })
      .catch(() => setStatus('failed'));
  }, []);

  const weeks = useMemo(() => [...new Set(history.map((pairing) => pairing.week))], [history]);
  const visibleHistory = filterHistoryByWeek(history, week);

  return (
    <div className="pairing-shell">
      <header className="pairing-header">
        <Link className="brand" to="/dashboard" aria-label="MoringaPair home"><span className="brand-mark">m</span><span>Moringa<span className="brand-accent">Pair</span></span></Link>
        <nav className="pairing-nav" aria-label="Pairing navigation"><Link to="/pairing">My Pairing</Link><Link className="pairing-nav-active" to="/pairing/history">Pairing History</Link><Link className="button button-quiet" to="/dashboard">Directory</Link></nav>
      </header>
      <main className="pairing-main">
        <div className="pairing-title-row"><div><p className="eyebrow">Your past connections</p><h1>Pairing History</h1><p className="header-copy">Review every learning partner you've been matched with.</p></div><Link className="button button-primary" to="/pairing">Current pairing <span>→</span></Link></div>
        {status === 'loading' && <div className="pairing-state" role="status"><span className="spinner" />Loading pairing history...</div>}
        {status === 'failed' && <div className="pairing-state pairing-error">We couldn't load your pairing history. Please try again.</div>}
        {status === 'succeeded' && history.length === 0 && <div className="pairing-state"><h2>No history yet</h2><p>Your past pairings will appear here after your first weekly match.</p></div>}
        {status === 'succeeded' && history.length > 0 && <section className="history-panel"><div className="history-toolbar"><div><h2>Past pairings</h2><p>{visibleHistory.length} pairing{visibleHistory.length === 1 ? '' : 's'} shown</p></div><label>Week<select aria-label="Filter pairing history by week" value={week} onChange={(event) => setWeek(event.target.value)}><option value="all">All weeks</option>{weeks.map((weekValue) => <option key={weekValue} value={weekValue}>Week of {weekValue}</option>)}</select></label></div><div className="history-table-wrap"><table><thead><tr><th>Week</th><th>Partner</th><th>Focus</th><th>Cohort</th><th>Status</th></tr></thead><tbody>{visibleHistory.map((pairing) => <tr key={pairing.id}><td>{pairing.publishedAt}</td><td><strong>{pairing.partner}</strong><small>{pairing.partnerEmail}</small></td><td>{pairing.focus}</td><td>{pairing.cohort}</td><td><span className="history-status">Completed</span></td></tr>)}</tbody></table></div></section>}
      </main>
    </div>
  );
};

export default PairingHistory;
