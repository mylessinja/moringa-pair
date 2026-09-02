import { ArrowRight, Check, Compass, Menu, Sparkles, UsersRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <nav className="landing-nav" aria-label="Main navigation">
        <Link className="landing-brand" to="/" aria-label="MoringaPair home">
          <span className="landing-brand-mark">m</span>
          <span>Moringa<span>Pair</span></span>
        </Link>
        <div className="landing-nav-links">
          <a href="#how-it-works">How it works</a>
          <a href="#why-pair">Why pair?</a>
        </div>
        <div className="landing-actions">
          <Link className="landing-login" to="/login">Student Log in</Link>
          <Link className="landing-login" to="/admin/login">Admin Log in</Link>
          <Link className="landing-button landing-button-dark" to="/signup">Join MoringaPair <ArrowRight size={16} /></Link>
        </div>
        <button className="landing-menu" type="button" aria-label="Open navigation menu"><Menu size={21} /></button>
      </nav>

      <main>
        <section className="landing-hero">
          <div className="landing-hero-copy">
            <p className="landing-kicker"><Sparkles size={15} /> Better learning, together</p>
            <h1>Find the person who makes <em>progress</em> feel possible.</h1>
            <p className="landing-intro">MoringaPair matches you with a learning partner who complements your goals, keeps you accountable, and makes the hard parts less lonely.</p>
            <div className="landing-hero-actions">
              <Link className="landing-button landing-button-coral" to="/signup">Start your journey <ArrowRight size={17} /></Link>
              <Link className="landing-text-link" to="/login">Already a member? Log in</Link>
            </div>
            <div className="landing-proof"><span className="landing-proof-avatars"><span>J</span><span>A</span><span>K</span><span>+</span></span><span>Built for learners who show up</span></div>
          </div>
          <div className="landing-hero-art" aria-label="A preview of a weekly learning partnership">
            <div className="landing-orbit landing-orbit-one" />
            <div className="landing-orbit landing-orbit-two" />
            <div className="landing-note landing-note-top"><span className="landing-note-dot" />Weekly match ready</div>
            <div className="landing-profile-card">
              <div className="landing-profile-top"><span className="landing-label">YOUR PARTNER THIS WEEK</span><span className="landing-status">● Live</span></div>
              <div className="landing-person"><div className="landing-avatar">AK</div><div><h2>Amara K.</h2><p>Frontend &amp; accessibility</p></div></div>
              <div className="landing-match"><div><span>Shared focus</span><strong>Building with confidence</strong></div><span className="landing-match-score">94%<small>match</small></span></div>
              <div className="landing-card-footer"><span><Check size={14} /> Goals aligned</span><span>Week 08</span></div>
            </div>
            <div className="landing-note landing-note-bottom"><UsersRound size={15} /> 2,400+ meaningful connections</div>
          </div>
        </section>

        <section className="landing-strip" id="why-pair">
          <p>Learning works better when it has a rhythm</p>
          <div><span>01</span><strong>Meet with intention</strong></div>
          <div><span>02</span><strong>Learn in public</strong></div>
          <div><span>03</span><strong>Keep moving forward</strong></div>
        </section>

        <section className="landing-how" id="how-it-works">
          <div><p className="landing-kicker">A simpler way to grow</p><h2>One good match can change your whole week.</h2></div>
          <div className="landing-steps"><article><span>01</span><Compass size={23} /><h3>Share your direction</h3><p>Tell us what you are learning and where you want a little momentum.</p></article><article><span>02</span><UsersRound size={23} /><h3>Get thoughtfully paired</h3><p>Receive a weekly partner selected around your goals and learning style.</p></article><article><span>03</span><Check size={23} /><h3>Make progress together</h3><p>Check in, exchange ideas, and leave the week further along than you started.</p></article></div>
        </section>
      </main>
      <footer className="landing-footer"><span>© 2026 MoringaPair</span><span>Learning is a team sport.</span></footer>
    </div>
  );
};

export default LandingPage;