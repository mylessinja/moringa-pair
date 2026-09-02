import { useState } from 'react';
import StudentLayout from '../layouts/StudentLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Star } from 'lucide-react';

const questions = [
  {
    topic: 'JavaScript',
    prompt: 'Which approach best describes how you like to learn a new technical concept?',
    answers: ['Talk it through with someone', 'Read documentation and examples', 'Build a small project', 'Watch a guided walkthrough'],
  },
  {
    topic: 'Collaboration',
    prompt: 'When a pairing session gets stuck, what do you usually do first?',
    answers: ['Break the problem into smaller steps', 'Ask my partner to explain their thinking', 'Search for a similar example', 'Try a different approach'],
  },
  {
    topic: 'Problem solving',
    prompt: 'Which kind of task gives you the most energy?',
    answers: ['Designing a clean interface', 'Finding and fixing a tricky bug', 'Planning the data and structure', 'Explaining a solution to others'],
  },
  {
    topic: 'Growth',
    prompt: 'What would you most like to strengthen this month?',
    answers: ['Confidence with code reviews', 'Frontend architecture', 'Testing and debugging', 'Communicating technical ideas'],
  },
];

const scores = [
  { label: 'Frontend foundations', score: 82 },
  { label: 'Problem solving', score: 74 },
  { label: 'Communication', score: 91 },
  { label: 'Testing & quality', score: 63 },
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
    <StudentLayout eyebrow="Skill snapshot" title="Assessment & feedback">
      <Tabs value={view} onValueChange={setView} className="mb-6">
        <TabsList>
          <TabsTrigger value="quiz">Skill quiz</TabsTrigger>
          <TabsTrigger value="results">My results</TabsTrigger>
          <TabsTrigger value="feedback">Pairing feedback</TabsTrigger>
        </TabsList>

        <TabsContent value="quiz">
          <div className="flex items-center justify-between mb-4 mt-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-primary mb-1">
                A few thoughtful questions
              </p>
              <h2 className="text-lg font-bold text-foreground">Let's find your learning rhythm.</h2>
              <p className="text-sm text-muted-foreground mt-1 max-w-md">
                Your answers help us understand how you work best with a partner. There are no right
                or wrong answers.
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <span className="text-2xl font-bold text-foreground">{progress}%</span>
              <p className="text-xs text-muted-foreground">complete</p>
            </div>
          </div>

          <Progress value={Math.max(progress, 4)} className="mb-6" />

          <Card>
            <CardContent>
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                <span>
                  Question {questionIndex + 1} of {questions.length}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                  {question.topic}
                </span>
              </div>

              <h3 className="text-base font-bold text-foreground mb-4">{question.prompt}</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {question.answers.map((answer, index) => (
                  <button
                    key={answer}
                    onClick={() => chooseAnswer(index)}
                    className={`flex items-center gap-3 text-left px-4 py-3 rounded-md border text-sm transition-colors ${
                      answers[questionIndex] === index
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:bg-muted text-foreground'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${
                        answers[questionIndex] === index
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {String.fromCharCode(65 + index)}
                    </span>
                    {answer}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {answers[questionIndex] !== undefined ? 'Answer saved' : 'Select one answer'}
                </span>
                <Button disabled={answers[questionIndex] === undefined} onClick={nextQuestion}>
                  {questionIndex === questions.length - 1 ? 'See my results' : 'Next question'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results">
          <div className="flex items-center justify-between mb-4 mt-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-primary mb-1">
                Your latest snapshot
              </p>
              <h2 className="text-lg font-bold text-foreground">Strengths to share, skills to grow.</h2>
              <p className="text-sm text-muted-foreground mt-1 max-w-md">
                These results give your mentor a starting point for thoughtful pairings. They can
                evolve as you learn.
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <span className="text-2xl font-bold text-foreground">78</span>
              <p className="text-xs text-muted-foreground">
                / 100
                <br />
                overall fit
              </p>
            </div>
          </div>

          <Card>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-primary mb-1">
                    Skill breakdown
                  </p>
                  <h3 className="font-bold text-foreground">Where you are today</h3>
                </div>
                <span className="text-xs text-muted-foreground">Updated just now</span>
              </div>

              <div className="space-y-4 mb-6">
                {scores.map((item) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-foreground">{item.label}</span>
                      <strong className="text-foreground">{item.score}%</strong>
                    </div>
                    <Progress value={item.score} />
                  </div>
                ))}
              </div>

              <div className="border-l-2 border-primary bg-muted px-4 py-3 mb-4">
                <p className="text-sm text-foreground">
                  Your standout strength is communication. Consider pairing with someone who
                  enjoys exploring ideas out loud.
                </p>
              </div>

              <Button
                variant="secondary"
                onClick={() => {
                  setQuestionIndex(0);
                  setView('quiz');
                }}
              >
                Retake assessment
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback">
          <div className="mb-4 mt-4">
            <p className="text-xs font-medium uppercase tracking-wide text-primary mb-1">
              Week of Aug 17, 2026
            </p>
            <h2 className="text-lg font-bold text-foreground">How was your pairing with Amina?</h2>
            <p className="text-sm text-muted-foreground mt-1 max-w-md">
              Your honest reflection helps us make future pairings more useful for everyone.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <span className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold">
                AW
              </span>
              <div>
                <p className="font-medium text-foreground text-sm">Amina Wanjiku</p>
                <p className="text-xs text-muted-foreground">Frontend foundations</p>
              </div>
            </div>
          </div>

          <Card>
            <CardContent>
              <form onSubmit={submitFeedback} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground">
                    How would you rate this pairing?{' '}
                    <span className="text-red-500 text-xs font-normal">Required</span>
                  </label>
                  <div className="flex gap-1 mt-2" aria-label="Pairing rating">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        type="button"
                        key={value}
                        onClick={() => setRating(value)}
                        aria-label={`${value} out of 5`}
                        className={rating >= value ? 'text-amber-400' : 'text-gray-300 dark:text-zinc-600 dark:text-zinc-600'}
                      >
                        <Star className="w-6 h-6" fill="currentColor" />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="feedback-comment" className="text-sm font-medium text-foreground">
                    What worked well, or what could be better?{' '}
                    <span className="text-red-500 text-xs font-normal">Required</span>
                  </label>
                  <Textarea
                    id="feedback-comment"
                    rows={5}
                    className="mt-2"
                    value={comment}
                    onChange={(event) => setComment(event.target.value)}
                    placeholder="Share a little about your experience..."
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {submitted ? 'Thanks, your feedback was submitted.' : 'Your feedback is oy shared with the TM.'}
                  </span>
                  <Button type="submit">{submitted ? 'Submitted' : 'Submit feedback'}</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </StudentLayout>
  );
}

export default Assessment;
