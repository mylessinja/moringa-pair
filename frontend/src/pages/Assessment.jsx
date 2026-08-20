import { useState } from 'react';
import './Assessment.css';

const questions = [
  { topic: 'JavaScript', prompt: 'Which approach best describes how you like to learn a new technical concept?', answers: ['Talk it through with someone', 'Read documentation and examples', 'Build a small project', 'Watch a guided walkthrough'] },
  { topic: 'Collaboration', prompt: 'When a pairing session gets stuck, what do you usually do first?', answers: ['Break the problem into smaller steps', 'Ask my partner to explain their thinking', 'Search for a similar example', 'Try a different approach'] },
  { topic: 'Problem solving', prompt: 'Which kind of task gives you the most energy?', answers: ['Designing a clean interface', 'Finding and fixing a tricky bug', 'Planning the data and structure', 'Explaining a solution to others'] },
  { topic: 'Growth', prompt: 'What would you most like to strengthen this month?', answers: ['Confidence with code reviews', 'Frontend architecture', 'Testing and debugging', 'Communicating technical ideas'] },
];

const scores = [
  { label: 'Frontend foundations', score: 82, color: 'sage' },
  { label: 'Problem solving', score: 74, color: 'gold' },
  { label: 'Communication', score: 91, color: 'coral' },
  { label: 'Testing & quality', score: 63, color: 'blue' },
];

function Assessment() {
  const [view, setView] = useState('quiz');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const question = questions[questionIndex];
  const answered = Object.keys(answers).length;
  const progress = Math.round((answered / questions.length) * 100);

  const chooseAnswer = (answerIndex) => {
    setAnswers((current) => ({ ...current, [questionIndex]: answerIndex }));
  };

  const nextQuestion = () => {
    if (questionIndex < questions.length - 1) setQuestionIndex((current) => current + 1);
    else setView('results');
  };

  const submitFeedback = (event) => {
    event.preventDefault();
    if (rating && comment.trim()) setSubmitted(true);
  };

  return (
    <div className="assessment-shell">
      <aside className="assessment-sidebar">
        <a className="brand" href="/dashboard" aria-label="Moringa Pair home"><span className="brand-mark">m</span><span>Moringa<span className="brand-accent">Pair</span></span></a>
        <nav className="assessment-nav" aria-label="Main navigation">
          <a className="nav-item" href="/dashboard"><span className="nav-icon">◆</span>My pairing</a>
          <a className="nav-item nav-item-active" href="/assessment"><span className="nav-icon">▣</span>Assessment</a>
          <a className="nav-item" href="/dashboard#pairing-history"><span className="nav-icon">▤</span>Pairing history</a>
        </nav>
        <div className="sidebar-bottom"><a className="nav-item" href="/profile"><span className="nav-icon">◯</span>Profile</a><a className="nav-item" href="/login"><span className="nav-icon">↪</span>Log out</a></div>
      </aside>

      <main className="assessment-main">
        <header className="assessment-header"><div><p className="eyebrow">Skill snapshot</p><h1>Assessment & feedback</h1></div><button className="avatar-button" aria-label="Open Ariel's profile">AM</button></header>

        <div className="assessment-tabs" role="tablist" aria-label="Assessment sections">
          <button className={view === 'quiz' ? 'tab-active' : ''} onClick={() => setView('quiz')}>Skill quiz <span>01</span></button>
          <button className={view === 'results' ? 'tab-active' : ''} onClick={() => setView('results')}>My results <span>02</span></button>
          <button className={view === 'feedback' ? 'tab-active' : ''} onClick={() => setView('feedback')}>Pairing feedback <span>03</span></button>
        </div>

        {view === 'quiz' && <section className="assessment-content">
          <div className="intro-row"><div><p className="eyebrow">A few thoughtful questions</p><h2>Let’s find your learning rhythm.</h2><p className="intro-copy">Your answers help us understand how you work best with a partner. There are no right or wrong answers.</p></div><div className="completion"><strong>{progress}%</strong><span>complete</span></div></div>
          <div className="progress-track"><span style={{ width: `${Math.max(progress, 4)}%` }} /></div>
          <article className="question-card"><div className="question-meta"><span>Question {questionIndex + 1} of {questions.length}</span><span className="topic-label">{question.topic}</span></div><h3>{question.prompt}</h3><div className="answer-grid">{question.answers.map((answer, index) => <button key={answer} className={answers[questionIndex] === index ? 'answer selected' : 'answer'} onClick={() => chooseAnswer(index)}><span className="answer-letter">{String.fromCharCode(65 + index)}</span>{answer}<span className="check-mark">✓</span></button>)}</div><div className="question-footer"><span>{answers[questionIndex] !== undefined ? 'Answer saved' : 'Select one answer'}</span><button className="primary-button" disabled={answers[questionIndex] === undefined} onClick={nextQuestion}>{questionIndex === questions.length - 1 ? 'See my results' : 'Next question'} <span>→</span></button></div></article>
        </section>}

        {view === 'results' && <section className="assessment-content results-content"><div className="results-intro"><p className="eyebrow">Your latest snapshot</p><h2>Strengths to share, skills to grow.</h2><p className="intro-copy">These results give your mentor a starting point for thoughtful pairings. They can evolve as you learn.</p><div className="result-score"><strong>78</strong><span>/ 100<br />overall fit</span></div></div><div className="score-panel"><div className="panel-heading"><div><p className="eyebrow">Skill breakdown</p><h3>Where you are today</h3></div><span className="updated-label">Updated just now</span></div>{scores.map((item) => <div className="score-row" key={item.label}><div className="score-label"><span>{item.label}</span><strong>{item.score}%</strong></div><div className="score-track"><span className={`score-fill ${item.color}`} style={{ width: `${item.score}%` }} /></div></div>)}<div className="result-note"><span>✦</span><p><strong>Your standout strength is communication.</strong> Consider pairing with someone who enjoys exploring ideas out loud.</p></div><button className="secondary-button" onClick={() => { setQuestionIndex(0); setView('quiz'); }}>Retake assessment</button></div></section>}

        {view === 'feedback' && <section className="assessment-content feedback-content"><div className="feedback-copy"><p className="eyebrow">Week of Aug 17, 2026</p><h2>How was your pairing with Amina?</h2><p className="intro-copy">Your honest reflection helps us make future pairings more useful for everyone.</p><div className="feedback-person"><span className="pairing-avatar">AW</span><div><strong>Amina Wanjiku</strong><span>Frontend foundations</span></div></div></div><form className="feedback-form" onSubmit={submitFeedback}><label>How would you rate this pairing? <span className="required">Required</span></label><div className="rating-group" aria-label="Pairing rating">{[1, 2, 3, 4, 5].map((value) => <button type="button" key={value} className={rating >= value ? 'rating selected' : 'rating'} onClick={() => setRating(value)} aria-label={`${value} out of 5`}>★</button>)}</div><label htmlFor="feedback-comment">What worked well, or what could be better? <span className="required">Required</span></label><textarea id="feedback-comment" rows="5" value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Share a little about your experience..." /><div className="form-footer"><span>{submitted ? 'Thanks, your feedback was submitted.' : 'Your feedback is only shared with the TM.'}</span><button className="primary-button" type="submit">{submitted ? 'Submitted' : 'Submit feedback'} <span>→</span></button></div></form></section>}
      </main>
    </div>
  );
}

export default Assessment;