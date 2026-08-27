import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCurrentPairing } from '../services/pairingService';
import { shouldShowNewPairingBanner } from '../services/pairingUtils';
import './Pairing.css';

const CURRENT_WEEK = '2026-08-17';

const Pairing = () => {
  const [pairing, setPairing] = useState(null);
  const [status, setStatus] = useState('loading');
  const [bannerDismissed, setBannerDismissed] = useState(false);

  useEffect(() => {
    getCurrentPairing()
      .then((currentPairing) => {
        setPairing(currentPairing);
        setStatus('succeeded');
      })
      .catch(() => setStatus('failed'));
  }, []);

  return (
    <div className="pairing-shell">
      <header className="pairing-header">
        <Link className="brand" to="/dashboard" aria-label="MoringaPair home"><span className="brand-mark">m</span><span>Moringa<span className="brand-accent">Pair</span></span></Link>
        <nav className="pairing-nav" aria-label="Pairing navigation">
          <Link className="pairing-nav-active" to="/pairing">My Pairing</Link>
          <Link to="/pairing/history">Pairing History</Link>
          <Link className="button button-quiet" to="/dashboard">Directory</Link>
        </nav>
      </header>
      <main className="pairing-main">
        <div className="pairing-title-row">
          <div><p className="eyebrow">Week of August 17, 2026</p><h1>My Pairing</h1><p className="header-copy">Your learning partner for this week.</p></div>
          <Link className="button button-quiet" to="/pairing/history">View history <span>→</span></Link>
        </div>
        {shouldShowNewPairingBanner(pairing, CURRENT_WEEK, bannerDismissed) && <div className="pairing-banner" role="status"><div><strong>New weekly pairing is live</strong><span>Your new partner is ready. Reach out and plan your first session together.</span></div><button type="button" onClick={() => setBannerDismissed(true)} aria-label="Dismiss new pairing notification">x</button></div>}
        {status === 'loading' && <div className="pairing-state" role="status"><span className="spinner" />Loading your pairing...</div>}
        {status === 'failed' && <div className="pairing-state pairing-error">We couldn't load your pairing. Please try again.</div>}
        {status === 'succeeded' && pairing && <section className="current-pairing" aria-label="Current pairing"><div className="partner-avatar">SK</div><div className="partner-details"><p className="eyebrow">Paired with</p><h2>{pairing.partner}</h2><p>{pairing.partnerEmail}</p><div className="pairing-meta"><span>{pairing.cohort}</span><span>{pairing.focus}</span></div></div><a className="button button-primary" href={`mailto:${pairing.partnerEmail}`}>Message partner</a></section>}
        {status === 'succeeded' && !pairing && <div className="pairing-state"><h2>No pairing yet</h2><p>Your Technical Mentor has not published this week's pairings yet. Check back soon.</p></div>}
      </main>
    </div>
  );
};

export default Pairing;
