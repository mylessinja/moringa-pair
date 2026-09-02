import { ArrowRight, Check, Compass, Menu, Sparkles, UsersRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-foreground font-sans">
      <nav className="relative z-50 border-b border-border bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <Logo />
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              How it works
            </a>
            <a href="#why-pair" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Why pair?
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link to="/login">Log in</Link>
            </Button>
            <Button asChild>
              <Link to="/signup">
                Join MoringaPair <ArrowRight size={16} />
              </Link>
            </Button>
          </div>
          <button className="md:hidden" type="button" aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </nav>

      <main>
        <section className="relative overflow-hidden">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:py-28">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                  <Sparkles size={14} />
                  AI-powered pairing
                </div>
                <h1 className="mt-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                  Find the learning partner who makes progress feel possible
                </h1>
                <p className="mt-6 text-base leading-relaxed text-muted-foreground">
                  MoringaPair uses AI to match you with a learning partner who complements your goals, keeps you accountable, and makes the hard parts less lonely.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Button size="lg" asChild>
                    <Link to="/signup">
                      Start your journey <ArrowRight size={18} />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link to="/login">Already a member? Log in</Link>
                  </Button>
                </div>
                <div className="mt-8 flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {['J', 'A', 'K', '+'].map((char, i) => (
                      <div
                        key={i}
                        className={cn(
                          'flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-xs font-semibold text-white',
                          i === 0 && 'bg-primary',
                          i === 1 && 'bg-orange-400',
                          i === 2 && 'bg-emerald-500',
                          i === 3 && 'bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-200'
                        )}
                      >
                        {char}
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">2,400+</span> meaningful connections
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="relative rounded-2xl border border-border bg-muted/50 p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Your partner this week</p>
                      <div className="mt-4 flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
                          AK
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">Amara K.</h3>
                          <p className="text-sm text-muted-foreground">Frontend &amp; accessibility</p>
                        </div>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700 dark:bg-green-500/15 dark:text-green-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                      Live
                    </span>
                  </div>
                  <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Shared focus</p>
                      <p className="text-sm font-semibold text-foreground">Building with confidence</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-primary">94%</p>
                      <p className="text-xs text-muted-foreground">match</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                    <Check size={14} className="text-green-600" />
                    <span>Goals aligned</span>
                    <span className="ml-auto">Week 08</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="why-pair" className="border-t border-border bg-muted/30">
          <div className="mx-auto max-w-7xl px-6 py-16">
            <div className="grid gap-8 sm:grid-cols-3">
              <div className="rounded-xl border border-border bg-white p-6 shadow-sm dark:bg-zinc-900">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">01</p>
                <h3 className="mt-3 text-base font-semibold text-foreground">Meet with intention</h3>
                <p className="mt-2 text-sm text-muted-foreground">Show up prepared with a clear goal for every pairing session.</p>
              </div>
              <div className="rounded-xl border border-border bg-white p-6 shadow-sm dark:bg-zinc-900">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">02</p>
                <h3 className="mt-3 text-base font-semibold text-foreground">Learn in public</h3>
                <p className="mt-2 text-sm text-muted-foreground">Share ideas, ask questions, and grow together with your partner.</p>
              </div>
              <div className="rounded-xl border border-border bg-white p-6 shadow-sm dark:bg-zinc-900">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">03</p>
                <h3 className="mt-3 text-base font-semibold text-foreground">Keep moving forward</h3>
                <p className="mt-2 text-sm text-muted-foreground">Track progress week over week and build lasting habits.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="border-t border-border">
          <div className="mx-auto max-w-7xl px-6 py-16">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">A smarter way to grow</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                One good match can change your whole week.
              </h2>
            </div>
            <div className="mt-12 grid gap-8 sm:grid-cols-3">
              <article className="relative rounded-xl border border-border bg-white p-6 shadow-sm dark:bg-zinc-900">
                <span className="absolute -top-3 right-6 rounded-full bg-muted px-3 py-1 text-xs font-semibold text-primary">
                  01
                </span>
                <Compass className="h-8 w-8 text-primary" />
                <h3 className="mt-4 text-base font-semibold text-foreground">Share your direction</h3>
                <p className="mt-2 text-sm text-muted-foreground">Tell us what you are learning and where you want a little momentum.</p>
              </article>
              <article className="relative rounded-xl border border-border bg-white p-6 shadow-sm dark:bg-zinc-900">
                <span className="absolute -top-3 right-6 rounded-full bg-muted px-3 py-1 text-xs font-semibold text-primary">
                  02
                </span>
                <UsersRound className="h-8 w-8 text-primary" />
                <h3 className="mt-4 text-base font-semibold text-foreground">Get thoughtfully paired</h3>
                <p className="mt-2 text-sm text-muted-foreground">Receive a weekly partner selected around your goals and learning style.</p>
              </article>
              <article className="relative rounded-xl border border-border bg-white p-6 shadow-sm dark:bg-zinc-900">
                <span className="absolute -top-3 right-6 rounded-full bg-muted px-3 py-1 text-xs font-semibold text-primary">
                  03
                </span>
                <Check className="h-8 w-8 text-primary" />
                <h3 className="mt-4 text-base font-semibold text-foreground">Make progress together</h3>
                <p className="mt-2 text-sm text-muted-foreground">Check in, exchange ideas, and leave the week further along than you started.</p>
              </article>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-muted/30">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <p className="text-sm text-muted-foreground">&copy; 2026 MoringaPair. Learning is a team sport.</p>
          <Logo className="text-sm" />
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
